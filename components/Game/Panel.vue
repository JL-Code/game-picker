<template>
  <!-- 内容面板 -->
  <el-card shadow="never" class="min-w-4xl">
    <template #header>
      <!-- 关键字搜索 -->
      <div class="flex justify-between items-center pt-3 gap-x-2">
        <div class="flex">
          <div>
            <el-input
              v-model="keyword"
              :suffix-icon="Search"
              placeholder="请输入关键字"
            />
          </div>
          <div>
            <el-link
              type="primary"
              text
              to="tencent://message/?uin=3007797691&Site=比价器BiJiaQi.com&Menu=yes"
              >没有您要的游戏？
            </el-link>
          </div>
        </div>
        <div>
          <el-button size="small" type="danger" @click="$emit('close')"
            >关闭
          </el-button>
        </div>
      </div>
      <!-- 字母快速导航条 -->
      <div class="flex mt-2">
        <GameLetterIndex :letters="mixedLetters" v-model="letter" />
      </div>
    </template>
    <!-- 内容区 -->
    <el-scrollbar max-height="400">
      <div v-if="filteredData.length" class="flex flex-wrap gap-2 w-full">
        <div
          v-for="item in filteredData"
          :key="item.value"
          :title="item.label"
          class="w-40 text-xs cursor-pointer line-clamp-1 hover:underline hover:text-blue line-height-relaxed"
          @click="handleClick(item)"
        >
          {{ item.label }}
        </div>
      </div>
      <el-empty v-else class="mx-auto" :image-size="100" />
    </el-scrollbar>
  </el-card>
</template>
<script lang="ts" setup>
import {Search} from "@element-plus/icons-vue";

interface Props {
  data: GamePicker.SimpleOptionVM[];
  type: string;
  props?: { label: string; value: string };
}

const rootProps = withDefaults(defineProps<Props>(), {
  data: () => [],
  props: () => {
    return {label: "label", value: "value"};
  },
});
const emit = defineEmits<{
  close: [];
  itemClick: [type: string, item: GamePicker.SimpleOptionVM];
}>();
const ALL = "全部"
const HOT = "热门"
const letter = ref<string>(ALL);
const keyword = ref<string>("");

const letters = computed(():string[]=>{
  const initials=rootProps.data.filter(m=>m.initial).map((m) => m.initial!);
  return [...new Set(initials.sort())]
})

/**
 * 混合字母
 */
const mixedLetters = computed(() => {
  return [HOT, ALL,...letters.value]
})

/**
 * 过滤后的数据
 */
const filteredData = computed(() => {
  if (letter.value === ALL) {
    return rootProps.data;
  } else if (letter.value === HOT) {
    return rootProps.data.filter((item: GamePicker.SimpleOptionVM) => item.hot)
  }
  return rootProps.data.filter((item: GamePicker.SimpleOptionVM) => item.initial === letter.value);
})

const handleClick = (item: GamePicker.SimpleOptionVM) => {
  emit("itemClick", rootProps.type, item);
};
</script>
