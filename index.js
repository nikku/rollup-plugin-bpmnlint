const compileConfig = require('bpmnlint/lib/support/compile-config');

const { createFilter } = require('rollup-pluginutils');


function bpmnlint(options = {}) {

  let {
    include,
    exclude
  } = options;

  if (typeof include === 'undefined') {
    include = /\/.bpmnlintrc$/;
  }

  const filter = createFilter(include, exclude);

  return {
    name: 'bpmnlint',

    async transform(code, id) {

      if (!filter(id)) {
        return;
      }

      const config = JSON.parse(code);

      const transformedCode = await compileConfig(config);

      return {
        code: transformedCode,
        map: { mappings: '' }
      };
    }
  };
}

module.exports = bpmnlint;