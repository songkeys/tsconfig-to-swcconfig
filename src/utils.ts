import fs from 'fs'
import JoyCon from 'joycon'
import type * as ts from 'typescript'
import { parse } from 'jsonc-parser'
import deepmerge from 'deepmerge'
import nodePath from "path";

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

  if(!path || !data){
    const resolvedModule = resolveNodeModule(filename)
    if(resolvedModule){
      cwd = resolvedModule.cwd
      path = resolvedModule.path
      data = resolvedModule.data
    }
  }

  if (path && data) {
    if (tsConfig) {
      data = deepmerge(data, tsConfig)
    }
    let { extends: _extends } = data
    if (_extends) {
      delete data.extends
      if(!_extends.endsWith('.json')){
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

export function resolveNodeModule(fileName: string){
 try {
   const data = require(fileName)
   const path = require.resolve(fileName)
   const cwd = nodePath.resolve(require.resolve(fileName), '..')
   return {data, path, cwd}
 }catch (e){
   return null
 }
}
