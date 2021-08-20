# tsconfig-to-swcconfig

[![NPM version](https://img.shields.io/npm/v/tsconfig-to-swcconfig.svg?style=flat)](https://npmjs.org/package/tsconfig-to-swcconfig)
[![NPM downloads](https://img.shields.io/npm/dm/tsconfig-to-swcconfig.svg?style=flat)](https://npmjs.org/package/tsconfig-to-swcconfig)

Convert tsconfig to swc config.

## Install

```bash
npm i tsconfig-to-swcconfig
```

## Usage

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

## License

MIT
