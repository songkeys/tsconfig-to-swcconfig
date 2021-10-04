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
  t.match(result, { target: 'es2018' })

  t.end()
})
