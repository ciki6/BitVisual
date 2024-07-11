<template>
  <input type="checkbox" v-model="checked" @change="updateValue" />
</template>

<script lang="ts" setup>
  import { ref, watch } from "vue";

  interface propInterface {
    modelValue: boolean;
  }

  const props = withDefaults(defineProps<propInterface>(), {
    modelValue: false,
  });

  const emit = defineEmits(["update:modelValue"]);

  const checked = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (newValue) => {
      checked.value = newValue;
    }
  );

  const updateValue = () => {
    emit("update:modelValue", checked.value);
  };
</script>
