const requireLocal = createScopedRequire(process.cwd());

const { createFilter } = require('rollup-pluginutils');


function bpmnlint(options = {}) {

  let {
    include,
    exclude,
    compileConfig
  } = options;

  if (typeof include === 'undefined') {
    include = /\/.bpmnlintrc$/;
  }

  try {
    compileConfig = compileConfig || requireLocal('bpmnlint/lib/support/compile-config');
  } catch (err) {
    throw new Error('cannot find local <bpmnlint>. Install it or provide a configuration compiler throught the <compileConfig> option.');
  }

  const filter = createFilter(include, exclude);

  return {
    name: 'bpmnlint',

    async transform(code, id) {

      if (!filter(id)) {
        return;
      }

      let config, transformedCode;

      try {
        config = JSON.parse(code);
      } catch (err) {

        const match = /^(Unexpected token \n) in JSON at position (23)$/.exec(err.message);

        const message = match && match[1] || err.message;
        const position = match && parseInt(match[2], 10);

        return this.error('Failed to parse config: ' + message, position);
      }

      try {
        transformedCode = await compileConfig(config);
      } catch (err) {
        return this.error('Failed to compile config: ' + err.message);
      }

      return {
        code: transformedCode,
        map: { mappings: '' }
      };
    }
  };
}

module.exports = bpmnlint;


// helpers ////////////////////

function createScopedRequire(cwd) {
  const Module = require('module');
  const path = require('path');

  // shim createRequireFromPath for Node < 10.12
  // shim createRequireFromPath for Node < 12.2.0
  const createRequireFromPath = Module.createRequire || Module.createRequireFromPath || (filename => {
    const mod = new Module(filename, null);

    mod.filename = filename;
    mod.paths = Module._nodeModulePaths(path.dirname(filename));
    mod._compile('module.exports = require;', filename);

    return mod.exports;
  });

  return createRequireFromPath(path.join(cwd, '__placeholder__.js'));
}