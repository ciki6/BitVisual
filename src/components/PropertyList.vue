<template>
  <div>{{ props.propertyDic }}</div>
  <div v-for="group in props.propertyDic">
    {{ group.displayName }}
    <propertyItem v-for="item in group.children" :propertyDic="item" :propertyValue="propertyValue" @update:property-value="handlePropertyValueUpdate" />
  </div>
</template>
<script setup lang="ts">
  // import { ref } from "vue";
  import propertyItem from "./PropertyItem.vue";

  interface propInterface {
    propertyDic: any;
    property: any;
  }

  const props = withDefaults(defineProps<propInterface>(), {
    propertyDic: [],
    property: {},
  });

  const propertyValue = (group: string, name: string): any => props.property[group][name];

  const handlePropertyValueUpdate = (newValue: any) => {
    console.log("update", newValue);
  };
</script>
