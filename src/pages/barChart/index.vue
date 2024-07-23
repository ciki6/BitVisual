<template>
  <div>
    BarChart组件测试
    <div class="comp_container"></div>
    <PropertyList :property="property" :property-dic="propertyDic" @update:updateProperty="updateProperty" />
  </div>
</template>

<script setup lang="ts">
  // 组件逻辑
  import { onMounted, ref } from "vue";
  import PropertyList from "@/components/PropertyList.vue";
  import BarChart from "../../../lib/barChart/barChart";

  let comp = ref();
  const propertyDic = ref([]);
  const property = ref({});

  const updateProperty = (name: string, value: any) => {
    comp.value.setProperty(name, value);
  };

  onMounted(() => {
    comp.value = new BarChart("asd", "asd", document.getElementsByClassName("comp_container")[0], 0, {});
    propertyDic.value = comp.value.propertyManager.getPropertyDictionary();
    property.value = comp.value.propertyManager.getPropertyList();
  });
</script>

<style scoped>
  /* 添加样式 */
</style>
