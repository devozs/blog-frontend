<!-- ./app.vue -->
<script setup>
useSeoMeta({
  title: () => "DevOzs Posts",
  description: () => "DevOps Blog Posts built by DevOzs",
  twitterImage: () => `https://blog.devozs.com/devops-avatar.png?timestamp=${new Date().getMilliseconds()}`,
})

</script>
<template>
  <div>
    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
  </div>
</template>
