"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWithPlugin = void 0;
const architect_1 = require("@angular-devkit/architect");
const build_angular_1 = require("@angular-devkit/build-angular");
const project_1 = require("../../utils/project");
const plugin_1 = require("../plugin");
const buildWithPlugin = (options, context) => {
    return (0, project_1.getProjectCwd)(context).then((cwd) => (0, build_angular_1.executeExtractI18nBuilder)(options, context, (0, plugin_1.plugin)(Object.assign(Object.assign({}, options.ngxEnv), { cwd }))));
};
exports.buildWithPlugin = buildWithPlugin;
exports.default = (0, architect_1.createBuilder)(exports.buildWithPlugin);
