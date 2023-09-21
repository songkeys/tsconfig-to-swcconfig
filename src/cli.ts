#!/usr/bin/env node

import { writeFile } from 'node:fs'
import { parseArgs } from 'node:util'
import type swcType from '@swc/core'
import { convert } from './index'

const {
	values: { filename, cwd, output, help, set: overrideValues },
} = parseArgs({
	options: {
		filename: {
			type: 'string',
			short: 'f',
			default: 'tsconfig.json',
		},
		cwd: {
			type: 'string',
			short: 'c',
			default: process.cwd(),
		},
		output: {
			type: 'string',
			short: 'o',
		},
		set: {
			type: 'string',
			short: 's',
			multiple: true,
		},
		help: {
			type: 'boolean',
			short: 'h',
			default: false,
		},
	},
})

if (help) {
	console.log(`
Usage: tsconfig-to-swcconfig [options]
Alias: t2s [options]

Options:
  -f, --filename <filename>  filename to tsconfig (default: "tsconfig.json")
  -c, --cwd <cwd>            cwd (default: "${process.cwd()}")
  -o, --output <output>      output file (default: stdout)
  -s, --set <name>=<value>   set additional swcrc options
  -h, --help                 display help for command
`)

	process.exit(0)
}

const overrides = overrideValues?.reduce((all, a) => {
	const [prop, value] = a.split('=', 2)
	const props = prop.split('.')
	const parents = props.slice(0, -1)
	const key = props[props.length - 1]
	const parent = parents.reduce((o, s) => {
		o[s] ??= {}
	}, all)

	parent[key] = value

	return all
}, {} as any) as swcType.Options

const swcConfig = convert(filename, cwd, overrides)

if (output) {
	writeFile(output, JSON.stringify(swcConfig, null, 2), (err) => {
		if (err) {
			console.error(err)
			process.exit(1)
		}
	})
} else {
	console.log(JSON.stringify(swcConfig, null, 2))
	process.exit(0)
}
