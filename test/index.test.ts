import { describe, it } from 'vitest'
import path from 'path'
import { convert } from '../src/index'

describe('convert', () => {
  it('should convert tsconfig.json', ({ expect }) => {
    let result = convert()
    expect(result.jsc?.target, 'es2018')

    result = convert(
      'tsconfig-not-default.json',
      path.resolve(__dirname, 'fixtures', 'tsconfig'),
      { minify: true },
    )
    expect(result.sourceMaps).toBe(false)
    expect(result.module?.type).toBe('commonjs')
    // @ts-ignore
    expect(result.module?.noInterop).toBe(false)
    // @ts-ignore
    expect(result.module?.strictMode).toBe(true)
    expect(result.jsc?.externalHelpers).toBe(true)
    expect(result.jsc?.target).toBe('es3')
    expect(result.jsc?.parser?.decorators).toBe(true)
    expect(result.jsc?.transform?.decoratorMetadata).toBe(true)
    expect(result.jsc?.transform?.react?.pragma).toBe('React.createElement')
    expect(result.jsc?.transform?.react?.pragmaFrag).toBe('React.Fragment')
    expect(result.jsc?.keepClassNames).toBe(false)
    expect(result.minify).toBe(true)

    result = convert(
      'tsconfig-edge-case.json',
      path.resolve(__dirname, 'fixtures', 'tsconfig'),
    )
    // @ts-ignore
    expect(result.module?.noInterop).toBe(true)
  })

  it('should ignore strict from tsconfig', ({ expect }) => {
    const result = convert()
    // @ts-ignore
    expect(result.module?.strict).toBe(undefined)
  })
})
