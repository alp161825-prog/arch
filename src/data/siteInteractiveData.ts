import { TopicKey, getTopicContent } from "@/data/siteContentV2";

export const interactiveMapPoints = [
  {
    id: "forbidden-city",
    label: "紫禁城",
    longitude: 116.397,
    latitude: 39.918,
    regionId: "north",
    dynasty: "明清",
    topic: "palace" as TopicKey,
  },
  {
    id: "weiyang",
    label: "未央宫",
    longitude: 108.89,
    latitude: 34.31,
    regionId: "northwest",
    dynasty: "秦汉",
    topic: "palace" as TopicKey,
  },
  {
    id: "zhaozhou",
    label: "赵州桥",
    longitude: 114.775,
    latitude: 37.754,
    regionId: "north",
    dynasty: "隋唐",
    topic: "bridge" as TopicKey,
  },
  {
    id: "lugou",
    label: "卢沟桥",
    longitude: 116.219,
    latitude: 39.856,
    regionId: "north",
    dynasty: "宋元至明清",
    topic: "bridge" as TopicKey,
  },
  {
    id: "huizhou",
    label: "徽州民居",
    longitude: 118.339,
    latitude: 29.715,
    regionId: "jiangnan",
    dynasty: "明清",
    topic: "residential" as TopicKey,
  },
  {
    id: "suzhou",
    label: "江南民居",
    longitude: 120.585,
    latitude: 31.298,
    regionId: "jiangnan",
    dynasty: "宋至明清",
    topic: "residential" as TopicKey,
  },
  {
    id: "yamen",
    label: "州府衙署",
    longitude: 113.625,
    latitude: 34.747,
    regionId: "central",
    dynasty: "明清",
    topic: "government" as TopicKey,
  },
  {
    id: "tulou",
    label: "福建土楼",
    longitude: 116.732,
    latitude: 24.724,
    regionId: "southeast",
    dynasty: "明清",
    topic: "residential" as TopicKey,
  },
];

export const mapRegions = [
  {
    id: "north",
    label: "北方礼制轴线区",
    provinces: ["北京市", "天津市", "河北省", "山西省", "山东省"],
    summary: "宫殿与官署最强调中轴秩序，大尺度院落和纪念性空间集中分布在这一带。",
    focus: "礼制秩序、官式营造、桥梁交通节点",
  },
  {
    id: "northwest",
    label: "西北都城遗址区",
    provinces: ["陕西省", "甘肃省", "宁夏回族自治区"],
    summary: "秦汉至隋唐都城遗址密集，是宫殿与官署制度空间的重要源头。",
    focus: "都城格局、夯土台基、汉唐宫殿体系",
  },
  {
    id: "jiangnan",
    label: "江南水网聚落区",
    provinces: ["江苏省", "浙江省", "安徽省", "上海市"],
    summary: "民居与园林、街巷和河道紧密耦合，形成细密而精致的生活空间。",
    focus: "院落尺度、园居融合、水乡桥巷系统",
  },
  {
    id: "southeast",
    label: "东南宗族聚居区",
    provinces: ["福建省", "广东省", "江西省"],
    summary: "围屋、土楼等聚居形态突出防御性与宗族组织，兼顾潮湿炎热环境下的通风与排水。",
    focus: "宗族聚居、防御性、气候适应",
  },
  {
    id: "central",
    label: "中原制度传播区",
    provinces: ["河南省", "湖北省", "湖南省"],
    summary: "是官署与民居范式向南北扩散的中介地带，兼具制度传播与地方转译特征。",
    focus: "制度扩散、衙署格局、聚落过渡",
  },
];

export const timelineCourseStages = [
  {
    id: "sprout",
    title: "萌芽",
    period: "先秦",
    summary: "建筑首先回应遮蔽、祭祀与聚落组织需求，四类建筑尚未完全分化。",
    categories: {
      residential: "穴居、干栏和早期院落开始形成，居住需求驱动最初空间组织。",
      government: "宗庙与宫室混合，政治与礼仪空间还未严格区分。",
      palace: "宫殿雏形依附都邑与礼制空间出现，以夯土台基和轴线意识为核心。",
      bridge: "桥梁仍以木梁和简易跨越为主，解决通行问题是首要目标。",
    },
  },
  {
    id: "formation",
    title: "成型",
    period: "秦汉",
    summary: "都城秩序、礼制空间和大型工程能力显著增强，建筑类型逐渐明确。",
    categories: {
      residential: "院落和聚落关系开始稳定，民居从功能 shelter 向家庭秩序延伸。",
      government: "官署的前朝后寝和公私分区变得清晰，制度空间形成模板。",
      palace: "未央宫等大型宫殿奠定宫城尺度、台基和轴线格局。",
      bridge: "石材与拱券技术逐渐成熟，为后续桥梁创新奠基。",
    },
  },
  {
    id: "mature",
    title: "成熟",
    period: "隋唐至宋元",
    summary: "四类建筑全面成熟，并在技术、审美和制度层面展现各自高峰。",
    categories: {
      residential: "地域民居分化明显，江南、北方、西南的居住范式各自稳定。",
      government: "衙署体系与城市治理空间高度耦合，前堂后宅格局定型。",
      palace: "大明宫等宫殿群展现最强的礼制秩序和营造技术整合。",
      bridge: "赵州桥、卢沟桥等代表拱桥技术与景观价值同步成熟。",
    },
  },
  {
    id: "diversify",
    title: "分化",
    period: "明清",
    summary: "在成熟范式基础上，四类建筑沿着制度强化、地域细化与审美深化继续分化。",
    categories: {
      residential: "徽州民居、福建土楼等形态高度地方化，家族与地域特征进一步强化。",
      government: "官署制度被广泛复制，地方层级差异更多体现在尺度与装饰上。",
      palace: "紫禁城将中轴、院落层级与皇家象征推进到集大成阶段。",
      bridge: "桥梁一方面继续服务交通，另一方面成为园林和城市景观的重要构件。",
    },
  },
];

export const compareRadarData = [
  { dimension: "礼制等级", residential: 45, government: 90, palace: 98, bridge: 30 },
  { dimension: "地域适应", residential: 96, government: 58, palace: 68, bridge: 82 },
  { dimension: "工程技术", residential: 70, government: 76, palace: 92, bridge: 97 },
  { dimension: "生活关联", residential: 98, government: 42, palace: 26, bridge: 78 },
  { dimension: "景观表达", residential: 82, government: 64, palace: 94, bridge: 88 },
];

export const compareBarData = [
  { label: "空间秩序", residential: 76, government: 92, palace: 99, bridge: 68 },
  { label: "结构复杂度", residential: 62, government: 74, palace: 95, bridge: 96 },
  { label: "传播广度", residential: 94, government: 88, palace: 72, bridge: 84 },
  { label: "象征强度", residential: 48, government: 86, palace: 100, bridge: 56 },
];

export const compareTagMatrix = [
  { dimension: "核心目标", residential: "居住", government: "治理", palace: "皇权", bridge: "交通" },
  { dimension: "典型结构", residential: "院落/围屋", government: "门厅堂院", palace: "中轴殿阁群", bridge: "梁桥/拱桥" },
  { dimension: "主要材料", residential: "木、砖、土", government: "木、砖、瓦", palace: "木、石、琉璃", bridge: "石、木、砖" },
  { dimension: "成熟阶段", residential: "宋元至明清", government: "秦汉至明清", palace: "隋唐至明清", bridge: "隋唐至明清" },
];

export const topicNarrativeLabels: Record<TopicKey, string[]> = {
  residential: ["居住原型", "地域适应", "生活秩序", "家族文化"],
  government: ["治理原点", "礼制成型", "衙署系统", "制度传播"],
  palace: ["宫城奠基", "轴线展开", "工艺高峰", "皇权象征"],
  bridge: ["跨越需求", "结构创新", "工程成熟", "景观融合"],
};

export const topicCaseNotes: Record<TopicKey, string[]> = {
  residential: ["关注院落开合与生活流线", "观察气候适应与材料选择", "比较地域民居的聚族方式"],
  government: ["抓住前堂后宅的秩序关系", "观察大堂与门厅的权力界面", "比较制度如何在地方落地"],
  palace: ["观察中轴组织如何放大权力", "比较台基、屋顶和色彩的等级表达", "注意宫殿群前朝后寝的节奏"],
  bridge: ["比较梁桥与拱桥的受力差异", "观察桥梁如何处理水文条件", "注意桥梁如何转化为景观节点"],
};

export const topicCaseProfiles = {
  residential: getTopicContent("residential").examples,
  government: getTopicContent("government").examples,
  palace: getTopicContent("palace").examples,
  bridge: getTopicContent("bridge").examples,
};
