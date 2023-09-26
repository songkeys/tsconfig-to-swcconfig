import fs from 'node:fs'
import Deepmerge from '@fastify/deepmerge'
import JoyCon from 'joycon'
import { parse } from 'jsonc-parser'
import type ts from 'typescript'

const deepmerge = Deepmerge({
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
	filename = 'tsconfig.json',
	cwd: string = process.cwd(),
): ts.CompilerOptions | null {
	const { compilerOptions } = loadTsFile(filename, cwd) ?? {}
	return compilerOptions ?? null
}

function loadTsFile(filename: string, cwd: string): any {
	let { data, path } = resolveFile(filename, cwd) ?? {}

	if (!path || !data) {
		return null
	}

	if (!data.extends) {
		return data
	}

	const extendsArr = Array.isArray(data.extends) ? data.extends : [data.extends]
	for (let _extends of extendsArr) {
		if (!_extends.endsWith('.json')) {
			_extends += '.json'
		}
		data = deepmerge(loadTsFile(_extends, cwd), data)
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

export function parseParamValue(prop: string, value: string) {
	if (value === 'undefined') {
		return undefined
	}
	try {
		return JSON.parse(value)
	} catch (_) {
		return value
	}
}
