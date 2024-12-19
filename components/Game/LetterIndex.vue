<template>
  <!--  <el-radio-group v-model="model" size="small">-->
  <!--    <el-radio-button-->
  <!--      v-for="item in letters"-->
  <!--      :key="item"-->
  <!--      :label="item"-->
  <!--      :value="item"/>-->
  <!--  </el-radio-group>-->
  <el-segmented v-model="model" :options="options" size="small"/>
</template>

<script setup lang="ts">
const props = defineProps<{
  letters: string[];
}>()
const model = defineModel<string>();
const options = computed(() => {
  return props.letters.map(m => {
    return {
      label: m,
      value: m
    }
  })
})
</script>
