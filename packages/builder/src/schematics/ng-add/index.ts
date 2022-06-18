import { normalize } from "@angular-devkit/core";
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { getFileFromTree } from "../../utils/file-utils";
import { WorkspaceProject, writeBuilder } from "../../utils/workspace";

interface NgAddOptions {
  project: string;
  preBuild: boolean;
  ciOnly: boolean;
}

export function builder({ preBuild, ciOnly, project }: NgAddOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { path: workspacePath, content: workspace } = getFileFromTree(tree, [
      "/angular.json",
      "./angular.json",
    ]);

    if (!project) {
      throw new SchematicsException(
        "No Angular project found in the workspace"
      );
    }

    const wsProject: WorkspaceProject = workspace.projects[project];

    if (!wsProject) {
      throw new SchematicsException(
        "The specified Angular project is not defined in this workspace"
      );
    }

    if (preBuild) {
      if (!ciOnly) {
        wsProject.architect["build"] = {
          ...wsProject.architect["build"],
          options: {
            ...wsProject.architect["build"].options,
            index: "src/__ngx-env__/index.html",
          },
          configurations: {
            ...wsProject.architect["build"].configurations,
            development: {
              ...wsProject.architect["build"].configurations.development,
              fileReplacements: [
                {
                  replace: "src/environments/environment.ts",
                  with: "src/__ngx-env__/environments/environment.ts",
                },
              ],
            },
            production: {
              ...wsProject.architect["build"].configurations.production,
              fileReplacements: [
                {
                  replace: "src/environments/environment.ts",
                  with: "src/__ngx-env__/environments/environment.prod.ts",
                },
              ],
            },
          },
        };
        wsProject.architect["test"] = {
          ...wsProject.architect["test"],
          options: {
            ...wsProject.architect["test"].options,
            fileReplacements: [
              {
                replace: "src/environments/environment.ts",
                with: "src/__ngx-env__/environments/environment.ts",
              },
            ],
          },
        };
      }
      wsProject.architect["ngx-env"] = {
        builder: "@ngx-env/builder:pre-build",
        options: {
          files: ["src/environments/**.ts", "src/index.html"],
          ["ciOnly"]: ciOnly ? undefined : false,
        },
      };
      const { path: packageJsonPath, content: packageJson } = getFileFromTree(
        tree,
        ["/package.json", "./package.json"]
      );
      packageJson["scripts"]["ngx-env"] = "ng run app-process:ngx-env";
      if (!packageJson["scripts"]["prebuild"]) {
        packageJson["scripts"]["prebuild"] = "npm run ngx-env";
      }
      if (!ciOnly) {
        ["prestart", "pretest"].forEach((script) => {
          if (!packageJson["scripts"][script]) {
            packageJson["scripts"][script] = "npm run ngx-env";
          }
        });
      }
      tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));
      tree.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
    } else {
      if (wsProject.projectType !== "application") {
        throw new SchematicsException(
          `@ngx-env/builder requires an Angular project type of "application" in angular.json`
        );
      }

      writeBuilder(wsProject, "build", "@ngx-env/builder:browser", true);
      writeBuilder(wsProject, "serve", "@ngx-env/builder:dev-server", true);
      writeBuilder(wsProject, "test", "@ngx-env/builder:karma");
      writeBuilder(wsProject, "extract-i18n", "@ngx-env/builder:extract-i18n");
      writeBuilder(wsProject, "server", "@ngx-env/builder:server");
      tree.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
    }

    if (
      wsProject.architect["ngx-env"] &&
      wsProject.architect["build"].builder === "@ngx-env/builder:browser"
    ) {
      console.warn(
        "You should not use the @ngx-env/builder:pre-build builder with the @ngx-env/builder:browser."
      );
    }
    return tree;
  };
}

export default function (options: any): Rule {
  return chain([
    mergeWith(apply(url("./template"), [move(normalize("./src"))])),
    builder(options),
  ]);
}
