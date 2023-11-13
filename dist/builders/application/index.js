"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWithPlugin = void 0;
const architect_1 = require("@angular-devkit/architect");
const build_angular_1 = require("@angular-devkit/build-angular");
const rxjs_1 = require("rxjs");
const project_1 = require("../../utils/project");
const esbuild_plugin_1 = require("../esbuild-plugin");
const buildWithPlugin = (options, context) => {
    let cwd;
    return (0, rxjs_1.from)((0, project_1.getProjectCwd)(context)).pipe((0, rxjs_1.switchMap)((_cwd) => {
        cwd = _cwd;
        return (0, architect_1.fromAsyncIterable)((0, build_angular_1.buildApplication)(options, context, (0, esbuild_plugin_1.plugin)(Object.assign(Object.assign({}, options.ngxEnv), { cwd }))));
    }), (0, rxjs_1.tap)(() => {
        (0, esbuild_plugin_1.indexHtml)(options, Object.assign(Object.assign({}, options.ngxEnv), { cwd }));
    }));
};
exports.buildWithPlugin = buildWithPlugin;
exports.default = (0, architect_1.createBuilder)(exports.buildWithPlugin);
