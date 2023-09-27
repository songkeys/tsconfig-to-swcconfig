import { type TsConfigJson, getTsconfig } from 'get-tsconfig'

export function getTSOptions(
	filename = 'tsconfig.json',
	cwd: string = process.cwd(),
): TsConfigJson.CompilerOptions | null {
	const result = getTsconfig(cwd, filename)
	if (!result) {
		return null
	}
	const { config } = result
	return config.compilerOptions ?? null
}
