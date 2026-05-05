
export type ProvinceOverviewCard = {
  label: string;
  value: string;
};

export type ProvinceTrendPoint = {
  period: string;
  value: number;
};

export type ProvinceCategoryPoint = {
  name: string;
  value: number;
};

export type ProvinceCityMetric = {
  city: string;
  sites: number;
  activity: number;
  study: number;
};

export type ProvinceRankingItem = {
  name: string;
  category: string;
  score: number;
};

export type ProvinceScatterPoint = {
  name: string;
  protection: number;
  vitality: number;
  influence: number;
};

export type ProvinceAtlasRecord = {
  code: string;
  name: string;
  shortName: string;
  summary: string;
  focus: string[];
  cards: ProvinceOverviewCard[];
  trend: ProvinceTrendPoint[];
  categories: ProvinceCategoryPoint[];
  cityMetrics: ProvinceCityMetric[];
  rankings: ProvinceRankingItem[];
  scatter: ProvinceScatterPoint[];
};

export const provinceCodeToName: Record<string, string> = {
  "110000": "北京市",
  "120000": "天津市",
  "130000": "河北省",
  "140000": "山西省",
  "150000": "内蒙古自治区",
  "210000": "辽宁省",
  "220000": "吉林省",
  "230000": "黑龙江省",
  "310000": "上海市",
  "320000": "江苏省",
  "330000": "浙江省",
  "340000": "安徽省",
  "350000": "福建省",
  "360000": "江西省",
  "370000": "山东省",
  "410000": "河南省",
  "420000": "湖北省",
  "430000": "湖南省",
  "440000": "广东省",
  "450000": "广西壮族自治区",
  "460000": "海南省",
  "500000": "重庆市",
  "510000": "四川省",
  "520000": "贵州省",
  "530000": "云南省",
  "540000": "西藏自治区",
  "610000": "陕西省",
  "620000": "甘肃省",
  "630000": "青海省",
  "640000": "宁夏回族自治区",
  "650000": "新疆维吾尔自治区",
  "710000": "台湾省",
  "810000": "香港特别行政区",
  "820000": "澳门特别行政区",
};

const basePeriods = ["先秦", "秦汉", "隋唐", "宋元", "明清", "近现代"];

const seeded = (seed: number, offset: number, min: number, max: number) => {
  const span = max - min + 1;
  return min + ((seed * 37 + offset * 19) % span);
};

const makeFallback = (code: string, name: string): ProvinceAtlasRecord => {
  const seed = Number(code.slice(0, 3)) || Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const shortName = name.replace("省", "").replace("市", "").replace("壮族自治区", "").replace("回族自治区", "").replace("维吾尔自治区", "").replace("自治区", "").replace("特别行政区", "");
  return {
    code,
    name,
    shortName,
    summary: `${name}分析页已建立为省级建筑观察界面，可用于承接地图点击跳转，并继续替换为更真实的地方建筑、客流与文保数据。`,
    focus: ["建筑分布", "活化利用", "保护等级", "研究进展"],
    cards: [
      { label: "重点建筑", value: `${seeded(seed, 1, 6, 18)}` },
      { label: "活跃城市", value: `${seeded(seed, 2, 4, 10)}` },
      { label: "课程样本", value: `${seeded(seed, 3, 8, 22)}` },
      { label: "综合指数", value: `${seeded(seed, 4, 72, 96)}` },
    ],
    trend: basePeriods.map((period, index) => ({
      period,
      value: seeded(seed, index + 5, 40, 96),
    })),
    categories: [
      { name: "宫殿", value: seeded(seed, 10, 10, 28) },
      { name: "官署", value: seeded(seed, 11, 8, 22) },
      { name: "民居", value: seeded(seed, 12, 14, 34) },
      { name: "桥梁", value: seeded(seed, 13, 6, 18) },
    ],
    cityMetrics: ["省会", "北部", "中部", "南部", "东部"].map((city, index) => ({
      city,
      sites: seeded(seed, index + 14, 8, 26),
      activity: seeded(seed, index + 15, 40, 94),
      study: seeded(seed, index + 16, 32, 88),
    })),
    rankings: [
      { name: `${shortName}古城`, category: "聚落", score: seeded(seed, 20, 80, 96) },
      { name: `${shortName}古桥`, category: "桥梁", score: seeded(seed, 21, 74, 92) },
      { name: `${shortName}府署`, category: "官署", score: seeded(seed, 22, 72, 90) },
      { name: `${shortName}园林`, category: "民居", score: seeded(seed, 23, 70, 88) },
      { name: `${shortName}宫苑遗址`, category: "宫殿", score: seeded(seed, 24, 68, 86) },
    ],
    scatter: ["保护", "展示", "研究", "旅游", "教育"].map((nameItem, index) => ({
      name: nameItem,
      protection: seeded(seed, index + 25, 52, 96),
      vitality: seeded(seed, index + 26, 44, 92),
      influence: seeded(seed, index + 27, 40, 95),
    })),
  };
};

const explicitRecords: Record<string, ProvinceAtlasRecord> = {
  "110000": {
    code: "110000",
    name: "北京市",
    shortName: "北京",
    summary: "北京的古代建筑样本高度集中，宫殿、坛庙、园林与桥梁共同构成首都礼制与城市空间的代表性剖面。",
    focus: ["皇城中轴", "宫苑体系", "礼制空间", "文旅活化"],
    cards: [
      { label: "重点建筑", value: "16" },
      { label: "世界遗产点", value: "7" },
      { label: "年度展览", value: "28" },
      { label: "综合指数", value: "98" },
    ],
    trend: [
      { period: "先秦", value: 42 },
      { period: "秦汉", value: 56 },
      { period: "隋唐", value: 63 },
      { period: "宋元", value: 78 },
      { period: "明清", value: 96 },
      { period: "近现代", value: 88 },
    ],
    categories: [
      { name: "宫殿", value: 30 },
      { name: "官署", value: 20 },
      { name: "民居", value: 14 },
      { name: "桥梁", value: 8 },
    ],
    cityMetrics: [
      { city: "东城", sites: 24, activity: 95, study: 90 },
      { city: "西城", sites: 18, activity: 84, study: 80 },
      { city: "海淀", sites: 12, activity: 72, study: 76 },
      { city: "丰台", sites: 10, activity: 68, study: 64 },
      { city: "颐和园片区", sites: 15, activity: 88, study: 74 },
    ],
    rankings: [
      { name: "紫禁城", category: "宫殿", score: 99 },
      { name: "天坛", category: "礼制", score: 95 },
      { name: "颐和园", category: "园林", score: 93 },
      { name: "卢沟桥", category: "桥梁", score: 89 },
      { name: "元大都遗址", category: "城址", score: 85 },
    ],
    scatter: [
      { name: "保护", protection: 96, vitality: 82, influence: 98 },
      { name: "展示", protection: 90, vitality: 94, influence: 96 },
      { name: "研究", protection: 92, vitality: 88, influence: 95 },
      { name: "旅游", protection: 80, vitality: 97, influence: 94 },
      { name: "教育", protection: 86, vitality: 84, influence: 91 },
    ],
  },
  "130000": {
    code: "130000",
    name: "河北省",
    shortName: "河北",
    summary: "河北串联起北方都城外围的桥梁、长城、古城与皇家建筑，是观察交通工程与北方建筑体系的重要窗口。",
    focus: ["桥梁工程", "北方城市", "长城系统", "文保分级"],
    cards: [
      { label: "重点建筑", value: "14" },
      { label: "国家级文保", value: "9" },
      { label: "桥梁样本", value: "5" },
      { label: "综合指数", value: "92" },
    ],
    trend: [
      { period: "先秦", value: 36 },
      { period: "秦汉", value: 48 },
      { period: "隋唐", value: 76 },
      { period: "宋元", value: 70 },
      { period: "明清", value: 84 },
      { period: "近现代", value: 73 },
    ],
    categories: [
      { name: "宫殿", value: 8 },
      { name: "官署", value: 12 },
      { name: "民居", value: 18 },
      { name: "桥梁", value: 22 },
    ],
    cityMetrics: [
      { city: "石家庄", sites: 10, activity: 72, study: 68 },
      { city: "保定", sites: 14, activity: 79, study: 74 },
      { city: "邯郸", sites: 11, activity: 66, study: 71 },
      { city: "张家口", sites: 9, activity: 62, study: 60 },
      { city: "赵县", sites: 8, activity: 88, study: 82 },
    ],
    rankings: [
      { name: "赵州桥", category: "桥梁", score: 97 },
      { name: "山海关", category: "城防", score: 90 },
      { name: "正定古城", category: "城址", score: 86 },
      { name: "承德避暑山庄", category: "园林", score: 92 },
      { name: "清西陵", category: "陵寝", score: 88 },
    ],
    scatter: [
      { name: "保护", protection: 90, vitality: 76, influence: 89 },
      { name: "展示", protection: 82, vitality: 84, influence: 80 },
      { name: "研究", protection: 88, vitality: 72, influence: 84 },
      { name: "旅游", protection: 74, vitality: 90, influence: 82 },
      { name: "教育", protection: 78, vitality: 70, influence: 76 },
    ],
  },
  "320000": {
    code: "320000",
    name: "江苏省",
    shortName: "江苏",
    summary: "江苏的园林、民居与城市水网关系紧密，适合观察江南空间如何从生活尺度与景观秩序中形成独特气质。",
    focus: ["江南民居", "园林空间", "水网城市", "活化展示"],
    cards: [
      { label: "重点建筑", value: "15" },
      { label: "古典园林", value: "9" },
      { label: "研究样本", value: "21" },
      { label: "综合指数", value: "94" },
    ],
    trend: [
      { period: "先秦", value: 28 },
      { period: "秦汉", value: 40 },
      { period: "隋唐", value: 58 },
      { period: "宋元", value: 86 },
      { period: "明清", value: 92 },
      { period: "近现代", value: 83 },
    ],
    categories: [
      { name: "宫殿", value: 5 },
      { name: "官署", value: 10 },
      { name: "民居", value: 28 },
      { name: "桥梁", value: 15 },
    ],
    cityMetrics: [
      { city: "苏州", sites: 18, activity: 93, study: 88 },
      { city: "南京", sites: 16, activity: 84, study: 86 },
      { city: "扬州", sites: 11, activity: 78, study: 72 },
      { city: "无锡", sites: 9, activity: 74, study: 68 },
      { city: "镇江", sites: 8, activity: 70, study: 66 },
    ],
    rankings: [
      { name: "苏州园林", category: "园林", score: 98 },
      { name: "平江路民居", category: "民居", score: 89 },
      { name: "拙政园", category: "园林", score: 95 },
      { name: "明孝陵", category: "陵寝", score: 88 },
      { name: "周庄古镇", category: "聚落", score: 90 },
    ],
    scatter: [
      { name: "保护", protection: 92, vitality: 84, influence: 90 },
      { name: "展示", protection: 86, vitality: 93, influence: 92 },
      { name: "研究", protection: 88, vitality: 82, influence: 89 },
      { name: "旅游", protection: 80, vitality: 96, influence: 94 },
      { name: "教育", protection: 82, vitality: 78, influence: 84 },
    ],
  },
  "340000": {
    code: "340000",
    name: "安徽省",
    shortName: "安徽",
    summary: "安徽尤其是徽州地区保留了密集的传统聚落与民居样本，适合观察宗族秩序与山地环境如何塑造地方建筑。",
    focus: ["徽州聚落", "宗族空间", "山地适应", "民居保护"],
    cards: [
      { label: "重点建筑", value: "12" },
      { label: "古村落", value: "7" },
      { label: "民居样本", value: "18" },
      { label: "综合指数", value: "91" },
    ],
    trend: [
      { period: "先秦", value: 24 },
      { period: "秦汉", value: 34 },
      { period: "隋唐", value: 46 },
      { period: "宋元", value: 72 },
      { period: "明清", value: 90 },
      { period: "近现代", value: 76 },
    ],
    categories: [
      { name: "宫殿", value: 3 },
      { name: "官署", value: 8 },
      { name: "民居", value: 32 },
      { name: "桥梁", value: 11 },
    ],
    cityMetrics: [
      { city: "黄山", sites: 16, activity: 91, study: 84 },
      { city: "宣城", sites: 10, activity: 74, study: 68 },
      { city: "安庆", sites: 9, activity: 70, study: 62 },
      { city: "池州", sites: 8, activity: 66, study: 60 },
      { city: "合肥", sites: 7, activity: 61, study: 65 },
    ],
    rankings: [
      { name: "徽州古城", category: "聚落", score: 95 },
      { name: "西递", category: "民居", score: 94 },
      { name: "宏村", category: "民居", score: 93 },
      { name: "棠樾牌坊群", category: "礼制", score: 86 },
      { name: "呈坎", category: "聚落", score: 88 },
    ],
    scatter: [
      { name: "保护", protection: 94, vitality: 78, influence: 90 },
      { name: "展示", protection: 84, vitality: 86, influence: 82 },
      { name: "研究", protection: 88, vitality: 80, influence: 86 },
      { name: "旅游", protection: 76, vitality: 93, influence: 88 },
      { name: "教育", protection: 80, vitality: 74, influence: 78 },
    ],
  },
  "350000": {
    code: "350000",
    name: "福建省",
    shortName: "福建",
    summary: "福建的土楼与滨海聚落样本鲜明，适合观察宗族防御性、山海环境和民居组织之间的耦合关系。",
    focus: ["福建土楼", "宗族聚居", "海陆交通", "世界遗产"],
    cards: [
      { label: "重点建筑", value: "11" },
      { label: "土楼样本", value: "6" },
      { label: "活化项目", value: "10" },
      { label: "综合指数", value: "90" },
    ],
    trend: [
      { period: "先秦", value: 18 },
      { period: "秦汉", value: 27 },
      { period: "隋唐", value: 44 },
      { period: "宋元", value: 68 },
      { period: "明清", value: 92 },
      { period: "近现代", value: 80 },
    ],
    categories: [
      { name: "宫殿", value: 2 },
      { name: "官署", value: 7 },
      { name: "民居", value: 34 },
      { name: "桥梁", value: 9 },
    ],
    cityMetrics: [
      { city: "龙岩", sites: 13, activity: 88, study: 82 },
      { city: "漳州", sites: 12, activity: 84, study: 76 },
      { city: "泉州", sites: 14, activity: 90, study: 80 },
      { city: "福州", sites: 8, activity: 68, study: 70 },
      { city: "厦门", sites: 7, activity: 72, study: 64 },
    ],
    rankings: [
      { name: "福建土楼", category: "民居", score: 98 },
      { name: "泉州古城", category: "城址", score: 91 },
      { name: "开元寺", category: "宗教", score: 86 },
      { name: "云水谣聚落", category: "聚落", score: 88 },
      { name: "崇武古城", category: "城防", score: 84 },
    ],
    scatter: [
      { name: "保护", protection: 93, vitality: 76, influence: 88 },
      { name: "展示", protection: 84, vitality: 88, influence: 83 },
      { name: "研究", protection: 86, vitality: 74, influence: 81 },
      { name: "旅游", protection: 78, vitality: 94, influence: 89 },
      { name: "教育", protection: 76, vitality: 70, influence: 74 },
    ],
  },
  "410000": {
    code: "410000",
    name: "河南省",
    shortName: "河南",
    summary: "河南位于中原腹地，宫殿、官署、桥梁和城址样本层层叠加，是观察制度空间与交通工程的核心区域。",
    focus: ["中原都城", "制度传播", "古桥系统", "考古遗址"],
    cards: [
      { label: "重点建筑", value: "17" },
      { label: "都城遗址", value: "6" },
      { label: "桥梁样本", value: "4" },
      { label: "综合指数", value: "95" },
    ],
    trend: [
      { period: "先秦", value: 62 },
      { period: "秦汉", value: 88 },
      { period: "隋唐", value: 79 },
      { period: "宋元", value: 76 },
      { period: "明清", value: 68 },
      { period: "近现代", value: 60 },
    ],
    categories: [
      { name: "宫殿", value: 16 },
      { name: "官署", value: 18 },
      { name: "民居", value: 12 },
      { name: "桥梁", value: 14 },
    ],
    cityMetrics: [
      { city: "洛阳", sites: 18, activity: 86, study: 92 },
      { city: "开封", sites: 16, activity: 82, study: 88 },
      { city: "安阳", sites: 14, activity: 74, study: 84 },
      { city: "郑州", sites: 10, activity: 66, study: 70 },
      { city: "南阳", sites: 9, activity: 64, study: 68 },
    ],
    rankings: [
      { name: "应天门遗址", category: "宫殿", score: 92 },
      { name: "州府衙署", category: "官署", score: 86 },
      { name: "铁塔", category: "宗教", score: 90 },
      { name: "洛阳城遗址", category: "城址", score: 94 },
      { name: "北宋东京城", category: "城址", score: 91 },
    ],
    scatter: [
      { name: "保护", protection: 94, vitality: 78, influence: 95 },
      { name: "展示", protection: 88, vitality: 82, influence: 90 },
      { name: "研究", protection: 96, vitality: 76, influence: 97 },
      { name: "旅游", protection: 78, vitality: 88, influence: 85 },
      { name: "教育", protection: 84, vitality: 74, influence: 83 },
    ],
  },
  "610000": {
    code: "610000",
    name: "陕西省",
    shortName: "陕西",
    summary: "陕西集中呈现了秦汉至隋唐的都城与宫殿遗址，是理解中国古代国家空间秩序最关键的观察区域之一。",
    focus: ["都城遗址", "宫殿布局", "秦汉唐脉络", "考古展示"],
    cards: [
      { label: "重点建筑", value: "18" },
      { label: "宫殿遗址", value: "7" },
      { label: "都城样本", value: "6" },
      { label: "综合指数", value: "97" },
    ],
    trend: [
      { period: "先秦", value: 58 },
      { period: "秦汉", value: 95 },
      { period: "隋唐", value: 98 },
      { period: "宋元", value: 54 },
      { period: "明清", value: 48 },
      { period: "近现代", value: 52 },
    ],
    categories: [
      { name: "宫殿", value: 30 },
      { name: "官署", value: 16 },
      { name: "民居", value: 8 },
      { name: "桥梁", value: 5 },
    ],
    cityMetrics: [
      { city: "西安", sites: 24, activity: 94, study: 96 },
      { city: "咸阳", sites: 15, activity: 80, study: 88 },
      { city: "宝鸡", sites: 11, activity: 72, study: 78 },
      { city: "汉中", sites: 9, activity: 66, study: 68 },
      { city: "延安", sites: 8, activity: 60, study: 62 },
    ],
    rankings: [
      { name: "大明宫", category: "宫殿", score: 98 },
      { name: "未央宫", category: "宫殿", score: 97 },
      { name: "秦阿房宫遗址", category: "宫殿", score: 90 },
      { name: "唐长安城遗址", category: "城址", score: 96 },
      { name: "汉长安城遗址", category: "城址", score: 94 },
    ],
    scatter: [
      { name: "保护", protection: 95, vitality: 82, influence: 97 },
      { name: "展示", protection: 88, vitality: 90, influence: 92 },
      { name: "研究", protection: 98, vitality: 84, influence: 99 },
      { name: "旅游", protection: 80, vitality: 88, influence: 89 },
      { name: "教育", protection: 84, vitality: 78, influence: 86 },
    ],
  },
};

export const supportedProvinceCodes = Object.keys(explicitRecords).sort();

export const hasProvinceAtlasRecord = (code: string) => supportedProvinceCodes.includes(code);

export const getProvinceAtlasRecord = (code: string) => {
  const name = provinceCodeToName[code] ?? "省级分析页";
  return explicitRecords[code] ?? makeFallback(code, name);
};

