var { expect } = require('chai');
var { rollup } = require('rollup');

var bpmnlint = require('../');

function createBundle(options, bpmnlintOptions = {}) {
  options.plugins = [bpmnlint(bpmnlintOptions)];

  return rollup(options);
}


describe('rollup-plugin-bpmnlint', function() {

  describe('should pack config', function() {

    it('.bpmnlintrc', async function() {

      // given
      const bundle = await createBundle({ input: 'test/fixtures/basic.js' });

      // when
      const { code } = await bundle.generate({ format: 'iife', moduleName: 'cfg' });

      // then
      new Function('expect', code)(expect);
    });


    it('custom name', async function() {

      // given
      const bundle = await createBundle(
        { input: 'test/fixtures/custom-name.js' },
        { include: /\/bpmnlint-config.json$/ }
      );

      // when
      const { code } = await bundle.generate({ format: 'iife', moduleName: 'cfg' });

      // then
      new Function('expect', code)(expect);
    });

  });


  it('should output sourcemap', async function() {

    // given
    const bundle = await createBundle({ input: 'test/fixtures/basic.js' });

    // when
    const { code, map } = await bundle.generate({ sourcemap: true, format: 'esm' });

    // then
    expect(code).to.exist;
    expect(map).to.exist;
  });


  it('should throw when failing to resolve', async function() {

    let err;

    try {
      await createBundle(
        { input: 'test/fixtures/error.js' },
        { include: /\/bpmnlint-config-error.json$/ }
      );


    } catch (e) {
      err = e;
    }

    expectError(err, 'Failed to compile config: Cannot resolve config <base> from <bpmnlint-plugin-unknown>');
  });


  it('should throw when parsing bad JSON', async function() {

    let err;

    try {
      await createBundle(
        { input: 'test/fixtures/bad-json-error.js' },
        { include: /\/bpmnlint-config-bad-json-error.json$/ }
      );

    } catch (e) {
      err = e;
    }

    expectError(err, 'Failed to parse config: Unexpected token \n');
  });

});


// helpers //////////////////

function expectError(err, expectedMessage) {

  expect(err).to.exist;

  const message = err.message;

  if (message.startsWith(expectedMessage)) {
    return;
  }

  expect(message).to.eql(expectedMessage);
}