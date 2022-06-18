import { SchematicsException, Tree } from "@angular-devkit/schematics";
import { Workspace } from "./workspace";

export function getFileFromTree(
  host: Tree,
  possibleFiles: string[]
): {
  path: string;
  content: Workspace;
} {
  const path = possibleFiles.find((path) => host.exists(path));
  const configBuffer = path ? host.read(path) : undefined;

  if (!path || !configBuffer) {
    throw new SchematicsException(`Could not find angular.json`);
  }

  let content: Workspace;
  try {
    content = JSON.parse(configBuffer.toString());
  } catch (e: any) {
    throw new SchematicsException(
      `Could not parse angular.json: ${e?.message}`
    );
  }

  return { path, content };
}
