import dynastyXiaShang from "@/assets/dynasty-xia-shang.jpg";
import dynastyZhou from "@/assets/dynasty-zhou.jpg";
import dynastyQinHan from "@/assets/dynasty-qin-han.jpg";
import dynastySuiTang from "@/assets/dynasty-sui-tang.jpg";
import dynastySong from "@/assets/dynasty-song.jpg";
import dynastyYuan from "@/assets/dynasty-yuan.jpg";
import dynastyMingQing from "@/assets/dynasty-ming-qing.jpg";
import { buildingImageMap } from "@/data/buildingImageMap.generated";
import { resolveUserBuildingImage } from "@/data/userBuildingImageMap";

// Local building fallback images
import imgYinxu from "@/assets/buildings/yinxu.jpg";
import imgErlitou from "@/assets/buildings/erlitou.jpg";
import imgZhouyuan from "@/assets/buildings/zhouyuan.jpg";
import imgYongcheng from "@/assets/buildings/yongcheng.jpg";
import imgWeiyang from "@/assets/buildings/weiyang.jpg";
import imgHanBridge from "@/assets/buildings/han-bridge.jpg";
import imgEpang from "@/assets/buildings/epang.jpg";
import imgGreatWall from "@/assets/buildings/great-wall.jpg";
import imgDaming from "@/assets/buildings/daming.jpg";
import imgFoguang from "@/assets/buildings/foguang.jpg";
import imgZhaozhou from "@/assets/buildings/zhaozhou-bridge.jpg";
import imgTengwang from "@/assets/buildings/tengwang.jpg";
import imgJinci from "@/assets/buildings/jinci.jpg";
import imgQingming from "@/assets/buildings/qingming.jpg";
import imgLugou from "@/assets/buildings/lugou.jpg";
import imgIronPagoda from "@/assets/buildings/iron-pagoda.jpg";
import imgYongle from "@/assets/buildings/yongle.jpg";
import imgYuandadu from "@/assets/buildings/yuandadu.jpg";
import imgForbiddenCity from "@/assets/buildings/forbidden-city.jpg";
import imgSummerPalace from "@/assets/buildings/summer-palace.jpg";
import imgHuizhou from "@/assets/buildings/huizhou.jpg";
import imgSeventeenArch from "@/assets/buildings/seventeen-arch.jpg";
import imgTempleHeaven from "@/assets/buildings/temple-heaven.jpg";
import imgSuzhouGarden from "@/assets/buildings/suzhou-garden.jpg";

// Evolution images
import evoXiaShang from "@/assets/evolution/xia-shang.jpg";
import evoZhou from "@/assets/evolution/zhou.jpg";
import evoQinHan from "@/assets/evolution/qin-han.jpg";
import evoSuiTang from "@/assets/evolution/sui-tang.jpg";
import evoSong from "@/assets/evolution/song.jpg";
import evoYuan from "@/assets/evolution/yuan.jpg";
import evoMingQing from "@/assets/evolution/ming-qing.jpg";

const toPublicAssetUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, "");
  const base = import.meta.env.BASE_URL ?? "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${normalizedPath}`;
};

const defaultBuildingImage = imgSuzhouGarden;
const realSceneImage = (_query: string) => defaultBuildingImage;

const localFallbackImageMap: Record<string, string> = {
  "殷墟宫殿遗址": imgYinxu,
  "二里头宫殿": imgErlitou,
  "周原宫殿遗址": imgZhouyuan,
  "雍城宫殿": imgYongcheng,
  "未央宫": imgWeiyang,
  "阿房宫遗址": imgEpang,
  "万里长城": imgGreatWall,
  "灞桥遗址": imgHanBridge,
  "大明宫含元殿": imgDaming,
  "佛光寺东大殿": imgFoguang,
  "赵州桥": imgZhaozhou,
  "滕王阁": imgTengwang,
  "晋祠圣母殿": imgJinci,
  "清明上河图中建筑": imgQingming,
  "卢沟桥": imgLugou,
  "开封铁塔": imgIronPagoda,
  "沧浪亭": imgSuzhouGarden,
  "德寿宫遗址": imgYuandadu,
  "永乐宫": imgYongle,
  "元大都遗址": imgYuandadu,
  "狮子林": imgSuzhouGarden,
  "紫禁城": imgForbiddenCity,
  "天坛祈年殿": imgTempleHeaven,
  "颐和园": imgSummerPalace,
  "拙政园": imgSuzhouGarden,
  "徽州民居": imgHuizhou,
  "十七孔桥": imgSeventeenArch,
  "留园": imgSuzhouGarden,
  "个园": imgSuzhouGarden,
  "豫园": imgSuzhouGarden,
  "承德避暑山庄": imgSummerPalace,
  "乔家大院": imgHuizhou,
  "王家大院": imgHuizhou,
  "福建土楼": imgHuizhou,
  "西递民居": imgHuizhou,
};

const getBuildingImage = (name: string, query: string) => {
  const userImage = resolveUserBuildingImage(name);
  if (userImage) return userImage;
  const downloaded = buildingImageMap[name];
  if (downloaded) return toPublicAssetUrl(downloaded);
  return localFallbackImageMap[name] ?? realSceneImage(query);
};

export interface Dynasty {
  id: string;
  name: string;
  period: string;
  yearStart: number;
  yearEnd: number;
  color: string;
  image: string;
  evolutionImage: string;
  description: string;
  architectureFeatures: string[];
  keyInnovation: string;
  structureHighlight: string;
  materials: string[];
  representativeBuildings: {
    name: string;
    type: string;
    description: string;
    location: string;
    image: string;
    category: string;
  }[];
  stats: {
    scaleLevel: number;
    decorationLevel: number;
    techLevel: number;
    structureComplexity: number;
  };
}

export const dynastyData: Dynasty[] = [
  {
    id: "xia-shang",
    name: "夏商",
    period: "约前2070年—前1046年",
    yearStart: -2070,
    yearEnd: -1046,
    color: "hsl(30, 50%, 45%)",
    image: dynastyXiaShang,
    evolutionImage: evoXiaShang,
    description: "中国建筑的萌芽期。夏商时期出现了最早的宫殿建筑和城市规划，开创了中轴对称的布局传统。殷墟考古发现了大型夯土台基宫殿遗址，标志着中国建筑从简陋的穴居走向地面建筑。",
    architectureFeatures: ["夯土台基", "茅茨土阶", "中轴对称", "前朝后寝"],
    keyInnovation: "从穴居到地面建筑的革命性转变，发明夯土技术",
    structureHighlight: "茅草屋顶 + 木柱 + 夯土台基，建筑的三要素初步形成",
    materials: ["夯土", "木材", "茅草", "石材"],
    representativeBuildings: [
      { name: "殷墟宫殿遗址", type: "宫殿", description: "目前发现的最早的大型宫殿建筑群遗址，面积超过10万平方米", location: "河南安阳", image: getBuildingImage("殷墟宫殿遗址", "殷墟宫殿遗址 安阳"), category: "宫殿" },
      { name: "二里头宫殿", type: "宫殿", description: "夏代晚期大型宫殿基址，中国最早的宫城，开创'前朝后寝'布局", location: "河南洛阳", image: getBuildingImage("二里头宫殿", "二里头夏都遗址 洛阳"), category: "宫殿" },
    ],
    stats: { scaleLevel: 3, decorationLevel: 2, techLevel: 2, structureComplexity: 2 },
  },
  {
    id: "zhou",
    name: "周",
    period: "前1046年—前256年",
    yearStart: -1046,
    yearEnd: -256,
    color: "hsl(25, 55%, 42%)",
    image: dynastyZhou,
    evolutionImage: evoZhou,
    description: "礼制建筑规范的形成期。周代确立了严格的建筑等级制度，'天子之堂九尺，诸侯七尺，大夫五尺'。瓦的发明是建筑史上的重大突破，开启了中国建筑屋顶的辉煌篇章。",
    architectureFeatures: ["礼制等级", "瓦屋面", "斗拱雏形", "高台建筑"],
    keyInnovation: "瓦的发明——建筑屋顶革命，确立礼制等级规范",
    structureHighlight: "高台建筑形制，多层夯土台基上建殿堂，气势威严",
    materials: ["夯土", "木材", "瓦", "青铜构件"],
    representativeBuildings: [
      { name: "周原宫殿遗址", type: "宫殿", description: "西周王朝的政治中心，发现大量甲骨文和青铜器", location: "陕西宝鸡", image: getBuildingImage("周原宫殿遗址", "周原遗址 陕西宝鸡"), category: "宫殿" },
      { name: "雍城宫殿", type: "宫殿", description: "秦国早期都城的宫殿建筑群，规模宏大", location: "陕西凤翔", image: getBuildingImage("雍城宫殿", "雍城遗址 凤翔"), category: "宫殿" },
    ],
    stats: { scaleLevel: 4, decorationLevel: 3, techLevel: 3, structureComplexity: 3 },
  },
  {
    id: "qin-han",
    name: "秦汉",
    period: "前221年—220年",
    yearStart: -221,
    yearEnd: 220,
    color: "hsl(15, 65%, 40%)",
    image: dynastyQinHan,
    evolutionImage: evoQinHan,
    description: "中国建筑的第一个高峰。秦始皇统一后大兴土木，阿房宫'覆压三百余里'。汉代建筑体系基本成熟，木构架技术日趋完善，斗拱体系初步形成，砖石技术广泛应用。",
    architectureFeatures: ["木构架成熟", "斗拱体系", "砖石拱券", "画像砖石"],
    keyInnovation: "斗拱体系正式形成，砖石拱券技术突破",
    structureHighlight: "木构架体系基本定型，抬梁式与穿斗式并行发展",
    materials: ["木材", "砖", "石", "琉璃瓦"],
    representativeBuildings: [
      { name: "未央宫", type: "宫殿", description: "西汉皇宫，面积约5平方公里，是紫禁城的7倍", location: "陕西西安", image: getBuildingImage("未央宫", "未央宫遗址 西安"), category: "宫殿" },
      { name: "阿房宫遗址", type: "宫殿", description: "秦代最宏伟的宫殿，'覆压三百余里，隔离天日'", location: "陕西西安", image: getBuildingImage("阿房宫遗址", "阿房宫遗址 西安"), category: "宫殿" },
      { name: "万里长城", type: "城防", description: "始建于秦代，总长超过2万公里的伟大防御工程", location: "河北", image: getBuildingImage("万里长城", "万里长城 河北"), category: "城墙" },
      { name: "灞桥遗址", type: "桥梁", description: "汉代石拱桥技术的重要见证", location: "陕西西安", image: getBuildingImage("灞桥遗址", "灞桥遗址 西安 古桥"), category: "桥梁" },
    ],
    stats: { scaleLevel: 7, decorationLevel: 5, techLevel: 5, structureComplexity: 5 },
  },
  {
    id: "sui-tang",
    name: "隋唐",
    period: "581年—907年",
    yearStart: 581,
    yearEnd: 907,
    color: "hsl(5, 70%, 48%)",
    image: dynastySuiTang,
    evolutionImage: evoSuiTang,
    description: "中国古代建筑的成熟鼎盛期。唐代建筑风格雄浑大气，斗拱硕大，出檐深远，体现盛唐气象。大明宫含元殿面阔十一间，气势恢宏。木构建筑技术达到高度成熟。",
    architectureFeatures: ["斗拱硕大", "出檐深远", "举折平缓", "色彩简洁"],
    keyInnovation: "木构技术巅峰，斗拱成为核心构件，结构与艺术完美统一",
    structureHighlight: "硕大斗拱承托深远出檐，屋顶举折平缓舒展，气势雄浑",
    materials: ["木材", "琉璃瓦", "砖石", "三彩饰件"],
    representativeBuildings: [
      { name: "大明宫含元殿", type: "宫殿", description: "唐代最宏伟的宫殿，面积是紫禁城的4.5倍", location: "陕西西安", image: getBuildingImage("大明宫含元殿", "大明宫遗址 西安"), category: "宫殿" },
      { name: "佛光寺东大殿", type: "殿堂", description: "现存最古老的唐代木构建筑，梁思成发现的国宝", location: "山西五台", image: getBuildingImage("佛光寺东大殿", "佛光寺东大殿 五台山"), category: "宫殿" },
      { name: "赵州桥", type: "桥梁", description: "世界上最古老的敞肩石拱桥，建于隋代，跨度37米", location: "河北赵县", image: getBuildingImage("赵州桥", "赵州桥 河北"), category: "桥梁" },
      { name: "滕王阁", type: "楼阁", description: "江南三大名楼之首，初建于唐永徽四年", location: "江西南昌", image: getBuildingImage("滕王阁", "滕王阁 南昌"), category: "宫殿" },
    ],
    stats: { scaleLevel: 9, decorationLevel: 6, techLevel: 8, structureComplexity: 7 },
  },
  {
    id: "song",
    name: "宋",
    period: "960年—1279年",
    yearStart: 960,
    yearEnd: 1279,
    color: "hsl(160, 30%, 40%)",
    image: dynastySong,
    evolutionImage: evoSong,
    description: "建筑艺术走向精致化。宋代建筑更加注重细部装饰和比例协调，《营造法式》的编撰标志着建筑技术的规范化。建筑风格趋于秀丽柔美，与唐代雄浑形成鲜明对比。",
    architectureFeatures: ["营造法式", "减柱造", "移柱造", "装饰精细"],
    keyInnovation: "《营造法式》编撰——中国第一部建筑技术规范",
    structureHighlight: "斗拱变小变密成装饰构件，减柱移柱扩大内部空间",
    materials: ["木材", "琉璃", "砖石", "彩画"],
    representativeBuildings: [
      { name: "晋祠圣母殿", type: "殿堂", description: "宋代建筑的典范之作，减柱造代表，前廊开阔", location: "山西太原", image: getBuildingImage("晋祠圣母殿", "晋祠圣母殿 太原"), category: "宫殿" },
      { name: "清明上河图中建筑", type: "市井", description: "展现宋代城市建筑风貌，虹桥结构为世界首创", location: "河南开封", image: getBuildingImage("清明上河图中建筑", "清明上河园 开封"), category: "民居" },
      { name: "卢沟桥", type: "桥梁", description: "始建于金代的联拱石桥，桥上石狮造型各异", location: "北京", image: getBuildingImage("卢沟桥", "卢沟桥 北京"), category: "桥梁" },
      { name: "开封铁塔", type: "塔", description: "北宋琉璃砖塔，高55米，被誉为'天下第一塔'", location: "河南开封", image: getBuildingImage("开封铁塔", "开封铁塔"), category: "宫殿" },
      { name: "沧浪亭", type: "园林", description: "苏州现存最古老园林之一，宋代文人园林代表", location: "江苏苏州", image: getBuildingImage("沧浪亭", "沧浪亭 苏州园林"), category: "园林" },
      { name: "德寿宫遗址", type: "宫殿", description: "南宋临安皇城核心遗址，反映宋代宫殿空间格局", location: "浙江杭州", image: getBuildingImage("德寿宫遗址", "德寿宫遗址 杭州"), category: "宫殿" },
    ],
    stats: { scaleLevel: 7, decorationLevel: 8, techLevel: 9, structureComplexity: 8 },
  },
  {
    id: "yuan",
    name: "元",
    period: "1271年—1368年",
    yearStart: 1271,
    yearEnd: 1368,
    color: "hsl(210, 30%, 40%)",
    image: dynastyYuan,
    evolutionImage: evoYuan,
    description: "多元文化融合期。蒙古、伊斯兰、汉族建筑风格相互融合，建筑出现了新的特色。减柱造和移柱造被广泛使用，殿堂内部空间更加灵活开阔。",
    architectureFeatures: ["多文化融合", "减柱移柱", "空间开阔", "装饰简朴"],
    keyInnovation: "多民族建筑风格融合，空间布局创新",
    structureHighlight: "大量减柱，殿内空间豁然开朗；融合伊斯兰穹顶元素",
    materials: ["木材", "砖石", "琉璃瓦"],
    representativeBuildings: [
      { name: "永乐宫", type: "殿堂", description: "元代壁画艺术与建筑结合的典范，壁画面积1000余平方米", location: "山西芮城", image: getBuildingImage("永乐宫", "永乐宫 山西芮城"), category: "宫殿" },
      { name: "元大都遗址", type: "城防", description: "元代都城规划的杰出代表，奠定今日北京城市格局", location: "北京", image: getBuildingImage("元大都遗址", "元大都遗址 北京"), category: "城墙" },
      { name: "狮子林", type: "园林", description: "始建于元代的苏州古典园林，以太湖石假山著称", location: "江苏苏州", image: getBuildingImage("狮子林", "狮子林 苏州"), category: "园林" },
    ],
    stats: { scaleLevel: 7, decorationLevel: 5, techLevel: 7, structureComplexity: 7 },
  },
  {
    id: "ming-qing",
    name: "明清",
    period: "1368年—1911年",
    yearStart: 1368,
    yearEnd: 1911,
    color: "hsl(45, 80%, 45%)",
    image: dynastyMingQing,
    evolutionImage: evoMingQing,
    description: "中国古代建筑的最后高峰，也是集大成时期。紫禁城是世界上现存最大的古代宫殿建筑群。建筑技术高度标准化，官式建筑与地方民居各具特色，园林艺术达到顶峰。",
    architectureFeatures: ["官式定制", "彩画等级", "园林高峰", "地方特色"],
    keyInnovation: "建筑标准化体系完善，园林艺术登峰造极",
    structureHighlight: "庑殿重檐为最高等级，斗拱纯装饰化，彩画严格分等",
    materials: ["木材", "金砖", "琉璃", "汉白玉"],
    representativeBuildings: [
      { name: "紫禁城", type: "宫殿", description: "世界最大古代宫殿群，9999.5间房，占地72万平方米", location: "北京", image: getBuildingImage("紫禁城", "故宫 紫禁城 北京"), category: "宫殿" },
      { name: "天坛祈年殿", type: "祭祀", description: "明清皇帝祭天之所，三重檐圆形攒尖顶，结构精妙", location: "北京", image: getBuildingImage("天坛祈年殿", "天坛祈年殿"), category: "宫殿" },
      { name: "颐和园", type: "园林", description: "中国古典园林艺术的巅峰之作，面积290公顷", location: "北京", image: getBuildingImage("颐和园", "颐和园"), category: "园林" },
      { name: "拙政园", type: "园林", description: "苏州四大名园之首，'咫尺之内再造乾坤'", location: "江苏苏州", image: getBuildingImage("拙政园", "拙政园 苏州园林"), category: "园林" },
      { name: "徽州民居", type: "民居", description: "粉墙黛瓦马头墙，天井式布局的典型代表", location: "安徽", image: getBuildingImage("徽州民居", "徽州民居 宏村"), category: "民居" },
      { name: "十七孔桥", type: "桥梁", description: "颐和园中的标志性石桥，长150米", location: "北京", image: getBuildingImage("十七孔桥", "十七孔桥 颐和园"), category: "桥梁" },
      { name: "留园", type: "园林", description: "清代私家园林杰作，以建筑空间层次与假山闻名", location: "江苏苏州", image: getBuildingImage("留园", "留园 苏州"), category: "园林" },
      { name: "个园", type: "园林", description: "扬州四大名园之一，以四季假山叠石著称", location: "江苏扬州", image: getBuildingImage("个园", "个园 扬州"), category: "园林" },
      { name: "豫园", type: "园林", description: "上海著名江南园林，曲桥、湖石、厅堂组合精巧", location: "上海", image: getBuildingImage("豫园", "豫园 上海"), category: "园林" },
      { name: "承德避暑山庄", type: "园林", description: "清代皇家园林与离宫建筑群，融合南北园林风格", location: "河北承德", image: getBuildingImage("承德避暑山庄", "承德避暑山庄"), category: "园林" },
      { name: "乔家大院", type: "民居", description: "晋商宅院代表，院落严整、砖雕木雕保存完好", location: "山西祁县", image: getBuildingImage("乔家大院", "乔家大院"), category: "民居" },
      { name: "王家大院", type: "民居", description: "晋中传统民居群体，规模宏阔，有“民间故宫”之称", location: "山西灵石", image: getBuildingImage("王家大院", "王家大院"), category: "民居" },
      { name: "福建土楼", type: "民居", description: "大型夯土群居建筑，兼具防御与家族聚居功能", location: "福建龙岩", image: getBuildingImage("福建土楼", "福建土楼"), category: "民居" },
      { name: "西递民居", type: "民居", description: "徽派古村落代表，街巷与宅院格局保存完整", location: "安徽黄山", image: getBuildingImage("西递民居", "西递古村落"), category: "民居" },
    ],
    stats: { scaleLevel: 10, decorationLevel: 10, techLevel: 9, structureComplexity: 9 },
  },
];

export const buildingCategories = [
  { id: "宫殿", label: "宫殿殿堂", icon: "🏛️", description: "皇宫、殿堂、祭祀建筑" },
  { id: "园林", label: "园林景观", icon: "🏡", description: "皇家园林、私家园林" },
  { id: "桥梁", label: "桥梁工程", icon: "🌉", description: "石拱桥、廊桥等" },
  { id: "城墙", label: "城防工事", icon: "🏰", description: "长城、城墙、城门" },
  { id: "民居", label: "民居建筑", icon: "🏘️", description: "各地特色民居" },
];

export const quizQuestions = [
  {
    id: 1,
    question: "中国现存最古老的木构建筑是哪座？",
    options: ["紫禁城太和殿", "佛光寺东大殿", "晋祠圣母殿", "永乐宫三清殿"],
    correctIndex: 1,
    explanation: "佛光寺东大殿建于唐大中十一年（857年），是中国现存最古老的唐代木构建筑，由梁思成和林徽因于1937年发现。",
    dynasty: "隋唐",
  },
  {
    id: 2,
    question: "《营造法式》是哪个朝代编撰的建筑规范？",
    options: ["唐代", "宋代", "元代", "明代"],
    correctIndex: 1,
    explanation: "《营造法式》由北宋李诫编撰，成书于崇宁二年（1103年），是中国第一部官方建筑技术标准。",
    dynasty: "宋",
  },
  {
    id: 3,
    question: "赵州桥（安济桥）是世界上现存最古老的什么类型的桥？",
    options: ["梁桥", "悬索桥", "敞肩石拱桥", "廊桥"],
    correctIndex: 2,
    explanation: "赵州桥建于隋代（约605年），是世界上现存最古老的敞肩石拱桥。其开创性的敞肩设计既减轻了桥身重量，又有利于泄洪。",
    dynasty: "隋唐",
  },
  {
    id: 4,
    question: "紫禁城的最高等级屋顶形式是什么？",
    options: ["悬山顶", "歇山顶", "庑殿顶", "攒尖顶"],
    correctIndex: 2,
    explanation: "庑殿顶（又称四阿顶）是中国古建筑中等级最高的屋顶形式，只有太和殿等最重要的建筑才能使用重檐庑殿顶。",
    dynasty: "明清",
  },
  {
    id: 5,
    question: "斗拱在中国建筑中的核心作用是什么？",
    options: ["纯装饰", "承托出檐、传递荷载", "防水排水", "隔音保温"],
    correctIndex: 1,
    explanation: "斗拱是中国木构建筑的核心构件，位于柱顶与屋檐之间，将屋顶荷载层层传递至柱子，同时承托深远的出檐，是结构与美学的完美结合。",
    dynasty: "隋唐",
  },
  {
    id: 6,
    question: "中国建筑史上'瓦'的发明出现在哪个时期？",
    options: ["夏商时期", "西周时期", "秦汉时期", "隋唐时期"],
    correctIndex: 1,
    explanation: "考古发现，最早的瓦出现在西周早期（约公元前1000年）。瓦的发明使建筑屋顶从茅草跨越到更耐久的材料，是建筑史上的重大突破。",
    dynasty: "周",
  },
  {
    id: 7,
    question: "以下哪座建筑体现了'减柱造'技术？",
    options: ["太和殿", "晋祠圣母殿", "大明宫含元殿", "阿房宫"],
    correctIndex: 1,
    explanation: "晋祠圣母殿是宋代建筑中减柱造的经典之作。殿内减去前檐四根柱子，使前廊空间格外开阔，是结构创新的典范。",
    dynasty: "宋",
  },
  {
    id: 8,
    question: "天坛祈年殿的屋顶是什么形式？",
    options: ["重檐庑殿顶", "三重檐圆形攒尖顶", "重檐歇山顶", "单檐悬山顶"],
    correctIndex: 1,
    explanation: "天坛祈年殿采用三重檐圆形攒尖顶，上覆蓝色琉璃瓦，象征天。整座建筑不用一根大梁和长檩，全靠28根楠木大柱和36根枋桷支撑。",
    dynasty: "明清",
  },
];

export const materialEvolution = [
  { dynasty: "夏商", wood: 40, earth: 50, stone: 5, brick: 0, glaze: 0 },
  { dynasty: "周", wood: 45, earth: 35, stone: 8, brick: 5, glaze: 2 },
  { dynasty: "秦汉", wood: 40, earth: 20, stone: 15, brick: 20, glaze: 5 },
  { dynasty: "隋唐", wood: 45, earth: 10, stone: 15, brick: 15, glaze: 15 },
  { dynasty: "宋", wood: 40, earth: 5, stone: 15, brick: 20, glaze: 20 },
  { dynasty: "元", wood: 35, earth: 5, stone: 15, brick: 25, glaze: 20 },
  { dynasty: "明清", wood: 30, earth: 3, stone: 15, brick: 25, glaze: 27 },
];

export const materialEvolutionNotes = [
  {
    dynasty: "夏商",
    innovation: "夯土台基与木柱结合，形成最早地面建筑体系",
    techniques: ["夯土分层夯筑", "木柱承重", "茅草覆盖"],
  },
  {
    dynasty: "周",
    innovation: "瓦构件出现，屋面从茅草走向耐久化",
    techniques: ["板瓦筒瓦组合", "高台建筑", "礼制化尺度"],
  },
  {
    dynasty: "秦汉",
    innovation: "砖石与拱券技术突破，宫城与道路系统规模化",
    techniques: ["砖铺地面", "石质桥涵", "大型夯土城垣"],
  },
  {
    dynasty: "隋唐",
    innovation: "木构技术成熟，斗拱体系进入鼎盛",
    techniques: ["巨型斗拱", "深远出檐", "标准化木构模数"],
  },
  {
    dynasty: "宋",
    innovation: "《营造法式》推动营造工艺规范化与精细化",
    techniques: ["减柱造", "移柱造", "构件等级制度"],
  },
  {
    dynasty: "元",
    innovation: "多民族材料与构造并用，形成复合空间体系",
    techniques: ["木石混用", "跨文化装饰", "大跨度殿堂空间"],
  },
  {
    dynasty: "明清",
    innovation: "官式营造高度标准化，园林与民居体系并进",
    techniques: ["金砖地面", "彩画分等", "园林叠山理水"],
  },
];

const buildingTypeOrder = ["宫殿", "园林", "桥梁", "城墙", "民居"] as const;

const allRepresentativeBuildings = dynastyData.flatMap(d => d.representativeBuildings);
const totalRepresentativeBuildings = allRepresentativeBuildings.length;

export const buildingTypeStats = buildingTypeOrder.map(type => {
  const count = allRepresentativeBuildings.filter(b => b.category === type).length;
  return {
    type,
    count,
    percentage: Math.round((count / totalRepresentativeBuildings) * 100),
  };
});

