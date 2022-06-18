import { SchematicsException } from "@angular-devkit/schematics";

export type Options = Record<string, any>;
export type Environment = "development" | "production";
export interface WorkspaceProject {
  projectType?: string;
  architect?: Record<
    string,
    {
      builder: string;
      index?: string;
      options?: Options;
      configurations?: Record<Environment, Options>;
      defaultConfiguration?: Environment;
      fileReplacements?: {
        replace: string;
        with: string;
      }[];
    }
  >;
}

export interface Workspace {
  defaultProject?: string;
  projects: Record<string, WorkspaceProject>;
}

export function writeBuilder(
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
