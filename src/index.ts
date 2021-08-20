import type * as swcType from '@swc/core'
import deepmerge from 'deepmerge'
import { getTSOptions } from './utils'

export function convert(
  /** filename to tsconfig */
  filename: string = 'tsconfig.json',
  /** cwd */
  cwd: string = process.cwd(),
  /** swc configs to override */
  swcOptions: swcType.Options = {},
) {
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
    strict = false,
    alwaysStrict = false,
    noImplicitUseStrict = false,
  } = getTSOptions(filename, cwd) ?? {}
  const module = (_module as unknown as string)?.toLowerCase()

  const transformedOptions = deepmerge(
    {
      sourceMaps: sourceMap,
      module: {
        type: ['commonjs', 'amd', 'umd'].includes(module) ? module : 'commonjs',
        strict,
        strictMode: alwaysStrict || !noImplicitUseStrict,
        noInterop: !esModuleInterop,
      } as swcType.ModuleConfig,
      jsc: {
        externalHelpers: importHelpers,
        target: target as swcType.JscTarget,
        parser: {
          syntax: 'typescript',
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
          },
        },
        keepClassNames: !['es3', 'es5', 'es6', 'es2015'].includes(
          (target as string).toLowerCase(),
        ),
      },
    } as swcType.Options,
    swcOptions,
  )

  return transformedOptions
}
