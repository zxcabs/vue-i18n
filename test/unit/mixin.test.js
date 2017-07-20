import { mount } from 'vue-test-utils'
import VueI18n from '../../src/index'
import mixin from '../../src/mixin'

describe('mixin', () => {
  describe('beforeCreate', () => {
    describe('invalid i18n option', () => {
      it('should be warned', () => {
        const spy = sinon.spy(console, 'warn')
        // called from Vue core
        mount({}, { i18n: 1 })

        assert(spy.notCalled === false)
        assert(spy.callCount === 1)

        spy.restore()
      })
    })
  })

  describe('beforeDestroy', () => {
    describe('not assign VueI18n instance', () => {
      it('should be succeeded', () => {
        assert(mixin.beforeDestroy() === undefined)
      })
    })
  })
})
