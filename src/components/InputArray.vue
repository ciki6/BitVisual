<template>
  <div>
    <input v-for="(item, index) in propertyDic.placeholder" :key="index" type="number" v-model.number="values[index]" :placeholder="item" @change="updateValue" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";
  import { PropertyDictionaryItem } from "lib/types/property";

  interface propInterface {
    propertyDic: PropertyDictionaryItem;
    propertyValue: number[];
  }

  const props = defineProps<propInterface>();
  const emit = defineEmits(["update:modelValue"]);

  const values = ref([...props.propertyValue]);

  watch(
    () => props.propertyValue,
    (newValue) => {
      values.value = [...newValue];
    }
  );

  const updateValue = () => {
    emit("update:modelValue", values.value);
  };
</script>
