<!-- ./components/content/InfoBox.vue -->

<script setup>
// import icons from HeroIcons
import { InformationCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from "@heroicons/vue/24/solid";

// define props in <script>
const props = defineProps(["type"]);
</script>

<template>
  <!-- Access `type` prop in Dynamic class  -->
  <div class="info-box not-prose" :class="[type]">
    <!-- Conditionally render icons based on prop -->
    <ExclamationTriangleIcon v-if="type == 'warning'" class="icon solid" />
    <ExclamationCircleIcon v-else-if="type == 'error'" class="icon solid" />
    <ExclamationCircleIcon v-else-if="type == 'code'" class="icon solid" />
    <InformationCircleIcon v-else class="icon solid" />

    <details>
      <summary>
        <!-- Unamed Slot to render component content -->
        <slot />
      </summary>
      <div class="details pt-2">
        <!-- Named ContentSlot component to render rich-text -->
        <ContentSlot :use="$slots.details" unwrap="p"></ContentSlot>
      </div>
    </details>
  </div>
</template>

<style scoped>
.info-box {
  @apply flex items-start gap-2 p-4 bg-green-100 border border-green-200 text-green-500 rounded-lg;
}

.icon.solid {
  @apply fill-green-600;
}

details summary {
  @apply flex font-semibold leading-tight cursor-pointer;
}

details .details {
  @apply text-sm;
}

.info-box .icon {
  @apply shrink-0;
}

.info-box.warning {
  @apply bg-yellow-200 border-yellow-400 text-yellow-600;
}

.info-box.warning .icon.solid {
  @apply fill-yellow-600;
}

.info-box.error {
  @apply bg-red-200 border-red-400 text-red-600;
}

.info-box.error .icon.solid {
  @apply fill-red-600;
}
.info-box.code {
  @apply bg-slate-800 border-slate-200 text-slate-200;
}

.info-box.code .icon.solid {
  @apply fill-slate-200;
}

</style>
