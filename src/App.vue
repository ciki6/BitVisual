<template>
  <div class="container vertical">
    <header>header</header>
    <section class="container">
      <aside class="vertical">
        <router-link v-for="item in menus" :to='"/"+item'>{{ item }}</router-link>
      </aside>
      <section>
        <router-view />
      </section>
    </section>
  </div>
</template>
<script setup lang="ts">
  const pages = import.meta.glob("./pages/**/*.vue");
  console.log(pages);
  const menus = new Set<string>();

  Object.keys(pages).forEach((filePath) => {
    const segments = filePath.split("/");
    menus.add(segments[2]);
  });

  console.log(menus);
</script>
<style scoped>
  .container {
    display: flex;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    flex-direction: row;
  }
  .vertical {
    flex-direction: column;
  }
  header {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  aside {
    display: flex;
  }
</style>
