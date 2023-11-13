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
exports.plugin = void 0;
const webpack_1 = require("@dotenv-run/webpack");
function escapeStringRegexp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function plugin(options, ssr = false) {
    const _options = Object.assign(Object.assign({}, options), { appEnv: "NG_APP_ENV" });
    const dotEnvPlugin = new webpack_1.DotenvRunPlugin(_options, ssr);
    const raw = dotEnvPlugin.raw;
    return {
        webpackConfiguration: (webpackConfig) => __awaiter(this, void 0, void 0, function* () {
            webpackConfig.plugins.push(dotEnvPlugin);
            return webpackConfig;
        }),
        indexHtml: (content) => __awaiter(this, void 0, void 0, function* () {
            return Object.keys(raw).reduce((html, key) => html.replace(new RegExp("%" + escapeStringRegexp(key) + "%", "g"), raw[key]), content);
        }),
    };
}
exports.plugin = plugin;
