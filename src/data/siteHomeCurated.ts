import { topicContents } from "@/data/siteContentV2";

export const curatedTopicCopy = {
  residential: {
    title: "民居建筑专题",
    shortTitle: "民居",
    description: "从居住生活、家族组织和地域环境理解中国民居的空间智慧。",
    cta: "进入民居专题",
  },
  government: {
    title: "官署建筑专题",
    shortTitle: "官署",
    description: "观察礼制秩序、行政运行与建筑布局之间的对应关系。",
    cta: "进入官署专题",
  },
  palace: {
    title: "宫殿建筑专题",
    shortTitle: "宫殿",
    description: "从轴线、等级和皇家仪式出发理解宫殿建筑的成熟过程。",
    cta: "进入宫殿专题",
  },
  bridge: {
    title: "桥梁建筑专题",
    shortTitle: "桥梁",
    description: "从结构技术、交通组织与景观象征阅读中国古桥的演进。",
    cta: "进入桥梁专题",
  },
} as const;

export const homepagePresetSections = [
  {
    id: "overview",
    title: "总览驾驶舱",
    description: "用地图、图表和专题入口把课程主线浓缩到一个首页主屏里。",
  },
  {
    id: "classics",
    title: "经典建筑走廊",
    description: "把宫殿、官署、民居与桥梁的代表性案例做成交互式建筑卡片。",
  },
  {
    id: "official",
    title: "官方数据监测",
    description: "汇总文旅部、国家文物局和地方开放平台等官方来源的接入状态与更新方式。",
  },
  {
    id: "ai",
    title: "AI 导览助手",
    description: "围绕当前页面上下文生成讲解词、对比分析、课堂答疑和展板摘要。",
  },
];

export const classicalBuildings = [
  {
    id: "forbidden-city",
    name: "紫禁城",
    dynasty: "明清",
    topic: "palace",
    summary: "中轴秩序、院落层级和皇家礼制在这里形成最完整的宫殿建筑范式。",
    image: topicContents.find(item => item.key === "palace")?.examples[2]?.image,
  },
  {
    id: "weiyang",
    name: "未央宫",
    dynasty: "秦汉",
    topic: "palace",
    summary: "大型宫城与高台建筑的出现，奠定了后世宫殿体系的尺度基础。",
    image: topicContents.find(item => item.key === "palace")?.examples[0]?.image,
  },
  {
    id: "daming",
    name: "大明宫",
    dynasty: "隋唐",
    topic: "palace",
    summary: "唐代都城宫殿群的宏大气势与礼制组织能力，在这里得到集中体现。",
    image: topicContents.find(item => item.key === "palace")?.examples[1]?.image,
  },
  {
    id: "huizhou",
    name: "徽州民居",
    dynasty: "明清",
    topic: "residential",
    summary: "粉墙黛瓦、马头墙与天井空间共同塑造了典型江南民居的气质。",
    image: topicContents.find(item => item.key === "residential")?.examples[0]?.image,
  },
  {
    id: "suzhou",
    name: "苏州民居",
    dynasty: "宋元至明清",
    topic: "residential",
    summary: "临水街巷与小尺度庭院相互嵌合，形成了水乡聚落的生活图景。",
    image: topicContents.find(item => item.key === "residential")?.examples[1]?.image,
  },
  {
    id: "tulou",
    name: "福建土楼",
    dynasty: "明清",
    topic: "residential",
    summary: "聚居、防御与气候适应被整合进同一座大型共同体建筑之中。",
    image: topicContents.find(item => item.key === "residential")?.examples[2]?.image,
  },
  {
    id: "yamen",
    name: "州府官署",
    dynasty: "明清",
    topic: "government",
    summary: "前堂后宅、公私分区和礼仪轴线共同构成官署空间的基本秩序。",
    image: topicContents.find(item => item.key === "government")?.examples[0]?.image,
  },
  {
    id: "zhaozhou",
    name: "赵州桥",
    dynasty: "隋唐",
    topic: "bridge",
    summary: "敞肩石拱桥展示了结构创新与造型美感如何在工程中统一。",
    image: topicContents.find(item => item.key === "bridge")?.examples[0]?.image,
  },
  {
    id: "lugou",
    name: "卢沟桥",
    dynasty: "金元至明清",
    topic: "bridge",
    summary: "交通功能与文化记忆叠加，让桥梁成为城市景观与历史叙事的节点。",
    image: topicContents.find(item => item.key === "bridge")?.examples[1]?.image,
  },
];

export const curatedMetrics = [
  { label: "专题页", value: "4" },
  { label: "公共分析页", value: "3" },
  { label: "经典建筑样本", value: "9+" },
  { label: "待接官方源", value: "6" },
];
