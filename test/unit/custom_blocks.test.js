import { createLocalVue, mount } from 'vue-test-utils'
import VueI18n from '../../src/index'

describe('custom blocks', () => {
  const localVue = createLocalVue()
  VueI18n.install.installed = false
  localVue.use(VueI18n)

  let i18n
  beforeEach(() => {
    i18n = new VueI18n({
      locale: 'ja',
      messages: {
        en: { who: 'root' },
        ja: { who: 'ルート' }
      }
    })
  })

  describe('json string', () => {
    it('should be translated', done => {
      const wrapper = mount({
        components: {
          child: {
            __i18n: JSON.stringify({
              en: { who: 'child' },
              ja: { who: '子' }
            }),
            render (h) {
              return h('div', {}, [
                h('p', [this.$t('who')])
              ])
            }
          }
        },
        render (h) {
          return h('div', {}, [h('child')])
        }
      }, { localVue, i18n })
      assert.equal(wrapper.text(), '子')
      i18n.locale = 'en'
      wrapper.update()
      // TODO:
      wrapper.vm.$nextTick(() => {
        assert.equal(wrapper.text(), 'child')
        done()
      })
    })
  })

  describe('invalid json string', () => {
    it('should be fallbacked translation', done => {
      const spy = sinon.spy(console, 'warn')
      const wrapper = mount({
        components: {
          child: {
            __i18n: 'foo',
            render (h) {
              return h('div', {}, [
                h('p', [this.$t('who')])
              ])
            }
          }
        },
        render (h) {
          return h('div', {}, [h('child')])
        }
      }, { localVue, i18n })
      assert.equal(wrapper.text(), 'ルート')
      i18n.locale = 'en'
      wrapper.update()
      // TODO:
      wrapper.vm.$nextTick(() => {
        assert.equal(wrapper.text(), 'root')
        spy.restore()
        done()
      })
    })
  })
})
