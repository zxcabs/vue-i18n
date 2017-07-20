import { createLocalVue, mount } from 'vue-test-utils'
import VueI18n from '../../src/index'

describe('silent', () => {
  const localVue = createLocalVue()
  VueI18n.install.installed = false
  localVue.use(VueI18n)

  it('should be suppressed translate warnings', () => {
    const i18n = new VueI18n({
      locale: 'en',
      silentTranslationWarn: true,
      messages: {
        en: { who: 'root' },
        ja: { who: 'ルート' }
      }
    })
    const wrapper = mount({}, { localVue, i18n })
    const spy = sinon.spy(console, 'warn')
    wrapper.vm.$t('foo.bar.buz')
    assert(spy.notCalled === true)

    // change
    wrapper.vm.$i18n.silentTranslationWarn = false
    wrapper.vm.$t('foo.bar.buz')
    assert(spy.callCount === 2)

    spy.restore()
  })
})
