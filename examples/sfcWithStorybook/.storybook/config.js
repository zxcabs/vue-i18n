import { configure } from '@storybook/vue';
import VueI18n from 'vue-i18n';

import Vue from 'vue';

Vue.use(VueI18n);

function loadStories() {
  require('../src/App.story.js');
}

configure(loadStories, module);
