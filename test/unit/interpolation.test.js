import { createLocalVue, mount } from 'vue-test-utils'
import VueI18n from '../../src/index'
import Component from '../../src/component'

const messages = {
  en: {
    text: 'one: {0}',
    premitive: 'one: {0}, two: {1}',
    component: 'element: {0}, component: {1}',
    link: '@:premitive',
    term: 'I accept xxx {0}.',
    tos: 'Term of service',
    fallback: 'fallback from {0}'
  },
  ja: {
    text: '一: {0}'
  }
}
const components = {
  comp: {
    props: {
      msg: { type: String, default: '' }
    },
    render (h) {
      return h('p', [this.msg])
    }
  },
  fallback: {
    i18n: {
      locale: 'en'
    },
    render (h) {
      return h('i18n', { props: { path: 'fallback' } }, [
        h('p', ['child'])
      ])
    }
  }
}

describe('component interpolation', () => {
  const localVue = createLocalVue()
  VueI18n.install.installed = false
  localVue.use(VueI18n)

  let i18n
  beforeEach(() => {
    i18n = new VueI18n({
      locale: 'en',
      messages
    })
  })

  describe('children', () => {
    describe('text nodes', () => {
      it('should be interpolated', () => {
        const wrapper = mount({
          render (h) {
            return h('i18n', { props: { path: 'text' } }, [this._v('1')])
          }
        }, { localVue, i18n })
        assert.equal(wrapper.text(), 'one: 1')
      })
    })

    describe('premitive nodes', () => {
      it('should be interpolated', () => {
        const wrapper = mount({
          render (h) {
            return h('i18n', { props: { path: 'premitive' } }, [
              h('p', ['1']),
              h('p', ['2'])
            ])
          }
        }, { localVue, i18n })
        assert.equal(wrapper.html(), '<span>one: <p>1</p>, two: <p>2</p></span>')
      })
    })

    describe('components', () => {
      it('should be interpolated', () => {
        const wrapper = mount({
          components,
          render (h) {
            return h('i18n', { props: { path: 'component' } }, [
              h('p', ['1']),
              h('comp', { props: { msg: 'foo' } })
            ])
          }
        }, { localVue, i18n })
        assert.equal(wrapper.html(), '<span>element: <p>1</p>, component: <p>foo</p></span>')
      })
    })

    describe('fallback', () => {
      it('should be interpolated', () => {
        const wrapper = mount({
          components,
          render (h) {
            return h('fallback')
          }
        }, { localVue, i18n })
        assert.equal(wrapper.html(), '<span>fallback from <p>child</p></span>')
      })
    })

    describe('nested components', () => {
      it('should be interpolated', () => {
        const wrapper = mount({
          components,
          render (h) {
            return h('i18n', { props: { path: 'component' } }, [
              h('p', ['1']),
              h('div', {}, [
                h('i18n', { class: 'nested', props: { tag: 'div', path: 'component' } }, [
                  h('p', ['2']),
                  h('comp', { props: { msg: 'nested' } })
                ])
              ])
            ])
          }
        }, { localVue, i18n })
        assert.equal(
          wrapper.html(),
          '<span>element: <p>1</p>, component: <div><div class="nested">element: <p>2</p>, component: <p>nested</p></div></div></span>'
        )
      })
    })
  })

  describe('linked', () => {
    it('should be interpolated', () => {
      const wrapper = mount({
        render (h) {
          return h('i18n', { props: { path: 'link' } }, [
            h('p', ['1']),
            h('p', ['2'])
          ])
        }
      }, { localVue, i18n })
      assert.equal(wrapper.html(), '<span>one: <p>1</p>, two: <p>2</p></span>')
    })
  })

  describe('locale', () => {
    it('should be interpolated', () => {
      const wrapper = mount({
        render (h) {
          return h('i18n', { props: { path: 'text', locale: 'ja' } }, [
            this._v('1')
          ])
        }
      }, { localVue, i18n })
      assert.equal(wrapper.html(), '<span>一: 1</span>')
    })
  })

  describe('included translation locale message', () => {
    it('should be interpolated', () => {
      const wrapper = mount({
        render (h) {
          return h('i18n', { props: { path: 'term' } }, [
            h('a', { domProps: { href: '/term', textContent: this.$t('tos') } })
          ])
        }
      }, { localVue, i18n })
      assert.equal(
        wrapper.html(),
        '<span>I accept xxx <a href=\"/term\">Term of service</a>.</span>'
      )
    })
  })

  describe('warnning in render', () => {
    it('should be warned', () => {
      const spy = sinon.spy(console, 'warn')

      Component.render(() => {}, { children: [], parent: {} })
      assert(spy.notCalled === false)
      assert(spy.callCount === 1)

      spy.restore()
    })
  })
})
