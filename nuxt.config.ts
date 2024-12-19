// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: ["@unocss/nuxt", "@element-plus/nuxt"],
  css: ["@unocss/reset/tailwind.css", "./assets/site.css"],
  unocss: { attributify: true, icons: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  devtools: { enabled: true },
});
