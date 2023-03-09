import { test } from 'tap'
import path from 'path'
import { getTSOptions } from '../src/utils'

test('read tsconfig file', (t) => {
  let result = getTSOptions(
    'tsconfig.json',
    path.resolve(__dirname, 'fixtures', 'tsconfig'),
  )
  t.match(result, { target: 'esnext' })

  result = getTSOptions()
  t.match(result, { target: 'es2018' })

  result = getTSOptions('tsconfig.json', path.resolve('/')) // a place with no tsconfig
  t.match(result, null)

  result = getTSOptions(
    'tsconfig-extends.json',
    path.resolve(__dirname, 'fixtures', 'tsconfig'),
  )
  t.match(result, { target: 'es2018', strict: true })

  result = getTSOptions(
    'tsconfig-extends-imported.json',
    path.resolve(__dirname, 'fixtures', 'tsconfig'),
  )
  t.match(result, {
    lib: ['es2019', 'es2020.promise', 'es2020.bigint', 'es2020.string'],
    module: 'commonjs',
    target: 'es2018',
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: 'node',
  })

  t.end()
})
