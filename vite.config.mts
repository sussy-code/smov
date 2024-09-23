import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import loadVersion from "vite-plugin-package-version";
import { VitePWA } from "vite-plugin-pwa";
import checker from "vite-plugin-checker";
import path from "path";
import million from 'million/compiler';
import { handlebars } from "./plugins/handlebars";
import { PluginOption, loadEnv, splitVendorChunkPlugin } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

import tailwind from "tailwindcss";
import rtl from "postcss-rtlcss";

const captioningPackages = [
  "dompurify",
  "htmlparser2",
  "subsrt-ts",
  "parse5",
  "entities",
  "fuse"
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_BASE_URL || '/',
    plugins: [
      million.vite({ auto: true, mute: true }),
      handlebars({
        vars: {
          opensearchEnabled: env.VITE_OPENSEARCH_ENABLED === "true",
          routeDomain:
            env.VITE_APP_DOMAIN +
            (env.VITE_NORMAL_ROUTER !== "true" ? "/#" : ""),
          domain: env.VITE_APP_DOMAIN,
          env,
        },
      }),
      react({
        babel: {
          presets: [
            "@babel/preset-typescript",
            [
              "@babel/preset-env",
              {
                modules: false,
                useBuiltIns: "entry",
                corejs: {
                  version: "3.34",
                },
              },
            ],
          ],
        },
      }),
      VitePWA({
        disable: env.VITE_PWA_ENABLED !== "true",
        registerType: "autoUpdate",
        workbox: {
          maximumFileSizeToCacheInBytes: 4000000, // 4mb
          globIgnores: ["!assets/**/*"],
        },
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "safari-pinned-tab.svg",
        ],
        manifest: {
          name: "sudo-flix",
          short_name: "sudo-flix",
          description: "Watch your favorite shows and movies for free with no ads ever! (っ'ヮ'c)",
          theme_color: "#120f1d",
          background_color: "#120f1d",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
      loadVersion(),
      checker({
        overlay: {
          position: "tr",
        },
        typescript: true, // check typescript build errors in dev server
        eslint: {
          // check lint errors in dev server
          lintCommand: "eslint --ext .tsx,.ts src",
          dev: {
            logLevel: ["error"],
          },
        },
      }),
      splitVendorChunkPlugin(),
      visualizer() as PluginOption
    ],

    build: {
      sourcemap: true,
      rollupOptions: {
        output: {},
        manualChunks(id: string) {
          if (id.includes("@sozialhelden+ietf-language-tags") || id.includes("country-language")) {
            return "language-db";
          }
          if (id.includes("hls.js")) {
            return "hls";
          }
          if (id.includes("node-forge") || id.includes("crypto-js")) {
            return "auth";
          }
          if (id.includes("locales") && !id.includes("en.json")) {
            return "locales";
          }
          if (id.includes("react-dom")) {
            return "react-dom";
          }
          if (id.includes("Icon.tsx")) {
            return "Icons";
          }
          const isCaptioningPackage = captioningPackages.some(packageName => id.includes(packageName));
          if (isCaptioningPackage) {
            return "caption-parsing";
          }
        }
      }
    },
    css: {
      postcss: {
        plugins: [tailwind(), rtl()],
      },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@sozialhelden/ietf-language-tags": path.resolve(
          __dirname,
          "./node_modules/@sozialhelden/ietf-language-tags/dist/cjs"
        ),
      },
    },

    test: {
      environment: "jsdom",
    },
  };
});
