import { describe, it } from 'vitest'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

describe.concurrent('cli', () => {
  it('should print help', ({ expect }) => {
    const result = spawnSync('node', ['dist/cli.js', '--help'])
    expect(result.status).toBe(0)
    expect(result.stdout.toString()).toBeDefined()
  })

  it('should convert tsconfig.json', ({ expect }) => {
    const result = spawnSync('node', ['dist/cli.js'])
    expect(result.status).toBe(0)
    expect(result.stdout.toString()).toMatch(/"target": "es2018"/)
  })

  it('should convert --filename', ({ expect }) => {
    const result = spawnSync('node', ['dist/cli.js', '--filename', path.resolve(__dirname, 'fixtures', 'tsconfig', 'tsconfig-es6.json')])
    expect(result.status).toBe(0)
    expect(result.stdout.toString()).toMatch(/"target": "es2015"/)
  })

  it('should convert tsconfig.json with additions', ({ expect }) => {
    const result = spawnSync('node', ['dist/cli.js', '--set', 'module.target=es2015'])
    expect(result.status).toBe(0)
    expect(result.stdout.toString()).toMatch(/"target": "es2015"/)
  })

  it('should convert tsconfig.json with additions', ({ expect }) => {
    const result = spawnSync('node', ['dist/cli.js', '--filename', path.resolve(__dirname, 'fixtures', 'tsconfig', 'tsconfig-es2022.json'), '--set', 'module.target=es2015', '--set', 'module.type=commonjs'])
    expect(result.status).toBe(0)
    expect(result.stdout.toString()).toMatch(/"target": "es2015"/)
    expect(result.stdout.toString()).toMatch(/"type": "commonjs"/)
  })
})
