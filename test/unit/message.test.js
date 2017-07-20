import { createLocalVue, mount } from 'vue-test-utils'
import VueI18n from '../../src/index'
import messages from './fixture/index'

describe('message', () => {
  const localVue = createLocalVue()
  VueI18n.install.installed = false
  localVue.use(VueI18n)

  let i18n
  let orgEnLocale
  let orgJaLocaleMessage
  const expectEnLocale = 'the world updated'
  const expectJaLocaleMessage = {
    message: {
      hello: 'ザ・世界 -> メイド・イン・ヘブン'
    }
  }

  beforeEach(() => {
    i18n = new VueI18n({
      locale: 'en',
      messages
    })
    orgEnLocale = i18n.getLocaleMessage('en').message.hello
    orgJaLocaleMessage = i18n.getLocaleMessage('ja')
  })

  afterEach(() => {
    messages.en.message.hello = orgEnLocale
    i18n.setLocaleMessage('en', messages.en)
    i18n.setLocaleMessage('ja', orgJaLocaleMessage)
  })

  describe('messages', () => {
    it('should be workd', () => {
      assert.deepEqual(messages, i18n.messages)
    })
  })

  describe('getLocaleMessage / setLocaleMessage', () => {
    it('should be worked', () => {
      const wrapper = mount({
        render (h) {
          return h('p', [this.$t('message.hello')])
        }
      }, { localVue, i18n })

      assert.equal(wrapper.text(), messages.en.message.hello)
      // hot reload (set reactivity messages)
      messages.en.message.hello = expectEnLocale
      i18n.setLocaleMessage('en', messages.en)
      wrapper.update()

      assert.equal(wrapper.text(), expectEnLocale)
      // upade locale
      i18n.setLocaleMessage('ja', expectJaLocaleMessage)
      i18n.locale = 'ja'
      wrapper.update()
    })
  })

  describe('mergeLocaleMessage', () => {
    it('should be merged', () => {
      i18n = new VueI18n({
        locale: 'en',
        messages: {
          en: {
            foo: 'bar'
          },
          ja: {
            foo: 'バー'
          }
        }
      })
      i18n.mergeLocaleMessage('en', { bar: 'foo' })
      assert.deepEqual({ foo: 'bar', bar: 'foo' }, i18n.getLocaleMessage('en'))
    })
  })
})
