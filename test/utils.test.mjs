import { deepStrictEqual } from 'node:assert'
import { dirname, resolve } from 'node:path'
import { describe, it } from 'node:test'
import { URL } from 'node:url'
import { getTSOptions } from '../dist/utils.js'

const __dirname = dirname(new URL(import.meta.url).pathname)

describe('getTSOptions', { concurrency: true }, () => {
	it('should read tsconfig.json', () => {
		let result = getTSOptions(
			'tsconfig.json',
			resolve(__dirname, 'fixtures', 'tsconfig'),
		)
		deepStrictEqual(result, {
			strict: true,
			target: 'esnext',
		})

		result = getTSOptions()
		deepStrictEqual(result, {
			lib: ['es2018'],
			module: 'commonjs',
			target: 'es2018',
			strict: true,
			esModuleInterop: true,
			skipLibCheck: true,
			forceConsistentCasingInFileNames: true,
			declaration: true,
			rootDir: 'src',
			outDir: 'dist',
		})
	})

	it('should return null if not read tsconfig.json', () => {
		const result = getTSOptions('tsconfig.json', resolve('/')) // a place with no tsconfig
		deepStrictEqual(result, null)
	})

	it('should read extended tsconfig', () => {
		const result = getTSOptions(
			'tsconfig-extends.json',
			resolve(__dirname, 'fixtures', 'tsconfig'),
		)
		deepStrictEqual(result, { target: 'es2018', strict: true })
	})

	it('should read extended tsconfig with no target set', () => {
		const result = getTSOptions(
			'tsconfig-extends-no-target.json',
			resolve(__dirname, 'fixtures', 'tsconfig'),
		)
		deepStrictEqual(result, { target: 'esnext', strict: true })
	})

	it('should read multiple extended tsconfig with no target set', () => {
		const result = getTSOptions(
			'tsconfig-extends-no-target-child.json',
			resolve(__dirname, 'fixtures', 'tsconfig'),
		)
		deepStrictEqual(result, { target: 'esnext', strict: false })
	})

	it('should read extended tsconfig in node_modules', () => {
		const result = getTSOptions(
			'tsconfig-extends-imported.json',
			resolve(__dirname, 'fixtures', 'tsconfig'),
		)
		deepStrictEqual(result, {
			lib: ['es2019', 'es2020.promise', 'es2020.bigint', 'es2020.string'],
			module: 'node16',
			target: 'es2018',
			strict: true,
			esModuleInterop: true,
			skipLibCheck: true,
			forceConsistentCasingInFileNames: true,
			moduleResolution: 'node16',
		})
	})

	it('should read extended array tsconfig', () => {
		const result = getTSOptions(
			'tsconfig-extends-array.json',
			resolve(__dirname, 'fixtures', 'tsconfig'),
		)
		deepStrictEqual(result, {
			lib: ['es2019', 'es2020.promise', 'es2020.bigint', 'es2020.string'],
			module: 'node16',
			target: 'es2018',
			strict: true,
			esModuleInterop: true,
			skipLibCheck: true,
			forceConsistentCasingInFileNames: true,
			moduleResolution: 'node16',
			allowJs: true, // from the second child
		})
	})
})
