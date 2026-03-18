import Vue from 'vue'
import I18n from '../index'

Vue.config.productionTip = false

Vue.use(I18n)

I18n.prototype.loadLanguage = function (locale) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (this._config.localePaths[locale]) {
        resolve(generateMessages(locale))
      } else {
        reject()
      }
    }, 300)
  })
}

const defaultOptions = {
  fallbackLocale: 'ja',
  localePaths: {
    ja: 'ja',
    en: 'en',
  },
}

function generateMessages (locale) {
  return {
    hello: `Hello ${locale}`,
  }
}

describe('vue/I18n', () => {
  it('Test I18n property', () => {
    const i18n = new I18n(defaultOptions)
    const i18n2 = new I18n(Object.assign({}, defaultOptions, { locale: 'ja' }))
    expect(i18n.locale).toBe(undefined)
    expect(i18n.fallbackLocale).toBe('ja')
    expect(i18n2.locale).toBe('ja')
  })

  it('Test I18n event :: ready', done => {
    const i18n = new I18n(defaultOptions)

    i18n.on('ready', (event, locale) => {
      expect(event.type).toBe('ready')
      expect(locale).toBe('ja')
      done()
    })
  })

  it('Test I18n event :: change', done => {
    const i18n = new I18n(defaultOptions)
    expect(i18n.locale).toBe(undefined)

    i18n.on('change', (event, locale) => {
      expect(event.type).toBe('change')
      expect(locale).toBe('en')
      expect(i18n.locale).toBe(locale)
      expect(i18n.t('hello')).not.toBe(`Hello ${i18n.locale}`)
      done()
    })
    i18n.setLanguage('en')
  })

  it('Test I18n event :: changed', done => {
    const i18n = new I18n(defaultOptions)
    expect(i18n.locale).toBe(undefined)

    i18n.on('changed', (event, locale) => {
      expect(event.type).toBe('changed')
      expect(locale).toBe('en')
      expect(i18n.locale).toBe(locale)
      expect(i18n.t('hello')).toBe(`Hello ${i18n.locale}`)
      done()
    })
    i18n.setLanguage('en')
  })

  it('Test I18n event :: loadLanguage', done => {
    const i18n = new I18n(defaultOptions)
    expect(i18n.locale).toBe(undefined)

    i18n.on('loadLanguage', (event, locale) => {
      expect(event.type).toBe('loadLanguage')
      expect(locale).toBe('ja')
      expect(i18n.fallbackLocale).toBe(locale)
      done()
    })
  })

  it('Test I18n event :: loadLanguageDone', done => {
    const i18n = new I18n(Object.assign({}, defaultOptions, { locale: 'en' }))
    expect(i18n.locale).toBe('en')

    const triggerLocalesExpected = [ 'ja', 'en' ]
    const triggerCountExpected = 2
    let triggerLocales = []
    let triggerCount = 0

    i18n.on('loadLanguageDone', (event, locale) => {
      expect(event.type).toBe('loadLanguageDone')
      expect(triggerLocalesExpected.includes(locale)).toBe(true)

      triggerLocales.push(locale)
      triggerCount++
      if (triggerCount === triggerCountExpected) {
        expect(triggerLocales.sort()).toEqual(triggerLocalesExpected.sort())
        expect(i18n.t('hello')).toBe(`Hello ${i18n.locale}`)
        expect(i18n.t('hello', i18n.fallbackLocale)).toBe(`Hello ${i18n.fallbackLocale}`)
        done()
      }
    })
  })

  it('Test I18n event :: loadLanguageFail', done => {
    const i18n = new I18n(defaultOptions)

    i18n.on('loadLanguageFail', (event, locale, err) => {
      expect(event.type).toBe('loadLanguageFail')
      expect(locale).toBe('zh-CN')
      expect(err).toEqual(new Error(`Locale<${locale}> path does not exist.`))
      done()
    })

    i18n.setLanguage('zh-CN').catch(() => {})
  })

  it('Test I18n event :: trigger order', async () => {
    const i18n = new I18n(Object.assign({}, defaultOptions, { locale: 'en' }))
    const triggerOrderExpected = [ 'change', 'loadLanguage', 'loadLanguageDone', 'ready', 'changed' ]
    const triggerOrder = []
    await Promise.all([
      new Promise(resolve => {
        i18n.on('ready', (event, locale) => {
          if (locale !== 'en') return
          triggerOrder.push(event.type)
          resolve()
        })
      }),
      new Promise(resolve => {
        i18n.on('changed', (event, locale) => {
          if (locale !== 'en') return
          triggerOrder.push(event.type)
          resolve()
        })
      }),
      new Promise(resolve => {
        i18n.on('loadLanguageDone', (event, locale) => {
          if (locale !== 'en') return
          triggerOrder.push(event.type)
          resolve()
        })
      }),
      new Promise(resolve => {
        i18n.on('loadLanguage', (event, locale) => {
          if (locale !== 'en') return
          triggerOrder.push(event.type)
          resolve()
        })
      }),
      new Promise(resolve => {
        i18n.on('change', (event, locale) => {
          if (locale !== 'en') return
          triggerOrder.push(event.type)
          resolve()
        })
      }),
    ])
    expect(triggerOrderExpected).toEqual(triggerOrder)
  })

  it('Test I18n function :: checkSimilarLocale', () => {
    const i18n = new I18n()
    const i18n2 = new I18n({ caseSensitive: true })
    expect(i18n.checkSimilarLocale(defaultOptions.localePaths, 'JA')).toBe('ja')
    expect(i18n2.checkSimilarLocale(defaultOptions.localePaths, 'JA')).toBe('')
  })

  it('Test I18n function :: getMessages', done => {
    const i18n = new I18n(defaultOptions)

    i18n.on('ready', (_event, locale) => {
      expect(i18n.getMessages(locale)).toEqual(generateMessages(locale))
      expect(i18n.getMessages()).toEqual(i18n.messages)
      done()
    })
  })

  it('Test I18n function :: setMessages', () => {
    const i18n = new I18n()
    const locale = 'zh-CN'
    const messages = generateMessages(locale)
    expect(i18n.getMessages(locale)).toBe(undefined)
    i18n.setMessages(locale, messages)
    expect(i18n.getMessages(locale)).toEqual(messages)
  })

  it('Test I18n function :: getLanguage', async () => {
    const i18n = new I18n(defaultOptions)
    await expect(i18n.getLanguage('en')).resolves.toEqual(generateMessages('en'))
    await expect(i18n.getLanguage('zh-CN')).rejects.toEqual(new Error('Locale<zh-CN> path does not exist.'))
  })

  it('Test I18n function :: setLanguage', async () => {
    const i18n = new I18n(defaultOptions)
    expect(i18n.locale).toBe(undefined)
    await expect(i18n.setLanguage('en')).resolves.toBe('en')
    await expect(i18n.setLanguage('zh-CN')).rejects.toEqual(new Error('Locale<zh-CN> path does not exist.'))
    // 无论语言包最终是否能够成功加载，locale 都会被切换
    expect(i18n.locale).toBe('zh-CN')
  })

  it('Test I18n function :: isDefine', done => {
    const i18n = new I18n(Object.assign({}, defaultOptions, {
      locale: 'en',
      messages: {
        en: {
          test: 'Test',
        },
      },
    }))
    expect(i18n.isDefine('test')).toBe(true) // defined in en
    expect(i18n.isDefine('hello')).toBe(false) // defined in localePaths.ja

    i18n.on('ready', () => {
      expect(i18n.isDefine('test')).toBe(true)
      expect(i18n.isDefine('hello')).toBe(true)
      expect(i18n.isDefine('helloTest')).toBe(false)
      done()
    })
  })

  it('Test I18n function :: getT', () => {
    const i18n = new I18n(Object.assign({}, defaultOptions, {
      locale: 'en',
      messages: {
        en: {
          level1: {
            level2: {
              test: 'Test',
            },
          },
        },
      },
    }))
    expect(i18n.getT('level1.level2')('test')).toBe('Test')
  })

  it('Test I18n function :: localeChanged', done => {
    const i18n = new I18n(Object.assign({}, defaultOptions, { locale: 'en' }))
    i18n.localeChanged = locale => {
      expect(locale).toBe('en')
      done()
    }
  })
})
