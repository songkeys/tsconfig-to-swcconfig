import type swcType from '@swc/core'
import type tsType from 'typescript'
import { getTSOptions } from './utils'
import Deepmerge from '@fastify/deepmerge'

const deepmerge = Deepmerge()

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
    jsx: _jsx,
    jsxFactory = 'React.createElement',
    jsxFragmentFactory = 'React.Fragment',
    jsxImportSource = 'react',
    alwaysStrict = false,
    noImplicitUseStrict = false,
    paths,
    baseUrl,
  } = tsOptions
  const module = (_module as unknown as string)?.toLowerCase()

  const availableModuleTypes = ['commonjs', 'amd', 'umd', 'es6'] as const

  const jsx = (_jsx as unknown as string)?.toLowerCase()
  const jsxRuntime: swcType.ReactConfig['runtime'] =
    jsx === 'react-jsx' || jsx === 'react-jsxdev' ? 'automatic' : undefined
  const jsxDevelopment: swcType.ReactConfig['development'] =
    jsx === 'react-jsxdev' ? true : undefined

  const transformedOptions = deepmerge(
    {
      sourceMaps: sourceMap,
      module: {
        type: availableModuleTypes.includes(module as any)
          ? (module as (typeof availableModuleTypes)[number])
          : 'commonjs',
        strictMode: alwaysStrict || !noImplicitUseStrict,
        noInterop: !esModuleInterop,
      } satisfies swcType.ModuleConfig,
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
            development: jsxDevelopment,
            useBuiltins: false,
            pragma: jsxFactory,
            pragmaFrag: jsxFragmentFactory,
            importSource: jsxImportSource,
            runtime: jsxRuntime,
          },
        },
        keepClassNames: !['es3', 'es5', 'es6', 'es2015'].includes(
          (target as string).toLowerCase(),
        ),
        paths,
        baseUrl,
      },
    } satisfies swcType.Options,
    swcOptions,
  )

  return transformedOptions
}
