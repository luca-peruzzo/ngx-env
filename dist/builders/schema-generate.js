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
const fs = require("fs");
const cpy = require("cpy");
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Adding @ngx-env/builder schema");
        const ngxEnvConf = JSON.parse(fs.readFileSync(`src/builders/ngx-env/ngx-env.json`, 'utf-8'));
        yield cpy(['src/builders/**/*.json'], 'dist/builders/schemas');
        ["dev-server", "browser", "extract-i18n", "karma", "server", "application"].forEach((target) => __awaiter(this, void 0, void 0, function* () {
            const builderConf = JSON.parse(fs.readFileSync(`src/builders/${target}/${target}.json`, 'utf-8'));
            builderConf.properties = Object.assign(Object.assign({}, builderConf.properties), ngxEnvConf);
            yield fs.writeFileSync(`dist/builders/schemas/${target}.json`, JSON.stringify(builderConf, null, 4));
        }));
    });
}
exports.default = default_1;
