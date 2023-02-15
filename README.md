# rollup-plugin-bpmnlint

[![CI](https://github.com/nikku/rollup-plugin-bpmnlint/actions/workflows/CI.yml/badge.svg)](https://github.com/nikku/rollup-plugin-bpmnlint/actions/workflows/CI.yml)

Convert [bpmnlint](https://github.com/bpmn-io/bpmnlint) config files to consumable modules.

```javascript
import { Linter } from 'bpmnlint';

import linterConfig from './.bpmnlintrc';

const linter = new Linter(linterConfig);
```


## Installation

```sh
npm i rollup-plugin-bpmnlint -D
```

## Usage

```js
import { rollup } from 'rollup';

import bpmnlint from 'rollup-plugin-bpmnlint';

import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

rollup({
  input: 'main.js',
  plugins: [
    nodeResolve(),
    commonjs(),
    bpmnlint({
      // matching .bpmnlintrc files per default
      include: '**/.bpmnlintrc',

      // undefined per default
      exclude: [ ],

      // an compiler that transforms a .bpmnlintrc
      // file into the actual bpmnlint configuration
      compileConfig: null
    })
  ]
});
```


## License

MIT
