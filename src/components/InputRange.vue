<template>
  <input type="range" v-model.number="value" @change="updateValue" />
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";
  import { defineProps, defineEmits } from "vue";

  const props = defineProps<{ modelValue: number }>();
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
