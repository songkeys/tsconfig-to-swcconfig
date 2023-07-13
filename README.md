# tsconfig-to-swcconfig

[![NPM version](https://img.shields.io/npm/v/tsconfig-to-swcconfig.svg?style=flat)](https://npmjs.org/package/tsconfig-to-swcconfig)
[![NPM downloads](https://img.shields.io/npm/dm/tsconfig-to-swcconfig.svg?style=flat)](https://npmjs.org/package/tsconfig-to-swcconfig)

Convert tsconfig to swc config.

## Install

```bash
npm i tsconfig-to-swcconfig
```

## Usage

## Convert config in a tsconfig file

```typescript
import { convert } from 'tsconfig-to-swcconfig'

const swcConfig = convert() // will look for tsconfig under the cwd and convert it to swc config
```

Advanced options:

```typescript
import { convert } from 'tsconfig-to-swcconfig'

convert('tsconfig-filename.json', process.cwd(), {
  // more swc config to override...
  minify: true,
})
```

## Convert tsconfig value

Convert tsconfig value directly:

```typescript
import { convertTsConfig } from 'tsconfig-to-swcconfig'

const swcConfig = convertTsConfig({
  module: 'commonjs',
  target: 'es2018',
  strict: true,
  esModuleInterop: true,
})
```

Advanced usage:

```typescript
import { convertTsConfig } from 'tsconfig-to-swcconfig'

const swcConfig = convertTsConfig(
  { target: 'es2018' }, // tsconfig
  { minify: true }, // more swc config to override...
)
```

## CLI

To use the CLI, install globally:

```bash
npm i -g tsconfig-to-swcconfig
```

Then run:

```bash
tsconfig-to-swcconfig --help
```

```bash
Usage: tsconfig-to-swcconfig [options]
Alias: t2s [options]

Options:
  -f, --filename <filename>  filename to tsconfig (default: "tsconfig.json")
  -c, --cwd <cwd>            cwd (default: process.cwd())
  -o, --output <output>      output file (default: stdout)
  -h, --help                 display help for command
```

Instead of installing globally, you can also use `npx` to run the CLI without installing:

```bash
npx tsconfig-to-swcconfig -f tsconfig.json -c /path/to/project -o swc.config.js
```

## License

MIT
