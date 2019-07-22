/**
 * VueI18n 增强
 *
 * 扩展方法：
 * - checkSimilarLocale
 * - getMessages
 * - setMessages
 * - setLanguage
 * - getLanguage
 * - setLocale        设置当前语言。
 * - getT             获取语言转换器。
 * - config           设置配置对象。
 * - on               注册事件监听。
 * - off              移除事件监听。
 *
 * 扩展事件：
 * - requireLangDone  新语言包加载完成时触发该事件，并将该语言类型作为参数传入。
 * - requireLangFail  新语言包加载失败时触发该事件，并将该语言类型作为参数传入。
 * - change           语言变更后触发该事件，并将当前语言类型作为参数传入。
 * - ready            第一种语言准备好时触发该事件，并将当前语言类型作为参数传入。
 */
import VueI18n from 'vue-i18n'
import axios from 'axios'
import BaseEventObject from 'base-event-object'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'

const eventObject = new BaseEventObject({
  events: [
    'requireLangDone', // 请求一种语言完成时的回调
    'requireLangFail', // 请求一种语言失败时的回调
    'change' // 语言变更时的回调
  ],
  onceEvents: [
    'ready' // 第一种语言准备好时的回调
  ]
})

Object.assign(VueI18n.prototype, eventObject)

export default class I18n extends VueI18n {
  constructor (options) {
    super(options)

    this._isReady = false
    this._promises = {}
    this.config({
      fallbackLocale: '',

      // paths 语言包路径配置对象
      // {
      //     'zh-CN': 'language/zh-CN.json'
      // }
      paths: {},

      // 设置 http 请求的默认配置选项。
      http: {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      },

      // 语言类型是否大小写敏感
      caseSensitive: false
    })
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
  getMessages (locale) {
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

      this.setLocaleMessage(locale, Object.assign({}, existedLocaleMsg, localeMsg))
    }

    return this
  }

  /**
   * 设置当前语言类型
   * @param locale {String} 需要设置的当前语言类型
   * @return {Promise}      返回一个 Promise 对象。Promise 对象 resolve 时，表示语言设置成功，并会将当前语言类型作为参数传入。
   */
  setLanguage (locale) {
    const existedLocale = this.checkSimilarLocale(this.messages, locale)
    if (existedLocale) {
      locale = existedLocale
    }

    return new Promise((resolve, reject) => {
      if (this._isReady && locale === this.locale) return resolve()

      if (existedLocale) {
        this.setLocale(locale)
        return resolve()
      }

      this.loadLanguage(locale)
        .then(message => {
          this.setLocale(locale)
          resolve(message)
        })
        .catch(reject)
    }).then(() => {
      this.emit('change', locale)
    })
  }

  getLanguage (path) {
    return axios(merge({}, this._config.http, { url: path }))
      .then(res => {
        if (res.status === 200) {
          return res.data
        } else {
          return Promise.reject(res)
        }
      })
  }

  loadLanguage (locale) {
    if (this._promises[locale]) return this._promises[locale]

    const existedLocale = this.checkSimilarLocale(this._config.paths, locale)
    this._promises[locale] = this.getLanguage(this._config.paths[existedLocale])
      .then(message => {
        this.setMessages(locale, message)
        this.emit('requireLangDone', locale)

        if (!this._isReady) {
          this._isReady = true
          this.emit('ready', locale)
        }

        return message
      })
      .catch(err => {
        this.emit('requireLangFail', locale)
        return Promise.reject(err)
      })
      .finally(() => {
        this._promises[locale] = null
      })

    return this._promises[locale]
  }

  setLocale (locale) {
    this.locale = locale
    if (typeof axios !== 'undefined') axios.defaults.headers.common['Accept-Language'] = locale
    if (typeof document !== 'undefined') document.querySelector('html').setAttribute('lang', locale)
    return this
  }

  /**
   * 获取语言转换器
   * @param  {String}   path  传入语言 key 的父级路径
   * @return {Function}       返回一个转换函数，功能和 i18n.t 相同，但不需要再输入父级路径
   */
  getT (path) {
    return (...args) => {
      const key = args.shift()
      args.unshift(path + '.' + key)
      return this.t(...args)
    }
  }

  /**
   * 设置配置对象
   * @param {Object} config 配置对象
   */
  config (config) {
    this._config = merge(this._config, config)
    this.fallbackLocale = this._config.fallbackLocale
    if (this.fallbackLocale && !this.messages[this.fallbackLocale]) {
      this.loadLanguage(this.fallbackLocale)
    }
    return this
  }
}
