<template>
  <div>
    BarChart组件测试
    <div class="comp_container"></div>
    <PropertyList :property="comp?.property" :property-dic="propertyDic" />
  </div>
</template>

<script setup lang="ts">
  // 组件逻辑
  import { onMounted, ref } from "vue";
  import PropertyList from "@/components/PropertyList.vue";
  import BarChart from "../../../lib/barChart/barChart";

  let comp = ref();
  let propertyDic = ref([]);

  onMounted(() => {
    comp.value = new BarChart("asd", "asd", document.getElementsByClassName("comp_container")[0], 0, {});
    console.log(comp);
    propertyDic = comp.value.propertyManager.getPropertyDictionary();
  });
</script>

<style scoped>
  /* 添加样式 */
</style>
