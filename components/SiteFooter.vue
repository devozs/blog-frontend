<template>
    <footer class="site-footer">
        <div class="wrapper">
            <div class="footer-info">
                <!-- <p class="text-xl font-bold">
                    DevOps Blog Posts
                </p> -->
                <span>💚 <a href="http://devozs.com" target="DevOzs"
                        rel="noopener noreferrer">My Portfolio</a></span>
            </div>
            <div class="footer-info">
                <span>📷 By Midjourney</span>
            </div>

            <ul class="footer-links">
                <li class="link-item">
                    <a href="https://github.com/devozs" target="_blank"
                        rel="noopener noreferrer">DevOzs GitHub </a>
                </li>
            </ul>
        </div>
    </footer>
</template>
<style scoped>
.site-footer {
    @apply bg-white px-4 py-12 border-t border-slate-100;
}

.site-footer>.wrapper {
    @apply flex flex-wrap gap-16 justify-between m-auto max-w-6xl;
}
</style>