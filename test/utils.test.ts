import { describe, it } from 'vitest'
import path from 'path'
import { getTSOptions } from '../src/utils'

describe.concurrent('getTSOptions', () => {
  it('should read tsconfig.json', ({ expect }) => {
    let result = getTSOptions(
      'tsconfig.json',
      path.resolve(__dirname, 'fixtures', 'tsconfig'),
    )
    expect(result).toMatchObject({ target: 'esnext' })

    result = getTSOptions()
    expect(result).toMatchObject({ target: 'es2018' })
  })

  it('should return null if not read tsconfig.json', ({ expect }) => {
    let result = getTSOptions('tsconfig.json', path.resolve('/')) // a place with no tsconfig
    expect(result).toBe(null)
  })

  it('should read extended tsconfig', ({ expect }) => {
    let result = getTSOptions(
      'tsconfig-extends.json',
      path.resolve(__dirname, 'fixtures', 'tsconfig'),
    )
    expect(result).toMatchObject({ target: 'es2018', strict: true })
  })

  it('should read extended tsconfig in node_modules', ({ expect }) => {
    let result = getTSOptions(
      'tsconfig-extends-imported.json',
      path.resolve(__dirname, 'fixtures', 'tsconfig'),
    )
    expect(result).toMatchObject({
      lib: ['es2019', 'es2020.promise', 'es2020.bigint', 'es2020.string'],
      module: 'commonjs',
      target: 'es2018',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      moduleResolution: 'node',
    })
  })
})
