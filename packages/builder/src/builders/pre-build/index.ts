import { BuilderOutput, createBuilder } from "@angular-devkit/architect";
import { JsonObject } from "@angular-devkit/core";
import * as path from "node:path";
import * as fs from "node:fs";
import { Project } from "ts-morph";
import * as ts from "typescript";
import { escapeStringRegexp, getClientEnvironment } from "../../utils/env";

interface Options extends JsonObject {
  files: string[];
  ciOnly: boolean;
}

const { raw } = getClientEnvironment(/^NG_APP/i);
const rawWithEnv = {
  ...raw,
  NG_APP_ENV: raw["NG_APP_ENV"],
};

async function processTsFiles(files: string[], outputPath: string) {
  const sourceProject = new Project();
  const destinationProject = new Project();
  const sources = sourceProject.addSourceFilesAtPaths(files);
  sources.forEach((source) => {
    const sourcePath = source.getFilePath();
    const destinationPath = sourcePath.replace("src", outputPath);
    try {
      const destinationSource = destinationProject.createSourceFile(
        path.resolve(destinationPath),
        source.getText(),
        { overwrite: true }
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
            return ts.factory.createStringLiteral(
              rawWithEnv[processEnv[2].getText()]
            );
          }
        }
        return node;
      });
      console.log(`${source.getBaseName()} ✔`);
    } catch (e) {
      console.error(e);
      throw new Error(`Unable to process ${sourcePath} to ${destinationPath}`);
    }
  });
  await destinationProject.save();
}

async function processHtmlFiles(files: string[], outputPath: string) {
  files.forEach((file) => {
    const sourcePath = path.resolve(file);
    const destinationPath = sourcePath.replace("src", outputPath);
    const content = fs.readFileSync(sourcePath, "utf-8");
    const replacedContent = Object.keys(rawWithEnv).reduce(
      (html, key) =>
        html.replace(
          new RegExp("%" + escapeStringRegexp(key) + "%", "g"),
          rawWithEnv[key] || ""
        ),
      content
    );
    fs.writeFileSync(destinationPath, replacedContent);
    console.log(`${file} => ${destinationPath} ✔`);
  });
}

async function processBuilder({
  files,
  ciOnly,
}: Options): Promise<BuilderOutput> {
  try {
    const outputPath = ciOnly ? "src" : "src/__ngx-env__";
    await processTsFiles(
      files.filter((file) => file.endsWith(".ts")),
      outputPath
    );
    processHtmlFiles(
      files.filter((file) => file.endsWith(".html")),
      outputPath
    );
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
  return { success: true };
}

export default createBuilder<any>(processBuilder);
