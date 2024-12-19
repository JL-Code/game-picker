export default defineEventHandler((event) => {
  const data: GamePicker.TreeNodeVO[] = [
    {
      id: 331,
      parentId: 0,
      name: "魔兽世界美服",
      type: "game",
      typeName: "游戏",
      hot: false,
      initial: "M",
      sort: 1
    },
    {
      id: 332,
      parentId: 0,
      name: "王权与自由",
      type: "game",
      typeName: "游戏",
      hot: true,
      initial: "W",
      sort: 2
    },
  ];
  return [...data];
});
