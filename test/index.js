"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tap_1 = require("tap");
const path_1 = __importDefault(require("path"));
const index_1 = require("../src/index");
tap_1.test('convert tsconfig file', (t) => {
    var _a, _b, _c, _d, _e, _f;
    let result = index_1.convert();
    t.match(result.jsc.target, 'es2018');
    result = index_1.convert('tsconfig-not-default.json', path_1.default.resolve(__dirname, 'fixtures', 'tsconfig'), { minify: true });
    t.match(result.sourceMaps, false);
    t.match(result.module.type, 'commonjs');
    t.match(result.module.noInterop, false);
    // @ts-ignore
    t.match(result.module.strictMode, true);
    t.match(result.jsc.externalHelpers, true);
    t.match(result.jsc.target, 'es3');
    t.match((_a = result.jsc.parser) === null || _a === void 0 ? void 0 : _a.decorators, true);
    t.match((_b = result.jsc.transform) === null || _b === void 0 ? void 0 : _b.decoratorMetadata, true);
    t.match((_d = (_c = result.jsc.transform) === null || _c === void 0 ? void 0 : _c.react) === null || _d === void 0 ? void 0 : _d.pragma, 'React.createElement');
    t.match((_f = (_e = result.jsc.transform) === null || _e === void 0 ? void 0 : _e.react) === null || _f === void 0 ? void 0 : _f.pragmaFrag, 'React.Fragment');
    t.match(result.jsc.keepClassNames, false);
    t.match(result.minify, true);
    result = index_1.convert('tsconfig-edge-case.json', path_1.default.resolve(__dirname, 'fixtures', 'tsconfig'));
    t.match(result.module.noInterop, true);
    t.end();
});
