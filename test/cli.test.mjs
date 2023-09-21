import { match, ok, strictEqual } from 'node:assert'
import { execFile } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { describe, it } from 'node:test'
import { URL } from 'node:url'
import { promisify } from 'node:util'

const __dirname = dirname(new URL(import.meta.url).pathname)

const pExe = promisify(execFile)

describe('cli', { concurrency: true }, () => {
	it('should print help', async () => {
		const { stdout, stderr } = await pExe('node', ['dist/cli.js', '--help'])
		strictEqual(stderr, '')
		ok(stdout)
	})

	it('should convert tsconfig.json', async () => {
		const { stdout, stderr } = await pExe('node', ['dist/cli.js'])
		strictEqual(stderr, '')
		match(stdout, /"target": "es2018"/)
	})

	it('should convert --filename', async () => {
		const { stdout, stderr } = await pExe('node', [
			'dist/cli.js',
			'--filename',
			resolve(__dirname, 'fixtures', 'tsconfig', 'tsconfig-es6.json'),
		])
		strictEqual(stderr, '')
		match(stdout, /"target": "es2015"/)
	})

	it('should convert tsconfig.json with additions', async () => {
		const { stdout, stderr } = await pExe('node', [
			'dist/cli.js',
			'--set',
			'module.target=es2015',
		])
		strictEqual(stderr, '')
		match(stdout, /"target": "es2015"/)
	})

	it('should convert tsconfig.json with additions', async () => {
		const { stdout, stderr } = await pExe('node', [
			'dist/cli.js',
			'--filename',
			resolve(__dirname, 'fixtures', 'tsconfig', 'tsconfig-es2022.json'),
			'--set',
			'module.target=es2015',
			'--set',
			'module.type=commonjs',
		])
		strictEqual(stderr, '')
		match(stdout, /"target": "es2015"/)
		match(stdout, /"type": "commonjs"/)
	})
})
