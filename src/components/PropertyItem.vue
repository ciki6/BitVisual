<template>
  <div>{{ props.propertyDic.displayName }}</div>
  <component :is="getInputComponent(props.propertyDic.type)" v-model="value" :propertyDic="props.propertyDic" :propertyValue="props.propertyValue" :disabled="!props.propertyDic.editable" v-if="shouldShowField(props.propertyDic)" @update:modelValue="valueUpdate" />
  {{ props.propertyDic }}
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

  const valueUpdate = (newVal: any) => {
    value.value = newVal;
    emit("update:propertyValue", newVal, props.propertyName);
  };
</script>
