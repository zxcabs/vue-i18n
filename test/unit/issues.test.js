import { createLocalVue, mount } from 'vue-test-utils'
import VueI18n from '../../src/index'
import messages from './fixture/index'
import { parse } from '../../src/format'

describe('issues', () => {
  const localVue = createLocalVue()
  VueI18n.install.installed = false
  localVue.use(VueI18n)

  let wrapper, i18n
  beforeEach(() => {
    i18n = new VueI18n({
      locale: 'en',
      messages
    })
    wrapper = mount({}, { localVue, i18n })
  })


  describe('#24', () => {
    it('should be translated', () => {
      assert.equal(
        wrapper.vm.$t('continue-with-new-account'),
        messages[wrapper.vm.$i18n.locale]['continue-with-new-account']
      )
    })
  })

  describe('#35', () => {
    it('should be translated', () => {
      assert.equal(
        wrapper.vm.$t('underscore', { helloMsg: 'hello' }),
        'hello world'
      )
    })
  })

  describe('#42, #43', () => {
    it('should not be occured error', () => {
      assert.equal(
        wrapper.vm.$t('message[\'hello\']'),
        messages[wrapper.vm.$i18n.locale]['message']['hello']
      )
    })
  })

  describe('#51', () => {
    it('should be translated', () => {
      assert.equal(
        wrapper.vm.$t('message.hyphen-locale'),
        'hello hyphen'
      )
    })
  })

  describe('#91, #51', () => {
    it('should be translated', () => {
      const arrayMessages = messages[wrapper.vm.$i18n.locale].issues.arrayBugs
      for (let i = 0; i < arrayMessages.length; i++) {
        const item = wrapper.vm.$t('issues.arrayBugs')[i]
        assert.equal(item, arrayMessages[i])
      }
    })
  })

  describe('#97', () => {
    it('should be translated', () => {
      assert.equal(
        wrapper.vm.$t('message.1234'),
        messages[wrapper.vm.$i18n.locale]['message']['1234']
      )
      assert.equal(
        wrapper.vm.$t('message.1mixedKey'),
        messages[wrapper.vm.$i18n.locale]['message']['1mixedKey']
      )
    })
  })

  describe('#169', () => {
    it('should be translated', () => {
      const Component = {
        __i18n: JSON.stringify({
          en: { custom: 'custom block!' }
        }),
        render (h) {
          return h('p', { ref: 'custom' }, [this.$t('custom')])
        }
      }
      const wrapper = mount(Component, { localVue, i18n })
      assert.equal(wrapper.vm.$refs.custom.textContent, 'custom block!')
    })
  })

  describe('#170', () => {
    it('should be translated', () => {
      assert.equal(wrapper.vm.$i18n.t('message.linkHyphen'), messages.en['hyphen-hello'])
      assert.equal(wrapper.vm.$i18n.t('message.linkUnderscore'), messages.en.underscore_hello)
    })
  })

  describe('#171', () => {
    it('should be translated', () => {
      wrapper = mount({
        render (h) {
          return h('i18n', { props: { path: 'message.linkList' } }, [
            h('strong', [this.$t('underscore_hello')]),
            h('strong', [this.$t('message.link')])
          ])
        }
      }, { localVue, i18n })
      assert.equal(
        wrapper.html(),
        '<span>the world: <strong>underscore the wolrd</strong> <strong>the world</strong></span>'
      )
    })
  })

  describe('#172', () => {
    it('should be translated', () => {
      const i18n = new VueI18n({
        locale: 'en',
        messages: {
          en: { 'company-name': 'billy-bob\'s fine steaks.' }
        }
      })
      wrapper = mount({
        components: {
          comp: {
            __i18n: JSON.stringify({
              en: { title: '@:company-name - yeee hawwww!!!' }
            }),
            render (h) {
              return h('p', { ref: 'title' }, [this.$t('title')])
            }
          }
        },
        render (h) {
          return h('div', [h('comp', { ref: 'comp' })])
        }
      }, { localVue, i18n })
      assert.equal(
        wrapper.text(),
        'billy-bob\'s fine steaks. - yeee hawwww!!!'
      )
    })
  })

  describe('#173', () => {
    it('should be translated', () => {
      const Component = {
        __i18n: JSON.stringify({
          en: { custom: 'custom block!' }
        }),
        render (h) {
          return h('p', { ref: 'custom' }, [this.$t('custom')])
        }
      }
      const wrapper = mount(Component, {
        localVue,
        i18n: new VueI18n({ locale: 'en' })
      })
      assert.equal(wrapper.text(), 'custom block!')
    })
  })

  describe('#174', () => {
    it('should be fallback', () => {
      const i18n = new VueI18n({
        locale: 'en',
        fallbackLocale: 'ja',
        messages: {
          en: {},
          ja: { msg: 'メッセージ' }
        }
      })
      wrapper = mount({
        components: {
          comp: {
            i18n: {
              messages: {
                en: {},
                ja: { hello: 'こんにちは' }
              }
            },
            render (h) {
              return h('div', [
                h('p', { ref: 'el1' }, [this.$t('hello')]),
                h('p', { ref: 'el2' }, [this.$t('msg')])
              ])
            }
          }
        },
        render (h) {
          return h('div', [h('comp', { ref: 'comp' })])
        }
      }, { localVue, i18n })
      assert.equal(wrapper.text(), 'こんにちはメッセージ')
    })
  })

  describe('#176', () => {
    it('should be translated', () => {
      const i18n = new VueI18n({
        locale: 'xx',
        fallbackLocale: 'en',
        messages: {
          en: {
            'alpha': '[EN] alpha {gustav} value',
            'bravo': '[EN] bravo {gustav} value',
            'charlie': '[EN] charlie {0} value',
            'delta': '[EN] delta {0} value'
          },
          xx: {
            'bravo': '[XX] bravo {gustav} value',
            'delta': '[XX] delta {0} value'
          }
        }
      })
      wrapper = mount({
        render (h) {
          return h('div', [
            h('p', { ref: 'el1' }, [this.$t('alpha', { gustav: 'injected' })]),
            h('p', { ref: 'el2' }, [this.$t('bravo', { gustav: 'injected' })]),
            h('p', { ref: 'el3' }, [this.$t('charlie', ['injected'])]),
            h('p', { ref: 'el4' }, [this.$t('delta', ['injected'])])
          ])
        }
      }, { localVue, i18n })
      assert.equal(
        wrapper.text(),
        '[EN] alpha injected value[XX] bravo injected value[EN] charlie injected value[XX] delta injected value'
      )
    })
  })

  describe('#191', () => {
    it('should be parsed', () => {
      const tokens = parse('{deposit}% PREPAYMENT')
      assert(tokens.length === 2)
      assert.equal(tokens[0].type, 'named')
      assert.equal(tokens[0].value, 'deposit')
      assert.equal(tokens[1].type, 'text')
      assert.equal(tokens[1].value, '% PREPAYMENT')
    })
  })
})
