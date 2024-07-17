<template>
  <div>
    <input v-for="(item, index) in placeholder" :key="index" type="number" v-model.number="values[index]" :placeholder="item" @change="updateValue" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";

  const props = defineProps<{ modelValue: number[]; placeholder: string[] }>();
  const emit = defineEmits(["update:modelValue"]);

  const values = ref([...props.modelValue]);

  watch(
    () => props.modelValue,
    (newValue) => {
      values.value = [...newValue];
    }
  );

  const updateValue = () => {
    emit("update:modelValue", values.value);
  };
</script>
