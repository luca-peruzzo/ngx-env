import {
  BuilderContext,
  createBuilder,
  BuilderOutput,
} from "@angular-devkit/architect";
import { JsonObject } from "@angular-devkit/core";
import { Project } from "ts-morph";
import * as ts from "typescript";
import * as path from "path";
import { getClientEnvironment } from "../../utils/env";

interface Options extends JsonObject {
  files: string[];
  outputPath: string;
}

const { raw } = getClientEnvironment(/^NG_APP/i);

async function processBuilder({
  files,
  outputPath,
}: Options): Promise<BuilderOutput> {
  const [file] = files;
  console.log({ outputPath });
  try {
    const sourceProject = new Project();
    const destinationProject = new Project();
    const sources = sourceProject.addSourceFilesAtPaths(files);
    sources.forEach((source) => {
      console.log(path.resolve(outputPath, source.getBaseName()));
      const destinationSource = destinationProject.createSourceFile(
        path.resolve(outputPath, source.getBaseName()),
        source.getText()
      );
      destinationSource.transform((traversal) => {
        const node = traversal.visitChildren();
        if (ts.isPropertyAccessExpression(node)) {
          const processEnv = node.getChildren();
          if (
            ts.isPropertyAccessExpression(processEnv[0]) &&
            processEnv[0].getText() === "process.env" &&
            ts.isIdentifier(processEnv[2])
          ) {
            return ts.factory.createStringLiteral(raw[processEnv[2].getText()]);
          }
        }
        return node;
      });
    });
    await destinationProject.save();
  } catch (err) {
    return {
      success: false,
      error: `Unable to process ${file}`,
    };
  }
  return { success: true };
}

export default createBuilder<any>(processBuilder);
