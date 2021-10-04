import fs from 'fs'
import JoyCon from 'joycon'
import type * as ts from 'typescript'
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
  let { data, path } = joycon.loadSync([filename], cwd)
  if (path && data) {
    if (tsConfig) {
      data = deepmerge(tsConfig, data)
    }
    const { extends: _extends } = data
    if (_extends) {
      delete data.extends
      return loadTsFile(path, cwd, data)
    } else {
      return data
    }
  } else {
    return null
  }
}
