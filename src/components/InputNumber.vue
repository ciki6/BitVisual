<template>
  <input type="number" v-model.number="value" :step="props.propertyDic.type === 'double' ? 0.01 : 1" @change="updateValue" />
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";
  import { defineProps, defineEmits } from "vue";
  import { PropertyDictionaryItem } from "lib/types/property";

  const props = defineProps<{ modelValue: number; propertyDic: PropertyDictionaryItem }>();
  const emit = defineEmits(["update:modelValue"]);

  const value = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (newValue) => {
      value.value = newValue;
    }
  );

  const updateValue = () => {
    emit("update:modelValue", value.value);
  };
</script>
