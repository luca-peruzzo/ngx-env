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
import { getFileFromTree, WorkspaceProject } from "../../utils/file-utils";

interface NgAddOptions {
  project: string;
  preBuild: boolean;
}

function writeBuilder(
  project: WorkspaceProject,
  target: string,
  builder: string,
  mandatory = false
) {
  if (!project?.architect?.[target]) {
    if (mandatory) {
      throw new SchematicsException(
        `Cannot read the output path(architect.build.serve.builder) in angular.json`
      );
    }
    return;
  }
  project.architect[target] = {
    ...project.architect[target],
    builder,
  };
}

export function builder({ preBuild, project }: NgAddOptions): Rule {
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
      wsProject.architect["ngx-env"] = {
        builder: "@ngx-env/builder:pre-build",
        options: {
          files: ["src/environments/**.ts", "src/index.html"],
        },
      };
      const { path: packageJsonPath, content: packageJson } = getFileFromTree(
        tree,
        ["/package.json", "./package.json"]
      );
      packageJson["scripts"]["ngx-env"] = "ng run app-process:ngx-env";
      ["prebuild", "prestart", "pretest"].forEach((script) => {
        if (!packageJson["scripts"][script]) {
          packageJson["scripts"][script] = packageJson[script] =
            "npm run ngx-env";
        }
      });
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
