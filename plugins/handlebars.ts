import { globSync } from "glob";
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { PluginOption } from "vite";
import Handlebars from "handlebars";
import path from "path";

export const handlebars = (options: { vars?: Record<string, any> } = {}): PluginOption[] => {
  const files = globSync("src/assets/**/**.hbs");

  function render(content: string): string {
    const template = Handlebars.compile(content);
    return template(options?.vars ?? {});
  }

  return [
    {
      name: 'hbs-templating',
      enforce: "pre",
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          return render(html);
        }
      },
    },
    viteStaticCopy({
      silent: true,
      targets: files.map(file => ({
        src: file,
        dest: '',
        rename: path.basename(file).slice(0, -4), // remove .hbs file extension
        transform: {
          encoding: 'utf8',
          handler(content: string) {
            return render(content);
          }
        }
      }))
    })
  ]
}
