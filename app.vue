<!-- ./app.vue -->
<script setup>
useSeoMeta({
  ogImage: () => `https://blog.devozs.com/devops-avatar.png?timestamp=${new Date().getMilliseconds()}`,
})

</script>
<template>
  <div>
    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
  </div>
</template>
