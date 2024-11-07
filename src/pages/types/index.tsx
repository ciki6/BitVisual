<template>
  <div>
    Types组件测试
    <div class="comp_container"></div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
import { onMounted } from 'vue';
import Types from '../../../lib/types/types';

onMounted(() => {
  new Types('asd','asd',document.getElementsByClassName('comp_container')[0], 0, {})
})
</script>

<style scoped>
/* 添加样式 */
</style>
