import { expect, describe, it } from 'vitest';
import { transform } from '@babel/core';
import path from 'path';
import fs from 'fs';

import plugin, { PluginOptions } from '../src';

async function compile(filepath: string, opts: PluginOptions) {
  const fileContent = await fs.promises.readFile(path.resolve(__dirname, 'fixtures', filepath), 'utf-8');
  const result = transform(fileContent, {
    plugins: [[plugin, opts || {}]],
    babelrc: false,
  });
  return result?.code;
}

function getOutput(filepath: string) {
  return fs.readFileSync(path.resolve(__dirname, 'fixtures', filepath), 'utf-8').trim();
}

describe('use normal string', () => {
  it('string replacement', async () => {
    const output = await compile('input.js', {
      libraryName: 'rc-tabs',
      importType: 'sideEffect',
      importedSource: 'rc-tabs/assets/index.css',
    });
    expect(output).toBe(getOutput('output.js'));
  });
});
