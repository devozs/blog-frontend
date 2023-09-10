<!-- ./pages/blog/tags/[slug].vue -->

<script setup>
// const print = (wareev) => {
//   console.log(wareev);
// };

// get current route
const {
  params: { slug },
} = useRoute();

const filter = slug.split(",");
console.log({ filter });


useSeoMeta({
  title: () => `Blogs with ${slug}`,
  ogImage: () => `https://blog.devozs.com/img/devops-avatar.png?timestamp=${new Date().getMilliseconds()}`,
})

</script>
<template>
  <main>
    <header class="page-heading">
      <div class="wrapper">
        <h1 class="text-5xl font-extrabold">All blogs with "{{ slug }}"</h1>
        <p class="font-medium text-lg">Here's a list of all filtered blogs</p>
      </div>
    </header>
    <section class="page-section">
      <Tags />
      <!-- Render list of all articles in ./content/blog using `path` -->
      <!-- Provide only defined fieldsin the `:query` prop -->
      <ContentList
        path="/blog"
        :query="{
          only: ['title', 'description', 'tags', '_path', 'img'],
          where: {
            tags: {
              $contains: filter,
            },
          },
          $sensitivity: 'base',
        }"
      >
        <!-- Default list slot -->
        <template v-slot="{ list }">
          <ul class="article-list">
            <li v-for="article in list" :key="article._path" class="article-item">
              <NuxtLink :to="article._path">
                <div class="wrapper">
                  <div class="img-cont w-32">
                    <img :src="`/${article.img}`" :alt="article.title" class="rounded-lg max-h-[8rem]" />
                  </div>
                  <header>
                    <h1 class="text-2xl font-semibold">{{ article.title }}</h1>
                    <p>{{ article.description }}</p>
                    <ul class="article-tags">
                      <li class="tag" v-for="(tag, n) in article.tags" :key="n">
                        <NuxtLink :to="`/tags/${tag}`" class="underline"> {{ tag }} </NuxtLink>
                      </li>
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
