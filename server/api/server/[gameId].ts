import GamePicker from "~/types/components/GamePicker";

export default defineEventHandler((event) => {
  const gameId = getRouterParam(event, "gameId");
  console.log("[api] server gameId", gameId, Number.isInteger(gameId));
  if (!gameId) {
    throw createError({
      statusCode: 400,
      statusMessage: "gameId should be an integer",
    });
  }

  console.log("[api] server mock");
  const m = [
    {
      id: 332,
      parentId: 331,
      name: "服务器1",
      type: "server",
      typeName: "服务器",
      hot: true,
      initial: "A",
      sort: 1,
    },
    {
      id: 333,
      parentId: 332,
      name: "服务器2",
      type: "server",
      typeName: "游戏",
      hot: false,
      initial: "B",
      sort: 2,
    },
    {
      id: 334,
      parentId: 331,
      name: "服务器3",
      type: "server",
      typeName: "服务器",
      hot: true,
      initial: "C",
      sort: 3,
    },
  ];
  const w = [
    {
      id: 12,
      parentId: 332,
      name: "美东",
      type: "region",
      typeName: "大区",
      hot: true,
      initial: "A",
      sort: 1,
      children: [
        {
          id: 121,
          parentId: 12,
          name: "服务器2",
          type: "server",
          typeName: "服务器",
          hot: false,
          initial: "B",
          sort: 2,
        },
        {
          id: 122,
          parentId: 12,
          name: "服务器3",
          type: "server",
          typeName: "服务器",
          hot: true,
          initial: "C",
          sort: 3,
        },
      ],
    },
    {
      id: 1221,
      parentId: 332,
      name: "美西",
      type: "region",
      typeName: "大区",
      hot: false,
      initial: "B",
      sort: 2,
      children: [
        {
          id: 212,
          parentId: 1221,
          name: "1区达芬奇",
          type: "server",
          typeName: "服务器",
          hot: false,
          initial: "B",
          sort: 2,
        },
        {
          id: 212,
          parentId: 1221,
          name: "2区论道",
          type: "server",
          typeName: "服务器",
          hot: true,
          initial: "C",
          sort: 3,
        },
      ],
    },
  ];

  if (Number(gameId) === 331) {
    return m;
  } else if (Number(gameId) === 332) {
    return w;
  } else {
    return [];
  }
});
