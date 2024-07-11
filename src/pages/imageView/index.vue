<template>
  <div>
    ImageView组件测试
    <div class="comp_container"></div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
import { onMounted } from 'vue';
import ImageView from '../../../lib/imageView/imageView';

onMounted(() => {
  new ImageView('asd','asd',document.getElementsByClassName('comp_container')[0], 0, {})
})
</script>

<style scoped>
/* 添加样式 */
</style>
