<!-- ./pages/blog/index.vue -->

<script setup>
definePageMeta({
  key: (route) => route.fullPath,
});

// get tag query
const {
  query: { tags },
} = useRoute();

const filter = ref(tags?.split(","));

// set meta for page
useHead({
  title: "DevOzs Posts",
  meta: [
    { name: "description", content: "DevOps Blog Posts built by DevOzs" },
    {
      hid: "og:image",
      property: "og:image",
      content: `https://blog.devozs.com/devops-avatar.png?timestamp=${new Date().getMilliseconds()}`,
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: `https://blog.devozs.com/devops-avatar.png?timestamp=${new Date().getMilliseconds()}` },
  ],
});
</script>
<template>
  <main>
    <div>
      <div class="img-cont h-72 mb-2">
        <img :src="`/img/devops-avatar.png`" :alt="DevOzsHome" class=" rounded-2xl" />
      </div>
      <!-- <div class="wrapper">
        <h1 class="text-5xl font-extrabold">All blogs</h1>
        <p class="font-medium text-lg">Here's a list of all DevOps blogs</p>
      </div> -->
    </div>

    <section class="page-section">
      <Tags />

      <!-- Render list of all articles in ./content/blog using `path` -->
      <!-- Provide only defined fieldsin the `:query` prop -->
      <ContentList path="/blog" :query="{
        only: ['title', 'description', 'tags', '_path', 'img'],
        where: {
          tags: {
            $contains: filter,
          },
        },
        $sensitivity: 'base',
      }">
        <!-- Default list slot -->
        <template v-slot="{ list }">
          <ul class="article-list">
            <li v-for="article in list" :key="article._path" class="article-item">
              <NuxtLink :to="article._path">
                <div class="wrapper">
                  <div class="img-cont w-32 shrink-0">
                    <img :src="`/${article.img}`" :alt="article.title" class="rounded-lg max-h-[8rem]" />
                  </div>
                  <header>
                    <h1 class="text-2xl font-semibold">{{ article.title }}</h1>
                    <p>{{ article.description }}</p>
                    <ul class="article-tags">
                      <li class="tag !py-0.5" v-for="(tag, n) in article.tags" :key="n">{{ tag }}</li>
                    </ul>
                  </header>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </template>

        <!-- Not found slot to display message when no content us is found -->
        <template #not-found>
          <p>No articles found.</p>
        </template>
      </ContentList>
    </section>
  </main>
</template>
