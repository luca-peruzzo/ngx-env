"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cpy = require("cpy");
function copySchema(name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield cpy([`src/schematics/${name}/schema.json`], `dist/schematics/${name}`);
        yield cpy([`src/schematics/${name}/template`], `dist/schematics/${name}/template`);
    });
}
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        yield copySchema("ng-add");
    });
}
exports.default = default_1;
