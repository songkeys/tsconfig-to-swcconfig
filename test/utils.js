"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tap_1 = require("tap");
const path_1 = __importDefault(require("path"));
const utils_1 = require("../src/utils");
tap_1.test('read tsconfig file', (t) => {
    let result = utils_1.getTSOptions('tsconfig.json', path_1.default.resolve(__dirname, 'fixtures', 'tsconfig'));
    t.match(result, { target: 'esnext' });
    result = utils_1.getTSOptions();
    t.match(result, { target: 'es2018' });
    result = utils_1.getTSOptions('tsconfig.json', path_1.default.resolve('/')); // a place with no tsconfig
    t.match(result, null);
    t.end();
});
