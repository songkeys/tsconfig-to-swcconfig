import fs from 'fs'
import JoyCon from 'joycon'
import type ts from 'typescript'
import { parse } from 'jsonc-parser'
import Deepmerge from '@fastify/deepmerge'

const deepmerge = Deepmerge({
  all: true,
  mergeArray: function replaceByClonedSource(options) {
    const clone = options.clone
    return function (target, source) {
      return clone(source)
    }
  },
})

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
  return compilerOptions ?? null
}

function loadTsFile(filename: string, cwd: string, tsConfig?: any): any {
  let { data, path } = resolveFile(filename, cwd) ?? {}

  if (!path || !data) {
    return tsConfig
  }

  if (tsConfig) {
    data = deepmerge(data, tsConfig)
  }

  if (!data.extends) {
    return data
  }

  const extendsArr = Array.isArray(data.extends) ? data.extends : [data.extends]
  delete data.extends
  for (let _extends of extendsArr) {
    if (!_extends.endsWith('.json')) {
      _extends += '.json'
    }
    const clonedData = structuredClone(data)
    data = loadTsFile(_extends, cwd, clonedData)
  }

  return data
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
