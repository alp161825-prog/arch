import type { AtlasHeritagePoint } from "@/data/atlasHeritagePoints";
import { buildingOfficialSourcesV2, type BuildingOfficialSource } from "@/data/buildingOfficialSourcesV2";
import { knowledgeDocxModulesById, type KnowledgeDocxModule } from "@/data/knowledgeDocxModules";
import { provinceCodeToName } from "@/data/provinceAtlas";
import { topicCompetitionContents, type TopicCompetitionKey } from "@/data/topicCompetitionContent";
import { resolveUserBuildingImage } from "@/data/userBuildingImageMap";

export type KnowledgeTimelineNode = {
  date: string;
  event: string;
};

export type KnowledgeEntry = {
  id: string;
  name: string;
  topic: TopicCompetitionKey;
  topicTitle: string;
  dynasty: string;
  provinceCode: string;
  provinceName: string;
  location: string;
  summary: string;
  heat: number;
  image: string;
  keywords: string[];
  thesis: string;
  sources: BuildingOfficialSource[];
  docxModules?: KnowledgeDocxModule[];
  detail: {
    typeLabel: string;
    functionDescription: string;
    buildingOverview: string;
    constructionBackground: string;
    featureHighlights: string[];
    spatialPattern: string;
    structureMaterial: string;
    historicalValue: string;
    currentStatus: string;
    viewingPoints: string[];
    eraContext: string;
    chronology: KnowledgeTimelineNode[];
  };
};

type DetailOverride = Partial<KnowledgeEntry["detail"]>;

const topicMap = Object.fromEntries(
  topicCompetitionContents.map(topic => [topic.key, topic] as const),
) as Record<TopicCompetitionKey, (typeof topicCompetitionContents)[number]>;

const normalizeName = (name: string) => name.replace(/[（）()·\s]/g, "");

const findBestImage = (topicKey: TopicCompetitionKey, pointLabel: string, explicitImage?: string) => {
  if (explicitImage) return explicitImage;
  const topic = topicMap[topicKey];
  const normalizedPoint = normalizeName(pointLabel);
  const matchedCase =
    topic.cases.find(item => normalizeName(item.name).includes(normalizedPoint.slice(0, 2))) ??
    topic.cases.find(item => normalizedPoint.includes(normalizeName(item.name).slice(0, 2)));

  return resolveUserBuildingImage(pointLabel, matchedCase?.image ?? topic.heroImage);
};

const enrichKeywords = (topicKey: TopicCompetitionKey, pointLabel: string) => {
  const topic = topicMap[topicKey];
  const base = [topic.title, ...topic.keywords];
  const matchedCase =
    topic.cases.find(
      item => pointLabel.includes(item.name.slice(0, 2)) || item.name.includes(pointLabel.slice(0, 2)),
    ) ?? topic.cases[0];

  return Array.from(new Set([...base, ...(matchedCase?.keywords ?? []), pointLabel]));
};

const topicTypeLabelMap: Record<TopicCompetitionKey, string> = {
  residential: "民居建筑",
  government: "官署建筑",
  palace: "宫殿建筑",
  bridge: "桥梁建筑",
};

const topicFunctionMap: Record<TopicCompetitionKey, string> = {
  residential: "主要服务于居住、家族生活与日常起居，是观察古代生活方式最直接的建筑类型。",
  government: "主要服务于行政办公、政务处理与礼法秩序表达，是国家治理进入空间之后的典型载体。",
  palace: "主要服务于王权礼制、朝会仪典与宫廷生活，是中国古代建筑等级秩序最集中的体现。",
  bridge: "主要服务于跨越河流、连接道路和组织交通，是工程技术与公共空间结合最紧密的建筑类型。",
};

const topicSpatialMap: Record<TopicCompetitionKey, string> = {
  residential: "这类建筑通常围绕院落、厅堂、厢房或聚居单元展开，通过主次分区和路径组织把家庭生活转化为稳定的空间秩序。",
  government: "这类建筑通常围绕仪门、大堂、二堂、后宅等序列展开，通过递进式空间关系强化身份区分和办事程序。",
  palace: "这类建筑通常围绕中轴线、前朝后寝、台基殿庭和层层院落展开，通过轴线和尺度传达最高等级的礼制秩序。",
  bridge: "这类建筑通常围绕桥面、桥墩、券洞、引桥与水系环境展开，通过结构跨越关系把工程受力与交通组织统一起来。",
};

const topicStructureMap: Record<TopicCompetitionKey, string> = {
  residential: "结构上多围绕木构架、围合墙体、院落尺度和气候适应做法展开，重点不在单体炫技，而在生活组织是否稳定有效。",
  government: "结构上更强调轴线秩序和门堂关系，材料与做法服务于空间等级，重点是程序感、秩序感和公共性。",
  palace: "结构上通常体现更高等级的木构体系、台基处理和殿庭尺度，重点是如何通过结构与尺度强化王权象征。",
  bridge: "结构上最重要的是桥型选择、受力路径、桥墩做法和跨越尺度，材料与做法直接决定桥梁能否长期稳定使用。",
};

const topicViewingMap: Record<TopicCompetitionKey, string[]> = {
  residential: [
    "先看院落、房间和厅堂之间的主次关系。",
    "再看采光、通风、围合方式和日常生活路径。",
    "最后看它怎样把家庭秩序和地方环境一起转化为空间形态。",
  ],
  government: [
    "先看从入口到核心厅堂的进入顺序。",
    "再看办公空间与后宅空间怎样分层。",
    "最后看它怎样通过尺度和路径表现行政等级。",
  ],
  palace: [
    "先看中轴线和主要殿宇的排列方式。",
    "再看前朝后寝、门庭广场和院落层级。",
    "最后看台基、尺度和整体格局怎样共同强化王权象征。",
  ],
  bridge: [
    "先看桥型和跨越方式。",
    "再看桥墩、券洞、桥肩和桥面这些关键构件。",
    "最后看它怎样连接道路、水系和区域交通节点。",
  ],
};

const dynastyRangeMap: Record<string, string> = {
  "先秦": "约公元前21世纪至公元前221年",
  "秦汉": "公元前221年至220年",
  "魏晋南北朝": "220年至589年",
  "隋唐": "581年至907年",
  "宋元": "960年至1368年",
  "明清": "1368年至1912年",
};

const chronologyOverrides: Record<string, KnowledgeTimelineNode[]> = {
  "forbidden-city": [
    { date: "1406年", event: "明永乐四年下诏营建紫禁城。" },
    { date: "1420年", event: "宫城基本建成，次年明廷正式迁都北京。" },
    { date: "1925年", event: "故宫博物院成立，宫城转入现代博物馆体系。" },
    { date: "1987年", event: "列入UNESCO世界文化遗产名录。" },
  ],
  "zhaozhou-bridge": [
    { date: "595年", event: "隋开皇十五年开建赵州桥（安济桥）。" },
    { date: "605年", event: "隋大业元年前后基本建成并投入通行。" },
    { date: "1961年", event: "列入第一批全国重点文物保护单位。" },
  ],
  "lugou-bridge": [
    { date: "1189年", event: "金代开始营建卢沟桥。" },
    { date: "1192年", event: "桥梁主体建成，成为燕京西向重要通道。" },
    { date: "1937年", event: "卢沟桥事变发生，桥址成为近代史关键节点。" },
    { date: "1961年", event: "列入第一批全国重点文物保护单位。" },
  ],
  "luoyang-bridge": [
    { date: "1053年", event: "北宋皇祐年间开建洛阳桥。" },
    { date: "1059年", event: "工程基本完成，成为泉州湾关键跨越节点。" },
    { date: "2021年", event: "作为“泉州：宋元中国的世界海洋商贸中心”遗产点列入世界遗产。" },
  ],
  "erlitou-palace": [
    { date: "约公元前1750—前1530年", event: "二里头宫殿区进入早期王权中心营建阶段。" },
    { date: "1959年", event: "二里头遗址启动系统性考古发掘。" },
    { date: "2000年代以来", event: "遗址展示与夏商文明研究持续深化。" },
  ],
  "yinxu-palace": [
    { date: "约公元前14—前11世纪", event: "殷墟宫殿宗庙区形成并持续使用。" },
    { date: "1928年", event: "安阳殷墟开始科学考古发掘，宫殿宗庙区线索逐步清晰。" },
    { date: "2006年", event: "殷墟列入UNESCO世界文化遗产名录。" },
  ],
  "weiyang-palace": [
    { date: "公元前200年前后", event: "西汉都城长安宫城体系确立，未央宫成为核心宫殿区。" },
    { date: "西汉时期", event: "作为国家政治礼仪核心空间长期使用。" },
    { date: "20世纪后半叶以来", event: "遗址考古与保护展示持续推进。" },
  ],
  "epang-palace": [
    { date: "公元前3世纪", event: "阿房宫进入秦代大型宫殿营建叙事与遗址形成阶段。" },
    { date: "汉唐以来", event: "作为帝国巨构象征长期进入历史文献与文学记忆。" },
    { date: "20世纪后半叶以来", event: "遗址考古、展示和学术辨析持续展开。" },
  ],
  "daming-palace": [
    { date: "634年", event: "唐太宗时期大明宫开始营建。" },
    { date: "7—9世纪", event: "成为唐帝国核心朝会与政治活动空间之一。" },
    { date: "2014年", event: "作为“丝绸之路：长安—天山廊道路网”遗产点列入世界遗产。" },
  ],
  "huaqing-palace": [
    { date: "唐代中前期", event: "华清宫在骊山温泉区形成离宫体系。" },
    { date: "盛唐时期", event: "宫苑、温泉与山地景观共同构成典型离宫空间。" },
    { date: "20世纪后半叶以来", event: "遗址保护、景区展示与历史研究同步推进。" },
  ],
  "tianjin-bridge": [
    { date: "隋唐时期", event: "天津桥作为洛阳都城核心桥梁节点形成并完善。" },
    { date: "都城盛期", event: "承担中轴通行与城市水路连接的复合功能。" },
    { date: "20世纪后半叶以来", event: "相关遗址调查与都城复原研究持续推进。" },
  ],
  "guangji-bridge": [
    { date: "1171年", event: "潮州广济桥开始营建。" },
    { date: "宋元至明清", event: "桥体在长期维护中形成梁桥与浮桥结合的复合结构特征。" },
    { date: "21世纪以来", event: "作为潮州文化地标持续进行保护修缮与活化展示。" },
  ],
  "tokyo-palace": [
    { date: "960年后", event: "北宋都城东京宫城体系进入成熟发展阶段。" },
    { date: "北宋时期", event: "宫城与繁华都市空间长期共构运行。" },
    { date: "20世纪以来", event: "相关遗址线索通过考古与文献比对持续复原。" },
  ],
  "deshou-palace": [
    { date: "南宋时期", event: "德寿宫在临安城体系中形成并发挥宫廷功能。" },
    { date: "南宋中后期", event: "宫苑空间与江南城市环境高度耦合。" },
    { date: "21世纪以来", event: "遗址考古发掘与数字化展示不断完善。" },
  ],
  "yuan-capital-palace": [
    { date: "1267年后", event: "元大都营建启动，皇宫区随都城骨架同步形成。" },
    { date: "元代", event: "作为北方政治中心宫城持续使用。" },
    { date: "明清至今", event: "其空间格局对后续北京皇城体系产生深远影响。" },
  ],
  "shangdu-daan": [
    { date: "元代", event: "元上都宫城体系形成，大安阁成为高等级殿阁节点。" },
    { date: "13—14世纪", event: "服务上都驻跸与礼仪活动，体现多都城统治格局。" },
    { date: "2012年", event: "元上都遗址列入UNESCO世界文化遗产名录。" },
  ],
  "siheyuan": [
    { date: "元明时期", event: "北京院落住宅逐步形成较稳定的街巷-院落体系。" },
    { date: "清代", event: "四合院在平面秩序与家族礼序表达上达到成熟形态。" },
    { date: "20世纪以来", event: "历史街区保护与院落更新实践持续推进。" },
  ],
  "huizhou-residence": [
    { date: "明代中后期", event: "徽州民居在宗族与商业背景下形成典型格局。" },
    { date: "清代", event: "马头墙、天井与街巷空间系统进一步成熟。" },
    { date: "20世纪后半叶以来", event: "古村落与传统民居保护体系逐步建立。" },
  ],
  "fujian-tulou": [
    { date: "明清时期", event: "福建土楼进入大规模营建与聚族居住稳定阶段。" },
    { date: "18—19世纪", event: "大型圆楼、方楼体系在闽西南山区持续完善。" },
    { date: "2008年", event: "福建土楼列入UNESCO世界文化遗产名录。" },
  ],
  "gongwangfu": [
    { date: "1777年", event: "府邸前身由和珅营建，形成高等级王府格局基础。" },
    { date: "1851年后", event: "赐予恭亲王奕䜣，成为清代王府代表性实例。" },
    { date: "20世纪后半叶以来", event: "文物修缮、博物馆化展示与公众开放持续推进。" },
  ],
  "shenyang-palace": [
    { date: "1625年后", event: "后金政权在盛京营建宫城，形成早期核心殿区。" },
    { date: "清初阶段", event: "宫城布局体现满族传统与中原宫殿制度并行特征。" },
    { date: "2004年", event: "作为“明清皇家宫殿”扩展项目列入世界遗产体系。" },
  ],
  "nanjing-palace": [
    { date: "14世纪后期", event: "明初南京宫城营建展开，形成早期都城皇宫格局。" },
    { date: "15世纪初", event: "都城北迁后，遗址成为研究明初宫殿制度的关键线索。" },
    { date: "20世纪以来", event: "遗址调查与展示阐释持续推进。" },
  ],
  "yellow-river-iron-bridge": [
    { date: "1907—1909年", event: "兰州黄河铁桥建成，进入近代钢结构桥梁阶段。" },
    { date: "20世纪", event: "长期承担兰州黄河南北岸核心交通功能。" },
    { date: "21世纪以来", event: "作为城市工业遗产与历史地标持续保护利用。" },
  ],
};

const dynastyResearchNodeMap: Record<string, { date: string; event: (name: string, location: string) => string }> = {
  "先秦": {
    date: "20世纪50年代以来",
    event: (name, location) => `${name}相关遗址在${location}持续开展考古调查与分期研究，早期建筑线索逐步明确。`,
  },
  "秦汉": {
    date: "20世纪后半叶以来",
    event: (name, location) => `${name}相关遗址在${location}进入系统考古、测绘与保护展示阶段。`,
  },
  "魏晋南北朝": {
    date: "20世纪后半叶以来",
    event: (name, location) => `${name}通过考古发现与文献互证，在${location}的历史空间关系不断被复原。`,
  },
  "隋唐": {
    date: "20世纪后半叶以来",
    event: (name, location) => `${name}在${location}进入遗址公园化、城市遗产化与公共阐释并行阶段。`,
  },
  "宋元": {
    date: "20世纪后半叶以来",
    event: (name, location) => `${name}相关遗址在${location}持续开展保护修缮与历史景观复原研究。`,
  },
  "明清": {
    date: "20世纪以来",
    event: (name, location) => `${name}在${location}逐步纳入文物保护、活化利用与公众教育体系。`,
  },
};

const topicChronologyNodeMap: Record<string, { date: string; event: (name: string, location: string) => string }> = {
  residential: {
    date: "形成至成熟阶段",
    event: (name, location) => `${name}在${location}围绕家族组织、气候适应与院落生活逐步形成稳定居住模式。`,
  },
  government: {
    date: "制度化阶段",
    event: (name, location) => `${name}在${location}通过门、院、堂、宅的序列化组织，承载行政流程与礼法秩序。`,
  },
  palace: {
    date: "都城核心阶段",
    event: (name, location) => `${name}在${location}通过中轴、殿庭与层级院落强化王权中心与礼制表达。`,
  },
  bridge: {
    date: "交通枢纽阶段",
    event: (name, location) => `${name}在${location}持续承担跨越水系与组织道路联系的关键基础设施功能。`,
  },
};

const defaultOfficialSources: BuildingOfficialSource[] = [
  {
    label: "国家文物局",
    type: "政府平台",
    url: "https://www.ncha.gov.cn/",
    note: "国家层面的文物政策、保护名录和专题信息入口。",
  },
  {
    label: "中国政府网",
    type: "政府平台",
    url: "https://www.gov.cn/",
    note: "可检索中央层面的政策、公报与权威发布。",
  },
];

const worldHeritageSourceById: Record<string, BuildingOfficialSource> = {
  "forbidden-city": {
    label: "UNESCO 世界遗产：明清皇家宫殿",
    type: "开放信息",
    url: "https://whc.unesco.org/en/list/439/",
    note: "故宫（北京）作为明清皇家宫殿核心组成的世界遗产信息。",
  },
  "shenyang-palace": {
    label: "UNESCO 世界遗产：明清皇家宫殿",
    type: "开放信息",
    url: "https://whc.unesco.org/en/list/439/",
    note: "沈阳故宫作为明清皇家宫殿扩展项目信息入口。",
  },
  "yinxu-palace": {
    label: "UNESCO 世界遗产：殷墟",
    type: "开放信息",
    url: "https://whc.unesco.org/en/list/1114/",
    note: "殷墟遗址的世界遗产信息与价值说明。",
  },
  "fujian-tulou": {
    label: "UNESCO 世界遗产：福建土楼",
    type: "开放信息",
    url: "https://whc.unesco.org/en/list/1113/",
    note: "福建土楼的遗产价值、组成与保护信息。",
  },
  "luoyang-bridge": {
    label: "UNESCO 世界遗产：泉州（洛阳桥点位）",
    type: "开放信息",
    url: "https://whc.unesco.org/en/list/1561/",
    note: "洛阳桥作为泉州世界遗产构成点之一的官方信息。",
  },
  "shangdu-daan": {
    label: "UNESCO 世界遗产：元上都遗址",
    type: "开放信息",
    url: "https://whc.unesco.org/en/list/1389/",
    note: "元上都遗址的世界遗产价值与边界信息。",
  },
};

const sourceAliasMap: Record<string, string> = {
  "weiyang-palace": "weiyang",
  "xianyang-palace": "weiyang",
  "epang-palace": "weiyang",
  "changle-palace": "weiyang",
  "jianzhang-palace": "weiyang",
  "changan-office": "weiyang",
  "qin-weiqiao": "weiyang",
  "han-baqiao": "weiyang",
  "seven-star-bridge": "weiyang",
  "sui-baqiao": "weiyang",
  "daxing-palace": "daming",
  "daming-palace": "daming",
  "huaqing-palace": "daming",
  "zhaozhou-bridge": "zhaozhou-bridge",
  "lugou-bridge": "lugou-bridge",
  "huizhou-residence": "huizhou-residence",
  "fujian-tulou": "fujian-tulou",
};

const resolveEntrySources = (entryId: string): BuildingOfficialSource[] => {
  const aliasKey = sourceAliasMap[entryId];
  const specific = buildingOfficialSourcesV2[entryId] ?? (aliasKey ? buildingOfficialSourcesV2[aliasKey] : undefined) ?? [];
  const heritage = worldHeritageSourceById[entryId] ? [worldHeritageSourceById[entryId]] : [];
  const all = [...specific, ...heritage, ...defaultOfficialSources];
  const seen = new Set<string>();

  return all.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
};

const buildEntryChronology = (point: AtlasHeritagePoint): KnowledgeTimelineNode[] => {
  const explicit = chronologyOverrides[point.id];
  if (explicit) return explicit;

  const dynastyRange = dynastyRangeMap[point.dynasty] ?? `${point.dynasty}时期`;
  const researchNode =
    dynastyResearchNodeMap[point.dynasty] ??
    {
      date: "20世纪以来",
      event: (name: string, location: string) => `${name}在${location}逐步进入文物调查、研究和保护展示阶段。`,
    };
  const topicNode =
    topicChronologyNodeMap[point.topic] ??
    {
      date: "功能演化阶段",
      event: (name: string, location: string) => `${name}在${location}持续适应时代需求并形成可识别的建筑类型特征。`,
    };

  return [
    { date: dynastyRange, event: `${point.label}的主要营建与使用历史时段。` },
    { date: topicNode.date, event: topicNode.event(point.label, point.location) },
    { date: researchNode.date, event: researchNode.event(point.label, point.location) },
    { date: "21世纪以来", event: `${point.label}在遗产传播、数字化展示或公共教育中的可见度持续提升。` },
  ];
};

const detailOverrides: Record<string, DetailOverride> = {
  "forbidden-city": {
    buildingOverview:
      "北京故宫是一处位于北京的宫殿建筑样本，年代定位在明清。它是中国古代宫殿建筑成熟阶段的代表，也是中轴秩序、院落层级与国家礼制表达最完整的实物载体。",
    constructionBackground:
      "北京故宫建成于明初都城营建完成之后，其形成背景不是单体宫室扩建，而是整座都城围绕王权中心进行制度化规划的结果。到了清代，它又继续沿用并强化了这套礼制空间。",
    featureHighlights: [
      "北京故宫最突出的特征，是整组建筑沿中轴线展开，三大殿、后三宫和层层院落形成极其清晰的尊卑秩序。",
      "它通过高台基、大屋顶、广庭空间与严格门禁，把政治权威、礼仪活动和空间压迫感同时放大。",
      "黄色琉璃瓦、红墙、重檐庑殿等做法，不只是审美选择，也是在视觉上明确“最高等级”的建筑语言。",
    ],
    spatialPattern:
      "理解北京故宫时，最好的切入点是“中轴 + 前朝后寝”。前部以朝会和礼仪为核心，后部以帝后起居为核心，再以门、庭、殿、廊层层推进，形成中国古代宫殿最成熟的空间秩序。",
    structureMaterial:
      "它以高等级木构体系为基础，重点看三件事：一是台基如何抬升殿宇等级，二是斗拱与屋顶如何共同塑造大屋顶形象，三是大殿尺度如何通过柱网与殿庭关系被放大。",
    historicalValue:
      "北京故宫的重要性在于，它不是一座“保存较好的宫殿”而已，而是中国古代国家礼制、政治权威与建筑技术在同一空间中达到高度统一的代表样本。",
    currentStatus:
      "今天的北京故宫仍然是理解中国古代宫殿制度最直接的入口。对公众而言，它让抽象的礼制与等级变得可见；对研究者而言，它则是考察都城营建、木构技术和皇家空间秩序的核心材料。",
  },
  "weiyang-palace": {
    buildingOverview:
      "汉未央宫是一处位于陕西西安的宫殿建筑样本，年代定位在秦汉。它是西汉宫殿制度与都城空间关系最重要的代表之一，也是理解早期帝国宫殿格局的核心案例。",
    constructionBackground:
      "未央宫形成于西汉都城长安营建过程中。它的出现意味着宫殿建筑已经不再只是王权居所，而是帝国政治中心、礼仪中心与都城布局共同组织下的核心区域。",
    featureHighlights: [
      "未央宫最值得注意的是它在都城中所占据的极高地位，显示宫殿与国家权力中心已经被紧密绑定。",
      "从布局逻辑看，它强调主殿、前朝空间和大尺度宫苑的组合，呈现出早期帝国宫殿群的宏大气势。",
      "它在后世宫殿史上的意义，不在于保存最完整，而在于它提供了汉代宫殿制度如何成型的重要证据。",
    ],
  },
  "xianyang-palace": {
    buildingOverview:
      "秦咸阳宫是一处位于陕西咸阳的宫殿建筑样本，年代定位在秦汉。它是秦帝国早期宫殿空间与都城权力中心结合的重要代表，也是理解帝国宫殿如何迅速放大规模的关键案例。",
    constructionBackground:
      "咸阳宫形成于秦帝国统一前后的都城扩张背景中。随着政治中心迅速强化，宫殿不再只是王室居所，而成为统治秩序和国家中心的直观空间表达。",
    featureHighlights: [
      "咸阳宫最值得关注的是它与都城整体关系的紧密程度，宫殿群的出现意味着国家权力已经需要更大尺度的空间容器。",
      "它在布局上强调高位控制与中心聚集，能够帮助用户理解秦代宫殿为何会成为后世大型宫殿群的前奏。",
      "虽然现存实物有限，但它在宫殿史中的意义非常明确：这是帝国宫殿快速扩大尺度的重要起点。",
    ],
  },
  "epang-palace": {
    buildingOverview:
      "阿房宫是一处位于陕西西安的宫殿建筑样本，年代定位在秦汉。它在中国古代建筑史上最重要的意义，不只是“宏大”，而是它集中体现了帝国宫殿在想象尺度和国家叙事中的象征地位。",
    featureHighlights: [
      "阿房宫最鲜明的特征是它在历史叙事中始终与“超大尺度宫殿”联系在一起，这种形象本身就说明宫殿建筑已被赋予极强的国家象征意义。",
      "理解阿房宫时，重点不在于把它当作完整遗存，而在于看它如何代表秦代宫殿扩张和帝国权力表达的极端趋势。",
      "它是知识库里非常适合说明“建筑不仅有实物价值，也有政治想象与文化记忆价值”的案例。",
    ],
  },
  "changle-palace": {
    buildingOverview:
      "长乐宫是一处位于陕西西安的宫殿建筑样本，年代定位在秦汉。它体现了汉代宫殿群并置发展的特点，适合用来说明早期帝国宫殿并非单一核心，而是多宫体系共同构成皇权空间。",
    featureHighlights: [
      "长乐宫最值得关注的是它与未央宫等宫殿之间的关系，用户可以通过它理解汉代宫殿群是如何并置和分工的。",
      "它说明宫殿建筑在秦汉时期已经发展成多中心组合，而不是后世那种高度收束的单轴模式。",
      "在知识库里，它有助于用户看清汉代宫殿制度的复杂性，而不仅是记住一个“主宫殿”名称。",
    ],
  },
  "jianzhang-palace": {
    buildingOverview:
      "建章宫是一处位于陕西西安的宫殿建筑样本，年代定位在秦汉。它体现了汉代宫殿在礼制与景观两方面同时扩展的趋势，是观察宫殿功能由政治中心向综合皇家空间延伸的重要案例。",
    featureHighlights: [
      "建章宫最值得注意的地方，在于它不仅承担宫殿功能，也强化了苑囿与景观组织，使宫殿空间更具综合性。",
      "它说明汉代宫殿并不只是大殿集合，而是开始将居住、礼仪、景观和象征表达组合成更复杂的皇家体系。",
      "理解建章宫，有助于用户看懂宫殿建筑为何会从“中心殿堂”走向“综合宫苑”。",
    ],
  },
  "daming-palace": {
    buildingOverview:
      "唐大明宫是一处位于陕西西安的宫殿建筑样本，年代定位在隋唐。它是盛唐帝国王权、朝会礼仪和都城视线关系整合程度最高的宫殿案例之一。",
    constructionBackground:
      "大明宫的形成与唐代国家实力上升、都城秩序成熟以及宫殿功能扩展直接相关。它不是简单替代旧宫，而是盛唐政治中心转移和礼制升级后的空间结果。",
    featureHighlights: [
      "大明宫最鲜明的特征，是宫殿群与城市地势、视线和朝会序列结合得极为紧密。",
      "含元殿等核心殿宇利用高台与开阔前庭形成强烈的国家仪式感，这种气势是宫殿专题里非常有表现力的一点。",
      "它不仅体现礼制秩序，也体现唐代宫殿建筑在规模、组织和景观关系上的成熟。",
    ],
  },
  "erlitou-palace": {
    buildingOverview:
      "二里头宫殿区是一处位于河南洛阳的宫殿建筑样本，年代定位在先秦。它的重要性在于为中国早期王权建筑、宫殿布局和中轴组织提供了极早的实物线索。",
    constructionBackground:
      "二里头宫殿区形成于中国早期王权中心逐步稳定的阶段。它背后对应的，不是成熟帝国都城，而是王权、礼制和聚落中心开始集中化之后的最初空间尝试。",
    featureHighlights: [
      "二里头宫殿区的核心价值，在于它让我们看到早期王权中心已经开始出现明确的建筑组织与空间秩序。",
      "它虽然还没有后世宫殿那样成熟的层级体系，但已经显露出轴线、院落与核心建筑集中布置的趋势。",
      "在宫殿史里，它更像一个源头型样本，帮助我们理解后世宫殿制度不是突然出现，而是有长期积累过程。",
    ],
    historicalValue:
      "二里头宫殿区的重要性在于，它提供了中国早期宫殿建筑和王权中心空间组织的关键证据。没有这类样本，后世成熟宫殿的形成逻辑就会缺少一个可被观察的起点。",
  },
  "yinxu-palace": {
    buildingOverview:
      "殷墟宫殿宗庙遗址是一处位于河南安阳的宫殿建筑样本，年代定位在先秦。它把王权空间与宗庙祭祀空间并置，显示早期都城中心如何同时承担政治与祭祀功能。",
    constructionBackground:
      "殷墟宫殿宗庙遗址形成于商代都城中心持续强化的背景中。随着祭祀、王权和都城秩序逐步集中，宫殿与宗庙空间被同时组织进了核心区域。",
    featureHighlights: [
      "这处遗址最值得看的，不是单栋建筑，而是宫殿与宗庙相互并置的整体关系。",
      "它说明早期王权空间并不只处理行政事务，而是已经把政治中心和祭祀中心结合成一个整体。",
      "在中国宫殿史上，它是理解礼制空间怎样进入都城核心的关键节点。",
    ],
    historicalValue:
      "殷墟宫殿宗庙遗址的重要性，在于它让用户清楚看见“政治空间”和“祭祀空间”如何在早期都城中被并置和整合。这种关系是理解后世礼制建筑体系的基础。",
  },
  "shenyang-palace": {
    buildingOverview:
      "沈阳故宫是一处位于辽宁沈阳的宫殿建筑样本，年代定位在明清。它的重要性在于展示了满族宫廷传统与中原宫殿制度结合后的特殊形态，是北京故宫之外最值得并列观察的皇家建筑案例。",
    constructionBackground:
      "沈阳故宫形成于清初政权尚未完全入主中原之前，它既承接东北地方政治中心的现实需要，又逐步吸收中原宫殿制度，因此保留了鲜明的过渡特征。",
    featureHighlights: [
      "沈阳故宫最值得关注的是它与北京故宫的差异，它并不完全遵循后来的极致中轴秩序，而保留了更明显的多元布局特征。",
      "它的建筑组合中既能看到清代皇家制度的形成，也能看到早期满族宫廷空间的延续。",
      "在知识库里，它特别适合用作“宫殿制度如何在不同政治阶段调整”的案例。",
    ],
  },
  "nanjing-palace": {
    buildingOverview:
      "南京故宫是一处位于江苏南京的宫殿建筑样本，年代定位在明清。它的重要性不只在遗址本身，更在于它保留了明初都城营建和宫殿格局形成的关键线索。",
    featureHighlights: [
      "南京故宫最值得关注的是它作为早期明代宫殿样本的历史位置，它帮助用户理解北京故宫之前的皇家空间组织逻辑。",
      "它说明明代宫殿制度并非一开始就以北京故宫的成熟状态出现，而是经历了都城转换和布局调整。",
      "在知识库里，它更像一个“源流型案例”，让用户看到成熟宫殿体系形成之前的阶段性面貌。",
    ],
  },
  "zhaozhou-bridge": {
    buildingOverview:
      "赵州桥是一处位于河北赵县的桥梁建筑样本，年代定位在隋唐。它是中国古代石拱桥技术成熟的重要代表，也是桥梁专题里最能说明工程智慧的案例。",
    constructionBackground:
      "赵州桥的形成与隋代交通组织和工程技术提升密切相关。跨越稳定河道、提高通行效率和提升耐久性，是它产生的直接背景。",
    featureHighlights: [
      "赵州桥最值得关注的是敞肩石拱做法，这种处理在保证强度的同时减轻了自重，也有利于洪水期排泄水流。",
      "整座桥的拱券比例、桥肩开孔与桥面关系处理得非常成熟，说明它不是经验拼凑，而是高度成熟的结构设计。",
      "它之所以重要，不只是“保存很早”，而是它把结构、减重、排水和耐久性统一到了一个极高水平。",
    ],
    structureMaterial:
      "读赵州桥时，重点要看主拱、敞肩、小拱和桥墩衔接关系。石材构件通过拱券受力把压力向两侧传递，使桥体在大跨度条件下依旧保持稳定。",
    historicalValue:
      "赵州桥的重要性在于，它是中国古代石拱桥技术成熟的标志性证据。很多关于桥梁工程与古代结构智慧的讲解，都可以从它展开。",
  },
  "lugou-bridge": {
    buildingOverview:
      "卢沟桥是一处位于北京的桥梁建筑样本，年代定位在明清。它既是首都交通节点上的实用桥梁，也是中国古桥中兼具工程价值和文化记忆的代表。",
    featureHighlights: [
      "卢沟桥最鲜明的特征是联拱石桥体系，它通过连续券洞完成稳定跨越。",
      "它不仅承担通行功能，也在都城西向道路体系中占据重要位置，因此具有明显的交通地标意义。",
      "桥上的石狮、桥栏和桥体尺度，使它同时成为工程设施与城市记忆景观。",
    ],
  },
  "luoyang-bridge": {
    buildingOverview:
      "洛阳桥是一处位于福建泉州的桥梁建筑样本，年代定位在宋元。它是中国古代跨海港地区桥梁工程的重要代表，特别适合说明桥梁建筑怎样回应潮汐、水文和区域交通条件。",
    constructionBackground:
      "洛阳桥的形成与泉州港地区的交通联系、海潮环境和商贸发展密切相关。稳定跨越复杂水域，是它诞生的直接工程背景。",
    featureHighlights: [
      "洛阳桥最值得关注的是它在海港型水域环境中对桥基和水流条件的适应做法。",
      "它不是单纯“更长的桥”，而是把地方水文特点转化为工程策略的典型案例。",
      "在桥梁专题里，它能很好地说明南方桥梁技术为何会在水网与港湾环境中发展出不同路径。",
    ],
  },
  "tianjin-bridge": {
    buildingOverview:
      "洛阳天津桥是一处位于河南洛阳的桥梁建筑样本，年代定位在隋唐。它是都城中轴与水陆交通相连接的重要节点，特别适合说明桥梁如何进入城市核心空间。",
    constructionBackground:
      "天津桥形成于隋唐洛阳城高度制度化和都城组织成熟的背景中。它的建造目标不仅是跨越河道，更是把都城主轴、道路系统和水路联系统合起来。",
    featureHighlights: [
      "天津桥最值得注意的是它不只是交通设施，而是都城空间结构中的核心节点。",
      "它说明在隋唐时期，桥梁已经能够承担城市景观、礼仪通道和交通组织的复合功能。",
      "理解天津桥时，重点是看“桥与都城”而不是只看桥本身。",
    ],
    historicalValue:
      "洛阳天津桥的重要性，在于它让用户看到桥梁建筑如何直接参与都城空间秩序的建立。它既是工程设施，也是都城主轴延伸到水域上的关键节点。",
  },
  "guangji-bridge": {
    buildingOverview:
      "广济桥是一处位于广东潮州的桥梁建筑样本，年代定位在宋元。它以梁桥与浮桥结合的复合结构著称，是桥梁专题里最能体现“因地制宜”工程智慧的案例之一。",
    featureHighlights: [
      "广济桥最鲜明的特点是复合桥型，它并不执着于单一结构，而是根据潮汐、水道和通航条件组合不同跨越方式。",
      "它既是交通设施，也是潮州城市形象的重要组成部分，因此在功能与景观两方面都很突出。",
      "理解广济桥时，重点是看桥梁如何对真实环境作出灵活回应，而不是只追求一种“标准结构”。",
    ],
    structureMaterial:
      "广济桥的关键不是单一构件，而是不同桥段结构如何协同工作。阅读它时，应重点关注固定桥段与可变桥段之间的关系，以及这种复合做法怎样适应水文变化。",
  },
  "yellow-river-iron-bridge": {
    buildingOverview:
      "黄河铁桥是一处位于甘肃兰州的桥梁建筑样本，年代定位在明清之后的近代转型阶段。它是知识库中连接古代桥梁传统与近代工程技术的重要补充案例。",
    featureHighlights: [
      "黄河铁桥最值得关注的是它所使用的材料与结构逻辑已经明显不同于传统木石桥梁。",
      "它说明桥梁专题并不止于传统形式，还可以帮助用户看到古代工程传统怎样与近代技术发生衔接。",
      "在整个知识库中，它承担的是桥梁史后段补充节点的作用，让时间链条更完整。",
    ],
  },
  "fujian-tulou": {
    buildingOverview:
      "福建土楼是一处位于福建龙岩的民居建筑样本，年代定位在明清。它以大型夯土群居建筑的形式，把居住、聚族和防御统一到一个整体之中。",
    constructionBackground:
      "福建土楼的形成与闽西山区地形、宗族聚居传统和安全需求直接相关。它不是单户住宅扩大的结果，而是共同体生活方式推动下形成的特殊居住类型。",
    featureHighlights: [
      "福建土楼最值得关注的是整体围合形态，它通过厚重外墙和向心型内部空间构成强烈的共同体秩序。",
      "它的核心不在单体房间，而在整座楼如何同时容纳居住、储藏、祭祀、防御和公共活动。",
      "土楼说明民居并不一定是分散小尺度建筑，也可以是高度组织化的大型聚族空间。",
    ],
    spatialPattern:
      "理解福建土楼时，最好先看外圈围护与内圈公共空间的关系。它通过外实内虚的组织方式，一边提供防御，一边形成共享院落和共同生活核心。",
  },
  "siheyuan": {
    buildingOverview:
      "北京四合院是一处位于北京的民居建筑样本，年代定位在明清。它是北方院落式住宅最具代表性的类型之一，也是理解家族秩序如何进入居住空间的经典案例。",
    featureHighlights: [
      "北京四合院最鲜明的特征是围合院落与正房尊位，这种关系直接反映了家庭内部的主次秩序。",
      "它在北方气候下通过围合、朝向和院落尺度组织采光、通风与保温，是生活经验长期积累后的成熟形态。",
      "四合院的重要性在于它把家庭礼序、日常生活和城市居住结合得非常清楚，用户一眼就能读懂。",
    ],
  },
  "sanyangzhuang": {
    buildingOverview:
      "三杨庄遗址是一处位于河南安阳的民居建筑样本，年代定位在秦汉。它最重要的意义在于保存了院落、田地与生活路径之间的真实关系，是理解汉代民居生活场景的珍贵实证。",
    constructionBackground:
      "三杨庄遗址能够被今天清晰辨认，与特殊埋藏条件有关。但它所反映的并不是偶然景象，而是汉代地方居民在聚落中组织生产和生活的真实方式。",
    featureHighlights: [
      "三杨庄遗址最值得关注的是它把住宅、院落、道路和周边环境一起保留下来，让用户不只看到房子，还能看到生活整体。",
      "它特别适合说明民居不是孤立单体，而是始终嵌在生产、聚落和家庭组织里的空间单元。",
      "对知识库而言，这是民居专题里非常强的“考古实证型”案例。",
    ],
    historicalValue:
      "三杨庄遗址的重要性，在于它让汉代民居不再停留在文献想象里，而是成为可以被直接观察的生活空间证据。这对民居知识库非常关键。",
  },
  "han-wubi": {
    buildingOverview:
      "汉代坞壁是一处位于河南洛阳的民居建筑样本，年代定位在秦汉。它体现了居住空间与防御需求结合的特点，是理解乱世背景下地方聚居形式的重要案例。",
    featureHighlights: [
      "汉代坞壁最值得关注的是居住与防御的结合，这说明民居建筑并不总是只追求日常舒适，也会受到社会安全环境强烈影响。",
      "它在空间组织上通常更强调围合、控制和内部保护，因此和一般开放型院落形成鲜明对比。",
      "在知识库中，它能很好地说明民居类型为何会因时代局势不同而出现明显差异。",
    ],
    historicalValue:
      "汉代坞壁的重要性，在于它揭示了民居建筑与社会秩序、地方安全之间的真实关系。用户可以通过它看到建筑为什么会因时代压力而改变形态。",
  },
  "huizhou-residence": {
    buildingOverview:
      "徽州明代住宅是一处位于安徽黄山的民居建筑样本，年代定位在明清。它通过粉墙黛瓦、马头墙和天井系统形成极强的地域识别度，是江南民居的重要代表。",
    featureHighlights: [
      "徽州住宅最值得关注的是天井与院落的关系，它既服务采光通风，也组织了家庭活动的核心界面。",
      "马头墙、街巷和宅院共同构成连续的空间景观，这让徽州民居不是孤立单体，而是街区整体的一部分。",
      "它的重要性在于把江南环境、宗族文化和商业社会背景共同转化成了一种高度成熟的地方住宅样式。",
    ],
  },
  "yaodong": {
    buildingOverview:
      "窑洞是一处位于陕西延安的民居建筑样本，年代定位在明清延续阶段。它最值得关注的地方，是直接利用黄土高原地形形成居住空间，充分体现了因地制宜的建筑智慧。",
    featureHighlights: [
      "窑洞最鲜明的特征是依托黄土坡地或塬面开掘形成居住空间，这种做法让建筑和地形几乎融为一体。",
      "它在保温、节材和施工效率上都有很强优势，因此不是“简陋住宅”，而是高度适应环境的成熟居住类型。",
      "在民居专题里，窑洞非常适合说明建筑形式并不是审美偏好决定的，而是由环境条件强烈推动的。",
    ],
  },
  "yikeyin": {
    buildingOverview:
      "一颗印是一处位于云南昆明的民居建筑样本，年代定位在明清。它以紧凑院落和平面组织著称，是西南地区民居空间适应性的代表类型之一。",
    featureHighlights: [
      "一颗印最值得关注的是它整体尺度紧凑，但院落和房间关系依然非常清楚。",
      "它说明西南地区民居并不是简单复制北方院落，而是在气候、地形和地方生活方式影响下形成了自己的组织逻辑。",
      "在民居知识条目中，它有助于把用户视线从北方和江南延伸到西南地方样式。",
    ],
  },
  "kaifeng-fu": {
    buildingOverview:
      "北宋开封府是一处位于河南开封的官署建筑样本，年代定位在宋元。它是都城地方治理与官署空间关系最具代表性的案例之一。",
    featureHighlights: [
      "开封府最值得关注的是它与都城生活的紧密关系，它不是孤立官署，而是深度嵌入东京城治理体系中的节点。",
      "作为地方行政机构，它既要承担政务处理，也要保持官署应有的程序感和权力秩序。",
      "它的重要性在于让用户看到，官署建筑并不只属于中央，也能在城市生活中扮演非常真实的治理角色。",
    ],
  },
  "huozhou-office": {
    buildingOverview:
      "霍州署大堂是一处位于山西霍州的官署建筑样本，年代定位在宋元。它的重要性在于现存遗构较清楚，适合直接观察地方官署的大堂空间怎样组织政务活动。",
    featureHighlights: [
      "霍州署大堂最值得关注的是“堂”本身，因为它是地方官署中最核心、最公开的政务空间。",
      "相比抽象的制度文本，这样的现存建筑能让用户直接看到官署尺度、路径和公共性如何被具体化。",
      "在官署专题里，它非常适合用来讲“地方官署建筑的标准性空间逻辑”。",
    ],
  },
  "nanyang-yamen": {
    buildingOverview:
      "南阳府衙是一处位于河南南阳的官署建筑样本，年代定位在明清。它较完整地保留了明清地方官署的院落序列，是理解府县衙署空间逻辑的核心案例。",
    featureHighlights: [
      "南阳府衙最值得关注的是仪门、大堂、二堂和后宅之间的完整递进关系，这套秩序让用户能直观看懂官署的程序逻辑。",
      "它的价值不在宏大，而在完整。正因为保留相对清楚，所以特别适合用来讲地方官署建筑的标准结构。",
      "对知识库而言，它能把“官署”这个抽象类别具体化，让用户看到制度怎样通过建筑被组织出来。",
    ],
  },
  "suiyuan-office": {
    buildingOverview:
      "绥远将军衙署是一处位于内蒙古呼和浩特的官署建筑样本，年代定位在明清。它体现了边疆军政治理建筑的特殊性，是理解官署建筑如何因治理对象不同而发生调整的重要案例。",
    featureHighlights: [
      "绥远将军衙署最值得关注的是它所承担的功能不只属于一般地方行政，而是兼具军政与边疆治理色彩。",
      "这使它在空间上往往既保留官署秩序，又更强调控制与驻防的实际需要。",
      "它在知识库中的价值，是帮助用户理解官署建筑也有明显的区域差异和治理差异。",
    ],
  },
  "tokyo-palace": {
    buildingOverview:
      "北宋东京城皇宫是一处位于河南开封的宫殿建筑样本，年代定位在宋元。它的重要性在于体现了宫城与城市生活高度贴近的状态，是理解宋代宫殿与都城关系的重要案例。",
    constructionBackground:
      "东京城皇宫形成于北宋都城高度繁荣的背景中。与更封闭、更强调纯礼制秩序的宫殿相比，它所在的城市环境更活跃，也让宫城与城市之间的关系显得格外紧密。",
    featureHighlights: [
      "这座宫城最值得关注的是它与城市关系的贴近性，而不是单纯追求孤立的皇权中心感。",
      "它说明宫殿建筑并不总是脱离城市独立存在，宋代宫城与繁华都城之间保持着更复杂的互动关系。",
      "在知识库里，它有助于用户看到“宫殿建筑也会随着城市结构变化而调整”。",
    ],
  },
  "deshou-palace": {
    buildingOverview:
      "南宋德寿宫是一处位于浙江杭州的宫殿建筑样本，年代定位在宋元。它的重要性在于把南宋宫廷空间与江南城市环境联系起来，是观察宫殿地方化和城市化特征的重要案例。",
    featureHighlights: [
      "德寿宫最值得关注的是它与江南城市环境的关系，它不像北方宏大宫城那样强调单纯轴线统摄，而更能体现南方都城中的空间调整。",
      "它说明宫殿建筑并不是固定模板，而会随着地域环境和政治中心变化而出现新的组织方式。",
      "在知识库里，它特别适合作为北京故宫、大明宫之外的差异化宫殿样本。",
    ],
  },
  "yuan-capital-palace": {
    buildingOverview:
      "元大都皇宫是一处位于北京的宫殿建筑样本，年代定位在宋元。它的重要性在于为后来的北京皇城格局提供了关键基础，是观察元代都城政治中心空间的重要案例。",
    constructionBackground:
      "元大都皇宫形成于新的北方政治中心建立过程中。随着都城营建展开，宫殿空间与城市骨架同步成型，为后世北京城的皇家格局奠定了结构基础。",
    featureHighlights: [
      "元大都皇宫最值得关注的是它在北京皇城历史中的“奠基作用”。",
      "它既保留元代都城自身的政治空间特征，也为后世明清北京皇城形成了关键前提。",
      "在知识库里，它适合用来讲都城延续性，而不只是单看某一朝宫殿外观。",
    ],
  },
  "erlitou-dwelling": {
    buildingOverview:
      "二里头遗址半地穴式房屋是一处位于河南洛阳的民居建筑样本，年代定位在先秦。它的重要价值在于保留了中国早期居住形态从半地穴向地面化、院落化演进的关键线索。",
    constructionBackground:
      "这类房屋形成于早期聚落组织逐步稳定的阶段。随着聚落人口增加与生产活动分工，居住空间开始从临时性庇护转向更持久、更可组织的平面结构。",
    featureHighlights: [
      "半地穴处理兼顾了保温与施工效率，反映出早期居民对环境条件的直接回应。",
      "房址与道路、作坊、公共空间的关系，说明“住居”已经嵌入聚落整体，而非孤立单体。",
      "它是理解中国古代住宅起源阶段最直接的考古证据之一。",
    ],
  },
  "zhou-scholar-house": {
    buildingOverview:
      "周代士大夫住宅形制是一处位于陕西宝鸡的官署前史样本，年代定位在先秦。它的重要性在于展示礼制等级如何先进入“贵族居住空间”，再影响后来的官署与公共建筑秩序。",
    constructionBackground:
      "西周礼制逐步成型后，住宅已不只是生活容器，而成为身份秩序的空间表达。院落分区、门内外层级、主次方位都开始具有制度含义。",
    featureHighlights: [
      "空间主次与尊卑关系被明确编码进平面组织，是后世官式建筑秩序的前奏。",
      "它体现了“礼”如何从文本进入建造实践，形成可被观看和使用的空间规则。",
      "对官署专题而言，这类样本有助于解释“为什么官署会是那样的序列”。",
    ],
  },
  "shang-bridge": {
    buildingOverview:
      "商代拒桥是一处位于河南郑州的桥梁建筑样本，年代定位在先秦。它用于说明早期桥梁在军事防御与交通跨越之间的双重起源。",
    constructionBackground:
      "先秦城址常见壕沟、水道与城门防御体系并置，桥梁首先服务于“可控通行”。在这种背景下，桥既是交通设施，也是城防系统的一部分。",
    featureHighlights: [
      "桥位与城门、壕沟关系紧密，反映了早期城防逻辑。",
      "结构形态相对朴素，但已经出现明确的“跨越-控制”工程思路。",
      "它有助于理解中国桥梁技术并非只从民用交通单线发展。",
    ],
  },
  "weihe-float": {
    buildingOverview:
      "周文王渭河浮桥是一处位于陕西西安的桥梁建筑样本，年代定位在先秦。它代表以舟船、缆索和桥面组合完成大水域临时或半固定跨越的早期技术路径。",
    constructionBackground:
      "渭河流域是早期政治与交通核心区，季节性水文变化明显。浮桥方案能够在较低材料成本下快速恢复通行，满足军政调度与区域联系需求。",
    featureHighlights: [
      "以“可拼装、可维护”的跨越策略应对复杂水文，是浮桥体系的核心优势。",
      "它揭示了早期桥梁技术的工程取向：先解决通行，再逐步追求耐久。",
      "在桥梁演进链条中，浮桥是理解后续固定桥发展的重要参照。",
    ],
  },
  "pujin-float": {
    buildingOverview:
      "蒲津渡浮桥是一处位于山西永济的桥梁建筑样本，年代定位在先秦传统延续段。它是黄河大水面跨越体系中的典型节点，长期承载关中与河东之间的交通联系。",
    constructionBackground:
      "黄河渡口通行需求长期稳定，但水流、泥沙与汛期变化剧烈。浮桥与渡运的结合，成为古代大河跨越最现实的工程方案之一。",
    featureHighlights: [
      "跨越对象是大河而非城市内河，因此工程组织与维护难度显著更高。",
      "桥渡一体化模式强调季节适配与持续养护，体现古代交通治理能力。",
      "它说明“古代大桥”不只有石拱路径，也有成熟的浮桥系统。",
    ],
  },
  "changan-office": {
    buildingOverview:
      "西汉长安城中央官署遗址是一处位于陕西西安的官署建筑样本，年代定位在秦汉。它是中央行政机构空间化的重要证据，显示帝国治理如何依赖成体系的办公建筑群。",
    constructionBackground:
      "统一帝国建立后，中央机构规模扩张，官署需要从临时性场所转向标准化、制度化空间，以承载文书处理、朝会协同和官员日常办公。",
    featureHighlights: [
      "遗址层面可观察到官署区位与宫城、道路体系之间的紧密关系。",
      "建筑群并非单堂单院，而是围绕行政流程形成复合布局。",
      "它是理解秦汉“制度-都城-建筑”联动关系的核心材料。",
    ],
  },
  "quefei-hall": {
    buildingOverview:
      "东汉却非殿是一处位于河南洛阳的官署/宫廷政务样本，年代定位在秦汉。它体现了东汉时期宫廷空间与政务活动高度耦合的特征。",
    constructionBackground:
      "东汉洛阳政治中心成熟后，宫廷内部出现更复杂的仪礼与政务分工。却非殿这类殿堂反映了政治决策空间向精细化发展的趋势。",
    featureHighlights: [
      "它连接“宫廷礼仪”与“实际政务”两种功能，而非单一礼制建筑。",
      "在空间层级上体现了进入控制与身份区分逻辑。",
      "可作为汉魏制度空间连续演进的重要观察点。",
    ],
  },
  "qin-weiqiao": {
    buildingOverview:
      "秦渭桥是一处位于陕西西安的桥梁建筑样本，年代定位在秦汉。它是都城与渭河北岸通道体系中的关键跨越节点。",
    constructionBackground:
      "秦汉都城扩张使渭河两岸通行需求显著上升，桥梁建设不再是局部工程，而成为都城交通骨架的组成部分。",
    featureHighlights: [
      "桥位服务于都城主通道，体现“桥与城市主轴”关系。",
      "结构与交通功能直接挂钩，强调稳定通行与组织效率。",
      "它有助于理解秦汉桥梁在国家交通体系中的地位。",
    ],
  },
  "han-baqiao": {
    buildingOverview:
      "汉霸桥是一处位于陕西西安的桥梁建筑样本，年代定位在秦汉。它兼具交通节点与都城东向门户意象，是长安外向联系的重要桥梁案例。",
    constructionBackground:
      "随着汉长安对外道路体系完善，灞水跨越成为都城运行的必要条件。桥梁不仅保障物流与出行，也参与都城景观与礼仪路径组织。",
    featureHighlights: [
      "作为都城出入口节点，桥梁功能超出单纯跨越。",
      "桥与道路、驿传系统联动，体现古代交通网络化趋势。",
      "在文化记忆中长期高频出现，说明其社会识别度极高。",
    ],
  },
  "seven-star-bridge": {
    buildingOverview:
      "西汉七星桥是一处位于陕西西安的桥梁建筑样本，年代定位在秦汉。它用于说明汉代桥梁在工程实用之外，已经具备较强景观与城市叙事属性。",
    constructionBackground:
      "汉代都城周边河网跨越需求持续增长，桥梁建设逐步走向多样化。七星桥类案例反映了结构、路径和城市记忆并行发展的阶段特征。",
    featureHighlights: [
      "桥名与地方记忆结合，显示桥梁的文化地标属性。",
      "桥体位置多与道路节点重合，兼具交通与识别功能。",
      "是理解汉代“工程设施景观化”的代表线索之一。",
    ],
  },
  "sandian-bridge": {
    buildingOverview:
      "三殿汉代古桥是一处位于河南洛阳的桥梁建筑样本，年代定位在秦汉。它提供了汉代地方桥梁施工与交通组织的实物证据。",
    constructionBackground:
      "汉代洛阳及周边道路系统扩展后，区域性桥梁承担了连接聚落、城址与生产区的基础功能，成为地方交通网络中的关键设施。",
    featureHighlights: [
      "遗存价值在于可用于识别早期桥梁构造方式与桥位选择逻辑。",
      "桥梁与周边道路关系清晰，能够还原地方交通组织状态。",
      "它补足了“都城名桥之外”普通桥梁的历史样本。",
    ],
  },
  "aristocrat-house": {
    buildingOverview:
      "舍宅为寺的贵族住宅是一处位于江苏南京的民居转化样本，年代定位在魏晋南北朝。它记录了贵族宅第向佛寺空间转换的历史过程，是城市空间功能变迁的重要证据。",
    constructionBackground:
      "南朝时期宗教活动活跃，建康城中出现大量“以宅改寺”现象。既有高等级宅院因区位与尺度优势，被重新纳入宗教与公共活动体系。",
    featureHighlights: [
      "同一空间由私宅转为宗教建筑，体现城市功能重组。",
      "原有院落与礼序仍在一定程度上影响后续寺院布局。",
      "它非常适合解释“建筑类型并非固定不变”。",
    ],
  },
  "taiji-hall": {
    buildingOverview:
      "汉魏洛阳城太极殿是一处位于河南洛阳的官署/宫廷核心样本，年代定位在魏晋南北朝。它是该时期政治仪礼与宫城秩序的关键节点建筑。",
    constructionBackground:
      "洛阳作为政治中心延续使用，宫廷核心殿堂不断调整以适配制度变化。太极殿体现了汉魏制度过渡期对核心礼仪空间的再组织。",
    featureHighlights: [
      "它不是孤立大殿，而是整套宫城秩序中的核心控制点。",
      "礼仪活动与政务活动在此高度交叠，体现制度复合性。",
      "可作为理解魏晋时期政治空间转型的重要样本。",
    ],
  },
  "jiankang-palace": {
    buildingOverview:
      "六朝建康宫是一处位于江苏南京的宫殿建筑样本，年代定位在魏晋南北朝。它展示了江南都城宫殿体系在多朝更替中的持续调整与重构。",
    constructionBackground:
      "建康长期作为南朝政治中心，宫城布局在承续北方制度框架的同时，不断适应江南城市地形与水系环境，形成差异化宫殿组织逻辑。",
    featureHighlights: [
      "宫殿空间与城市关系更加紧密，体现都城“在地化”趋势。",
      "多朝沿用与改造叠加，使其成为观察制度连续性的理想案例。",
      "对比北方宫城，它能突出魏晋南朝宫殿的地域特征。",
    ],
  },
  "traveler-bridge": {
    buildingOverview:
      "洛阳旅人桥是一处位于河南洛阳的桥梁建筑样本，年代定位在魏晋南北朝。它常被用于讨论早期拱桥发展线索，是桥梁史中的过渡节点案例。",
    constructionBackground:
      "魏晋南北朝交通恢复与城市联系增强，桥梁工程在木梁、浮桥之外探索更稳定的跨越形式。旅人桥相关记载反映了这一技术演进背景。",
    featureHighlights: [
      "其学术价值高于遗存完整度，重点在技术史线索意义。",
      "可与后世成熟拱桥对照，观察结构思路如何演进。",
      "有助于用户理解桥梁技术发展的连续性而非跳跃性。",
    ],
  },
  "duyu-float": {
    buildingOverview:
      "杜预浮桥是一处位于湖北武汉的桥梁建筑样本，年代定位在魏晋南北朝。它代表军事与交通双重需求下的浮桥工程实践。",
    constructionBackground:
      "南北对峙与区域军事调度强化了快速跨江需求。浮桥可在短期内建立稳定通道，是当时最具现实性的组织方案之一。",
    featureHighlights: [
      "强调机动性与通行效率，体现战时工程思维。",
      "浮桥方案与水文条件紧密绑定，维护体系复杂。",
      "是理解魏晋南北朝交通军事化特征的重要案例。",
    ],
  },
  "chang-an-lifang": {
    buildingOverview:
      "隋唐长安城里坊住宅是一处位于陕西西安的民居建筑样本，年代定位在隋唐。它是“礼制化城市网格”如何落实到居民日常空间的代表案例。",
    constructionBackground:
      "里坊制度成熟后，住宅不再自由散布，而被纳入严格的坊里边界与道路系统。居住组织与城市管理制度形成高度耦合。",
    featureHighlights: [
      "住宅形态与城市网格同步，体现制度先行的空间组织逻辑。",
      "坊门、街巷与宅院关系清晰，便于理解都城日常治理。",
      "它让用户看到“宏观都城制度”如何作用到微观居住层面。",
    ],
  },
  "dunhuang-courtyard": {
    buildingOverview:
      "敦煌壁画院落是一处位于甘肃敦煌的民居图像样本，年代定位在隋唐。它通过壁画保存了大量院落、屋顶和生活场景信息，是研究隋唐民居的重要图像证据。",
    constructionBackground:
      "实物民居往往难以完整保存，敦煌壁画成为补足建筑史空白的关键材料。画面中的院落与构件组合反映了当时可被识别的住宅类型。",
    featureHighlights: [
      "图像证据能还原居住空间与日常活动关系。",
      "可与考古实物互证，提升民居研究可信度。",
      "是“以图像读建筑史”的典型案例。",
    ],
  },
  "zhengpingfang": {
    buildingOverview:
      "正平坊遗址（含国子监）是一处位于河南洛阳的官署/官学建筑样本，年代定位在隋唐。它显示了坊里制度下教育与政务功能如何嵌入都城结构。",
    constructionBackground:
      "隋唐洛阳城制度化程度高，官学设施与行政网络协同布局。正平坊相关遗址提供了“坊里-官学-政务”复合空间的重要线索。",
    featureHighlights: [
      "官学并非孤立校园，而是都城治理系统的一环。",
      "遗址关系有助于重建隋唐都城功能分区逻辑。",
      "可作为“制度建筑群”而非单体建筑来理解。",
    ],
  },
  "daxing-palace": {
    buildingOverview:
      "隋大兴宫是一处位于陕西西安的宫殿建筑样本，年代定位在隋唐。它是隋唐长安宫殿体系的早期核心，对后续大明宫等体系发展具有基础性意义。",
    constructionBackground:
      "隋代重建都城后，需要一套与新政权秩序匹配的核心宫城。大兴宫在都城骨架形成阶段承担了王权中心空间的组织任务。",
    featureHighlights: [
      "其意义在于“制度奠基”，而不仅是单体建筑存续。",
      "宫城布局与都城道路、坊里系统联动紧密。",
      "是理解隋唐宫殿系统连续性的关键起点之一。",
    ],
  },
  "huaqing-palace": {
    buildingOverview:
      "华清宫是一处位于陕西西安的宫殿建筑样本，年代定位在隋唐。它将温泉资源、山地景观与离宫制度结合，是宫苑型皇家建筑的典型案例。",
    constructionBackground:
      "在隋唐宫廷活动中，离宫承担休养、礼仪和政治活动的复合功能。华清宫依托骊山与温泉形成了区别于都城正宫的空间类型。",
    featureHighlights: [
      "自然地形与宫苑建筑高度耦合，景观组织能力突出。",
      "与都城正宫形成功能互补，体现宫廷空间分层。",
      "是研究“皇家离宫”系统最具代表性的案例之一。",
    ],
  },
  "sui-baqiao": {
    buildingOverview:
      "隋灞桥是一处位于陕西西安的桥梁建筑样本，年代定位在隋唐。它延续并强化了长安东向交通门户的跨越功能，是都城对外联系的重要桥梁节点。",
    constructionBackground:
      "隋唐长安道路系统规模扩大，灞水跨越成为稳定交通的刚性需求。桥梁建设因此兼具城市交通组织与礼仪路径意义。",
    featureHighlights: [
      "桥位与都城主通道关系密切，承担门户型节点功能。",
      "它体现了隋唐时期“桥-路-城”一体化组织特征。",
      "在交通史与城市史叙事中都具有较高辨识度。",
    ],
  },
  "xu-fuma-fu": {
    buildingOverview:
      "北宋许驸马府是一处位于河南开封的民居建筑样本，年代定位在宋元。它反映了北宋高等级府邸如何在繁密城市肌理中组织院落生活与礼序空间。",
    constructionBackground:
      "东京城高密度城市环境与上层居住需求并存，贵族府邸发展出兼顾礼制秩序与城市适应性的复合空间组织方式。",
    featureHighlights: [
      "府邸尺度与城市街巷关系紧密，体现“城宅叠合”特征。",
      "院落层级和功能分区清晰，可读性强。",
      "它有助于补足宋代住宅从普通民居到高等级宅第的谱系。",
    ],
  },
  "houyingfang": {
    buildingOverview:
      "元代后英房遗址是一处位于北京的民居建筑样本，年代定位在宋元。它为研究元大都时期城市住宅形态和街区结构提供了直接考古线索。",
    constructionBackground:
      "元大都作为新建都城，居民区快速成形。后英房遗址反映了都城常住社区在网格化城市中的空间组织方式。",
    featureHighlights: [
      "遗址价值在于可与元代都城格网关系直接对读。",
      "可观察住宅单元与道路界面之间的结构关系。",
      "是北京城市居住史中承上启下的重要证据。",
    ],
  },
  "jishi-residence": {
    buildingOverview:
      "姬氏民居是一处位于山西临汾的民居建筑样本，年代定位在宋元。它体现了北方家族型院落在地方社会中的长期稳定形态。",
    constructionBackground:
      "晋南地区宗族生活与地方营建传统延续性强，民居空间在防护、礼序和日常功能之间形成了相对成熟的平衡。",
    featureHighlights: [
      "院落主次关系明确，便于识别家族生活秩序。",
      "构造做法体现北方材料与气候适应经验。",
      "可作为宋元以来北方院落传统连续性的观察窗口。",
    ],
  },
  "hongqiao": {
    buildingOverview:
      "汴京虹桥是一处位于河南开封的桥梁图像样本，年代定位在宋元。虽以图像文献著称，但它已成为理解宋代桥梁工程与都市商业空间关系的经典案例。",
    constructionBackground:
      "北宋东京商业高度繁荣，桥梁既承担跨河功能，也承担人流组织与市井活动承载功能。虹桥意象正是在这种城市背景下被反复记录。",
    featureHighlights: [
      "案例价值突出在“文献图像可视化了桥梁与城市生活”。",
      "桥上、桥下与沿岸活动一体化，显示复合公共空间属性。",
      "它是知识库中连接工程史与城市社会史的关键节点。",
    ],
  },
  "yingxiang-bridge": {
    buildingOverview:
      "迎祥桥是一处位于浙江杭州的桥梁建筑样本，年代定位在宋元。它代表江南城市水网环境中桥梁与街巷空间协同生长的典型路径。",
    constructionBackground:
      "杭州水网密集，交通依赖桥梁高频连接。迎祥桥这类桥梁的形成反映了城市日常通行、商业流动和滨水空间整合的长期需求。",
    featureHighlights: [
      "桥梁尺度与城市街巷界面适配度高，使用效率强。",
      "兼具通行、观景与地标识别功能，公共性明显。",
      "有助于理解江南“桥城一体”的空间特征。",
    ],
  },
  "shangdu-daan": {
    buildingOverview:
      "元上都大安阁是一处位于内蒙古锡林郭勒的宫殿建筑样本，年代定位在宋元。它体现了元代草原都城体系中的高等级殿阁形态与多中心统治特征。",
    constructionBackground:
      "元代存在大都与上都并行的政治空间结构，上都宫苑需满足季节性驻跸与国家礼仪功能，大安阁因此成为宫城系统中的关键节点建筑。",
    featureHighlights: [
      "案例重点在“多都城体系”下宫殿建筑的角色分配。",
      "草原环境与官式建筑制度在此发生直接耦合。",
      "可用于解释元代宫殿空间与中原传统的异同关系。",
    ],
  },
  "gongwangfu": {
    buildingOverview:
      "恭王府是一处位于北京的官署/王府建筑样本，年代定位在明清。它是清代高等级府第空间组织与园宅结合模式的代表案例。",
    constructionBackground:
      "清代都城王府体系制度完备，府第建筑需同时满足居住、礼仪、接待与管理功能。恭王府在保存完整度与空间层次上具有突出代表性。",
    featureHighlights: [
      "前府后园格局清晰，能够直观阅读王府生活与礼序分层。",
      "建筑群与园林并置，体现贵族空间的复合属性。",
      "是明清都城高等级宅第研究的核心实例之一。",
    ],
  },
  "jiliao-office": {
    buildingOverview:
      "蓟辽督师府是一处位于河北秦皇岛的官署建筑样本，年代定位在明清。它反映了边防重镇军政一体治理在建筑空间上的特殊表达。",
    constructionBackground:
      "明代北方边防压力持续存在，督师机构承担军事调度与地方治理双重任务，官署布局因此更强调指挥效率与防务属性。",
    featureHighlights: [
      "相较一般府县衙署，它更突出军政复合功能。",
      "空间组织呈现“官署秩序 + 边防需求”双重逻辑。",
      "是理解明代边务体系建筑化表达的重要案例。",
    ],
  },
};

const getEraContext = (dynasty: string, location: string) => {
  if (dynasty.includes("先秦")) {
    return `${location}在先秦阶段已经出现与聚落、礼制或交通相关的建筑实践，这类样本有助于理解中国古代建筑从早期形态走向制度化的起点。`;
  }
  if (dynasty.includes("秦汉")) {
    return `${location}在秦汉时期逐步进入统一帝国的空间组织之中，这类建筑反映了制度、都城和交通体系走向成熟之后的典型表达。`;
  }
  if (dynasty.includes("魏晋")) {
    return `${location}在魏晋南北朝时期经历了建筑形制持续过渡，这类样本能帮助理解旧制度空间如何走向新的地域格局。`;
  }
  if (dynasty.includes("隋唐")) {
    return `${location}在隋唐时期进入都城体系、交通网络和礼制空间高度成熟的阶段，这类建筑往往能体现盛期建筑组织方式的代表性。`;
  }
  if (dynasty.includes("宋元")) {
    return `${location}在宋元时期经历了城市发展、区域流通和制度转换，这一阶段尤其适合观察功能与空间的精细化。`;
  }
  if (dynasty.includes("明清")) {
    return `${location}在明清时期形成了高度稳定的建筑形制，这类样本通常能够代表某一类建筑走向成熟后的典型状态。`;
  }
  return `${location}这条建筑样本可以放回其所属朝代的制度、地域与技术背景中理解，从而看清它在建筑演进链条中的位置。`;
};

const buildBuildingOverview = (
  name: string,
  dynasty: string,
  location: string,
  topicKey: TopicCompetitionKey,
) => {
  const typeLabel = topicTypeLabelMap[topicKey];
  const overviewMap: Record<TopicCompetitionKey, string> = {
    residential: `${name}是一处位于${location}的${typeLabel}样本，年代定位在${dynasty}。它最值得关注的，不只是“住人”这一点，而是这座建筑如何把家庭生活、起居路径和地方环境组织成稳定的空间。`,
    government: `${name}是一处位于${location}的${typeLabel}样本，年代定位在${dynasty}。它不是普通办公场所，而是把行政程序、礼法等级和公共治理转化成了可以被直观感受到的空间秩序。`,
    palace: `${name}是一处位于${location}的${typeLabel}样本，年代定位在${dynasty}。它不仅承担朝会和礼制功能，也通过中轴、殿庭和层层院落把王权象征具体化。`,
    bridge: `${name}是一处位于${location}的${typeLabel}样本，年代定位在${dynasty}。它最直接的作用是解决跨越问题，但真正的价值还在于它把结构技术、交通组织和区域联系合在了一座桥上。`,
  };

  return overviewMap[topicKey];
};

const buildConstructionBackground = (
  name: string,
  dynasty: string,
  location: string,
  topicKey: TopicCompetitionKey,
) => {
  const backgroundMap: Record<TopicCompetitionKey, string> = {
    residential: `${name}形成于${dynasty}阶段的${location}，背后通常对应的是地方气候、居住习惯、家族组织和材料条件共同作用后的结果。它之所以会长成今天这样的样子，不是偶然设计，而是长期生活经验沉淀下来的空间答案。`,
    government: `${name}形成于${dynasty}阶段的${location}，背后通常对应的是行政体系、治理需求和礼法秩序的逐步稳定。它的出现说明，当时已经需要通过固定建筑来承载办事流程、权力表达和公共管理。`,
    palace: `${name}形成于${dynasty}阶段的${location}，背后通常对应的是王权中心、都城格局和礼制制度的强化。它不是单一宫室，而是国家形象、政治中心和建筑制度共同推动下的产物。`,
    bridge: `${name}形成于${dynasty}阶段的${location}，背后通常对应的是河流跨越、道路组织和区域交通的现实需求。它的建造往往意味着当地已经需要更稳定、更高效的跨越设施来支撑交流和流通。`,
  };

  return backgroundMap[topicKey];
};

const buildFeatureHighlights = (summary: string, topicKey: TopicCompetitionKey, location: string) => {
  const extraMap: Record<TopicCompetitionKey, string[]> = {
    residential: [
      "从建筑识别上看，这类建筑最值得关注院落、厅堂、厢房和居住单元之间的组合方式，因为这些关系决定了生活秩序是怎样被空间表达出来的。",
      `如果把它放回${location}的环境里观察，还能进一步理解当地气候、材料和聚居方式怎样影响房屋外观与院落尺度。`,
    ],
    government: [
      "从建筑识别上看，这类建筑最值得关注门、院、堂、宅的递进关系，因为这条路径就是办事程序和身份区分的空间化表达。",
      "它的核心特征往往不在装饰，而在路径、层级和视线控制，这些要素共同构成了官署建筑最鲜明的秩序感。",
    ],
    palace: [
      "从建筑识别上看，这类建筑最值得关注中轴线、主要殿宇、开敞广庭和台基关系，因为这些部分决定了整组建筑的尊卑层级。",
      "它往往不会只追求居住实用，而是通过尺度、层级和开阔空间让礼制与国家象征变得可以被感知。",
    ],
    bridge: [
      "从建筑识别上看，这类建筑最值得关注桥型与跨越方式，因为梁、拱或浮桥系统会直接决定它的结构逻辑。",
      "继续往下看时，还要把注意力放在桥墩、券洞、桥肩、桥面等关键构件上，这些部分最能说明它为何能够长期稳定地服务交通。",
    ],
  };

  return [summary, ...extraMap[topicKey]];
};

const buildHistoricalValue = (
  name: string,
  topicKey: TopicCompetitionKey,
  location: string,
  dynasty: string,
) => {
  const typeLabel = topicTypeLabelMap[topicKey];
  return `${name}的重要性并不只在于“它存在过”，而在于它能够帮助我们理解${dynasty}阶段${typeLabel}已经发展到了什么程度。它既是${location}地区的重要样本，也是同类建筑进行横向比较时非常有代表性的参照对象。`;
};

const buildCurrentStatus = (name: string, topicKey: TopicCompetitionKey, summary: string) => {
  const statusMap: Record<TopicCompetitionKey, string> = {
    residential: `${name}在今天的重要意义，首先是帮助用户理解传统居住空间怎样回应真实生活，其次也能为地域建筑、乡土保护和宜居设计提供参照。${summary}`,
    government: `${name}在今天的重要意义，首先是帮助用户理解古代国家治理怎样被空间化，其次也为认识城市公共建筑与制度空间提供了历史视角。${summary}`,
    palace: `${name}在今天的重要意义，首先是帮助用户理解礼制、等级与国家形象如何进入建筑，其次也为认识中国古代最高等级的空间秩序提供核心样本。${summary}`,
    bridge: `${name}在今天的重要意义，首先是帮助用户理解工程技术与公共交通如何在古代结合，其次也为现代基础设施审美与工程精神提供了历史参照。${summary}`,
  };

  return statusMap[topicKey];
};

const getReadableLocation = (location: string) => {
  const compact = location.replace(/\s+/g, "");
  return {
    province: compact.length >= 2 ? compact.slice(0, 2) : location,
    city: compact.length >= 4 ? compact.slice(2) : location,
  };
};

const buildEntryOverview = (
  name: string,
  dynasty: string,
  location: string,
  topicKey: TopicCompetitionKey,
) => {
  const typeLabel = topicTypeLabelMap[topicKey];
  const { city } = getReadableLocation(location);

  const overviewMap: Record<TopicCompetitionKey, string> = {
    residential: `${name}是一处位于${location}的${typeLabel}样本，年代定位在${dynasty}。从建筑本身看，它最值得注意的不是抽象的“民居类型”，而是它如何围绕${city}一带的真实生活组织院落、房间和起居路径，让居住方式直接变成可以被观看的空间形态。`,
    government: `${name}是一处位于${location}的${typeLabel}样本，年代定位在${dynasty}。理解这座建筑时，首先要把它看成一套具体的治理空间，而不是普通房屋，因为门、院、堂、宅之间的前后秩序，本身就在说明古代行政如何被放进建筑。`,
    palace: `${name}是一处位于${location}的${typeLabel}样本，年代定位在${dynasty}。它真正值得看的地方，不只是屋顶和尺度，而是整组建筑如何围绕中轴、殿庭和院落层级展开，把王权、礼制和国家形象落实成一套可以进入和感知的空间系统。`,
    bridge: `${name}是一处位于${location}的${typeLabel}样本，年代定位在${dynasty}。如果把它当成一座具体的桥来看，最重要的不是先记名字，而是去看它采用了什么桥型、怎样完成跨越、怎样把受力逻辑和通行功能组合在同一个结构里。`,
  };

  return overviewMap[topicKey];
};

const buildEntryBackground = (
  name: string,
  dynasty: string,
  location: string,
  topicKey: TopicCompetitionKey,
) => {
  const { province, city } = getReadableLocation(location);

  const backgroundMap: Record<TopicCompetitionKey, string> = {
    residential: `${name}形成于${dynasty}时期的${location}，背后通常对应的是${province}地区长期稳定的居住方式。它之所以会发展成今天这样的布局，不是偶然的形式选择，而是气候、材料、家庭结构和地方生活经验共同塑造出来的结果。`,
    government: `${name}形成于${dynasty}时期的${location}，背后对应的是越来越明确的行政体系和治理需求。也就是说，当时的${city}已经需要一套能够承载办公、礼仪、接见和秩序表达的固定公共建筑，因此才会形成这样的官署空间。`,
    palace: `${name}形成于${dynasty}时期的${location}，背后对应的是王权中心、都城格局和礼制制度的持续强化。它不是孤立长出的一组殿宇，而是整个政治中心成熟之后，围绕国家权力所组织起来的核心宫殿空间。`,
    bridge: `${name}形成于${dynasty}时期的${location}，背后通常对应的是河道跨越、道路组织和区域交通的现实压力。只有当${city}一带已经出现稳定的通行需求，这座桥才会被真正建造，并在后续使用中不断被验证和强化。`,
  };

  return backgroundMap[topicKey];
};

const buildEntryHistoricalValue = (
  name: string,
  topicKey: TopicCompetitionKey,
  location: string,
  dynasty: string,
) => {
  const typeLabel = topicTypeLabelMap[topicKey];
  return `${name}的重要性，不只在于“它保存到了今天”，更在于它能够直接说明${dynasty}阶段的${typeLabel}已经发展到什么程度。把它放进${location}的地方背景里看，它既是区域建筑史的重要样本，也是同类建筑进行横向比较时很有代表性的参照对象。`;
};

const buildEntryCurrentStatus = (name: string, topicKey: TopicCompetitionKey, summary: string) => {
  const statusMap: Record<TopicCompetitionKey, string> = {
    residential: `${name}今天仍然值得看，因为它能让人通过一座具体房屋读懂古人怎样安排家庭生活、院落关系和地方适应方式。${summary}`,
    government: `${name}今天仍然值得看，因为它能把古代国家治理、礼法秩序和公共空间之间的关系讲得非常具体。${summary}`,
    palace: `${name}今天仍然值得看，因为它能把王权、礼制和国家形象是如何进入建筑的这件事讲得非常直观。${summary}`,
    bridge: `${name}今天仍然值得看，因为它能让人一眼理解古代工程技术、交通组织和结构智慧是怎样结合在一座桥上的。${summary}`,
  };

  return statusMap[topicKey];
};

export const buildKnowledgeEntries = (points: AtlasHeritagePoint[]): KnowledgeEntry[] => points.map(point => {
  const topicKey = point.topic as TopicCompetitionKey;
  const topic = topicMap[topicKey];
  const provinceName = provinceCodeToName[point.provinceCode] ?? point.location.slice(0, 2);
  const keywords = enrichKeywords(topicKey, point.label);

  const detail: KnowledgeEntry["detail"] = {
    typeLabel: topicTypeLabelMap[topicKey],
    functionDescription: topicFunctionMap[topicKey],
    buildingOverview: buildEntryOverview(point.label, point.dynasty, point.location, topicKey),
    constructionBackground: buildEntryBackground(point.label, point.dynasty, point.location, topicKey),
    featureHighlights: buildFeatureHighlights(point.summary, topicKey, point.location),
    spatialPattern: topicSpatialMap[topicKey],
    structureMaterial: topicStructureMap[topicKey],
    historicalValue: buildEntryHistoricalValue(point.label, topicKey, point.location, point.dynasty),
    currentStatus: buildEntryCurrentStatus(point.label, topicKey, point.summary),
    viewingPoints: topicViewingMap[topicKey],
    eraContext: getEraContext(point.dynasty, point.location),
    chronology: buildEntryChronology(point),
  };

  return {
    id: point.id,
    name: point.label,
    topic: topicKey,
    topicTitle: topic.title,
    dynasty: point.dynasty,
    provinceCode: point.provinceCode,
    provinceName,
    location: point.location,
    summary: point.summary,
    heat: point.heat,
    image: findBestImage(topicKey, point.label, point.image),
    keywords,
    thesis: topic.thesis,
    sources: resolveEntrySources(point.id),
    docxModules: knowledgeDocxModulesById[point.id],
    detail: {
      ...detail,
      ...detailOverrides[point.id],
      featureHighlights: detailOverrides[point.id]?.featureHighlights ?? detail.featureHighlights,
      viewingPoints: detailOverrides[point.id]?.viewingPoints ?? detail.viewingPoints,
      chronology: detailOverrides[point.id]?.chronology ?? detail.chronology,
    },
  };
});

export const knowledgeTopics = topicCompetitionContents.map(topic => ({
  key: topic.key,
  title: topic.title,
  accent: topic.accent,
  thesis: topic.thesis,
}));

export const buildKnowledgeDynasties = (entries: KnowledgeEntry[]) =>
  Array.from(new Set(entries.map(item => item.dynasty)));

export const buildKnowledgeProvinces = (entries: KnowledgeEntry[]) =>
  Array.from(new Set(entries.map(item => item.provinceName))).sort((a, b) => a.localeCompare(b, "zh-CN"));

export const getKnowledgeEntryById = (entries: KnowledgeEntry[], id?: string) => entries.find(item => item.id === id);

export const getRelatedKnowledgeEntries = (entries: KnowledgeEntry[], entry: KnowledgeEntry, limit = 4) =>
  entries
    .filter(item => item.id !== entry.id)
    .sort((a, b) => {
      const score = (item: KnowledgeEntry) =>
        (item.topic === entry.topic ? 3 : 0) +
        (item.provinceCode === entry.provinceCode ? 2 : 0) +
        (item.dynasty === entry.dynasty ? 1 : 0);
      return score(b) - score(a) || a.name.localeCompare(b.name, "zh-CN");
    })
    .slice(0, limit);
