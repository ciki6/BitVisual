<template>
  <div>{{ props.propertyDic.displayName }}</div>
  <component :is="getInputComponent(props.propertyDic.type)" v-model="props.propertyDic.value" :placeholder="props.propertyDic.placeholder" :step="props.propertyDic.type === 'double' ? 0.01 : 1" :disabled="!props.propertyDic.editable" v-if="shouldShowField(props.propertyDic)" />
</template>
<script setup lang="ts">
  import InputCheckbox from "./InputCheckbox.vue";
  import InputNumber from "./InputNumber.vue";
  import InputArray from "./InputArray.vue";
  import InputRange from "./InputRange.vue";
  import { watch } from "vue";
  // import { PropertyDictionaryItem } from "lib/types/property";

  interface propInterface {
    propertyDic: any;
    propertyValue: any;
  }

  const props = withDefaults(defineProps<propInterface>(), {
    propertyDic: {},
    propertyValue: null,
  });

  const emit = defineEmits(["update:propertyValue"]);

  defineOptions({
    components: {
      InputCheckbox,
      InputNumber,
      InputArray,
      InputRange,
    },
  });

  const getInputComponent = (type: string | undefined) => {
    switch (type) {
      case "string":
        return "input";
      case "boolean":
        return "input-checkbox";
      case "int":
        return "input-number";
      case "double":
        return "input-number";
      case "doubleArray":
        return "input-array";
      case "range":
        return "input-range";
      default:
        return "input";
    }
  };

  const shouldShowField = (field: any) => {
    return field.show;
  };

  watch(
    () => props.propertyValue.value,
    (newValue) => {
      console.log(newValue);
      emit("update:propertyValue", newValue);
    }
  );
</script>
