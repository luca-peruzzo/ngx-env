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
exports.buildWithPlugin = void 0;
const architect_1 = require("@angular-devkit/architect");
const build_angular_1 = require("@angular-devkit/build-angular");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const plugin_1 = require("../plugin");
const esbuild_plugin_1 = require("../esbuild-plugin");
const project_1 = require("../../utils/project");
const buildWithPlugin = (options, context) => {
    var _a;
    const buildTarget = (0, architect_1.targetFromTargetString)((_a = options.buildTarget) !== null && _a !== void 0 ? _a : options.browserTarget);
    function setup() {
        return __awaiter(this, void 0, void 0, function* () {
            return context.getTargetOptions(buildTarget);
        });
    }
    function builderName() {
        return __awaiter(this, void 0, void 0, function* () {
            return context.getBuilderNameForTarget(buildTarget);
        });
    }
    return (0, rxjs_1.combineLatest)([setup(), builderName(), (0, project_1.getProjectCwd)(context)]).pipe((0, operators_1.switchMap)(([_options, builderName, cwd]) => {
        const ngxEnvOptions = Object.assign(Object.assign(Object.assign({ context }, options.ngxEnv), _options.ngxEnv), { cwd });
        if (builderName === "@ngx-env/builder:application") {
            options.forceEsbuild = true;
            return (0, build_angular_1.executeDevServerBuilder)(options, context, null, {
                buildPlugins: (0, esbuild_plugin_1.plugin)(ngxEnvOptions),
            });
        }
        else {
            return (0, build_angular_1.executeDevServerBuilder)(options, context, (0, plugin_1.plugin)(ngxEnvOptions));
        }
    }));
};
exports.buildWithPlugin = buildWithPlugin;
exports.default = (0, architect_1.createBuilder)(exports.buildWithPlugin);
