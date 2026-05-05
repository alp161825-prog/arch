import heroBanner from "@/assets/hero-banner.jpg";
import imgForbiddenCity from "@/assets/buildings/forbidden-city.jpg";
import imgWeiyang from "@/assets/buildings/weiyang.jpg";
import imgDaming from "@/assets/buildings/daming.jpg";
import imgZhaozhou from "@/assets/buildings/zhaozhou-bridge.jpg";
import imgLugou from "@/assets/buildings/lugou.jpg";
import imgSeventeenArch from "@/assets/buildings/seventeen-arch.jpg";
import imgHuizhou from "@/assets/buildings/huizhou.jpg";
import imgSuzhouGarden from "@/assets/buildings/suzhou-garden.jpg";
import imgYuandadu from "@/assets/buildings/yuandadu.jpg";
import imgTempleHeaven from "@/assets/buildings/temple-heaven.jpg";
import imgSummerPalace from "@/assets/buildings/summer-palace.jpg";
import { resolveUserBuildingImage } from "@/data/userBuildingImageMap";
import { dynastyData } from "@/data/dynastyData";

export type TopicKey = "residential" | "government" | "palace" | "bridge";
const realImage = (name: string, fallback?: string) => resolveUserBuildingImage(name, fallback);

export type TopicContent = {
  key: TopicKey;
  route: string;
  title: string;
  shortTitle: string;
  tagline: string;
  definition: string;
  heroImage?: string;
  accent: string;
  accentSoft: string;
  keywords: string[];
  metrics: Array<{ label: string; value: string }>;
  examples: Array<{
    name: string;
    region: string;
    location: string;
    summary: string;
    image?: string;
    dynasty: string;
  }>;
  sections: Array<{
    title: string;
    description: string;
    bullets: string[];
  }>;
  narrativeSteps: Array<{
    year: string;
    title: string;
    summary: string;
  }>;
  chartData: Array<{ stage: string; value: number }>;
  comparisonScores: Array<{ label: string; current: number; reference: number }>;
};

export const siteHero = {
  title: "中国古代建筑知识总览",
  subtitle: "首页做成地图与图表联动的大屏驾驶舱，专题页则改成深色沉浸式高保真叙事页面。",
  image: heroBanner,
};

export const topicContents: TopicContent[] = [
  {
    key: "residential",
    route: "/topics/residential",
    title: "民居建筑专题",
    shortTitle: "民居建筑",
    tagline: "从居住需求切入，观察地域适应、家族结构和地方审美如何塑造民居。",
    definition: "民居建筑最贴近日常生活，是“因地制宜”最直接、最鲜明的空间表达。",
    heroImage: realImage("徽州明代住宅", imgHuizhou),
    accent: "#8f5b33",
    accentSoft: "rgba(143,91,51,0.18)",
    keywords: ["居住需求", "地域适应", "院落组织", "生活礼俗"],
    metrics: [
      { label: "代表区域", value: "北方 / 江南 / 岭南 / 西南 / 西北" },
      { label: "核心类型", value: "四合院 / 徽派 / 围屋 / 水乡民居" },
      { label: "观察焦点", value: "气候、材料与家族结构" },
    ],
    examples: [
      { name: "徽州民居", region: "安徽黄山", location: "安徽", summary: "粉墙黛瓦、马头墙与天井空间构成高辨识度形象。", image: realImage("徽州明代住宅", imgHuizhou), dynasty: "明清" },
      { name: "江南水乡民居", region: "江苏苏州", location: "江苏苏州", summary: "宅院与河道、桥巷、园林体系交织，形成轻盈细密的生活空间。", image: realImage("姬氏民居", imgSuzhouGarden), dynasty: "宋至明清" },
      { name: "福建土楼", region: "福建龙岩", location: "福建龙岩", summary: "大型夯土群居建筑兼具防御性、聚族性和地域识别。", image: realImage("福建土楼", imgHuizhou), dynasty: "明清" },
    ],
    sections: [
      { title: "民居定义与功能", description: "民居首先解决“住”的问题，随后承载家庭秩序和地方生活方式。", bullets: ["院落组织家庭关系", "开口和朝向回应气候", "住宅向聚落秩序延伸"] },
      { title: "地域分布与类型划分", description: "不同气候、地貌和材料决定了民居在墙体、屋顶和聚落关系上的差异。", bullets: ["北方四合院重围合", "江南民居重灰空间", "围屋与吊脚楼强调适应性"] },
      { title: "构造特征与文化内涵", description: "民居既是建筑物，也是地方社会和日常伦理的可见表达。", bullets: ["因地取材形成传统", "厅堂和厢房组织秩序", "风格直接连接地方记忆"] },
    ],
    narrativeSteps: [
      { year: "起点", title: "居住需求", summary: "先解决遮蔽、保温和生活组织问题。" },
      { year: "演进", title: "地域适应", summary: "不同环境塑造了迥异的民居类型。" },
      { year: "稳定", title: "结构特色", summary: "天井、院落、厚墙和坡屋顶逐步定型。" },
      { year: "沉淀", title: "文化精神", summary: "民居成为家族伦理和地方文化的日常容器。" },
    ],
    chartData: [
      { stage: "居住效率", value: 87 },
      { stage: "气候适应", value: 94 },
      { stage: "家族组织", value: 82 },
      { stage: "地方审美", value: 90 },
    ],
    comparisonScores: [
      { label: "功能弹性", current: 90, reference: 74 },
      { label: "地域适应", current: 96, reference: 70 },
      { label: "装饰密度", current: 78, reference: 68 },
      { label: "礼制等级", current: 52, reference: 88 },
    ],
  },
  {
    key: "government",
    route: "/topics/government",
    title: "官府建筑专题",
    shortTitle: "官府建筑",
    tagline: "从治理功能进入，理解礼制秩序、门堂序列与行政空间如何共同构成权力结构。",
    definition: "官府建筑承担行政、司法与礼仪展示功能，是制度秩序在空间中的实体化表达。",
    heroImage: realImage("南阳府衙", imgYuandadu),
    accent: "#7a4b31",
    accentSoft: "rgba(122,75,49,0.18)",
    keywords: ["治理功能", "礼制秩序", "中轴布局", "权力表达"],
    metrics: [
      { label: "空间核心", value: "仪门 - 大堂 - 二堂 - 内宅" },
      { label: "制度特征", value: "公私分区、前后递进" },
      { label: "页面重心", value: "功能到秩序再到政治文化" },
    ],
    examples: [
      { name: "州府县衙格局", region: "各地衙署", location: "华北与江南多地", summary: "中轴线和前后院序列组织办公、审理和生活空间。", image: realImage("南阳府衙", imgYuandadu), dynasty: "明清" },
      { name: "大堂空间", region: "礼制核心", location: "中轴前段", summary: "承担审理、发布政令和礼仪展示。", image: realImage("霍州署大堂", imgDaming), dynasty: "隋唐至明清" },
      { name: "内宅系统", region: "后部生活区", location: "衙署后部", summary: "体现行政空间中明显的公私分层。", image: realImage("绥远将军衙署", imgWeiyang), dynasty: "明清" },
    ],
    sections: [
      { title: "官府建筑的职能定位", description: "官府建筑既是治理工具，也是制度威严的形象界面。", bullets: ["前部面向政务", "中轴线强化中心", "后部承担居住后勤"] },
      { title: "空间布局与礼制表达", description: "门、堂、院的连续递进，是礼制秩序在空间中的翻译方式。", bullets: ["仪门制造门槛", "大堂承担双重展示", "二堂和内宅提高私密等级"] },
      { title: "历史价值总结", description: "官府建筑是理解古代城市治理和行政文化的重要入口。", bullets: ["是制度史空间证据", "展示权力如何被感知", "保留公共建筑原型"] },
    ],
    narrativeSteps: [
      { year: "入口", title: "治理功能", summary: "空间首先服务行政与司法活动。" },
      { year: "组织", title: "礼制秩序", summary: "礼仪和等级决定门堂院的主次关系。" },
      { year: "展开", title: "空间布局", summary: "中轴和前后分区形成稳定官署范式。" },
      { year: "延伸", title: "政治文化", summary: "建筑最终成为制度认知的一部分。" },
    ],
    chartData: [
      { stage: "行政效率", value: 88 },
      { stage: "礼制表达", value: 93 },
      { stage: "空间递进", value: 90 },
      { stage: "象征强度", value: 86 },
    ],
    comparisonScores: [
      { label: "功能刚性", current: 92, reference: 70 },
      { label: "礼制等级", current: 94, reference: 60 },
      { label: "空间秩序", current: 91, reference: 72 },
      { label: "景观审美", current: 65, reference: 88 },
    ],
  },
  {
    key: "palace",
    route: "/topics/palace",
    title: "皇宫建筑专题",
    shortTitle: "皇宫建筑",
    tagline: "从最高等级建筑切入，观察中轴体系、宫殿群层级、结构工艺和皇权象征如何协同运作。",
    definition: "皇宫建筑是古代建筑体系中等级最高、整合度最强的一类，集中体现制度、工艺与审美。",
    heroImage: realImage("北京故宫", imgForbiddenCity),
    accent: "#aa7a1f",
    accentSoft: "rgba(170,122,31,0.18)",
    keywords: ["最高等级", "中轴线", "宫殿群层级", "皇权象征"],
    metrics: [
      { label: "核心线索", value: "中轴、层级、礼仪场景" },
      { label: "典型案例", value: "未央宫 / 大明宫 / 紫禁城" },
      { label: "技术焦点", value: "台基、屋顶、斗拱、彩画" },
    ],
    examples: [
      { name: "未央宫", region: "陕西西安", location: "陕西西安", summary: "汉代宫殿格局代表，规模巨大。", image: realImage("汉未央宫", imgWeiyang), dynasty: "秦汉" },
      { name: "大明宫", region: "陕西西安", location: "陕西西安", summary: "唐代宫殿高峰，展现盛唐气象。", image: realImage("唐大明宫", imgDaming), dynasty: "隋唐" },
      { name: "紫禁城", region: "北京", location: "北京", summary: "明清宫城集大成者，通过中轴和院落层级强化皇权秩序。", image: realImage("北京故宫", imgForbiddenCity), dynasty: "明清" },
    ],
    sections: [
      { title: "历史定位与总体格局", description: "皇宫建筑服务于最高统治中心，因此最强调轴线、层级和大尺度礼仪空间。", bullets: ["宫城格局优先", "外朝与内廷分工", "台基和广场组织威严感"] },
      { title: "技术与装饰艺术", description: "屋顶、斗拱、彩画和石作台基，把结构逻辑和象征系统紧密绑定在一起。", bullets: ["斗拱兼顾受力与装饰", "屋顶形式体现等级", "色彩强化仪式感"] },
      { title: "皇权象征与文化价值", description: "皇宫建筑是国家意志、工艺峰值和文明叙事的综合展示平台。", bullets: ["体现礼制国家想象", "凝聚最高等级营造技术", "影响后世中轴观念"] },
    ],
    narrativeSteps: [
      { year: "起势", title: "最高等级建筑", summary: "以体量、轴线和围合感建立压倒性秩序。" },
      { year: "展开", title: "秩序布局", summary: "宫门、广场、台基与殿堂层层递进。" },
      { year: "强化", title: "技术成就", summary: "屋顶、斗拱和彩画将工艺推向高峰。" },
      { year: "定型", title: "文明象征", summary: "最终形成国家形象和文明记忆的物质化表达。" },
    ],
    chartData: [
      { stage: "规模控制", value: 95 },
      { stage: "礼仪密度", value: 97 },
      { stage: "结构工艺", value: 92 },
      { stage: "视觉象征", value: 98 },
    ],
    comparisonScores: [
      { label: "礼制等级", current: 98, reference: 64 },
      { label: "结构复杂度", current: 94, reference: 76 },
      { label: "审美密度", current: 93, reference: 81 },
      { label: "日常适应", current: 48, reference: 92 },
    ],
  },
  {
    key: "bridge",
    route: "/topics/bridge",
    title: "古代桥梁专题",
    shortTitle: "古代桥梁",
    tagline: "从交通需求出发，观察桥型分类、结构创新、工程智慧与审美价值如何统一在一座桥上。",
    definition: "桥梁建筑连接区域交通与社会生活，是技术创新最容易被直观看见的一类古代建筑。",
    heroImage: realImage("赵州桥", imgZhaozhou),
    accent: "#557a6b",
    accentSoft: "rgba(85,122,107,0.18)",
    keywords: ["交通需求", "结构创新", "工程智慧", "审美成就"],
    metrics: [
      { label: "典型桥型", value: "梁桥 / 拱桥 / 浮桥 / 园桥" },
      { label: "工程焦点", value: "跨度、受力与耐久性" },
      { label: "重点案例", value: "赵州桥 / 卢沟桥 / 十七孔桥" },
    ],
    examples: [
      { name: "赵州桥", region: "河北赵县", location: "河北赵县", summary: "敞肩石拱桥代表，兼顾减重、排水和长期耐久。", image: realImage("赵州桥", imgZhaozhou), dynasty: "隋唐" },
      { name: "卢沟桥", region: "北京", location: "北京", summary: "联拱石桥代表，桥狮与桥体共同构成文化记忆。", image: realImage("卢沟桥", imgLugou), dynasty: "宋元至明清" },
      { name: "十七孔桥", region: "北京颐和园", location: "北京", summary: "桥梁兼具交通与皇家园林景观价值。", image: realImage("十七孔桥", imgSeventeenArch), dynasty: "明清" },
    ],
    sections: [
      { title: "桥梁发展概述", description: "桥梁的发展始终围绕跨越河流、沟谷和交通节点组织需求展开。", bullets: ["先解决通行", "再优化形态", "最终成为区域节点"] },
      { title: "桥型分类与技术创新", description: "不同桥型对应不同跨度需求和施工条件，也对应不同结构逻辑。", bullets: ["梁桥直接但跨径有限", "拱桥受力更成熟", "园林桥兼顾景观价值"] },
      { title: "社会功能与美学价值", description: "桥梁不仅组织交通，也是地方景观、记忆和审美经验的重要组成部分。", bullets: ["桥也是公共空间", "装饰细部强化识别", "工程理性与景观美感并存"] },
    ],
    narrativeSteps: [
      { year: "需求", title: "交通连接", summary: "首先解决跨越障碍和组织道路系统的问题。" },
      { year: "推进", title: "结构创新", summary: "受力方式和材料技术驱动桥型进化。" },
      { year: "成熟", title: "工程智慧", summary: "桥梁兼顾耐久、维护与水文适应。" },
      { year: "外化", title: "审美成就", summary: "桥梁逐步变成景观和文化记忆的一部分。" },
    ],
    chartData: [
      { stage: "跨度能力", value: 86 },
      { stage: "受力效率", value: 93 },
      { stage: "景观价值", value: 88 },
      { stage: "社会连接", value: 91 },
    ],
    comparisonScores: [
      { label: "工程创新", current: 96, reference: 72 },
      { label: "交通效率", current: 94, reference: 60 },
      { label: "礼制等级", current: 34, reference: 96 },
      { label: "景观融合", current: 89, reference: 74 },
    ],
  },
];

export const publicPages = [
  { title: "时间演进页", route: "/explore/timeline", description: "把四类建筑放到同一时间轴上，观察各阶段的演进。" },
  { title: "地域分布页", route: "/explore/regions", description: "以中国区域为主轴，强调建筑如何因环境而分化。" },
  { title: "对比分析页", route: "/explore/compare", description: "围绕功能、布局、材料、技术和礼制进行横向比较。" },
];

export const siteOverviewMetrics = [
  { label: "专题页", value: "4" },
  { label: "公共功能页", value: "3" },
  { label: "朝代阶段", value: `${dynastyData.length}` },
  { label: "代表建筑", value: `${dynastyData.flatMap(item => item.representativeBuildings).length}+` },
];

export const timelineStages = [
  { title: "先秦萌芽", dynasties: dynastyData.filter(item => item.yearEnd <= -221) },
  { title: "秦汉发展", dynasties: dynastyData.filter(item => item.id === "qin-han") },
  { title: "隋唐成熟", dynasties: dynastyData.filter(item => item.id === "sui-tang") },
  { title: "宋元演变", dynasties: dynastyData.filter(item => item.id === "song" || item.id === "yuan") },
  { title: "明清高峰", dynasties: dynastyData.filter(item => item.id === "ming-qing") },
];

export const regionClusters = [
  { name: "北方地区", summary: "围合院落、轴线秩序和大型纪念性建筑最集中。", examples: ["北京紫禁城", "山西晋祠", "河北赵州桥"] },
  { name: "江南地区", summary: "水网环境塑造临水聚落、园林化民居和细密尺度。", examples: ["苏州园林", "徽州民居", "德寿宫遗址"] },
  { name: "西南地区", summary: "山地地貌驱动吊脚楼、栈道和更强环境适应性。", examples: ["吊脚楼", "山地聚落", "木桥与栈道体系"] },
  { name: "岭南地区", summary: "重通风、防潮和宗族聚居，形成围屋与祠堂谱系。", examples: ["客家围屋", "广府民居", "祠堂水系空间"] },
  { name: "西北地区", summary: "夯土传统和干燥气候推动厚墙体与防御聚落发展。", examples: ["窑洞", "夯土城址", "古道桥涵"] },
];

export const compareDimensions = [
  { dimension: "功能用途", residential: "满足居住与家族生活", government: "承担治理、司法与礼仪", palace: "服务最高统治中心", bridge: "组织区域交通与跨越联系" },
  { dimension: "空间布局", residential: "院落或聚落式组织", government: "中轴递进与前后分区", palace: "多重院落与严格层级", bridge: "线性跨越与节点衔接" },
  { dimension: "材料使用", residential: "因地取材最明显", government: "以木构和院落体系为主", palace: "木构体系最完整", bridge: "石木砖材料按结构选择" },
  { dimension: "技术特点", residential: "强调环境适应与建造经验", government: "强调秩序与功能组织", palace: "强调系统化和高等级工艺", bridge: "强调受力、跨度与耐久性" },
];

export const homeTopicPerformance = [
  { name: "民居", value: 86, color: "#8f5b33" },
  { name: "官府", value: 79, color: "#7a4b31" },
  { name: "皇宫", value: 95, color: "#aa7a1f" },
  { name: "桥梁", value: 88, color: "#557a6b" },
];

export const homeDynastyHeat = [
  { dynasty: "夏商", residential: 16, government: 12, palace: 22, bridge: 6 },
  { dynasty: "周", residential: 22, government: 18, palace: 28, bridge: 12 },
  { dynasty: "秦汉", residential: 34, government: 26, palace: 42, bridge: 20 },
  { dynasty: "隋唐", residential: 40, government: 32, palace: 54, bridge: 34 },
  { dynasty: "宋元", residential: 48, government: 30, palace: 38, bridge: 40 },
  { dynasty: "明清", residential: 62, government: 44, palace: 58, bridge: 46 },
];

export const homeMatrixData = [
  { dimension: "功能性", residential: 92, government: 90, palace: 78, bridge: 95 },
  { dimension: "礼制性", residential: 54, government: 94, palace: 99, bridge: 28 },
  { dimension: "技术性", residential: 72, government: 76, palace: 92, bridge: 96 },
  { dimension: "地域性", residential: 97, government: 60, palace: 68, bridge: 84 },
];

export const homeMapPoints = [
  { id: "forbidden-city", label: "紫禁城", topic: "palace" as TopicKey, dynasty: "明清", region: "北京", x: 67, y: 26, value: 98, image: realImage("北京故宫", imgForbiddenCity) },
  { id: "weiyang", label: "未央宫", topic: "palace" as TopicKey, dynasty: "秦汉", region: "陕西西安", x: 38, y: 44, value: 91, image: realImage("汉未央宫", imgWeiyang) },
  { id: "daming", label: "大明宫", topic: "palace" as TopicKey, dynasty: "隋唐", region: "陕西西安", x: 39, y: 43, value: 93, image: realImage("唐大明宫", imgDaming) },
  { id: "zhaozhou", label: "赵州桥", topic: "bridge" as TopicKey, dynasty: "隋唐", region: "河北赵县", x: 63, y: 34, value: 95, image: realImage("赵州桥", imgZhaozhou) },
  { id: "lugou", label: "卢沟桥", topic: "bridge" as TopicKey, dynasty: "宋元", region: "北京", x: 66, y: 27, value: 89, image: realImage("卢沟桥", imgLugou) },
  { id: "seventeen-arch", label: "十七孔桥", topic: "bridge" as TopicKey, dynasty: "明清", region: "北京", x: 66, y: 29, value: 86, image: realImage("十七孔桥", imgSeventeenArch) },
  { id: "huizhou", label: "徽州民居", topic: "residential" as TopicKey, dynasty: "明清", region: "安徽黄山", x: 74, y: 64, value: 93, image: realImage("徽州明代住宅", imgHuizhou) },
  { id: "suzhou", label: "江南民居", topic: "residential" as TopicKey, dynasty: "宋至明清", region: "江苏苏州", x: 79, y: 56, value: 88, image: realImage("姬氏民居", imgSuzhouGarden) },
  { id: "yamen", label: "州府县衙", topic: "government" as TopicKey, dynasty: "明清", region: "华北地区", x: 57, y: 40, value: 84, image: realImage("南阳府衙", imgYuandadu) },
  { id: "qinian", label: "祈年殿", topic: "palace" as TopicKey, dynasty: "明清", region: "北京", x: 67, y: 28, value: 87, image: realImage("颐和园", imgTempleHeaven) },
  { id: "summer", label: "颐和园", topic: "palace" as TopicKey, dynasty: "明清", region: "北京", x: 65, y: 27, value: 85, image: realImage("颐和园", imgSummerPalace) },
];

export const homeRanking = [
  { name: "紫禁城", score: 98, topic: "皇宫", dynasty: "明清" },
  { name: "赵州桥", score: 95, topic: "桥梁", dynasty: "隋唐" },
  { name: "徽州民居", score: 93, topic: "民居", dynasty: "明清" },
  { name: "大明宫", score: 93, topic: "皇宫", dynasty: "隋唐" },
  { name: "州府县衙", score: 84, topic: "官府", dynasty: "明清" },
];

export const getTopicContent = (key: TopicKey) => topicContents.find(item => item.key === key)!;
