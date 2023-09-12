// ./nuxt.config.ts

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      titleSeparator: '·',
      siteUrl: 'https://blog.devozs.com/',
      siteName: 'DevOzs Blog',
      siteDescription: 'DevOps Blog Posts built by DevOzs',
      language: 'en',
      trailingSlash: true,
    }
  },
  extends: [
    'nuxt-seo-kit'
  ],
  modules: [
      '@nuxt/content',
      '@nuxtjs/tailwindcss',
      'nuxt-gtag'
  ],
  content: {
    // https://content.nuxtjs.org/api/configuration
    highlight: {
      theme: {
        // Default theme (same as single string)
        default: 'material-palenight',
        // Theme used if `html.dark`
        dark: 'github-dark',
      }
    },
    markdown: {
      toc: {
        depth: 5,
        searchDepth: 5
      },
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },
  app: {
    head: {
      charset: 'utf-8',
      meta: [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: `https://blog.devozs.com/devops-avatar.png?timestamp=${new Date().getMilliseconds()}` },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

})
