<template>
  <div v-for="group in props.propertyDic">
    {{ group.displayName }}
    <propertyItem v-for="item in group.children" :propertyDic="item" :propertyValue="propertyValue(group.name, item.name)" :propertyName="`${group.name}.${item.name}`" @update:property-value="handlePropertyValueUpdate" />
  </div>
</template>
<script setup lang="ts">
  // import { ref } from "vue";
  import propertyItem from "./PropertyItem.vue";

  interface propInterface {
    propertyDic: any;
    property: any;
  }

  const emit = defineEmits(["update:updateProperty"]);

  const props = withDefaults(defineProps<propInterface>(), {
    propertyDic: [],
    property: {},
  });

  const propertyValue = (group: string, name: string): any => props.property[group][name];

  const handlePropertyValueUpdate = (value: any, name: string) => {
    emit("update:updateProperty", name, value);
  };
</script>
