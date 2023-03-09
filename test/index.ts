import { test } from 'tap'
import path from 'path'
import { convert } from '../src/index'

test('convert tsconfig file', (t) => {
  let result = convert()
  t.match(result.jsc?.target, 'es2018')

  result = convert(
    'tsconfig-not-default.json',
    path.resolve(__dirname, 'fixtures', 'tsconfig'),
    { minify: true },
  )
  t.match(result.sourceMaps, false)
  t.match(result.module?.type, 'commonjs')
  t.match(result.module?.noInterop, false)
  // @ts-ignore
  t.match(result.module?.strictMode, true)
  t.match(result.jsc?.externalHelpers, true)
  t.match(result.jsc?.target, 'es3')
  t.match(result.jsc?.parser?.decorators, true)
  t.match(result.jsc?.transform?.decoratorMetadata, true)
  t.match(result.jsc?.transform?.react?.pragma, 'React.createElement')
  t.match(result.jsc?.transform?.react?.pragmaFrag, 'React.Fragment')
  t.match(result.jsc?.keepClassNames, false)
  t.match(result.minify, true)

  result = convert(
    'tsconfig-edge-case.json',
    path.resolve(__dirname, 'fixtures', 'tsconfig'),
  )
  t.match(result.module?.noInterop, true)

  t.end()
})

test('ignores strict from tsconfig', (t) => {
  const result = convert()
  t.equal(result.module?.strict, undefined)
  t.end()
})