"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexHtml = exports.plugin = void 0;
const core_1 = require("@dotenv-run/core");
const path_1 = require("path");
const fs_1 = require("fs");
function escapeStringRegexp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function replacer(content, dotEnvOptions) {
    const raw = (0, core_1.env)(dotEnvOptions).raw;
    return Object.keys(raw).reduce((html, key) => html.replace(new RegExp("%" + escapeStringRegexp(key) + "%", "g"), raw[key]), content);
}
function plugin(options) {
    const _options = Object.assign(Object.assign({}, options), { appEnv: "NG_APP_ENV" });
    return [
        {
            name: "dotenv-run",
            setup: (build) => {
                var _a;
                let full = undefined;
                const define = (_a = build.initialOptions.define) !== null && _a !== void 0 ? _a : {};
                full = (0, core_1.env)(_options).full;
                build.initialOptions.define = Object.assign(Object.assign({}, full), define);
            },
        },
    ];
}
exports.plugin = plugin;
function indexHtml(options, dotEnvOptions) {
    const browserPath = (0, path_1.resolve)(dotEnvOptions.cwd, options.outputPath, "browser/index.html");
    const serverPath = (0, path_1.resolve)(dotEnvOptions.cwd, options.outputPath, "server/index.server.html");
    const browserIndex = (0, fs_1.readFileSync)(browserPath, "utf-8");
    const serverIndex = (0, fs_1.readFileSync)(serverPath, "utf-8");
    (0, fs_1.writeFileSync)(browserPath, replacer(browserIndex, Object.assign(Object.assign({}, dotEnvOptions), { appEnv: "NG_APP_ENV" })));
    (0, fs_1.writeFileSync)(serverPath, replacer(serverIndex, Object.assign(Object.assign({}, dotEnvOptions), { appEnv: "NG_APP_ENV" })));
}
exports.indexHtml = indexHtml;
