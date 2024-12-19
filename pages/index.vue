<template>
  <div>
    <p>location:{{ location }}</p>
    <GamePicker
      :url-linkage="false"
      debug
      :data="gameData"
      :default-game="defaultGame"
    />

    <nuxt-link
      :to="{
        path: '/gold',
        query: route.query,
      }"
      >金币</nuxt-link
    >
  </div>
</template>

<script setup lang="ts">
const location = ref<KV<number>[]>([
  { key: "game", value: 332 },
  { key: "region", value: 1221 },
  { key: "server", value: 121 },
]);
// const location = ref<KV<number>[]>([]);
const defaultGame = ref(331);
const route = useRoute();
const gameData = ref<GamePicker.TreeNodeVO[]>([]);
const { data } = await useFetch("/api/game");
if (data.value) {
  const { data: server } = await useFetch<GamePicker.TreeNodeVO[]>(
    "/api/server/" + data.value[0].id
  );
  if (server.value) {
    gameData.value = [...data.value, ...server.value];
  }
}

watch(
  () => location.value,
  (val) => {
    console.log("[index page] watch location", val);
  }
);
</script>
