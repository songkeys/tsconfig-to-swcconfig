import { strictEqual } from 'node:assert'
import { dirname, resolve } from 'node:path'
import { describe, it } from 'node:test'
import { URL } from 'node:url'
import { convert } from '../dist/index.js'

const __dirname = dirname(new URL(import.meta.url).pathname)

describe('convert', { concurrency: true }, () => {
	it('should convert tsconfig.json', () => {
		let result = convert()
		strictEqual(result.jsc?.target, 'es2018')

		result = convert(
			'tsconfig-not-default.json',
			resolve(__dirname, 'fixtures', 'tsconfig'),
			{ minify: true },
		)
		strictEqual(result.sourceMaps, false)
		strictEqual(result.module?.type, 'commonjs')
		strictEqual(result.module?.noInterop, false)
		strictEqual(result.module?.strictMode, true)
		strictEqual(result.jsc?.externalHelpers, true)
		strictEqual(result.jsc?.target, 'es3')
		strictEqual(result.jsc?.parser?.decorators, true)
		strictEqual(result.jsc?.transform?.decoratorMetadata, true)
		strictEqual(result.jsc?.transform?.react?.pragma, 'React.createElement')
		strictEqual(result.jsc?.transform?.react?.pragmaFrag, 'React.Fragment')
		strictEqual(result.jsc?.keepClassNames, false)
		strictEqual(result.minify, true)

		result = convert(
			'tsconfig-edge-case.json',
			resolve(__dirname, 'fixtures', 'tsconfig'),
		)
		strictEqual(result.module?.noInterop, true)
	})

	it('should ignore strict from tsconfig', () => {
		const result = convert()
		strictEqual(result.jsc?.strict, undefined)
	})

	it('should ignore strict from tsconfig', () => {
		const result = convert(
			'tsconfig-es2022.json',
			resolve(__dirname, 'fixtures', 'tsconfig'),
		)
		strictEqual(result.module?.type, 'es6')
	})

	it('should support target es6', () => {
		const result = convert(
			'tsconfig-es6.json',
			resolve(__dirname, 'fixtures', 'tsconfig'),
		)
		strictEqual(result.jsc?.target, 'es2015')
	})

	it('should output module:es6 if the nearest package.json is of type:module', () => {
		const result = convert(
			'tsconfig.json',
			resolve(__dirname, 'fixtures', 'tsconfig-with-package-json'),
		)
		strictEqual(result.module?.type, 'es6')
	})
})
