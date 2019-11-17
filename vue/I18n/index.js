/**
 * VueI18n 增强
 *
 * 扩展方法：
 * - checkSimilarLocale
 * - getMessages
 * - setMessages
 * - setLanguage       设置当前语言。
 * - isDefine          判断语言 key 是否被定义。
 * - getT              获取语言转换器。
 * - on                注册事件监听。
 * - off               移除事件监听。
 *
 * 扩展事件：
 * - loadLanguage      新语言包开始加载时触发该事件，并将该语言类型作为参数传入。
 * - loadLanguageDone  新语言包加载完成时触发该事件，并将该语言类型作为参数传入。
 * - loadLanguageFail  新语言包加载失败时触发该事件，并将该语言类型与错误信息作为参数传入。
 * - change            语言变更后触发该事件，并将当前语言类型作为参数传入。
 * - ready             第一种语言准备好时触发该事件，并将当前语言类型作为参数传入。
 */
import VueI18n from 'vue-i18n'
import axios from 'axios'
import BaseEventObject from 'base-event-object'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'

export default class I18n extends VueI18n {
  constructor (options = {}) {
    const {
      locale,
      fallbackLocale,
      // 语言包路径配置对象
      // {
      //     'zh-CN': 'language/zh-CN.json'
      // }
      localePaths = {},

      // 语言类型是否大小写敏感
      caseSensitive = false,

      ...otherOptions
    } = options

    super(Object.assign(otherOptions, { locale, fallbackLocale }))

    Object.assign(this, new BaseEventObject({
      events: [
        'loadLanguage', // 请求一种语言开始时的回调
        'loadLanguageDone', // 请求一种语言完成时的回调
        'loadLanguageFail', // 请求一种语言失败时的回调
        'change' // 语言变更时的回调
      ],
      onceEvents: [
        'ready' // 第一种语言准备好时的回调
      ]
    }))

    this._config = {
      localePaths,
      caseSensitive
    }

    this._isReady = false
    this._promises = {}

    // 如果不强行设置，vue-i18n 的默认 locale 与 fallbackLocale 将会是 en-US
    this._locale = undefined
    this.fallbackLocale = fallbackLocale

    if (locale) {
      this.setLanguage(locale).catch(err => {})
    }

    if (this.fallbackLocale && !this.messages[this.fallbackLocale]) {
      this.getLanguage(this.fallbackLocale).catch(err => {})
    }
  }

  /**
   * 检查对象中是否包含与指定 locale 相似的 key，如果包含则返回正确的 key
   * @param map
   * @param locale
   * @returns {String}
   */
  checkSimilarLocale (map, locale) {
    if (this._config.caseSensitive) {
      return map[locale] ? locale : ''
    } else {
      const reg = new RegExp('^' + locale + '$', 'i')
      for (const key in map) {
        if (reg.test(key)) return key
      }
      return ''
    }
  }

  /**
   * 获取全部语言对象
   * @param  locale {String} 可选。传入语言类型
   * @return {Object}        返回当前语言类型对应的语言对象。如果没有传参，则返回包含所有语言对象的集合。
   */
  getMessages (locale = undefined) {
    return locale === undefined
      ? cloneDeep(this.messages)
      : cloneDeep(this.messages[this.checkSimilarLocale(this.messages, locale)])
  }

  /**
   * 设置全部语言对象
   * @param locale    {String|Object} 传入语言类型。如果传入的是对象，则会将该对象与包含所有语言字典对象的集合合并，此时第二个参数 langDict 会被忽略。
   * @param localeMsg {Object}        传入语言字典对象。
   */
  setMessages (locale, localeMsg = null) {
    let messages

    if (typeof locale === 'object') {
      messages = locale
    } else if (typeof locale === 'string') {
      messages = {}
      messages[locale] = localeMsg
    } else {
      return this
    }

    for (locale in messages) {
      const localeMsg = messages[locale]

      const existedLocale = this.checkSimilarLocale(this.messages, locale)
      let existedLocaleMsg = {}

      if (existedLocale) {
        existedLocaleMsg = this.messages[existedLocale]
        locale = existedLocale
      }

      this.setLocaleMessage(locale, merge({}, existedLocaleMsg, localeMsg))
    }

    return this
  }

  async getLanguage (locale) {
    if (this._promises[locale]) return this._promises[locale]

    try {
      // 需要在当前帧的最后触发事件，否则会导致在这之后同步注册的监听无法接收到该事件
      setTimeout(() => this.emit('loadLanguage', locale))

      const existedLocale = this.checkSimilarLocale(this._config.localePaths, locale)
      const localePath = this._config.localePaths[existedLocale]
      if (!localePath) throw new Error(`Locale<${locale}> path does not exist.`)

      this._promises[locale] = this.loadLanguage(localePath)
      const messages = await this._promises[locale]
      this.setMessages(locale, messages)
      setTimeout(() => this.emit('loadLanguageDone', locale))

      // 第一个语言包加载完成时，判定为 ready
      if (!this._isReady) {
        this._isReady = true
        setTimeout(() => this.emit('ready', locale))
      }

      return messages
    } catch (err) {
      setTimeout(() => this.emit('loadLanguageFail', locale, err))
      return Promise.reject(err)
    }
  }

  /**
   * 设置当前语言类型
   * @param locale {String} 需要设置的当前语言类型
   * @return {Promise}      返回一个 Promise 对象。Promise 对象 resolve 时，表示语言设置成功，并会将当前语言类型作为参数传入。
   */
  async setLanguage (locale) {
    const existedLocale = this.checkSimilarLocale(this.messages, locale)
    if (existedLocale) {
      locale = existedLocale
    }

    this.locale = locale
    return this.getLanguage(locale).then(() => locale)
  }

  /**
   * 判断语言 key 是否被定义
   * @param key {String} 语言 key
   * @return {Boolean}
   */
  isDefine (key) {
    let isDefine = this.te(key)
    if (!isDefine && this.fallbackLocale) return this.te(key, this.fallbackLocale)
    return isDefine
  }

  /**
   * 获取语言转换器
   * @param path {String} 传入语言 key 的父级路径
   * @return {Function}   返回一个转换函数，功能和 i18n.t 相同，但不需要再输入父级路径
   */
  getT (path) {
    return (...args) => {
      const key = args.shift()
      args.unshift(path + '.' + key)
      return this.t(...args)
    }
  }

  /**
   * Override
   * 方法可被重写，更换语言包加载方式
   */
  loadLanguage (path) {
    return axios({
      url: path,
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
        return res.data
      } else {
        return Promise.reject(res)
      }
    })
  }

  /**
   * Override
   * 方法可被重写，更换语言后需要执行的操作
   */
  localeChanged (locale) {
    if (typeof axios !== 'undefined') axios.defaults.headers.common['Accept-Language'] = locale
    if (typeof document !== 'undefined') document.querySelector('html').setAttribute('lang', locale)
  }
}

Object.defineProperty(I18n.prototype, '_locale', Object.getOwnPropertyDescriptor(VueI18n.prototype, 'locale'))

Object.defineProperty(I18n.prototype, 'locale', {
  set: function (locale) {
    if (!locale || this._locale === locale) return
    this._locale = locale
    setTimeout(() => {
      this.emit('change', locale)
      this.localeChanged(locale)
    })
  },
  get: function () {
    return this._locale
  }
})
