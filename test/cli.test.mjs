import { doesNotMatch, match, ok, strictEqual } from 'node:assert'
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

	it('should convert tsconfig.json with explicit-string additions', async () => {
		const { stdout, stderr } = await pExe('node', [
			'dist/cli.js',
			'--set',
			'module.target="es2015"',
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

	it('should convert tsconfig.json with boolean additions', async () => {
		const { stdout, stderr } = await pExe('node', [
			'dist/cli.js',
			'--set',
			'jsc.externalHelpers=true',
			'--set',
			'jsc.test2=false',
		])
		strictEqual(stderr, '')
		match(stdout, /"externalHelpers": true/)
		match(stdout, /"test2": false/)
	})

	it('should convert tsconfig.json with undefined additions', async () => {
		const { stdout, stderr } = await pExe('node', [
			'dist/cli.js',
			'--filename',
			resolve(__dirname, 'fixtures', 'tsconfig', 'tsconfig-paths.json'),
			'--set',
			'jsc.paths=undefined',
		])
		strictEqual(stderr, '')
		doesNotMatch(stdout, /"paths": /)
		match(stdout, /"baseUrl": "src"/)
	})

	it('should convert tsconfig.json with "undefined" string addition', async () => {
		const { stdout, stderr } = await pExe('node', [
			'dist/cli.js',
			'--filename',
			resolve(__dirname, 'fixtures', 'tsconfig', 'tsconfig.json'),
			'--set',
			'jsc.paths.foo="undefined"',
		])
		strictEqual(stderr, '')
		match(stdout, /"foo": "undefined"/)
	})

	it('should convert tsconfig.json with undefined additions on parent', async () => {
		const { stdout, stderr } = await pExe('node', [
			'dist/cli.js',
			'--filename',
			resolve(__dirname, 'fixtures', 'tsconfig', 'tsconfig-paths.json'),
			'--set',
			'jsc=undefined',
		])
		strictEqual(stderr, '')
		doesNotMatch(stdout, /"jsc": /)
		doesNotMatch(stdout, /"paths": /)
		doesNotMatch(stdout, /"baseUrl": /)
	})

	it('should convert tsconfig.json with numeric additions', async () => {
		const { stdout, stderr } = await pExe('node', [
			'dist/cli.js',
			'--set',
			'jsc.num1=1',
			'--set',
			'jsc.num2=2',
			'--set',
			'jsc.not1=1x',
			'--set',
			'jsc.not2=x2',
		])
		strictEqual(stderr, '')
		match(stdout, /"num1": 1/)
		match(stdout, /"num2": 2/)
		match(stdout, /"not1": "1x"/)
		match(stdout, /"not2": "x2"/)
	})
})
