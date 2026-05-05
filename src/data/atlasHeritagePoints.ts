import type { TopicKey } from "@/data/siteContentV2";

export type AtlasHeritagePoint = {
  id: string;
  label: string;
  longitude: number;
  latitude: number;
  regionId: string;
  dynasty: string;
  topic: TopicKey;
  heat: number;
  provinceCode: string;
  location: string;
  summary: string;
  image?: string;
};

const point = (
  id: string,
  label: string,
  longitude: number,
  latitude: number,
  regionId: string,
  dynasty: string,
  topic: TopicKey,
  heat: number,
  provinceCode: string,
  location: string,
  summary: string
): AtlasHeritagePoint => ({
  id,
  label,
  longitude,
  latitude,
  regionId,
  dynasty,
  topic,
  heat,
  provinceCode,
  location,
  summary,
});

export const atlasHeritagePoints: AtlasHeritagePoint[] = [
  point("erlitou-dwelling", "二里头遗址半地穴式房屋", 112.68, 34.68, "central", "先秦", "residential", 79, "410000", "河南洛阳", "展示早期聚落居住空间由半地穴向更稳定院落化形态过渡的关键样本。"),
  point("zhou-scholar-house", "周代士大夫住宅形制", 107.8, 34.2, "northwest", "先秦", "government", 72, "610000", "陕西宝鸡", "体现礼制等级已开始进入住宅空间组织，是官府建筑秩序的前史。"),
  point("erlitou-palace", "二里头宫殿区", 112.68, 34.67, "central", "先秦", "palace", 90, "410000", "河南洛阳", "二里头宫殿区是中国早期宫殿建筑与中轴组织的重要源头。"),
  point("yinxu-palace", "殷墟宫殿宗庙遗址", 114.3, 36.13, "central", "先秦", "palace", 92, "410000", "河南安阳", "宫殿与宗庙并置，反映王权、祭祀与都城布局的早期整合。"),
  point("shang-bridge", "商代拒桥", 113.63, 34.75, "central", "先秦", "bridge", 66, "410000", "河南郑州", "代表先秦桥梁从军事防御与交通跨越功能中萌芽。"),
  point("weihe-float", "周文王渭河浮桥", 108.94, 34.36, "northwest", "先秦", "bridge", 71, "610000", "陕西西安", "浮桥技术让早期都城交通与军政调度形成稳定通道。"),
  point("pujin-float", "蒲津渡浮桥", 110.45, 34.87, "north", "先秦", "bridge", 76, "140000", "山西永济", "黄河渡桥样本，体现先秦大型水域跨越的工程智慧。"),

  point("sanyangzhuang", "三杨庄遗址", 114.9, 35.97, "central", "秦汉", "residential", 82, "410000", "河南安阳", "因火山灰封存而保留出院落、农田与生活路径，是汉代民居研究的珍贵案例。"),
  point("han-wubi", "汉代坞壁", 112.45, 34.62, "central", "秦汉", "residential", 75, "410000", "河南洛阳", "带有防御性的聚居形态，反映乱世中的地方社会组织。"),
  point("changan-office", "西汉长安城中央官署遗址", 108.93, 34.31, "northwest", "秦汉", "government", 86, "610000", "陕西西安", "秦汉中央官署遗址体现行政空间和都城秩序同步成型。"),
  point("quefei-hall", "东汉却非殿", 112.45, 34.66, "central", "秦汉", "government", 73, "410000", "河南洛阳", "宫廷与政务空间关系更加复杂，是汉魏制度空间的重要节点。"),
  point("xianyang-palace", "秦咸阳宫", 108.7, 34.37, "northwest", "秦汉", "palace", 91, "610000", "陕西咸阳", "咸阳宫揭示秦帝国早期宫殿群与都城政治空间的尺度。"),
  point("epang-palace", "阿房宫", 108.84, 34.27, "northwest", "秦汉", "palace", 88, "610000", "陕西西安", "阿房宫以巨构想象和台基尺度，成为帝国宫殿叙事的象征。"),
  point("weiyang-palace", "汉未央宫", 108.89, 34.31, "northwest", "秦汉", "palace", 95, "610000", "陕西西安", "未央宫是汉代宫殿制度与中轴格局的集大成样本。"),
  point("changle-palace", "长乐宫", 108.95, 34.33, "northwest", "秦汉", "palace", 84, "610000", "陕西西安", "长乐宫展示汉代宫苑群体中多宫并置的布局方式。"),
  point("jianzhang-palace", "建章宫", 108.86, 34.29, "northwest", "秦汉", "palace", 82, "610000", "陕西西安", "建章宫强化了汉代宫殿从礼制到景观的多重表达。"),
  point("qin-weiqiao", "秦渭桥", 108.94, 34.34, "northwest", "秦汉", "bridge", 74, "610000", "陕西西安", "连接都城与渭河北岸，是秦汉都城交通体系的关键一桥。"),
  point("han-baqiao", "汉霸桥", 109.08, 34.29, "northwest", "秦汉", "bridge", 77, "610000", "陕西西安", "霸桥连接长安东向通道，是都城出入口景观与交通节点。"),
  point("seven-star-bridge", "西汉七星桥", 109.02, 34.22, "northwest", "秦汉", "bridge", 70, "610000", "陕西西安", "体现汉代桥梁在结构与景观叙事上的双重功能。"),
  point("sandian-bridge", "三殿汉代古桥", 112.5, 34.72, "central", "秦汉", "bridge", 68, "410000", "河南洛阳", "汉代古桥遗存，为早期桥梁施工与道路组织提供了证据。"),

  point("aristocrat-house", "舍宅为寺的贵族住宅", 118.79, 32.04, "jiangnan", "魏晋南北朝", "residential", 69, "320000", "江苏南京", "从贵族宅院向寺院空间转化，呈现南朝居住建筑与宗教建筑关系。"),
  point("taiji-hall", "汉魏洛阳城太极殿", 112.49, 34.71, "central", "魏晋南北朝", "government", 87, "410000", "河南洛阳", "太极殿是汉魏洛阳城政治空间和宫廷制度的核心象征。"),
  point("jiankang-palace", "六朝建康宫", 118.79, 32.04, "jiangnan", "魏晋南北朝", "palace", 85, "320000", "江苏南京", "建康宫体现江南都城宫殿体系与北方传统的重新组织。"),
  point("traveler-bridge", "洛阳旅人桥", 112.46, 34.68, "central", "魏晋南北朝", "bridge", 72, "410000", "河南洛阳", "被视为早期拱桥发展线索之一，是桥梁史中的关键节点。"),
  point("duyu-float", "杜预浮桥", 114.31, 30.6, "central", "魏晋南北朝", "bridge", 64, "420000", "湖北武汉", "反映南北朝时期浮桥技术服务军事与交通的延续。"),

  point("chang-an-lifang", "隋唐长安城里坊住宅", 108.95, 34.27, "northwest", "隋唐", "residential", 83, "610000", "陕西西安", "里坊住宅样本帮助理解都城居民空间如何嵌入礼制化城市网格。"),
  point("dunhuang-courtyard", "敦煌壁画院落", 94.66, 40.14, "northwest", "隋唐", "residential", 78, "620000", "甘肃敦煌", "壁画中的院落图像保存了隋唐民居空间形制与生活场景。"),
  point("zhengpingfang", "正平坊遗址（含国子监）", 112.45, 34.66, "central", "隋唐", "government", 81, "410000", "河南洛阳", "坊里遗址与国子监线索一起反映洛阳城中的官学与政务空间。"),
  point("daxing-palace", "隋大兴宫", 108.96, 34.28, "northwest", "隋唐", "palace", 86, "610000", "陕西西安", "隋大兴宫为唐长安宫殿体系奠定了都城宫苑格局。"),
  point("daming-palace", "唐大明宫", 108.97, 34.29, "northwest", "隋唐", "palace", 96, "610000", "陕西西安", "大明宫将唐代帝国权力、朝仪与山水视线整合为一体。"),
  point("huaqing-palace", "华清宫", 109.21, 34.38, "northwest", "隋唐", "palace", 84, "610000", "陕西西安", "华清宫结合温泉、山水与宫苑布局，是离宫体系代表。"),
  point("zhaozhou-bridge", "赵州桥", 114.78, 37.75, "north", "隋唐", "bridge", 97, "130000", "河北赵县", "敞肩石拱技术成熟，成为中国古桥史的标志性作品。"),
  point("sui-baqiao", "隋灞桥", 109.06, 34.29, "northwest", "隋唐", "bridge", 74, "610000", "陕西西安", "灞桥延续为长安东向交通与送别文化的重要节点。"),
  point("tianjin-bridge", "洛阳天津桥", 112.46, 34.67, "central", "隋唐", "bridge", 85, "410000", "河南洛阳", "天津桥连接洛阳城中轴与水路，是隋唐都城桥梁景观代表。"),

  point("xu-fuma-fu", "北宋许驸马府", 114.35, 34.8, "central", "宋元", "residential", 81, "410000", "河南开封", "展示北宋贵族府邸尺度与城市居住空间高度叠合的特征。"),
  point("houyingfang", "元代后英房遗址", 116.4, 39.91, "north", "宋元", "residential", 74, "110000", "北京", "保留元代城市住宅遗址线索，是北京城市居住史的重要证据。"),
  point("jishi-residence", "姬氏民居", 111.08, 36.57, "north", "宋元", "residential", 76, "140000", "山西临汾", "北方传统院落在地方家族居住组织中的典型代表。"),
  point("kaifeng-fu", "北宋开封府", 114.35, 34.8, "central", "宋元", "government", 86, "410000", "河南开封", "作为东京城重要官署，体现宋代行政空间与都城生活的紧密关联。"),
  point("huozhou-office", "霍州署大堂", 111.72, 36.57, "north", "宋元", "government", 80, "140000", "山西霍州", "现存州署大堂是观察宋元官署建筑遗构的重要样本。"),
  point("tokyo-palace", "北宋东京城皇宫", 114.35, 34.79, "central", "宋元", "palace", 89, "410000", "河南开封", "东京皇宫展现宋代宫城与都市生活高度共处的格局。"),
  point("deshou-palace", "南宋德寿宫", 120.17, 30.25, "jiangnan", "宋元", "palace", 87, "330000", "浙江杭州", "德寿宫将南宋宫苑与江南城市景观密切联结。"),
  point("yuan-capital-palace", "元大都皇宫", 116.39, 39.93, "north", "宋元", "palace", 86, "110000", "北京", "元大都皇宫为后世北京皇城格局提供了重要基础。"),
  point("shangdu-daan", "元上都大安阁", 116.18, 42.37, "north", "宋元", "palace", 79, "150000", "内蒙古锡林郭勒", "宫殿与草原都城形态并置，是元代多中心统治格局的见证。"),
  point("luoyang-bridge", "洛阳桥", 118.73, 24.97, "southeast", "宋元", "bridge", 92, "350000", "福建泉州", "筏形基础和海潮适应技术，使洛阳桥成为跨海港地区桥梁代表。"),
  point("guangji-bridge", "广济桥", 116.63, 23.67, "southeast", "宋元", "bridge", 94, "440000", "广东潮州", "梁桥、浮桥结合的复合结构展示了潮汕水域桥梁智慧。"),
  point("hongqiao", "汴京虹桥", 114.35, 34.8, "central", "宋元", "bridge", 83, "410000", "河南开封", "虽以图像著称，但已成为宋代桥梁与都市商业景观的经典意象。"),
  point("yingxiang-bridge", "迎祥桥", 120.16, 30.27, "jiangnan", "宋元", "bridge", 76, "330000", "浙江杭州", "江南桥梁与城市水网耦合的代表样本。"),

  point("siheyuan", "北京四合院", 116.4, 39.92, "north", "明清", "residential", 91, "110000", "北京", "四合院将家族秩序、院落尺度与北方气候适应整合为成熟民居范式。"),
  point("huizhou-residence", "徽州明代住宅", 118.34, 29.72, "jiangnan", "明清", "residential", 93, "340000", "安徽黄山", "粉墙黛瓦、天井与街巷共同构成徽州民居的标识性空间。"),
  point("fujian-tulou", "福建土楼", 116.73, 24.72, "southeast", "明清", "residential", 95, "350000", "福建龙岩", "土楼将宗族聚居、防御性与山地环境适应推向成熟。"),
  point("yaodong", "窑洞", 109.48, 36.6, "northwest", "明清", "residential", 80, "610000", "陕西延安", "窑洞利用黄土高原地貌形成低成本高适应性的居住空间。"),
  point("yikeyin", "一颗印", 102.83, 24.88, "southwest", "明清", "residential", 74, "530000", "云南昆明", "一颗印民居体现西南地区紧凑院落与气候适应。"),
  point("nanyang-yamen", "南阳府衙", 112.53, 32.99, "central", "明清", "government", 90, "410000", "河南南阳", "现存府衙完整保留了明清地方官署的前后序列和礼制空间。"),
  point("jiliao-office", "蓟辽督师府", 118.19, 39.63, "north", "明清", "government", 78, "130000", "河北秦皇岛", "边防重镇中的军政官署，体现明代边务治理格局。"),
  point("suiyuan-office", "绥远将军衙署", 111.67, 40.82, "north", "明清", "government", 77, "150000", "内蒙古呼和浩特", "清代将军衙署反映边疆治理与驻防制度的建筑化表达。"),
  point("gongwangfu", "恭王府", 116.39, 39.94, "north", "明清", "government", 82, "110000", "北京", "王府建筑在明清都城中连接贵族居住与行政礼序。"),
  point("forbidden-city", "北京故宫", 116.397, 39.918, "north", "明清", "palace", 99, "110000", "北京", "明清宫城集大成者，通过中轴和院落层级强化皇权秩序。"),
  point("shenyang-palace", "沈阳故宫", 123.45, 41.8, "north", "明清", "palace", 86, "210000", "辽宁沈阳", "满族宫廷建筑与中原制度空间结合，形成独特宫殿形态。"),
  point("nanjing-palace", "南京故宫", 118.8, 32.04, "jiangnan", "明清", "palace", 84, "320000", "江苏南京", "明初宫城遗址保留了早期都城营建与皇宫布局的重要线索。"),
  point("lugou-bridge", "卢沟桥", 116.22, 39.86, "north", "明清", "bridge", 91, "110000", "北京", "联拱石桥在工程与文化记忆层面都已成为中国古桥代表。"),
  point("yellow-river-iron-bridge", "黄河铁桥", 103.82, 36.06, "northwest", "明清", "bridge", 79, "620000", "甘肃兰州", "连接近代工程技术和黄河跨越传统，是桥梁史后段的重要补充。"),
];

export const supportedProvinceCodes = [
  "110000",
  "130000",
  "140000",
  "210000",
  "320000",
  "330000",
  "340000",
  "350000",
  "410000",
  "440000",
  "610000",
  "620000",
];
