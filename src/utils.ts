import fs from 'fs'
import JoyCon from 'joycon'
import type * as ts from 'typescript'
import { parse } from 'jsonc-parser'

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
  const { data, path } = joycon.loadSync([filename], cwd)
  if (path && data) {
    return data.compilerOptions
  }
  return null
}
