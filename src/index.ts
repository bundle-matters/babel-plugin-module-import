import { NodePath, PluginObj, PluginPass } from '@babel/core';
import * as t from '@babel/types';
import {
  addDefault, addNamed, addNamespace, addSideEffect,
  ImportOptions,
} from '@babel/helper-module-imports';
import assert from 'assert';

export interface PluginOptions extends Partial<ImportOptions> {
  libraryName: string;
  importType: 'default' | 'named' | 'namespace' | 'sideEffect';
  name?: string;
}

export default function moduleImport(): PluginObj {
  return {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    name: require('../package.json').name,
    visitor: {
      ImportDeclaration(path: NodePath<t.ImportDeclaration>, pass: PluginPass) {
        const { libraryName, importType, importedSource, name, ...restOpts } = pass.opts as PluginOptions;

        assert(libraryName, '`libraryName` is required');
        assert(importedSource, '`importedSource` is required');
        assert(importType, '`importType` is required');

        const importedName = typeof path.node.source === 'string'
          ? path.node.source
          : path.node.source.value;

        if (importedName === libraryName) {
          if (importType === 'named') {
            assert(name, '`name` is required when `importType` is named');
            addNamed(path, name, importedSource, restOpts);
          } else if (importType === 'default') {
            addDefault(path, importedSource, restOpts);
          } else if (importType === 'namespace') {
            addNamespace(path, importedSource, restOpts);
          } else if (importType === 'sideEffect') {
            addSideEffect(path, importedSource, restOpts);
          }
        }
      }
    }
  };
}
