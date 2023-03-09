import fs from 'fs'
import JoyCon from 'joycon'
import type ts from 'typescript'
import { parse } from 'jsonc-parser'
import deepmerge from 'deepmerge'

const joycon = new JoyCon()

joycon.addLoader({
  test: /\.json$/,
  loadSync: (file) => {
    const content = fs.readFileSync(file, 'utf8')
    return parse(content)
  },
})

export function getTSOptions(
  filename: string = 'tsconfig.json',
  cwd: string = process.cwd(),
): ts.CompilerOptions | null {
  const { compilerOptions } = loadTsFile(filename, cwd) ?? {}
  return compilerOptions
}

function loadTsFile(filename: string, cwd: string, tsConfig?: any): any {
  let { data, path } = resolveFile(filename, cwd) ?? {}

  if (path && data) {
    if (tsConfig) {
      data = deepmerge(data, tsConfig)
    }
    let { extends: _extends } = data
    if (_extends) {
      delete data.extends
      if (!_extends.endsWith('.json')) {
        _extends += '.json'
      }
      return loadTsFile(_extends, cwd, data)
    } else {
      return data
    }
  } else {
    return tsConfig
  }
}

function resolveFile(
  filename: string,
  cwd: string,
): {
  data: any
  path: string
} | null {
  try {
    let { data, path } = joycon.loadSync([filename], cwd)
    if (!path || !data) {
      data = require(filename)
      path = require.resolve(filename, { paths: [cwd] })
    }
    return { data, path }
  } catch (e) {
    return null
  }
}
