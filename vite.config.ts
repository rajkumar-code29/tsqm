import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

import siteConfiguration from './site.config.json' with { type: 'json' }

/**
 * This repository builds two independent websites from one source tree.
 *
 *   public      the charity's site — seven pages, indexed, linked from
 *               everywhere. Contains no private route and no ciphertext.
 *   collection  the gated Faberge collection, deployed on its own and
 *               sharing none of the public site's pages. Every path on it
 *               is a dead end except the one that matches the path hash.
 *
 * They are separate builds rather than one build with a hidden corner, so
 * the public bundle provably cannot contain the private page: its entry
 * point never imports it.
 */
const TARGET = (process.env.BUILD_TARGET ?? 'public') as 'public' | 'collection'

// GitHub Pages serves a project site from /<repo>/, so the base path has to
// match the repository name. Override when deploying somewhere else.
const BASE = {
  public: process.env.PUBLIC_BASE ?? '/tsqm/',
  collection: process.env.COLLECTION_BASE ?? '/tsqm-collection/',
}[TARGET]

const ENTRY = TARGET === 'collection' ? 'collection.html' : 'index.html'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: BASE,
  build: {
    outDir: `dist/${TARGET}`,
    emptyOutDir: true,
    sourcemap: mode === 'development' ? 'inline' : false,
    minify: mode !== 'development',
    rollupOptions: {
      input: path.resolve(import.meta.dirname, ENTRY),
    },
  },
  plugins: [react(), tailwindcss(), siteMetadata(siteConfiguration, TARGET)],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
}))

type SiteConfiguration = {
  title?: string
  description?: string
  language?: string
  robots?: { index?: boolean }
  icons?: { icon?: string }
  openGraph?: { image?: string }
}

/**
 * Applies site.config.json to the public site's document shell, so the page
 * title, meta description and social-sharing tags live in one editable file
 * rather than being hard-coded into index.html.
 *
 * The collection site is deliberately left alone: it has its own minimal
 * shell and must not advertise itself with a description or a social card.
 */
function siteMetadata(config: SiteConfiguration, target: 'public' | 'collection'): Plugin {
  const title = config.title ?? 'Friends of TS Queen Mary'
  const description = config.description ?? ''
  const favicon = config.icons?.icon ?? ''
  const socialImage = config.openGraph?.image ?? ''
  const language = (config.language ?? 'en-GB').replace(/[^a-zA-Z0-9-]/g, '')
  const noIndex = config.robots?.index === false

  const escape = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return {
    name: 'site-metadata',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (target === 'collection') return html

        const tags: HtmlTagDescriptor[] = []

        if (description) {
          tags.push({ tag: 'meta', attrs: { name: 'description', content: description }, injectTo: 'head' })
        }
        if (noIndex) {
          tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' })
        }
        if (favicon) {
          tags.push({ tag: 'link', attrs: { rel: 'icon', href: favicon }, injectTo: 'head' })
        }

        tags.push(
          { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:site_name', content: 'Friends of TS Queen Mary' }, injectTo: 'head' },
        )
        if (description) {
          tags.push({ tag: 'meta', attrs: { property: 'og:description', content: description }, injectTo: 'head' })
        }
        if (socialImage) {
          tags.push(
            { tag: 'meta', attrs: { property: 'og:image', content: socialImage }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:image', content: socialImage }, injectTo: 'head' },
          )
        }

        return {
          html: html
            .replace('<!-- site:lang -->', language)
            .replace('<!-- site:title -->', escape(title)),
          tags,
        }
      },
    },
  }
}
