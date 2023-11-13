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
const fs = require("fs");
function copyDistSchemas() {
    console.log("Copying Angular CLI target schemas");
    ["dev-server", "browser", "extract-i18n", "karma", "server", "application"].forEach((target) => __awaiter(this, void 0, void 0, function* () {
        yield cpy([
            `./node_modules/@angular-devkit/build-angular/src/builders/${target}/schema.json`,
        ], `src/builders/${target}`);
        console.log(`./node_modules/@angular-devkit/build-angular/src/builders/${target}/schema.json ==> src/builders/${target} ✅`);
        fs.renameSync(`src/builders/${target}/schema.json`, `src/builders/${target}/${target}.json`);
    }));
}
copyDistSchemas();
