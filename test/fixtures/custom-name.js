import { config, resolver } from './bpmnlint-config.json';

expect(config).to.exist;
expect(resolver).to.exist;

expect(config.extends).not.to.exist;
expect(config.rules).to.be.empty;