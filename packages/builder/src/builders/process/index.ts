import {
  BuilderContext,
  createBuilder,
  BuilderOutput,
} from "@angular-devkit/architect";
import { JsonObject } from "@angular-devkit/core";
import { Project, StructureKind } from "ts-morph";
import * as ts from "typescript";
import { getClientEnvironment } from "../../utils/env";

interface Options extends JsonObject {
  files: string[];
}

const { raw, stringified } = getClientEnvironment(/^NG_APP/i);

async function processBuilder(
  { files }: Options,
  context: BuilderContext
): Promise<BuilderOutput> {
  const [file] = files;
  try {
    // initialize
    const project = new Project();
    // add source files
    const source = project.addSourceFileAtPath(files[0]);
    source.transform((traversal) => {
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
    await project.save();
  } catch (err) {
    return {
      success: false,
      error: `Unable to process ${file}`,
    };
  }
  return { success: true };
}

export default createBuilder<any>(processBuilder);
