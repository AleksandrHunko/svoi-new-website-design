import nunjucks from "nunjucks";
import path from "path";

export default function nunjucksPlugin(options = {}) {
  const { variables = {} } = options;

  return {
    name: "vite-plugin-nunjucks",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const root = ctx.server?.config.root ?? process.cwd();
        const env = nunjucks.configure(root, { noCache: true });
        const pageVars = { ...variables, page: ctx.path };
        return env.renderString(html, pageVars);
      },
    },
  };
}
