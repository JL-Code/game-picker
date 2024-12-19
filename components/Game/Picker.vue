<template>
  <!-- 游戏选择器组件S -->
  <div v-loading="isGameLoading" class="relative">
    <div v-if="debug">
      <el-card>
        <p>[state] isGameLoading: {{ isGameLoading }}</p>
        <p>[state] gameId: {{ gameId }}</p>
        <p>[state] currentType: {{ currentType }}</p>
        <p>[state] selected: {{ selected }}</p>
        <p>[model] model: {{ model }}</p>
        <p>[computed] types: {{ types }}</p>
        <!-- <p>
          [computed] currentGame: {{ currentGame?.label }} -
          {{ currentGame?.value }}
        </p> -->
        <!-- <p>[computed] selected path: {{ selectedPath }}</p> -->
        <p>[computed] isCompleted: {{ isCompleted }}</p>
        <!-- <p>[computed] currentData:{{ currentData }}</p> -->
      </el-card>
    </div>
    <!-- 输入框区 -->
    <div class="flex gap-x-2">
      <div v-for="item in currentData" :key="item.type">
        <el-input
          :model-value="item.label"
          :placeholder="`请选择${item.typeName}`"
          :suffix-icon="ArrowDown"
          @click="handleInputClick(item.type)"
        />
      </div>
    </div>
    <!-- 内容面板分组 -->
    <div class="game-panel-group drop-shadow mt-1 absolute z-9999">
      <!-- 面板组件 -->
      <GamePanel
        v-for="item in currentData"
        v-show="currentType === item.type"
        :key="item.type"
        :data="item.options"
        :type="item.type"
        @item-click="handleItemClick"
        @close="handlePanelClose"
      />
    </div>
  </div>
  <!-- 游戏选择器组件E -->
</template>
<script setup lang="ts">
import _ from "lodash";
import { ArrowDown } from "@element-plus/icons-vue";
import type { PropType } from "vue";
interface Props {
    /**
     * 调试模式
     */
    debug?: boolean;
    /**
     * url 参数联动
     */
    urlLinkage?:boolean;
    /**
     * 默认游戏
     */
    defaultGame?: number;
    /**
     *
     */
    data?: GamePicker.TreeNodeVO[];
  }
const props = withDefaults(defineProps<Props>(),{
  debug:false,
  urlLinkage:true
});
const emit = defineEmits<{
  change: [val: KV<number>[]];
  itemClick: [type: string, item: any];
}>();

/** =================组件状态=================== */

const model = defineModel<KV<number>[]>();
const gameId = defineModel<number>("gameId");

const isGameLoading = ref(false);
const types = ref<string[]>([])
const games = ref<GamePicker.TreeNodeVO[]>([]);
const nodes = ref<GamePicker.TreeNodeVO[]>([]);
const servers = ref<GamePicker.TreeNodeVO[]>([]);
/**
 * 当前选中项
 */
const selected = ref<GamePicker.SimpleOptionVM[]>([]);
/**
 * 当前选中的类型
 */
const currentType = ref<string>("");

const {data:gameData,refresh} = await useFetch('/api/game');
games.value = gameData.value || [];
nodes.value = [...(gameData.value||[])]

/** =================组件计算属性=================== */

/**
 * 组件选择完成
 *     // isCompleted 需要判断同一个路径上的数据是否加载完毕
 */
const isCompleted = computed(() => {
  return types.value.length > 1 && types.value.length === selected.value.length;
});

/**
 * [核心]
 * 计算组件展示数据
 */
const currentData = computed((): GamePicker.OptionVM[] => {
  const options: GamePicker.SimpleOptionVM[] = games.value.map((m) => ({
    label: m.name,
    value: m.id,
    initial: m.initial,
    type: "game",
    hot: m.hot,
  }));
  const arr: GamePicker.OptionVM[] = [
    {
      label: selected.value.find((m) => m.type === "game")?.label,
      value: selected.value.find((m) => m.type === "game")?.value,
      type: "game",
      typeName: "游戏",
      hot: false,
      initial: "",
      options,
    },
  ];
  for (const type of types.value) {
    if(type === 'game')
      {
        continue
      }
      const selectedItemOfType = selected.value.find((m) => m.type === type);
      // FIXME: value 的值是所有 type 的值，应该根据上级过滤
      let value = nodes.value.filter(m=>m.type === type)||[]
      arr.push({
      label: selectedItemOfType?.label,
      value: selectedItemOfType?.value,
      type,
      typeName: '',
      hot: false,
      initial: "",
      options: _.sortBy(
        value.map((m) => ({
          label: m.name,
          value: m.id,
          initial: m.initial,
          type: m.type,
          hot: m.hot,
          sort: m.sort,
        })),
        "sort"
      ),
    });
  }
  return arr;
});

/**
 * 所有的数据项类型
 */
// const types = computed(() => {
//   return currentData.value.map((m) => m.type);
// });

/**
 * 当前游戏
 */
const currentGame = computed((): GamePicker.SimpleOptionVM | undefined => {
  return selected.value.find((m) => m.type === "game");
});

/** =================组件监听器=================== */

watch(
  () => props.defaultGame,
  async (val) => {
    if (val) {
      await setDefaultGame(val);
    }
  },
  { immediate: true }
);

watch(
  () => props.data,
  async (val) => {
    if (val) {
      nodes.value = [...val]
    }
  }
);

watch(()=>gameId.value,async (val:number|undefined)=>{
    if(val){
      await loadServer(val);
    }
    else{
      clean('server')
    }
})

/** =================暴露的方法=================== */

defineExpose({
  setDefaultGame,
  setDefaultValue,
});

/** =================组件方法=================== */

/**
 * 选择器表单控件点击事件
 * @param type 数据项类型
 */
const handleInputClick = (type: string) => {
  console.log("[game-picker] 选中", type);
  setCurrentType(type);
};

/**
 * 数据项点击事件
 * @param type 数据项类型
 * @param item 数据项
 */
const handleItemClick = async (type: string, item: GamePicker.SimpleOptionVM) => {
  if(props.urlLinkage){
    // 动态设置 url 参数
    Urls.addParam(type, String(item.value))
  }
  console.log("[game-picker] handleItemClick", type, item);
  if (type === "game") {
    gameId.value = item.value;
    // 重新加载服务器数据
    await loadServer(item.value!);
  }
  // 移动光标
  moveToNextType();
  selectedItem(type, item as any);
  emit("itemClick", type, item);
};

const handlePanelClose = () => {
  closePanel();
};

function setDefaultValueWithQuery(){

  const params= Urls.readParams(window.location.href)
  var obj= Object.fromEntries(params.entries());
  console.log("obj",obj)

  const kv:KV<number>[] = Array.from(params.entries()).map(([key, value]) => ({ key, value })) as any;

  console.log("kv",kv)

  setDefaultValue(kv)
}

/**
 * [核心方法]
 * 设置默认值
 *
 * @param params 默认值
 * eg: [{key:'game',value:10},{key:'region',value:112},{key:'server',value:10}]
 */
async function setDefaultValue(params?: KV<number>[]) {
  console.log("[game picker] setDefaultValue params",params)
  if (!params) {
    return;
  }
  let _gameId = params.find((m) => m.key === "game")?.value;
  for (const param of params) {
    const node: GamePicker.TreeNodeVO | undefined = nodes.value.find(
      (m) => m.type == param.key && m.id == param.value
    );
    // 设置默认值时后续数据可能还未加载或已加载数据发生了改变匹配不上，这时需要主动或重新加载数据。
    if (!node) {
      // 重新加载数据
      switch (param.key) {
        case "game":
          _gameId = param.value;
          console.debug(
            `[game] 节点类型[${param.key}]的数据不存在，开始重新加载数据`
          );
          await refresh();
          break;
        default:
          console.debug(
            `[game] 节点类型[${param.key}]的数据不存在，开始重新加载数据`
          );
          if(!_gameId){
            console.warn("[game picker] 游戏id无效，跳过设置默认值")
            break;
          }
          await loadServer(_gameId);
          console.log("[game] 服务器加载完毕",_gameId, Date.now())
          break;
      }
    }
    const _node: GamePicker.TreeNodeVO | undefined = nodes.value.find(
      (m) => m.type == param.key && m.id == param.value
    );
    if (_node) {
      console.log(`[game pikcer] 设置默认值 type: ${param.key}`, param.value);
      selectedItem(param.key, {
        typeName: "",
        options: [],
        label: _node.name,
        value: param.value,
        type: param.key,
        hot: _node.hot,
        initial: _node.initial,
      });
    }
  }
}

onMounted(()=>{
  // console.log("onMounted",model.value)
  // setDefaultValue(model.value)
  setDefaultValueWithQuery()
})

/**
 * [核心方法]
 * 设置默认游戏
 * @param gameId 游戏id
 */
async function setDefaultGame(gameId: number) {
  if(!gameId){
    return
  }
  const params: KV<number>[] = [];
  const gameNode = games.value.find((m) => m.id == gameId);
  if (!gameNode) {
    await refresh();
  }
  params.push({ key: "game", value: gameId });
  // 加载服务器信息
  await loadServer(gameId);
  for (const type of types.value) {
    const node = servers.value.filter((m) => m.type === type)[0];
    if (node) {
      params.push({ key: type, value: node.id });
    }
  }
  console.log("[game] setDefaultGame", params);
  await setDefaultValue(params);
}

/**
 * 清理数据
 * @param type 'game' | 'server'
 */
function clean(type: "game" | "server") {
  if (type == "game") {
    console.debug("[game] clean game");
    games.value.length = 0;
  }
  if (type == "server") {
    console.debug("[game] clean server");
    servers.value.length = 0;
  }
}

/**
 * 设置当前选项类型
 * @param type 选项类型
 */
function setCurrentType(type: string) {
  console.debug("[game] type change", type);
  currentType.value = type;
}

function closePanel() {
  setCurrentType("");
}

/**
 * 将当前指针移动到下一个类型
 */
function moveToNextType() {
  const index = types.value.findIndex((m) => m == currentType.value);
  console.debug(
    "[game] moveToNextType",
    currentType.value,
    index,
    types.value.length
  );
  if (index + 1 >= types.value.length) {
    console.debug("[game] 已经是最后一个类型了");
    setCurrentType("");
  } else {
    const nextType = types.value[index + 1];
    console.debug("[game] nextType", nextType);
    setCurrentType(nextType);
  }
}

/**
 * [核心方法]
 * 选中项,查找替换
 * 找到 type 在 types 的位置将其右边的值全部重置
 * @param type 数据项类型
 * @param item 选中项
 */
function selectedItem(type: string, item: GamePicker.OptionVM) {
  console.debug("[game] selected item", type, item);
  const index = selected.value.findIndex((m) => m.type === type);
  if (index >= 0) {
    const delStart = index + 1;
    console.warn("[game] 删除右边的值", delStart, type);
    selected.value.splice(delStart);
  }
  const result = selected.value.find((m) => m.type === type);
  // 查找替换或添加
  if (result) {
    Object.assign(result, item);
  } else {
    selected.value.push({
      value: item.value,
      label: item.label,
      type: type,
      initial: item.initial,
      hot: item.hot,
    });
  }

  if(type==='game'){
    gameId.value = item.value;
  }
  //
  model.value = selected.value.map(m=>({key:m.type,value:m.value!}))
}

/** =================辅助函数=================== */

/**
 * 加载服务器数据（树）
 * @param gameId 游戏id
 * @param loadSuccess 数据加载完毕的回调函数
 */
async function loadServer(
  gameId: number,
  loadSuccess?: GamePicker.LoadSuccessFn
) {
   const data = await $fetch<GamePicker.TreeNodeVO[]>('/api/server/'+gameId);
   if(data){
    const list = Trees.flatten(data) as GamePicker.TreeNodeVO[];
    types.value = ['game',...extractUniqueTypes(list as any)]
    nodes.value = [...games.value, ...list];
    servers.value = [...list];
   }
}

function extractUniqueTypes(data:GamePicker.TreeNodeVO[]):string[]{
return [...new Set(data.map(item => item.type))];
}
</script>
