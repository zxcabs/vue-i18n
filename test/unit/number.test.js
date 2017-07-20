import { createLocalVue, mount } from 'vue-test-utils'
import VueI18n from '../../src/index'
import numberFormats from './fixture/number'

const desc = VueI18n.availabilities.numberFormat ? describe : describe.skip
desc('number format', () => {
  const localVue = createLocalVue()
  VueI18n.install.installed = false
  localVue.use(VueI18n)

  describe('numberFormats', () => {
    it('should be worked', done => {
      const i18n = new VueI18n({
        locale: 'en-US',
        numberFormats
      })
      nextTick(() => {
        assert.deepEqual(numberFormats, i18n.numberFormats)
      }).then(done)
    })
  })

  describe('getNumberFormat / setNumberFormat', () => {
    it('should be worked', () => {
      const i18n = new VueI18n({
        locale: 'en-US',
        numberFormats
      })
      const money = 101
      const wrapper = mount({
        render (h) {
          return h('p', [this.$n(money, 'currency')])
        }
      }, { localVue, i18n })

      const zhFormat = {
        currency: {
          style: 'currency', currency: 'CNY', currencyDisplay: 'name'
        }
      }
      assert.equal(wrapper.text(), '$101.00')
      i18n.setNumberFormat('zh-CN', zhFormat)
      assert.deepEqual(i18n.getNumberFormat('zh-CN'), zhFormat)
      i18n.locale = 'zh-CN'
      wrapper.update()
      // NOTE: avoid webkit (safari/phantomjs) & Intl polyfill wired localization...
      isChrome && assert.equal(wrapper.text(), '101.00人民币')
    })
  })

  describe('mergeNumberFormat', () => {
    it('should be merged', () => {
      const i18n = new VueI18n({
        locale: 'ja-JP',
        numberFormats
      })
      const percent = { style: 'percent' }
      i18n.mergeNumberFormat('en-US', { percent })
      assert.deepEqual(percent, i18n.getNumberFormat('en-US').percent)
    })
  })
})
