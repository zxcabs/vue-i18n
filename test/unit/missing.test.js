import { createLocalVue, mount } from 'vue-test-utils'
import VueI18n from '../../src/index'

describe('missing', () => {
  const localVue = createLocalVue()
  VueI18n.install.installed = false
  localVue.use(VueI18n)

  describe('via i18n instance API', () => {
    it('should be handled translate missing', done => {
      const i18n = new VueI18n({
        locale: 'en',
        missing: (locale, key, vm) => {
          assert.equal('en', locale)
          assert.equal('foo.bar.buz', key)
          assert(vm === null)
          done()
        }
      })

      i18n.t('foo.bar.buz')
    })
  })

  describe('via vue instance', () => {
    it('should be handled translate missing', done => {
      let wrapper
      const i18n = new VueI18n({
        locale: 'en',
        missing: (locale, key, instance) => {
          assert.equal('en', locale)
          assert.equal('foo.bar.buz', key)
          assert(wrapper.vm === instance)
          done()
        }
      })
      wrapper = mount({}, { localVue, i18n })
      wrapper.vm.$t('foo.bar.buz')
    })
  })

  describe('i18n missing getter/setter', () => {
    it('should be worked', done => {
      const missing = (locale, key) => {
        assert(false)
      }
      const i18n = new VueI18n({
        locale: 'en',
        missing
      })

      assert.equal(missing, i18n.missing)

      i18n.missing = (locale, key, vm) => {
        done()
      }
      i18n.t('foo.bar.buz')
    })
  })
})
