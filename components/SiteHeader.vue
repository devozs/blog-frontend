<!-- ./components/SiteHeader.vue -->

<template>
  <header class="site-header">
    <div class="wrapper">
      <NuxtLink to="/" class="no-underline">
        <figure class="site-logo">
          <h1>DevOzs Blog</h1>
        </figure>
      </NuxtLink>

      <a href="http://devozs.com" target="DevOzs" rel="noopener noreferrer">
        <figure class="img-cont h-8">
          <img class="gallery-img rounded-full" src="/img/ozs.jpeg" alt="Oz Shemesh">
        </figure>
      </a>


      <!-- <nav class="site-nav">
        <ul class="links">
          <li class="link">
            <NuxtLink to="/blog">Blog</NuxtLink>
          </li>
        </ul>
      </nav> -->
    </div>
  </header>
</template>

<style scoped>
.site-header {
  @apply sticky top-0 w-full p-4 bg-slate-100 bg-opacity-40 border-b-2 border-white border-opacity-30 backdrop-blur-lg z-20;
}

.site-header>.wrapper {
  @apply flex items-center justify-between max-w-6xl m-auto;
}

.site-logo {
  @apply font-black text-lg;
}
</style>