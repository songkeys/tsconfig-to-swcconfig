import type * as swcType from '@swc/core'
import type * as tsType from 'typescript'
import deepmerge from 'deepmerge'
import { getTSOptions } from './utils'

export function convert(
  /** filename to tsconfig */
  filename: string = 'tsconfig.json',
  /** cwd */
  cwd: string = process.cwd(),
  /** swc configs to override */
  swcOptions?: swcType.Options,
): swcType.Options {
  const tsOptions = getTSOptions(filename, cwd) ?? {}
  return convertTsConfig(tsOptions, swcOptions)
}

export function convertTsConfig(
  tsOptions: tsType.CompilerOptions,
  swcOptions: swcType.Options = {},
): swcType.Options {
  // https://json.schemastore.org/tsconfig
  const {
    esModuleInterop = false,
    sourceMap = 'inline', // notice here we default it to 'inline' instead of false
    importHelpers = false,
    experimentalDecorators = false,
    emitDecoratorMetadata = false,
    target = 'es3',
    module: _module,
    jsxFactory = 'React.createElement',
    jsxFragmentFactory = 'React.Fragment',
    jsxImportSource = 'react',
    alwaysStrict = false,
    noImplicitUseStrict = false,
    paths,
    baseUrl,
  } = tsOptions
  const module = (_module as unknown as string)?.toLowerCase()

  const transformedOptions = deepmerge(
    {
      sourceMaps: sourceMap,
      module: {
        type: ['commonjs', 'amd', 'umd'].includes(module) ? module : 'commonjs',
        strictMode: alwaysStrict || !noImplicitUseStrict,
        noInterop: !esModuleInterop,
      } as swcType.ModuleConfig,
      jsc: {
        externalHelpers: importHelpers,
        target: target as swcType.JscTarget,
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: experimentalDecorators,
          dynamicImport: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: emitDecoratorMetadata,
          react: {
            throwIfNamespace: false,
            development: false,
            useBuiltins: false,
            pragma: jsxFactory,
            pragmaFrag: jsxFragmentFactory,
            importSource: jsxImportSource,
          },
        },
        keepClassNames: !['es3', 'es5', 'es6', 'es2015'].includes(
          (target as string).toLowerCase(),
        ),
        paths,
        baseUrl,
      },
    } as swcType.Options,
    swcOptions,
  )

  return transformedOptions
}
