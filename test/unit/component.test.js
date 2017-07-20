import { createLocalVue, mount } from 'vue-test-utils'
import VueI18n from '../../src/index'
import dateTimeFormats from './fixture/datetime'
import numberFormats from './fixture/number'

function getInstances (wrapper) {
  const vm = wrapper.vm
  return {
    root: vm.$refs.who,
    child1: vm.$refs.child1.$refs.who,
    child1Fallback: vm.$refs.child1.$refs.fallback,
    child1DateTime: vm.$refs.child1.$refs.datetime,
    child1Number: vm.$refs.child1.$refs.number,
    child2: vm.$refs.child2.$refs.who,
    subChild1: vm.$refs.child1.$refs['sub-child1'].$refs.who,
    subChild2: vm.$refs.child2.$refs['sub-child2'].$refs.who
  }
}

describe('component translation', () => {
  const localVue = createLocalVue()
  VueI18n.install.installed = false
  localVue.use(VueI18n)

  let wrapper
  const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))
  const money = 101
  const messages = {
    'en-US': {
      who: 'root',
      fallback: 'fallback'
    },
    'ja-JP': {
      who: 'ルート',
      fallback: 'フォールバック'
    }
  }

  beforeEach(() => {
    const i18n = new VueI18n({
      locale: 'ja-JP',
      messages,
      dateTimeFormats,
      numberFormats
    })

    wrapper = mount({
      components: {
        child1: { // translation with component
          i18n: {
            locale: 'en-US',
            sync: false,
            messages: {
              'en-US': { who: 'child1' },
              'ja-JP': { who: '子1' }
            }
          },
          components: {
            'sub-child1': { // translation with root
              render (h) {
                return h('div', {}, [
                  h('p', { ref: 'who' }, [this.$t('who')])
                ])
              }
            }
          },
          render (h) {
            return h('div', {}, [
              h('p', { ref: 'who' }, [this.$t('who')]),
              h('p', { ref: 'fallback' }, [this.$t('fallback')]),
              h('p', { ref: 'datetime' }, [this.$d(dt, 'short')]),
              h('p', { ref: 'number' }, [this.$n(money, 'currency')]),
              h('sub-child1', { ref: 'sub-child1' })
            ])
          }
        },
        child2: {
          components: {
            'sub-child2': {
              i18n: {
                messages: {
                  'en-US': { who: 'sub-child2' },
                  'ja-JP': { who: 'サブの子2' }
                }
              },
              render (h) {
                return h('div', {}, [
                  h('p', { ref: 'who' }, [this.$t('who')])
                ])
              }
            }
          },
          render (h) {
            return h('div', {}, [
              h('p', { ref: 'who' }, [this.$t('who')]),
              h('sub-child2', { ref: 'sub-child2' })
            ])
          }
        }
      },
      render (h) {
        return h('div', {}, [
          h('p', { ref: 'who' }, [this.$t('who')]),
          h('child1', { ref: 'child1' }),
          h('child2', { ref: 'child2' })
        ])
      }
    }, { localVue, i18n })
  })

  it('should be translated', done => {
    let instances = getInstances(wrapper)
    done()
      /*
    assert.equal(instances.root.textContent, 'ルート')
    assert.equal(instances.child1.textContent, 'child1')
    assert.equal(instances.child1Fallback.textContent, 'フォールバック')

    // NOTE: avoid webkit(phatomjs/safari) & Intl polyfill wired localization...
    isChrome && assert.equal(instances.child1DateTime.textContent, '12/19/2012, 10:00 PM')
    isChrome && assert.equal(instances.child1Number.textContent, '$101.00')
    assert.equal(instances.child2.textContent, 'ルート')
    assert.equal(instances.subChild1.textContent, 'ルート')
    assert.equal(instances.subChild2.textContent, 'サブの子2')

    // change locale
    i18n.locale = 'en-US'
    wrapper.vm.$refs.child1.$i18n.locale = 'ja-JP'
    wrapper.update()
    // TODO:
    wrapper.vm.$nextTick(() => {
      instances = getInstances(wrapper)

      assert.equal(instances.root.textContent, 'root')
      assert.equal(instances.child1.textContent, '子1')
      assert.equal(instances.child1Fallback.textContent, 'fallback')

      // NOTE: avoid webkit(phatomjs/safari) & Intl polyfill wired localization...
      isChrome && assert.equal(instances.child1DateTime.textContent, '2012/12/20 12:00')
      isChrome && assert.equal(instances.child1Number.textContent, '￥101')
      assert.equal(instances.child2.textContent, 'root')
      assert.equal(instances.subChild1.textContent, 'root')
      assert.equal(instances.subChild2.textContent, 'sub-child2')

      wrapper.vm.$destroy()
      wrapper.update()

      assert(wrapper.vm.$i18n === null)
      done()
    })
    */
  })
})
