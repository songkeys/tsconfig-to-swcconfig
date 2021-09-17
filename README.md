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

## License

MIT
