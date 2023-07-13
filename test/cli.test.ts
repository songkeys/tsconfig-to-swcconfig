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
})
