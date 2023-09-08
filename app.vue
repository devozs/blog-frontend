<!-- ./app.vue -->
<script setup>
useHead({
  title: "DevOzs Blog",
  meta: [
    { name: 'description', content: 'DevOps Interview Blog Posts built by DevOzs' }
  ],
})
</script>
<template>
  <div>
    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
  </div>
</template>
