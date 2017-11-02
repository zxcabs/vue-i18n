const merge = require('webpack-merge');
const conf = require('../webpack.config');
module.exports = (storyConf, env) => {
  conf.entry = {};

  const vueLoaderIndex = storyConf.module.rules.findIndex((rule) => {
    return rule.loader.indexOf('vue-loader') > -1;
  });

  if (vueLoaderIndex > -1) {
    storyConf.module.rules.splice(vueLoaderIndex, 1);
  }

  return merge(conf, storyConf);
};
