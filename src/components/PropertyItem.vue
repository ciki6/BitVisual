<template>
  <div>{{ props.propertyDic.displayName }}</div>
  <component :is="getInputComponent(props.propertyDic.type)" v-model="value" :propertyDic="props.propertyDic" :propertyValue="props.propertyValue" :disabled="!props.propertyDic.editable" v-if="shouldShowField(props.propertyDic)" @update:modelValue="valueUpdate" />
</template>
<script setup lang="ts">
  import InputCheckbox from "./InputCheckbox.vue";
  import InputNumber from "./InputNumber.vue";
  import InputArray from "./InputArray.vue";
  import InputRange from "./InputRange.vue";
  import { ref } from "vue";
  // import { PropertyDictionaryItem } from "lib/types/property";

  interface propInterface {
    propertyDic: any;
    propertyValue: any;
    propertyName: string;
  }

  const props = defineProps<propInterface>();

  const emit = defineEmits(["update:propertyValue"]);

  const value = ref(props.propertyValue);

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
      case "String":
        return "input";
      case "Boolean":
        return "input-checkbox";
      case "Int":
        return "input-number";
      case "Double":
        return "input-number";
      case "DoubleArray":
        return "input-array";
      case "Range":
        return "input-range";
      default:
        return "input";
    }
  };

  const shouldShowField = (field: any) => {
    return field.show;
  };

  const valueUpdate = (newVal: any) => {
    value.value = newVal;
    emit("update:propertyValue", newVal, props.propertyName);
  };
</script>
