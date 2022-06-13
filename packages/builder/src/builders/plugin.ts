import * as webpack from "webpack";
import { Configuration } from "webpack";
import { escapeStringRegexp, getClientEnvironment } from "../utils/env";

export function plugin() {
  const { raw, stringified } = getClientEnvironment(/^NG_APP/i);
  return {
    webpackConfiguration: async (webpackConfig: Configuration) => {
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          "process.env": stringified,
        })
      );
      return webpackConfig;
    },
    indexHtml: async (content: string) => {
      const rawWithEnv = {
        ...raw,
        NG_APP_ENV: raw["NG_APP_ENV"],
      };
      return Object.keys(rawWithEnv).reduce(
        (html, key) =>
          html.replace(
            new RegExp("%" + escapeStringRegexp(key) + "%", "g"),
            rawWithEnv[key]
          ),
        content
      );
    },
  };
}
