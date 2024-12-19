<template>
  <div>
    <p>location:{{ location }}</p>
    <GamePicker debug :default-game="defaultGame" v-model="location" />
  </div>
</template>

<script setup lang="ts">
const location = ref<KV<number>[]>([
  { key: "game", value: 332 },
  { key: "region", value: 1221 },
  { key: "server", value: 121 },
]);
// const location = ref<KV<number>[]>([]);
const defaultGame = ref(0);

watch(
  () => location.value,
  (val) => {
    console.log("[index page] watch location", val);
  }
);
</script>
