/* global describe, it, expect */

import Vue from 'vue'
import Hello from '../../src/components/Hello.vue'

describe('Hello.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      template: '<div><hello></hello></div>',
      components: { Hello }
    }).$mount()
    expect(vm.$el.querySelector('.Hello .Lead.Lead-phonegap').textContent).toBe('Phonegap')
    expect(vm.$el.querySelector('.Hello .Lead.Lead-spacer').textContent).toBe('meets')
    expect(vm.$el.querySelector('.Hello .Lead.Lead-vue').textContent).toBe('Vue.js')
  })
})

// also see example testing a component with mocks at
// https://github.com/vuejs/vueify-example/blob/master/test/unit/a.spec.js#L22-L43
