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
    module,
    jsx: _jsx,
    jsxFactory = 'React.createElement',
    jsxFragmentFactory = 'React.Fragment',
    jsxImportSource = 'react',
    alwaysStrict = false,
    noImplicitUseStrict = false,
    paths,
    baseUrl,
  } = tsOptions

  const jsx = (_jsx as unknown as string)?.toLowerCase()
  const jsxRuntime: swcType.ReactConfig['runtime'] =
    jsx === 'react-jsx' || jsx === 'react-jsxdev' ? 'automatic' : undefined
  const jsxDevelopment: swcType.ReactConfig['development'] =
    jsx === 'react-jsxdev' ? true : undefined

  const transformedOptions = deepmerge(
    {
      sourceMaps: sourceMap,
      module: {
        type: moduleType(module),
        strictMode: alwaysStrict || !noImplicitUseStrict,
        noInterop: !esModuleInterop,
      } satisfies swcType.ModuleConfig,
      jsc: {
        externalHelpers: importHelpers,
        target: targetType(target as any),
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

const availableModuleTypes = ['commonjs', 'amd', 'umd', 'es6'] as const
type Module = (typeof availableModuleTypes)[number]

function moduleType(m: tsType.ModuleKind | undefined): Module {
  const module = (m as unknown as string)?.toLowerCase()
  if (availableModuleTypes.includes(module as any)) {
    return module as Module
  }

  const es6Modules = ['es2015', 'es2020', 'es2022', 'esnext'] as const
  if (es6Modules.includes(module as any)) {
    return 'es6'
  }

  return 'commonjs'
}

function targetType(m: string): swcType.JscTarget {
  // ts: https://www.typescriptlang.org/tsconfig#target
  // swc: "es3" | "es5" | "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "es2021" | "es2022" | "esnext";

  return m === 'es6' ? 'es2015' : m as swcType.JscTarget
}