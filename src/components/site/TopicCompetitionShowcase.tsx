import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CompetitionAiAssistant from "@/components/site/CompetitionAiAssistant";
import imgDaming from "@/assets/buildings/daming.jpg";
import imgErlitou from "@/assets/buildings/erlitou.jpg";
import imgForbiddenCity from "@/assets/buildings/forbidden-city.jpg";
import imgHuizhou from "@/assets/buildings/huizhou.jpg";
import imgQingming from "@/assets/buildings/qingming.jpg";
import imgSummerPalace from "@/assets/buildings/summer-palace.jpg";
import imgTempleHeaven from "@/assets/buildings/temple-heaven.jpg";
import imgWeiyang from "@/assets/buildings/weiyang.jpg";
import imgYinxu from "@/assets/buildings/yinxu.jpg";
import imgYongcheng from "@/assets/buildings/yongcheng.jpg";
import imgYongle from "@/assets/buildings/yongle.jpg";
import imgSuzhouGarden from "@/assets/buildings/suzhou-garden.jpg";
import imgYuandadu from "@/assets/buildings/yuandadu.jpg";
import { resolveUserBuildingImage } from "@/data/userBuildingImageMap";
import type { TopicCompetitionContent } from "@/data/topicCompetitionContent";

type Props = {
  content: TopicCompetitionContent;
};

const residentialPanels = [
  {
    id: "north",
    name: "华北四合院",
    clue: "围合与中轴最鲜明",
    spaces: ["正房", "院心", "东厢房", "西厢房", "倒座", "垂花门"],
    metrics: [
      { label: "围合度", value: 95 },
      { label: "礼序性", value: 92 },
      { label: "保温性", value: 88 },
    ],
    note: "四合院把家族秩序、朝向关系与围合庭院整合为稳定的北方居住模式。",
  },
  {
    id: "jiangnan",
    name: "江南天井住宅",
    clue: "排水与通风更细密",
    spaces: ["门厅", "前厅", "天井", "厢房", "后厅", "后院"],
    metrics: [
      { label: "排水性", value: 95 },
      { label: "采光性", value: 90 },
      { label: "街巷联系", value: 92 },
    ],
    note: "江南住宅更重视天井采光、通风排水与街巷水网之间的空间联系。",
  },
  {
    id: "tulou",
    name: "福建土楼",
    clue: "聚族与防御并重",
    spaces: ["外墙", "环廊", "祖堂", "共享院心", "楼层住屋", "门楼"],
    metrics: [
      { label: "聚族性", value: 96 },
      { label: "防御性", value: 92 },
      { label: "共享性", value: 94 },
    ],
    note: "土楼把宗族聚居、防御需求与日常生活放进同一个完整建筑系统中。",
  },
];

const governmentPanels = [
  {
    id: "screen",
    name: "照壁",
    stage: "礼仪入口",
    summary: "照壁过滤街巷视线，先把民间日常与官署秩序分开。",
    role: "建立礼仪前场与制度边界",
    zone: "ritual",
    functionLabel: "视线过滤、礼仪缓冲、秩序预设",
    opennessLabel: "中高",
    opennessScore: 78,
    powerLabel: "制度边界建立",
    powerScore: 58,
    spaceLabel: "外部礼仪前场",
    spaceScore: 22,
    relatedCases: ["南阳府衙", "西汉长安城中央官署遗址"],
    aiQuestions: ["照壁为什么是官署空间序列的第一步？", "照壁如何把街巷日常转换为官署秩序？", "照壁与大门在制度意义上有什么区别？"],
  },
  {
    id: "gate",
    name: "大门",
    stage: "礼仪入口",
    summary: "大门是权限入口，决定谁可以进入官署程序。",
    role: "完成身份筛选与准入控制",
    zone: "ritual",
    functionLabel: "身份筛选、权限管控、程序入口",
    opennessLabel: "中",
    opennessScore: 66,
    powerLabel: "准入权力",
    powerScore: 70,
    spaceLabel: "礼仪入口阈值",
    spaceScore: 34,
    relatedCases: ["西汉长安城中央官署遗址", "北宋开封府"],
    aiQuestions: ["大门如何体现古代官署的准入制度？", "为什么说大门是空间权力的第一道关卡？", "中央官署与地方府衙的大门功能有何差异？"],
  },
  {
    id: "ceremony-gate",
    name: "仪门",
    stage: "礼仪入口",
    summary: "仪门是礼法门槛，标记从前场礼仪转入正式行政程序。",
    role: "完成礼法程序切换",
    zone: "ritual",
    functionLabel: "礼法切换、程序确认、秩序强化",
    opennessLabel: "中低",
    opennessScore: 54,
    powerLabel: "程序权力",
    powerScore: 76,
    spaceLabel: "内外转换节点",
    spaceScore: 45,
    relatedCases: ["南阳府衙", "正平坊遗址（含国子监）"],
    aiQuestions: ["仪门为什么是官署礼法程序的关键门槛？", "仪门如何强化官署空间的等级感？", "仪门之后为何通常接大堂？"],
  },
  {
    id: "hall",
    name: "大堂",
    stage: "公共行政",
    summary: "大堂承担审理、会见、发布与礼仪展示，是官署最强的公共界面。",
    role: "集中公开审理与政令发布",
    zone: "publicAdmin",
    functionLabel: "公开审理、宣示政令、接触民众",
    opennessLabel: "高",
    opennessScore: 92,
    powerLabel: "公共权力核心",
    powerScore: 95,
    spaceLabel: "权力象征中枢",
    spaceScore: 56,
    relatedCases: ["霍州署大堂", "南阳府衙"],
    aiQuestions: ["大堂为什么是官署权力最集中的空间？", "霍州署大堂体现了哪些制度特征？", "大堂的公开性如何影响地方治理形象？"],
  },
  {
    id: "middle",
    name: "二堂",
    stage: "内部办公",
    summary: "二堂连接公堂与后宅，承接复核议事、签押文书等内部行政。",
    role: "组织内部办公与行政复核",
    zone: "internalAdmin",
    functionLabel: "复核议事、签押文书、内部协同",
    opennessLabel: "低",
    opennessScore: 38,
    powerLabel: "行政执行中枢",
    powerScore: 82,
    spaceLabel: "内部办公后台",
    spaceScore: 74,
    relatedCases: ["南阳府衙", "北宋开封府"],
    aiQuestions: ["二堂在官署流程中承担什么职责？", "二堂如何连接大堂与后宅？", "为什么内部行政需要独立于公开审理空间？"],
  },
  {
    id: "rear",
    name: "后宅",
    stage: "私人生活",
    summary: "后宅是官员居住与后勤空间，维持治理机器的日常运转。",
    role: "承接居住、后勤与私密内务",
    zone: "private",
    functionLabel: "居住后勤、日常内务、治理保障",
    opennessLabel: "低",
    opennessScore: 16,
    powerLabel: "私密支持权力",
    powerScore: 46,
    spaceLabel: "私密生活区",
    spaceScore: 92,
    relatedCases: ["南阳府衙", "蓟辽督师府"],
    aiQuestions: ["后宅为何是前衙后宅制度不可缺少的一环？", "后宅如何支撑官署持续运作？", "后宅的私密性与公共治理之间是什么关系？"],
  },
];

const governmentZonePalette = {
  street: { label: "街巷界面", start: "#6d6458", end: "#8f8173", chip: "rgba(109,100,88,0.16)" },
  ritual: { label: "礼仪入口", start: "#a9442f", end: "#c97555", chip: "rgba(169,68,47,0.16)" },
  publicAdmin: { label: "公共行政", start: "#b97c3f", end: "#d4a661", chip: "rgba(185,124,63,0.16)" },
  internalAdmin: { label: "内部办公", start: "#9c6c41", end: "#b68a63", chip: "rgba(156,108,65,0.16)" },
  private: { label: "私人生活", start: "#7f7668", end: "#9f9482", chip: "rgba(127,118,104,0.2)" },
} as const;

const governmentAxisNodes: Array<{
  id: string;
  name: string;
  zone: keyof typeof governmentZonePalette;
  summary: string;
  panelIndex?: number;
}> = [
  {
    id: "street",
    name: "街巷",
    zone: "street",
    summary: "城市日常空间，尚未进入官署治理程序。",
  },
  {
    id: "screen",
    name: "照壁",
    zone: "ritual",
    summary: "过滤视线，建立官署边界。",
    panelIndex: 0,
  },
  {
    id: "gate",
    name: "大门",
    zone: "ritual",
    summary: "身份筛选与准入控制。",
    panelIndex: 1,
  },
  {
    id: "ceremony-gate",
    name: "仪门",
    zone: "ritual",
    summary: "礼法程序正式开启。",
    panelIndex: 2,
  },
  {
    id: "hall",
    name: "大堂",
    zone: "publicAdmin",
    summary: "公开审理与政令发布核心。",
    panelIndex: 3,
  },
  {
    id: "middle",
    name: "二堂",
    zone: "internalAdmin",
    summary: "复核议事与内部办公层。",
    panelIndex: 4,
  },
  {
    id: "rear",
    name: "后宅",
    zone: "private",
    summary: "居住与后勤支持空间。",
    panelIndex: 5,
  },
];

const governmentGovernanceDirections = [
  {
    id: "central",
    title: "中央官署",
    subtitle: "都城中枢",
    summary: "统筹国家政令、礼制与决策。",
  },
  {
    id: "local",
    title: "地方府衙",
    subtitle: "地方治理",
    summary: "承接中央制度并执行行政司法。",
  },
  {
    id: "military",
    title: "军政官署",
    subtitle: "边防与军事管理",
    summary: "处理军政复合与边疆治理事务。",
  },
  {
    id: "education",
    title: "教育礼制空间",
    subtitle: "国子监、学宫等",
    summary: "承担教化、礼制与官学体系运行。",
  },
];

const governmentProcessFlow = [
  {
    id: "petition",
    no: "01",
    title: "递状 / 击鼓",
    summary: "提出诉求，进入审理程序",
    space: "门前 / 照壁",
    panelIndex: 0,
    functionTitle: "受理入口功能",
    detail: "诉讼由门前空间启动，递状或击鼓把个人诉求转化为可以进入官署程序的公共事件。",
    caseTitle: "南阳府衙",
    caseText: "府衙入口与照壁共同建立公共界面，先把街巷空间和审理秩序区分开。",
    color: "#a9442f",
    icon: "状",
  },
  {
    id: "gate-entry",
    no: "02",
    title: "进入大门",
    summary: "进入官署外部礼仪空间",
    space: "大门",
    panelIndex: 1,
    functionTitle: "大门准入功能",
    detail: "大门承担身份筛选与秩序转换，意味着百姓从城市日常空间进入官署控制范围。",
    caseTitle: "西汉长安城中央官署遗址",
    caseText: "中央官署区的入口组织体现行政空间与都城道路之间的制度边界。",
    color: "#b45f3d",
    icon: "门",
  },
  {
    id: "ceremony-gate",
    no: "03",
    title: "过仪门",
    summary: "跨越内外分界，进入正式审理区域",
    space: "仪门",
    panelIndex: 2,
    functionTitle: "仪门礼制功能",
    detail: "仪门不是普通门洞，而是礼法程序的门槛，强化进入公堂前的肃穆感和身份秩序。",
    caseTitle: "南阳府衙",
    caseText: "明清府衙中轴上仪门、大堂、二堂层层递进，最能说明礼制空间的程序性。",
    color: "#b7793e",
    icon: "仪",
  },
  {
    id: "main-hearing",
    no: "04",
    title: "大堂审理",
    summary: "公开审理，宣示政令，接触民众",
    space: "大堂",
    panelIndex: 3,
    functionTitle: "大堂审理功能",
    detail: "大堂是官署最公开的权力界面，承担审理案件、发布政令、举行仪式和展示官威的功能。",
    caseTitle: "霍州署大堂",
    caseText: "霍州署大堂保留了地方官署核心公堂形态，适合观察审理空间的尺度与威仪。",
    color: "#c18a3f",
    icon: "堂",
  },
  {
    id: "review",
    no: "05",
    title: "二堂复核 / 议事",
    summary: "内部复核、议事与公务处理",
    space: "二堂",
    panelIndex: 4,
    functionTitle: "二堂复核功能",
    detail: "二堂位于公开大堂之后，承担更内部的复核、讨论和日常政务处理，是前公后私的过渡层。",
    caseTitle: "南阳府衙",
    caseText: "南阳府衙二堂与后部空间相连，呈现公开审理之后的内部行政流程。",
    color: "#765640",
    icon: "议",
  },
  {
    id: "archive",
    no: "06",
    title: "文书归档",
    summary: "文书整理、备案与后续执行",
    space: "文书房 / 档案",
    panelIndex: 5,
    functionTitle: "文书归档功能",
    detail: "案件完成后进入文书整理与归档环节，说明官署审理不仅是公堂上的判决，也依赖后场行政系统。",
    caseTitle: "蓟辽督师府",
    caseText: "军政边防官署中的文书、幕僚与后勤空间，让前线决策与行政记录持续运行。",
    color: "#80786a",
    icon: "档",
  },
];

const governmentFunctionProfileSeed = [
  { axis: "行政", values: [96, 92, 86] },
  { axis: "司法", values: [72, 88, 74] },
  { axis: "礼制", values: [94, 82, 78] },
  { axis: "军事", values: [68, 76, 90] },
  { axis: "教育", values: [84, 72, 82] },
];

type GovernmentLineageItem = {
  id: string;
  name: string;
  period: string;
  level: string;
  functions: string[];
  features: string[];
  value: string;
  stageTitle: string;
  image: string;
  color: string;
};

const governmentImageFallbacks: Record<string, string> = {
  "周代士大夫住宅形制": imgYinxu,
  "西汉长安城中央官署遗址": imgWeiyang,
  "东汉却非殿": imgDaming,
  "汉魏洛阳城太极殿": imgDaming,
  "正平坊遗址（含国子监）": imgQingming,
  "北宋开封府": imgQingming,
  "霍州署大堂": imgYongle,
  "南阳府衙": imgYuandadu,
  "蓟辽督师府": imgYuandadu,
  "绥远将军衙署": imgYuandadu,
  "恭王府": imgSummerPalace,
};

const governmentImage = (name: string) => resolveUserBuildingImage(name, governmentImageFallbacks[name] ?? imgYuandadu);

const governmentLineageItems: GovernmentLineageItem[] = [
  {
    id: "zhou-scholar-house",
    name: "周代士大夫住宅形制",
    period: "周",
    level: "教育礼制机构",
    functions: ["礼制"],
    features: ["礼法秩序", "公私分区"],
    value: "体现礼制等级进入住宅与公共空间组织，是后世官署秩序的前史线索。",
    stageTitle: "早期官署雏形",
    image: governmentImage("周代士大夫住宅形制"),
    color: "#9b4a35",
  },
  {
    id: "changan-office",
    name: "西汉长安城中央官署遗址",
    period: "汉",
    level: "中央官署",
    functions: ["行政", "礼制"],
    features: ["中轴线", "礼法秩序"],
    value: "体现国家行政权力在都城空间中的集中组织。",
    stageTitle: "中央行政空间形成",
    image: governmentImage("西汉长安城中央官署遗址"),
    color: "#a65338",
  },
  {
    id: "quefei-hall",
    name: "东汉却非殿",
    period: "汉",
    level: "中央官署",
    functions: ["行政", "礼制"],
    features: ["中轴线", "大堂"],
    value: "呈现宫廷政务空间与国家礼仪活动相互耦合的汉代制度特征。",
    stageTitle: "中央行政空间形成",
    image: governmentImage("东汉却非殿"),
    color: "#aa6040",
  },
  {
    id: "taiji-hall",
    name: "汉魏洛阳城太极殿",
    period: "魏晋南北朝",
    level: "中央官署",
    functions: ["行政", "礼制"],
    features: ["中轴线", "大堂", "礼法秩序"],
    value: "以政治核心建筑强化宫城秩序，是汉魏制度空间延续与转型的重要节点。",
    stageTitle: "都城官署制度化",
    image: governmentImage("汉魏洛阳城太极殿"),
    color: "#b27442",
  },
  {
    id: "zhengpingfang",
    name: "正平坊遗址（含国子监）",
    period: "隋唐",
    level: "教育礼制机构",
    functions: ["教育", "礼制"],
    features: ["门仪", "礼法秩序"],
    value: "显示官学、坊里与政务功能如何嵌入都城制度结构。",
    stageTitle: "都城官署制度化",
    image: governmentImage("正平坊遗址（含国子监）"),
    color: "#bf8a45",
  },
  {
    id: "kaifeng-fu",
    name: "北宋开封府",
    period: "宋元",
    level: "地方府衙",
    functions: ["行政", "司法"],
    features: ["大堂", "门仪", "公私分区"],
    value: "反映城市治理与地方行政空间的结合。",
    stageTitle: "地方府衙成熟",
    image: governmentImage("北宋开封府"),
    color: "#b77b44",
  },
  {
    id: "huozhou-office",
    name: "霍州署大堂",
    period: "宋元",
    level: "地方府衙",
    functions: ["行政", "司法"],
    features: ["大堂", "礼法秩序"],
    value: "现存州署大堂使地方官署核心审理空间的尺度与威仪可被直接观察。",
    stageTitle: "地方府衙成熟",
    image: governmentImage("霍州署大堂"),
    color: "#8b6548",
  },
  {
    id: "nanyang-yamen",
    name: "南阳府衙",
    period: "明清",
    level: "地方府衙",
    functions: ["行政", "司法"],
    features: ["中轴线", "大堂", "公私分区"],
    value: "体现明清地方官署空间制度的成熟形态。",
    stageTitle: "明清衙署体系完善",
    image: governmentImage("南阳府衙"),
    color: "#9a5a37",
  },
  {
    id: "jiliao-office",
    name: "蓟辽督师府",
    period: "明清",
    level: "军政机构",
    functions: ["行政", "军事"],
    features: ["中轴线", "门仪", "公私分区"],
    value: "体现边防重镇中军政合一的治理空间组织。",
    stageTitle: "明清衙署体系完善",
    image: governmentImage("蓟辽督师府"),
    color: "#7f5940",
  },
  {
    id: "suiyuan-office",
    name: "绥远将军衙署",
    period: "明清",
    level: "军政机构",
    functions: ["行政", "军事"],
    features: ["中轴线", "大堂", "公私分区"],
    value: "反映清代边疆治理、驻防制度与官署空间的结合。",
    stageTitle: "明清衙署体系完善",
    image: governmentImage("绥远将军衙署"),
    color: "#756457",
  },
  {
    id: "gongwangfu",
    name: "恭王府",
    period: "明清",
    level: "中央官署",
    functions: ["行政", "礼制"],
    features: ["中轴线", "公私分区", "礼法秩序"],
    value: "以王府空间连接贵族居住、理政活动与礼制秩序。",
    stageTitle: "明清衙署体系完善",
    image: governmentImage("恭王府"),
    color: "#94724f",
  },
];

const bridgePanels = [
  {
    id: "beam",
    name: "梁桥",
    clue: "构造直接、施工相对简单",
    diagram: "/diagrams/bridge-type-beam.png",
    metrics: [
      { label: "施工效率", value: 90 },
      { label: "跨度能力", value: 58 },
      { label: "维护便利", value: 84 },
    ],
    structureForm: "以桥墩或桥台支撑水平梁体，桥面直接承载通行。",
    forcePath: "荷载由桥面传至梁体，再传至桥墩和地基。",
    environment: "适合跨度较小、水流较缓、河面较窄的环境。",
    materials: "木材、石材、砖石。",
    advantages: "结构直接，施工相对简单，便于维修。",
    limitations: "跨度能力有限，需要较多桥墩，可能影响水流。",
    representatives: ["商代拒桥", "秦渭桥", "汉霸桥", "西汉七星桥", "隋灞桥", "迎祥桥"],
  },
  {
    id: "pontoon",
    name: "浮桥",
    clue: "搭建快速、灵活可拆卸",
    diagram: "/diagrams/bridge-type-pontoon.png",
    metrics: [
      { label: "搭建速度", value: 96 },
      { label: "环境适应", value: 82 },
      { label: "稳定性", value: 60 },
    ],
    structureForm: "以船只、浮箱或木筏承托桥面，形成可拆卸或可移动通道。",
    forcePath: "荷载通过桥面传至浮体，由水体浮力承担。",
    environment: "适合军事、临时交通、宽阔水面或水位变化较大的区域。",
    materials: "木材、船只、绳索、锚固设施。",
    advantages: "搭建速度快，灵活性强，适合临时通行与军事调度。",
    limitations: "稳定性较低，受水流、风浪和季节影响较大。",
    representatives: ["周文王渭河浮桥", "蒲津渡浮桥", "杜预浮桥"],
  },
  {
    id: "arch",
    name: "拱桥",
    clue: "受力成熟、跨越能力强",
    diagram: "/diagrams/bridge-type-arch.png",
    metrics: [
      { label: "施工效率", value: 72 },
      { label: "跨度能力", value: 93 },
      { label: "稳定性", value: 88 },
    ],
    structureForm: "以拱券承托桥面，将竖向荷载转化为沿拱圈传递的压力。",
    forcePath: "桥面荷载传至拱券，再传至桥台和基础。",
    environment: "适合较大跨度河道和需要保证水流通畅的区域。",
    materials: "石材、砖石、木材。",
    advantages: "跨越能力强，结构稳定，桥墩较少，利于泄洪和通航。",
    limitations: "施工技术要求较高，对桥台稳定性要求强。",
    representatives: ["赵州桥", "卢沟桥", "汴京虹桥"],
  },
  {
    id: "composite",
    name: "复合桥",
    clue: "多结构组合、适应复杂环境",
    diagram: "/diagrams/bridge-type-composite.png",
    metrics: [
      { label: "环境适应", value: 94 },
      { label: "系统复杂度", value: 90 },
      { label: "维护便利", value: 62 },
    ],
    structureForm: "结合桥墩、梁体、浮桥、启闭结构或近代材料形成复合跨越系统。",
    forcePath: "不同结构段分别承担桥面荷载、水流冲击和通行需求。",
    environment: "适合潮汐明显、水面宽阔、通航需求强或工程环境复杂的地区。",
    materials: "石材、木材、铁材、船只或浮梁。",
    advantages: "适应复杂水文环境，兼顾通行、通航和工程稳定。",
    limitations: "结构维护复杂，建造和管理成本较高。",
    representatives: ["洛阳桥", "广济桥", "黄河铁桥"],
  },
];

const bridgeComparisonObjects = ["梁桥", "浮桥", "拱桥", "复合桥"] as const;

const bridgeComparisonMatrix = [
  {
    dimension: "跨越能力",
    beam: "中低，适合小跨度",
    pontoon: "中等，依赖浮体数量",
    arch: "高，适合较大跨度",
    composite: "高，适应复杂跨越",
  },
  {
    dimension: "结构稳定性",
    beam: "中等",
    pontoon: "较低，受水流影响",
    arch: "高",
    composite: "较高，但维护复杂",
  },
  {
    dimension: "施工难度",
    beam: "较低",
    pontoon: "较低到中等",
    arch: "较高",
    composite: "高",
  },
  {
    dimension: "水文适应",
    beam: "一般",
    pontoon: "强，适应水位变化",
    arch: "强，利于泄洪通航",
    composite: "很强，适应复杂水文",
  },
  {
    dimension: "交通承载",
    beam: "中等",
    pontoon: "中低，适合临时通行",
    arch: "高",
    composite: "高",
  },
  {
    dimension: "维护成本",
    beam: "较低",
    pontoon: "中等，需要维护浮体",
    arch: "中等",
    composite: "较高",
  },
  {
    dimension: "代表桥梁",
    beam: "秦渭桥、汉霸桥、隋灞桥",
    pontoon: "蒲津渡浮桥、杜预浮桥",
    arch: "赵州桥、卢沟桥",
    composite: "洛阳桥、广济桥、黄河铁桥",
  },
] as const;

const bridgeComparisonConclusions = [
  "梁桥结构直接，适合早期道路交通和较小跨度跨越，是古代桥梁发展的基础类型。",
  "浮桥灵活快速，适合军事调度、临时交通和水位变化明显的大河环境。",
  "拱桥跨越能力强，结构稳定，适合长期交通和较大河道，是古代桥梁工程成熟的重要标志。",
  "复合桥综合多种结构方式，能够应对潮汐、通航、大跨度和复杂水文环境，体现桥梁技术的综合化发展。",
] as const;

type BridgeLineageItem = {
  id: string;
  name: string;
  period: string;
  stage: string;
  regionWater: string;
  typeTags: string[];
  bridgeStructure: string;
  coreTech: string;
  transportFunction: string;
  value: string;
};

const bridgeTypeFilterOrder = [
  "梁桥 / 木石梁桥",
  "浮桥",
  "拱桥",
  "城市桥 / 景观桥",
  "复合型桥梁",
];

const bridgeStageFilterOrder = [
  "早期跨越萌芽",
  "浮桥与军事交通",
  "秦汉道路桥梁发展",
  "隋唐石桥与城市桥梁成熟",
  "宋元明清城市与复合桥梁发展",
  "近代技术转型",
];

const bridgeRegionFilterOrder = [
  "渭河 / 关中",
  "黄河及北方交通",
  "洛阳城市水系",
  "中原 / 华北",
  "东南水网 / 岭南地区",
];

const bridgeLineageItems: BridgeLineageItem[] = [
  {
    id: "shang-juqiao",
    name: "商代拒桥",
    period: "商代",
    stage: "早期跨越萌芽",
    regionWater: "中原 / 华北",
    typeTags: ["梁桥 / 木石梁桥"],
    bridgeStructure: "梁桥 / 木石梁桥",
    coreTech: "木构横梁架设与浅基承托",
    transportFunction: "聚落近距跨越与早期通行组织",
    value: "呈现中国桥梁从“跨越需求”走向“结构意识”的起点。",
  },
  {
    id: "zhou-weihe-pontoon",
    name: "周文王渭河浮桥",
    period: "西周",
    stage: "浮桥与军事交通",
    regionWater: "渭河 / 关中",
    typeTags: ["浮桥"],
    bridgeStructure: "浮桥",
    coreTech: "舟船串联与缆索锚固",
    transportFunction: "军政调度与快速跨河交通",
    value: "体现早期王朝在军事与治理中对临时跨河系统的组织能力。",
  },
  {
    id: "pujindu-pontoon",
    name: "蒲津渡浮桥",
    period: "秦汉",
    stage: "浮桥与军事交通",
    regionWater: "黄河及北方交通",
    typeTags: ["浮桥"],
    bridgeStructure: "浮桥",
    coreTech: "舟节拼接、铁链牵系与渡口联动",
    transportFunction: "黄河要道跨越与干线交通保障",
    value: "把渡口体系与桥梁工程结合，强化北方交通主轴连续性。",
  },
  {
    id: "duyu-pontoon",
    name: "杜预浮桥",
    period: "魏晋",
    stage: "浮桥与军事交通",
    regionWater: "黄河及北方交通",
    typeTags: ["浮桥"],
    bridgeStructure: "浮桥",
    coreTech: "模块化舟桥部署与快速拆装",
    transportFunction: "军旅机动和战时后勤运输",
    value: "展示浮桥在复杂战地与河道条件下的高机动工程策略。",
  },
  {
    id: "qin-weiqiao",
    name: "秦渭桥",
    period: "秦",
    stage: "秦汉道路桥梁发展",
    regionWater: "渭河 / 关中",
    typeTags: ["梁桥 / 木石梁桥"],
    bridgeStructure: "梁桥 / 木石梁桥",
    coreTech: "木梁墩台组合与官道桥制",
    transportFunction: "都城周边干道联通与政务通行",
    value: "标志道路系统与桥梁建设开始制度化协同。",
  },
  {
    id: "han-baqiao",
    name: "汉霸桥",
    period: "西汉",
    stage: "秦汉道路桥梁发展",
    regionWater: "渭河 / 关中",
    typeTags: ["梁桥 / 木石梁桥"],
    bridgeStructure: "梁桥 / 木石梁桥",
    coreTech: "河岸加固与桥台稳定处理",
    transportFunction: "都城出入交通与礼仪送别通道",
    value: "兼具交通与文化象征，体现桥梁在城市生活中的复合角色。",
  },
  {
    id: "han-qixingqiao",
    name: "西汉七星桥",
    period: "西汉",
    stage: "秦汉道路桥梁发展",
    regionWater: "渭河 / 关中",
    typeTags: ["梁桥 / 木石梁桥"],
    bridgeStructure: "梁桥 / 木石梁桥",
    coreTech: "连续墩列与分跨组织",
    transportFunction: "宫苑与道路间日常通行",
    value: "反映秦汉时期多跨梁桥在都城环境中的普及应用。",
  },
  {
    id: "han-sandian-bridge",
    name: "三殿汉代古桥",
    period: "汉代",
    stage: "秦汉道路桥梁发展",
    regionWater: "中原 / 华北",
    typeTags: ["梁桥 / 木石梁桥"],
    bridgeStructure: "梁桥 / 木石梁桥",
    coreTech: "石础承重与木梁跨越结合",
    transportFunction: "区域道路跨水连接",
    value: "为汉代地方桥梁结构提供了可考的工程样本线索。",
  },
  {
    id: "zhaozhou-bridge",
    name: "赵州桥",
    period: "隋唐",
    stage: "隋唐石桥与城市桥梁成熟",
    regionWater: "中原 / 华北",
    typeTags: ["拱桥"],
    bridgeStructure: "拱桥",
    coreTech: "敞肩石拱、减重券肩与洪水疏导",
    transportFunction: "官道通行与长期稳定跨河",
    value: "代表中国古代拱桥受力设计与耐久性协同的高峰。",
  },
  {
    id: "sui-baqiao",
    name: "隋灞桥",
    period: "隋唐",
    stage: "隋唐石桥与城市桥梁成熟",
    regionWater: "渭河 / 关中",
    typeTags: ["梁桥 / 木石梁桥"],
    bridgeStructure: "梁桥 / 木石梁桥",
    coreTech: "桥墩布置与河道冲刷应对",
    transportFunction: "都城东向交通枢纽通行",
    value: "体现隋唐都城外缘交通与桥梁工程的系统组织。",
  },
  {
    id: "luoyang-tianjin-bridge",
    name: "洛阳天津桥",
    period: "隋唐",
    stage: "隋唐石桥与城市桥梁成熟",
    regionWater: "洛阳城市水系",
    typeTags: ["城市桥 / 景观桥"],
    bridgeStructure: "城市桥 / 景观桥",
    coreTech: "城市主桥跨河与桥道一体化",
    transportFunction: "都城中轴交通与城市礼仪通行",
    value: "是桥梁嵌入都城空间秩序的典型代表。",
  },
  {
    id: "luoyang-traveler-bridge",
    name: "洛阳旅人桥",
    period: "隋唐",
    stage: "隋唐石桥与城市桥梁成熟",
    regionWater: "洛阳城市水系",
    typeTags: ["城市桥 / 景观桥"],
    bridgeStructure: "城市桥 / 景观桥",
    coreTech: "城市街桥衔接与行旅通道优化",
    transportFunction: "居民与行旅日常过河交通",
    value: "体现城市桥梁从“过河”走向“空间节点”的角色转变。",
  },
  {
    id: "luoyang-bridge",
    name: "洛阳桥",
    period: "宋元",
    stage: "宋元明清城市与复合桥梁发展",
    regionWater: "东南水网 / 岭南地区",
    typeTags: ["复合型桥梁"],
    bridgeStructure: "复合型桥梁",
    coreTech: "筏形基础、种蛎固基与海潮环境适配",
    transportFunction: "海港道路联通与商贸运输",
    value: "展示东南沿海桥梁在潮汐环境中的综合工程智慧。",
  },
  {
    id: "bianjing-hongqiao",
    name: "汴京虹桥",
    period: "宋元",
    stage: "宋元明清城市与复合桥梁发展",
    regionWater: "中原 / 华北",
    typeTags: ["拱桥", "城市桥 / 景观桥"],
    bridgeStructure: "拱桥 / 城市桥",
    coreTech: "大跨无墩木拱与河运净空协同",
    transportFunction: "城市交通、漕运通航与市井活动复合",
    value: "凸显宋代城市桥梁在交通效率与商业活力间的平衡。",
  },
  {
    id: "yingxiang-bridge",
    name: "迎祥桥",
    period: "明清",
    stage: "宋元明清城市与复合桥梁发展",
    regionWater: "中原 / 华北",
    typeTags: ["梁桥 / 木石梁桥"],
    bridgeStructure: "梁桥 / 木石梁桥",
    coreTech: "石梁拼接与桥面稳定铺装",
    transportFunction: "城镇道路连接与日常交通通达",
    value: "体现明清时期常规道路桥梁的标准化建造经验。",
  },
  {
    id: "guangji-bridge",
    name: "广济桥",
    period: "宋元至明清",
    stage: "宋元明清城市与复合桥梁发展",
    regionWater: "东南水网 / 岭南地区",
    typeTags: ["复合型桥梁"],
    bridgeStructure: "复合型桥梁",
    coreTech: "梁桥与浮桥分段组合、可启闭桥段",
    transportFunction: "通行、商贸与城市景观展示复合",
    value: "把桥梁工程与商业城市生活深度整合为复合基础设施。",
  },
  {
    id: "lugou-bridge",
    name: "卢沟桥",
    period: "明清",
    stage: "宋元明清城市与复合桥梁发展",
    regionWater: "黄河及北方交通",
    typeTags: ["拱桥"],
    bridgeStructure: "拱桥",
    coreTech: "联拱石桥与桥墩分水设计",
    transportFunction: "北方交通干线跨河通行",
    value: "是明清都城外缘交通体系与文化记忆叠加的关键节点。",
  },
  {
    id: "yellow-river-iron-bridge",
    name: "黄河铁桥",
    period: "近代",
    stage: "近代技术转型",
    regionWater: "黄河及北方交通",
    typeTags: ["复合型桥梁"],
    bridgeStructure: "复合型桥梁（铁桥）",
    coreTech: "钢铁桁架体系与近代施工组织",
    transportFunction: "现代干线运输与区域联通",
    value: "标志中国桥梁从传统工艺向近代工程体系的技术转型。",
  },
];

const residentialMapPins = [
  {
    id: "north",
    label: "华北院落区",
    x: 38,
    y: 28,
    climate: "寒冷与风沙",
    living: "围合院落与家族礼序",
  },
  {
    id: "jiangnan",
    label: "江南水乡区",
    x: 53,
    y: 48,
    climate: "湿热与水网",
    living: "天井通风与排水组织",
  },
  {
    id: "tulou",
    label: "闽南群居区",
    x: 61,
    y: 62,
    climate: "山地与潮湿",
    living: "聚族防御与共享院心",
  },
];

type ResidentialLineageItem = {
  id: string;
  name: string;
  period: string;
  region: string;
  type: string;
  feature: string;
  value: string;
  stage: string;
  image: string;
  color: string;
};

const residentialImageFallbacks: Record<string, string> = {
  "二里头遗址半地穴式房屋": imgErlitou,
  "三杨庄遗址": imgYongcheng,
  "汉代坞壁": imgYongcheng,
  "舍宅为寺的贵族住宅": imgSuzhouGarden,
  "隋唐长安城里坊住宅": imgQingming,
  "敦煌壁画院落": imgQingming,
  "北宋许驸马府": imgSuzhouGarden,
  "元代后英房遗址": imgSummerPalace,
  "姬氏民居": imgSuzhouGarden,
  "北京四合院": imgSummerPalace,
  "徽州明代住宅": imgHuizhou,
  "福建土楼": imgTempleHeaven,
  "窑洞": imgYongcheng,
  "一颗印": imgHuizhou,
};

const residentialImage = (name: string) => resolveUserBuildingImage(name, residentialImageFallbacks[name] ?? imgHuizhou);

const residentialLineageItems: ResidentialLineageItem[] = [
  {
    id: "erlitou-dwelling",
    name: "二里头遗址半地穴式房屋",
    period: "夏商",
    region: "中原",
    type: "早期居住遗存",
    feature: "气候适应",
    value: "以半地穴、防寒保温和聚落关系呈现早期居住从穴居向地面建筑过渡的线索。",
    stage: "早期聚落居住",
    image: residentialImage("二里头遗址半地穴式房屋"),
    color: "#c2924f",
  },
  {
    id: "sanyangzhuang",
    name: "三杨庄遗址",
    period: "汉代",
    region: "中原",
    type: "农耕聚落",
    feature: "生活方式",
    value: "保存院落、农田与道路关系，是理解汉代基层农耕生活的珍贵实证。",
    stage: "汉代农耕聚落与防御居住",
    image: residentialImage("三杨庄遗址"),
    color: "#b98a4d",
  },
  {
    id: "han-wubi",
    name: "汉代坞壁",
    period: "汉代",
    region: "华北",
    type: "防御聚落",
    feature: "防御功能",
    value: "以围护、防御和聚族自保回应动荡环境，展示居住组织的安全维度。",
    stage: "汉代农耕聚落与防御居住",
    image: residentialImage("汉代坞壁"),
    color: "#9f6745",
  },
  {
    id: "aristocrat-house",
    name: "舍宅为寺的贵族住宅",
    period: "魏晋南北朝",
    region: "中原",
    type: "贵族宅第",
    feature: "礼制秩序",
    value: "反映贵族宅院与宗教空间转换，说明住宅进入礼制和信仰网络。",
    stage: "魏晋至隋唐的贵族住宅与城市里坊",
    image: residentialImage("舍宅为寺的贵族住宅"),
    color: "#8f6a50",
  },
  {
    id: "changan-lifang",
    name: "隋唐长安城里坊住宅",
    period: "隋唐",
    region: "长安",
    type: "城市住宅",
    feature: "礼制秩序",
    value: "住宅嵌入里坊制度与都城网格，体现城市管理对居住空间的塑形。",
    stage: "魏晋至隋唐的贵族住宅与城市里坊",
    image: residentialImage("隋唐长安城里坊住宅"),
    color: "#9b5f42",
  },
  {
    id: "dunhuang-courtyard",
    name: "敦煌壁画院落",
    period: "隋唐",
    region: "敦煌",
    type: "图像院落",
    feature: "生活方式",
    value: "壁画中的院落图像补足实物遗存不足，保存生活场景和空间形制线索。",
    stage: "魏晋至隋唐的贵族住宅与城市里坊",
    image: residentialImage("敦煌壁画院落"),
    color: "#b77a48",
  },
  {
    id: "xu-fuma-fu",
    name: "北宋许驸马府",
    period: "宋元",
    region: "岭南",
    type: "贵族宅第",
    feature: "礼制秩序",
    value: "高等级府第以厅堂、院落和礼序组织居住，体现宋代宅第制度成熟。",
    stage: "宋元时期合院住宅成熟",
    image: residentialImage("北宋许驸马府"),
    color: "#7d5c45",
  },
  {
    id: "houyingfang",
    name: "元代后英房遗址",
    period: "宋元",
    region: "华北",
    type: "城市住宅",
    feature: "合院布局",
    value: "元大都住宅遗址揭示北京城市合院形态的历史基础。",
    stage: "宋元时期合院住宅成熟",
    image: residentialImage("元代后英房遗址"),
    color: "#80614d",
  },
  {
    id: "jishi-residence",
    name: "姬氏民居",
    period: "宋元",
    region: "华北",
    type: "合院住宅",
    feature: "家族聚居",
    value: "山西地方院落住宅代表，说明北方合院在乡村社会中的延续。",
    stage: "宋元时期合院住宅成熟",
    image: residentialImage("姬氏民居"),
    color: "#a56a4f",
  },
  {
    id: "siheyuan",
    name: "北京四合院",
    period: "明清",
    region: "华北",
    type: "成熟地域民居",
    feature: "家族聚居",
    value: "以中轴对称、正房厢房和院落围合表达北方气候适应与宗法秩序。",
    stage: "明清地域民居多样化成熟",
    image: residentialImage("北京四合院"),
    color: "#a84f3e",
  },
  {
    id: "huizhou-residence",
    name: "徽州明代住宅",
    period: "明清",
    region: "徽州",
    type: "成熟地域民居",
    feature: "地方材料",
    value: "天井、马头墙与粉墙黛瓦共同体现山地聚落、宗族文化和徽商财富。",
    stage: "明清地域民居多样化成熟",
    image: residentialImage("徽州明代住宅"),
    color: "#6f7f7d",
  },
  {
    id: "fujian-tulou",
    name: "福建土楼",
    period: "明清",
    region: "福建",
    type: "成熟地域民居",
    feature: "家族聚居",
    value: "大型夯土围合空间将宗族组织、防御需求和地方材料智慧统一起来。",
    stage: "明清地域民居多样化成熟",
    image: residentialImage("福建土楼"),
    color: "#a45f37",
  },
  {
    id: "yaodong",
    name: "窑洞",
    period: "明清",
    region: "黄土高原",
    type: "成熟地域民居",
    feature: "气候适应",
    value: "利用黄土直立性和热惰性形成冬暖夏凉、因地制宜的居住方式。",
    stage: "明清地域民居多样化成熟",
    image: residentialImage("窑洞"),
    color: "#c69a4c",
  },
  {
    id: "yikeyin",
    name: "一颗印",
    period: "明清",
    region: "云南",
    type: "成熟地域民居",
    feature: "气候适应",
    value: "以紧凑方正院落回应云南高原气候、山地空间和多民族生活方式。",
    stage: "明清地域民居多样化成熟",
    image: residentialImage("一颗印"),
    color: "#d18141",
  },
];

const residentialTimelineStages = [
  {
    name: "早期聚落居住",
    period: "夏商",
    shape: "半地穴居住",
    keywords: "防寒、聚落、过渡",
    objectIds: ["erlitou-dwelling"],
    summary: "二里头遗址半地穴式房屋体现早期居住空间对气候和地表环境的适应，是由穴居、半穴居向地面建筑过渡的重要线索。",
  },
  {
    name: "汉代农耕聚落与防御居住",
    period: "汉代",
    shape: "村落与防御聚居",
    keywords: "农耕、防御、聚族",
    objectIds: ["sanyangzhuang", "han-wubi"],
    summary: "汉代民居逐渐呈现村落化、家族化和防御化特征，三杨庄遗址反映基层农耕生活，坞壁体现聚族自保的居住组织。",
  },
  {
    name: "魏晋至隋唐的贵族住宅与城市里坊",
    period: "魏晋至隋唐",
    shape: "城市院落与贵族住宅",
    keywords: "里坊、礼制、图像",
    objectIds: ["aristocrat-house", "changan-lifang", "dunhuang-courtyard"],
    summary: "这一阶段民居与城市制度、贵族生活和宗教建筑发生密切关系，住宅空间逐渐被纳入城市管理和礼制秩序。",
  },
  {
    name: "宋元时期合院住宅成熟",
    period: "宋元",
    shape: "合院宅第",
    keywords: "府第、院落、街巷",
    objectIds: ["xu-fuma-fu", "houyingfang", "jishi-residence"],
    summary: "宋元时期，合院住宅形态进一步成熟，高等级宅第与普通城市住宅共同推动了院落式居住空间的发展。",
  },
  {
    name: "明清地域民居多样化成熟",
    period: "明清",
    shape: "地域民居成熟",
    keywords: "地域、宗族、材料",
    objectIds: ["siheyuan", "huizhou-residence", "fujian-tulou", "yaodong", "yikeyin"],
    summary: "明清时期，各地民居在稳定社会结构和成熟营造经验中形成鲜明地域特色，集中体现中国民居的多样化智慧。",
  },
];

const residentialFormationFactors = [
  { name: "自然环境", summary: "气候、地形、水系、采光和通风共同影响民居平面与构造。", examples: ["窑洞", "敦煌壁画院落", "一颗印"], color: "#c2924f" },
  { name: "家族制度", summary: "宗族聚居、长幼有序和内外有别决定院落中的位置关系。", examples: ["北京四合院", "福建土楼", "徽州明代住宅"], color: "#a84f3e" },
  { name: "地方材料", summary: "木、砖、石、土、夯土和黄土让不同地区形成不同建造方法。", examples: ["福建土楼", "窑洞", "徽州明代住宅"], color: "#6f7f7d" },
  { name: "生活方式", summary: "生产、起居、防御、礼俗和邻里关系共同塑造真实居住空间。", examples: ["三杨庄遗址", "敦煌壁画院落", "北宋许驸马府"], color: "#d18141" },
];

const residentialHeroStats = [
  { label: "代表对象", value: "14", note: "从遗址到地域民居" },
  { label: "历史阶段", value: "5", note: "早期、汉代、隋唐、宋元、明清" },
  { label: "地域类型", value: "9", note: "中原、华北、福建、云南等" },
  { label: "形成因素", value: "4", note: "环境、家族、材料、生活" },
];

const residentialTocItems = [
  { id: "section-overview", label: "专题概览" },
  { id: "section-factors", label: "形成因素" },
  { id: "section-timeline", label: "时间演进" },
  { id: "section-lineage", label: "谱系总览" },
  { id: "section-region", label: "地域分布" },
  { id: "section-compare", label: "案例对比" },
  { id: "section-cases", label: "经典案例" },
  { id: "section-ai", label: "AI问答" },
];

const governmentTocItems = [
  { id: "section-overview", label: "专题概览" },
  { id: "section-axis", label: "空间序列 / 轴线" },
  { id: "section-process", label: "行政审理流程" },
  { id: "section-lineage", label: "官署谱系" },
  { id: "section-region", label: "治理网络" },
  { id: "section-timeline", label: "对比分析" },
  { id: "section-cases", label: "经典案例" },
  { id: "section-ai", label: "AI问答" },
];

const palaceTocItems = [
  { id: "section-overview", label: "专题叙事" },
  { id: "section-axis", label: "中轴节点功能图" },
  { id: "section-timeline", label: "中轴演进脉络" },
  { id: "section-lineage", label: "宫殿谱系总览" },
  { id: "section-region", label: "都城—宫城—中轴关系图" },
  { id: "section-space", label: "礼制等级与使用权限图" },
  { id: "section-cases", label: "典型案例深读" },
  { id: "section-ai", label: "AI问答助手" },
];

const bridgeTocItems = [
  { id: "section-overview", label: "首屏专题叙事" },
  { id: "section-compare", label: "桥型结构与受力原理" },
  { id: "section-timeline", label: "工程技术演进脉络" },
  { id: "section-lineage", label: "桥梁谱系概览" },
  { id: "section-region", label: "水系交通分布" },
  { id: "section-cases", label: "经典案例" },
  { id: "section-factors", label: "桥型对比分析" },
  { id: "section-ai", label: "AI专题助手" },
];

const residentialRegionAtlas = [
  { id: "central", region: "中原地区", lon: 113.6, lat: 34.7, objectIds: ["erlitou-dwelling", "sanyangzhuang"], reason: "早期聚落、农耕生活、防寒保温", summary: "早期聚落与农田生活共同塑造居住空间，半地穴和院落遗存体现对寒冷、生产与聚落关系的回应。", keywords: ["半地穴", "农耕", "聚落", "防寒"] },
  { id: "north", region: "华北地区", lon: 116.4, lat: 39.9, objectIds: ["han-wubi", "jishi-residence", "siheyuan", "houyingfang"], reason: "防御需求、合院秩序、宗法家庭", summary: "北方气候干燥寒冷，院落围合有利于防风、采光和家庭组织，动荡时期也强化了防御聚居。", keywords: ["合院", "防御", "宗法", "砖木结构"] },
  { id: "changan", region: "长安地区", lon: 108.9, lat: 34.3, objectIds: ["changan-lifang"], reason: "里坊制度、都城规划、城市管理", summary: "都城网格和里坊制度将住宅纳入城市管理，居住形态与礼制秩序、街巷边界紧密相关。", keywords: ["里坊", "都城", "街巷", "制度化"] },
  { id: "dunhuang", region: "敦煌 / 河西地区", lon: 94.7, lat: 40.1, objectIds: ["dunhuang-courtyard"], reason: "图像资料、院落生活、宗教文化", summary: "敦煌壁画保存院落生活图像，为理解西北地区住宅空间、宗教文化和日常场景提供线索。", keywords: ["壁画", "院落", "河西", "图像资料"] },
  { id: "lingnan", region: "岭南 / 潮州", lon: 116.6, lat: 23.7, objectIds: ["xu-fuma-fu"], reason: "高等级宅第、府第空间、礼制秩序", summary: "岭南府第空间兼顾湿热环境和礼制表达，厅堂、院落与门第共同组织高等级居住秩序。", keywords: ["府第", "厅堂", "礼制", "湿热气候"] },
  { id: "huizhou", region: "徽州地区", lon: 118.3, lat: 29.8, objectIds: ["huizhou-residence"], reason: "山地环境、宗族文化、商帮财富", summary: "山地聚落、宗族组织和徽商财富推动天井、马头墙、粉墙黛瓦等地方民居特征成熟。", keywords: ["天井", "马头墙", "宗族", "粉墙黛瓦"] },
  { id: "fujian", region: "福建地区", lon: 117.7, lat: 25.1, objectIds: ["fujian-tulou"], reason: "山区聚居、防御需求、夯土材料", summary: "山区聚族而居，防御需求强，夯土材料丰富，促成土楼大型围合、内向共享的空间形态。", keywords: ["夯土", "围合", "防御", "宗族聚居"] },
  { id: "loess", region: "黄土高原", lon: 109.1, lat: 36.7, objectIds: ["yaodong"], reason: "黄土材料、冬暖夏凉、因地制宜", summary: "黄土直立性和热惰性让窑洞能够就地取材，形成冬暖夏凉、低扰动的居住方式。", keywords: ["黄土", "冬暖夏凉", "拱券", "因地制宜"] },
  { id: "yunnan", region: "云南地区", lon: 102.7, lat: 25.0, objectIds: ["yikeyin"], reason: "紧凑院落、地方气候、多民族融合", summary: "云南山地和高原气候促成紧凑方正院落，一颗印体现地方气候、多民族生活与空间节制。", keywords: ["紧凑院落", "高原", "多民族", "通风采光"] },
];

const residentialSpaces = [
  { id: "gate", name: "门楼", function: "出入口、通行与礼仪界面", meaning: "区分内外，形成进入秩序", adaptation: "控制风沙、视线和街巷噪声", x: 43, y: 82, w: 14, h: 12 },
  { id: "front-yard", name: "前院", function: "过渡、采光和日常活动", meaning: "让生活从街巷转入家庭内部", adaptation: "改善采光与院内通风", x: 35, y: 56, w: 30, h: 20 },
  { id: "main-room", name: "正房", function: "长辈居住、会客、家族核心空间", meaning: "体现长幼秩序和家庭中心", adaptation: "通常选择更好朝向，利于采光保温", x: 34, y: 10, w: 32, h: 16 },
  { id: "side-room", name: "厢房", function: "子辈居住或辅助空间", meaning: "体现家庭分工和主次关系", adaptation: "围合院落边界，减少寒风直入", x: 10, y: 34, w: 18, h: 34 },
  { id: "patio", name: "天井", function: "采光、通风、排水", meaning: "形成内向型生活核心", adaptation: "适合湿热地区调节微气候", x: 40, y: 34, w: 20, h: 14 },
  { id: "wall", name: "围墙", function: "安全、防御、私密", meaning: "形成内向型居住边界", adaptation: "阻隔风沙、盗扰和外部干扰", x: 4, y: 8, w: 92, h: 82 },
  { id: "hall", name: "厅堂 / 祠堂", function: "祭祀、议事和礼俗活动", meaning: "把家族记忆放入日常空间", adaptation: "居中组织人流，稳定院落秩序", x: 70, y: 32, w: 18, h: 36 },
  { id: "kitchen", name: "厨房 / 储藏", function: "生产生活后勤", meaning: "支持家庭持续运行", adaptation: "靠边布置，便于排烟、储物和后勤操作", x: 14, y: 72, w: 20, h: 12 },
];

const residentialClassicIds = ["siheyuan", "huizhou-residence", "fujian-tulou", "yaodong", "yikeyin"];

const residentialCaseDeepDives = {
  siheyuan: {
    id: "siheyuan",
    name: "北京四合院",
    period: "明清",
    region: "北京 / 华北",
    type: "合院式成熟地域民居",
    keywords: ["中轴对称", "院落围合", "宗法秩序", "防风采光"],
    oneLine: "以中轴、正房和厢房组织家庭生活，是华北合院民居的典型代表。",
    feature: "正房居中，厢房分列两侧，倒座房面向街巷，院落形成内向生活核心。",
    reason: "北方寒冷干燥，围合院落利于防风、采光和家庭成员分区。",
    organization: "大门、倒座房、院落、厢房、正房沿内外和尊卑层级展开。",
    material: "砖木结构、灰瓦屋面、木构门窗，强调耐久与礼序界面。",
    lifestyle: "围绕院落进行起居、会客、节庆和家族日常交往。",
    meaning: "体现长幼有序、内外有别和家庭伦理的空间秩序。",
    value: "可作为理解北方家庭结构、礼制观念和气候适应的核心案例。",
    vrLink: "https://www.720yun.com/vr/bfdjtrekem1",
    aiQuestion: "北京四合院为什么强调中轴对称？",
    structureImage: "/user-images/case-structures/北京四合院空间结构.png",
    structure: [
      { name: "大门", x: 42, y: 82, w: 16, h: 10, summary: "控制内外转换，是街巷进入家庭的礼仪界面。" },
      { name: "倒座房", x: 32, y: 68, w: 36, h: 10, summary: "临街布置，承担会客、辅助和边界功能。" },
      { name: "院落", x: 34, y: 38, w: 32, h: 24, summary: "采光、通风和家庭活动中心。" },
      { name: "厢房", x: 12, y: 34, w: 18, h: 34, summary: "两侧辅助居住，体现家庭分工。" },
      { name: "正房", x: 34, y: 12, w: 32, h: 14, summary: "长辈居住和家族核心空间。" },
    ],
  },
  "huizhou-residence": {
    id: "huizhou-residence",
    name: "徽州明代住宅",
    period: "明清",
    region: "徽州地区",
    type: "天井式山地民居",
    keywords: ["天井", "马头墙", "粉墙黛瓦", "宗族文化"],
    oneLine: "以天井和马头墙回应山地聚落、湿润气候与宗族生活。",
    feature: "平面紧凑，天井组织采光排水，马头墙形成防火和立面节奏。",
    reason: "山地用地紧张、湿润多雨，徽商财富和宗族观念推动宅院精细化。",
    organization: "门厅、天井、厅堂、厢房层层递进，内向空间清晰。",
    material: "木构、砖墙、青瓦、石雕木雕砖雕，兼具实用与装饰。",
    lifestyle: "厅堂承载祭祀会客，天井维持通风采光，家庭生活围绕内院展开。",
    meaning: "体现宗族礼仪、徽商文化和山地聚落的空间智慧。",
    value: "适合展示地域环境、商业文化和营造细节如何共同塑造民居。",
    vrLink: "https://www.720yun.com/t/313jugenzy1?scene_id=24033671",
    aiQuestion: "徽州住宅的天井有什么作用？",
    structureImage: "/user-images/case-structures/徽州明代住宅空间结构.png",
    structure: [
      { name: "天井", x: 39, y: 38, w: 22, h: 20, summary: "采光、通风、排水，是室内微气候核心。" },
      { name: "马头墙", x: 8, y: 12, w: 84, h: 12, summary: "防火分隔，并形成徽州民居标志性轮廓。" },
      { name: "厅堂", x: 32, y: 14, w: 36, h: 16, summary: "会客、祭祀和家族礼仪空间。" },
      { name: "厢房", x: 14, y: 36, w: 18, h: 34, summary: "围绕天井组织日常起居。" },
    ],
  },
  "fujian-tulou": {
    id: "fujian-tulou",
    name: "福建土楼",
    period: "明清",
    region: "福建山区",
    type: "宗族聚居型防御民居",
    keywords: ["夯土墙", "环形围合", "内院", "宗族聚居"],
    oneLine: "以大型围合空间整合居住、防御、祭祀和公共生活。",
    feature: "厚重外墙封闭，内部环廊层叠，公共空间集中在内院。",
    reason: "山区聚族而居、防御需求强，夯土材料易得且适合大体量建造。",
    organization: "外墙围护，房间沿环形排列，祖堂和公共空间位于中心。",
    material: "夯土墙体、木构楼层、石基和瓦屋面共同构成稳定体系。",
    lifestyle: "多户同楼生活，共享祭祀、议事、储藏和防御空间。",
    meaning: "体现家族共同体、地方防御和集体生活秩序。",
    value: "是理解宗族组织、材料技术和防御性居住的代表案例。",
    vrLink: "https://www.720yun.com/vr/c3ejOduvum6",
    aiQuestion: "福建土楼为什么适合宗族聚居？",
    structureImage: "/user-images/case-structures/福建土楼空间结构.png",
    structure: [
      { name: "环形围合", x: 18, y: 16, w: 64, h: 64, summary: "形成高度内向且连续的聚居边界。" },
      { name: "内院", x: 38, y: 36, w: 24, h: 24, summary: "公共活动、采光和通风中心。" },
      { name: "夯土墙", x: 12, y: 10, w: 76, h: 76, summary: "厚重外墙兼具承重、防御与隔热。" },
      { name: "公共空间", x: 42, y: 64, w: 16, h: 12, summary: "祭祀、议事与集体活动的共享场所。" },
    ],
  },
  yaodong: {
    id: "yaodong",
    name: "窑洞",
    period: "明清",
    region: "黄土高原",
    type: "黄土地区生态民居",
    keywords: ["冬暖夏凉", "靠崖式", "下沉式", "黄土材料"],
    oneLine: "依托黄土直立性与热惰性，形成因地制宜的低扰动居住方式。",
    feature: "拱券洞室嵌入黄土或围绕下沉院落展开，空间朴素稳定。",
    reason: "黄土高原木材相对不足，黄土可掘性和保温性适合直接营造。",
    organization: "靠崖式顺坡开凿，下沉式围绕院心布置，独立式以拱券成屋。",
    material: "黄土、砖券、石基和抹面共同提高稳定性与耐久性。",
    lifestyle: "生产生活靠近院落和坡地，适合农耕家庭日常使用。",
    meaning: "体现顺应地形、节省材料和适应气候的朴素智慧。",
    value: "适合作为中国古代生态适应型居住的典型案例。",
    vrLink: "https://www.720yun.com/t/1cvkOyplr8b?scene_id=53291484",
    aiQuestion: "窑洞为什么冬暖夏凉？",
    structureImage: "/user-images/case-structures/窑洞空间结构.png",
    structure: [
      { name: "靠崖式", x: 8, y: 18, w: 28, h: 56, summary: "依山坡或沟崖开挖，施工直接且保温性强。" },
      { name: "下沉式", x: 38, y: 28, w: 24, h: 34, summary: "院落下沉，洞室沿四壁布置。" },
      { name: "独立式", x: 68, y: 24, w: 22, h: 42, summary: "以拱券结构模拟窑洞空间。" },
    ],
  },
  yikeyin: {
    id: "yikeyin",
    name: "一颗印",
    period: "明清",
    region: "云南地区",
    type: "紧凑合院型民居",
    keywords: ["三间四耳", "小天井", "紧凑院落", "高原气候"],
    oneLine: "以方正紧凑的院落组织，回应云南高原气候和多民族生活。",
    feature: "三间四耳围合小天井，体量紧凑，空间边界清楚。",
    reason: "山地城市用地有限，地方气候需要兼顾采光、保温和通风。",
    organization: "正房三间，两侧耳房围合小天井，形成紧凑内向院落。",
    material: "土木、砖瓦和地方材料结合，强调适用与建造效率。",
    lifestyle: "家庭生活围绕小天井展开，空间紧凑但功能完整。",
    meaning: "体现地方气候、多民族生活和合院传统的融合。",
    value: "可展示西南地区民居在有限用地中的空间组织智慧。",
    aiQuestion: "一颗印为什么采用紧凑院落？",
    structureImage: "/user-images/case-structures/一颗印空间结构.png",
    structure: [
      { name: "三间", x: 32, y: 14, w: 36, h: 16, summary: "正房三间构成家庭核心。" },
      { name: "四耳", x: 14, y: 34, w: 20, h: 38, summary: "两侧耳房补足居住和辅助功能。" },
      { name: "小天井", x: 40, y: 40, w: 20, h: 18, summary: "提供采光、通风和院落中心。" },
      { name: "紧凑院落", x: 24, y: 26, w: 52, h: 52, summary: "以较小尺度完成围合生活。" },
    ],
  },
};

const palacePlanNodes = [
  { id: "gate", name: "宫门", kind: "axis", stage: "前朝", summary: "控制进入资格，建立礼制起点。", cue: "门阙与进深体现身份筛选。" },
  { id: "court", name: "广庭", kind: "axis", stage: "前朝", summary: "放大仪式尺度，形成朝会缓冲区。", cue: "尺度决定庄严感。" },
  { id: "hall", name: "正殿", kind: "axis", stage: "前朝核心", summary: "朝会与权力象征中心。", cue: "台基与中轴位置最关键。" },
  { id: "bedroom", name: "后寝", kind: "axis", stage: "后寝", summary: "承接皇家日常，形成前朝后寝格局。", cue: "关注政务与生活分区。" },
  { id: "left-ancestor", name: "左祖", kind: "side", stage: "礼制侧翼", summary: "祖庙系统强调宗法与祭祀秩序。", cue: "位于轴线左侧，强调祖先礼仪。" },
  { id: "right-sheji", name: "右社", kind: "side", stage: "礼制侧翼", summary: "社稷系统承载国家土地与政权象征。", cue: "位于轴线右侧，体现国家祭祀。" },
];

const palaceAxisDetailMap: Record<string, {
  name: string;
  position: string;
  function: string;
  ritualLevel: string;
  ritualMeaning: string;
  imperialSymbol: string;
  representativeCase: string;
}> = {
  gate: {
    name: "宫门",
    position: "宫城入口",
    function: "控制出入、界定宫城内外",
    ritualLevel: "入口礼仪空间",
    ritualMeaning: "进入皇权空间的第一重界面",
    imperialSymbol: "区分凡俗城市与皇家禁地",
    representativeCase: "汉未央宫、北京故宫午门",
  },
  court: {
    name: "广庭",
    position: "宫门与正殿之间",
    function: "集结、候朝、举行大型礼仪活动",
    ritualLevel: "公共仪式空间",
    ritualMeaning: "放大进入正殿前的空间距离",
    imperialSymbol: "强化皇权的庄严与秩序",
    representativeCase: "唐大明宫含元殿前庭、北京故宫太和殿前广场",
  },
  hall: {
    name: "正殿",
    position: "中轴核心",
    function: "大朝、册封、典礼、政务象征",
    ritualLevel: "最高礼制空间",
    ritualMeaning: "国家礼仪与皇权展示中心",
    imperialSymbol: "皇权秩序的空间核心",
    representativeCase: "汉未央宫前殿、北京故宫太和殿",
  },
  bedroom: {
    name: "后寝",
    position: "中轴后部",
    function: "皇帝与后妃生活空间",
    ritualLevel: "内廷生活空间",
    ritualMeaning: "由国家仪式转入皇家生活",
    imperialSymbol: "前朝后寝制度的后部核心",
    representativeCase: "北京故宫乾清宫—坤宁宫组群",
  },
  "left-ancestor": {
    name: "左祖",
    position: "中轴左翼",
    function: "祖先祭祀与宗法礼制表达",
    ritualLevel: "辅助礼制空间",
    ritualMeaning: "将祖先崇祀纳入国家礼仪体系",
    imperialSymbol: "皇权合法性与宗法连续性的象征",
    representativeCase: "太庙系统",
  },
  "right-sheji": {
    name: "右社",
    position: "中轴右翼",
    function: "社稷祭祀、国家土地与政权仪式",
    ritualLevel: "辅助礼制空间",
    ritualMeaning: "强调国家治理与土地社稷的神圣关系",
    imperialSymbol: "国家统治正当性的祭祀表达",
    representativeCase: "社稷坛系统",
  },
};

const palaceEvolutionMap: Record<string, { representative: string; spatialFeature: string; ritualChange: string; value: string }> = {
  "早期宫殿雏形": {
    representative: "二里头宫殿区",
    spatialFeature: "宫殿与礼制核心并置，轴向秩序初现",
    ritualChange: "王权与祭祀空间开始合流",
    value: "奠定中国宫殿制度空间的原型框架",
  },
  "秦汉宫城扩展": {
    representative: "汉未央宫",
    spatialFeature: "宫城规模化扩展，前朝空间快速放大",
    ritualChange: "朝会与国家礼仪形成更稳定程序",
    value: "推动宫城与都城主轴关系的制度化",
  },
  "隋唐中轴秩序强化": {
    representative: "唐大明宫",
    spatialFeature: "中轴礼序、宫苑景观与都城格局联动",
    ritualChange: "国家仪式与宫殿空间高度耦合",
    value: "形成高等级帝国礼仪空间范式",
  },
  "宋元宫城制度调整": {
    representative: "东京宫城、元大都宫城",
    spatialFeature: "政治中心迁移下的宫城功能重组",
    ritualChange: "礼制程序在新都城中被重新配置",
    value: "承接前代制度并为明清定型提供过渡",
  },
  "明清紫禁城成熟": {
    representative: "北京紫禁城",
    spatialFeature: "中轴严整、前朝后寝、宫城皇城层级分明",
    ritualChange: "国家仪式与皇权象征高度制度化",
    value: "古代宫殿礼制空间的成熟范式",
  },
};

type PalaceLineageItem = {
  id: string;
  name: string;
  period: string;
  level: string;
  functionType: string;
  feature: string;
  value: string;
  image: string;
  color: string;
};

const palaceImageFallbacks: Record<string, string> = {
  "二里头宫殿区": imgErlitou,
  "汉未央宫": imgWeiyang,
  "唐大明宫": imgDaming,
  "宋东京宫城": imgQingming,
  "元大都宫城": imgYuandadu,
  "北京故宫": imgForbiddenCity,
  "沈阳故宫": imgForbiddenCity,
  "圆明园宫苑体系": imgSummerPalace,
};

const palaceImage = (name: string) => resolveUserBuildingImage(name, palaceImageFallbacks[name] ?? imgForbiddenCity);

const palaceLineageItems: PalaceLineageItem[] = [
  { id: "erlitou-palace", name: "二里头宫殿区", period: "先秦", level: "早期王权中心", functionType: "礼制 + 王权", feature: "宫殿原型", value: "建立王权中心与礼制空间并置关系。", image: palaceImage("二里头宫殿区"), color: "#a8712f" },
  { id: "han-weiyang", name: "汉未央宫", period: "秦汉", level: "帝国都城中枢", functionType: "大朝 + 政务", feature: "宫城扩展", value: "形成大尺度宫城与都城主轴协同。", image: palaceImage("汉未央宫"), color: "#b47d35" },
  { id: "tang-daming", name: "唐大明宫", period: "隋唐", level: "帝国礼仪中心", functionType: "礼制 + 朝会", feature: "中轴强化", value: "实现礼仪空间、宫城与都城关系成熟化。", image: palaceImage("唐大明宫"), color: "#c58f45" },
  { id: "song-capital", name: "宋东京宫城", period: "宋元", level: "都城宫城", functionType: "政务 + 礼制", feature: "制度调整", value: "在城市商业扩张背景下重组宫城秩序。", image: palaceImage("宋东京宫城"), color: "#9f6f47" },
  { id: "yuan-capital", name: "元大都宫城", period: "宋元", level: "新都宫城", functionType: "政务 + 城市中枢", feature: "轴线重组", value: "为明清中轴秩序成熟提供关键过渡。", image: palaceImage("元大都宫城"), color: "#8f5f42" },
  { id: "forbidden-city", name: "北京故宫", period: "明清", level: "最高礼制中心", functionType: "国家仪式 + 皇权象征", feature: "前朝后寝", value: "中轴、等级、礼制高度制度化的成熟范式。", image: palaceImage("北京故宫"), color: "#8f4b33" },
  { id: "shenyang-palace", name: "沈阳故宫", period: "明清", level: "陪都宫殿", functionType: "礼制 + 政务", feature: "满汉复合礼制", value: "展示多元礼制传统在宫殿空间中的融合。", image: palaceImage("沈阳故宫"), color: "#7e593f" },
  { id: "yuanmingyuan", name: "圆明园宫苑体系", period: "明清", level: "宫苑体系", functionType: "礼制 + 生活 + 游憩", feature: "宫苑复合", value: "体现礼制核心之外的皇家生活与景观组织。", image: palaceImage("圆明园宫苑体系"), color: "#9a7448" },
];

const palaceStructureDetailsMap: Record<
  string,
  {
    name: string;
    spatialRange: string;
    userGroup: string;
    openness: number;
    controlStrength: number;
    spaceFunction: string;
    ritualMeaning: string;
    representativeCase: string;
  }
> = {
  "outer-city": {
    name: "外城",
    spatialRange: "都城外围与社会生活区域",
    userGroup: "普通居民、商旅、工匠、官员等",
    openness: 5,
    controlStrength: 2,
    spaceFunction: "承载城市生活、交通、市场与社会秩序",
    ritualMeaning: "外城构成皇权空间之外的社会基础，是都城运行的外围层级",
    representativeCase: "明清北京外城、隋唐长安外郭城",
  },
  "imperial-city": {
    name: "皇城",
    spatialRange: "外城与宫城之间的国家机构和礼制缓冲区域",
    userGroup: "官员、礼官、侍卫、管理机构人员",
    openness: 3,
    controlStrength: 4,
    spaceFunction: "连接城市治理、国家机构与宫城核心",
    ritualMeaning: "皇城是城市公共空间向皇权核心过渡的缓冲层",
    representativeCase: "明清北京皇城、唐长安皇城",
  },
  "palace-city": {
    name: "宫城",
    spatialRange: "皇城之内，皇权核心区域",
    userGroup: "皇帝、后妃、近侍、核心礼官",
    openness: 1,
    controlStrength: 5,
    spaceFunction: "承载国家仪式、政务象征与皇家生活",
    ritualMeaning: "皇权空间的最高等级核心，权力由外向内收束于此。",
    representativeCase: "北京故宫、唐大明宫核心区",
  },
  axis: {
    name: "中轴线",
    spatialRange: "贯通外城、皇城、宫城、前朝与后寝的秩序主线",
    userGroup: "皇帝、百官、礼官、仪仗与侍卫队列",
    openness: 2,
    controlStrength: 5,
    spaceFunction: "组织礼仪路径、空间等级递进与权力展示节奏",
    ritualMeaning: "以线性秩序强化“居中而治”的国家象征。",
    representativeCase: "北京中轴线、明清故宫中轴序列",
  },
  front: {
    name: "前朝",
    spatialRange: "宫城中轴前部的礼仪与政务空间",
    userGroup: "皇帝、百官、使节、礼官",
    openness: 2,
    controlStrength: 5,
    spaceFunction: "举行大朝、册封、典礼和政务象征活动",
    ritualMeaning: "前朝是国家仪式与皇权展示的公共礼制核心",
    representativeCase: "北京故宫三大殿、唐大明宫含元殿区域",
  },
  rear: {
    name: "后寝",
    spatialRange: "宫城中轴后部的内廷生活空间",
    userGroup: "皇帝、后妃、皇室成员、近侍",
    openness: 1,
    controlStrength: 5,
    spaceFunction: "承担起居、内廷生活和皇室日常活动",
    ritualMeaning: "后寝体现前朝后寝制度，是宫城内部最私密的生活层级",
    representativeCase: "北京故宫后三宫、乾清宫区域",
  },
  "ritual-wing": {
    name: "礼制侧翼",
    spatialRange: "宫城或皇城左右两侧的祭祀礼制空间",
    userGroup: "皇帝、礼官、祭祀人员",
    openness: 2,
    controlStrength: 4,
    spaceFunction: "宗庙祭祀、社稷祭祀和国家礼制辅助",
    ritualMeaning: "礼制侧翼使宫城不只是政务中心，也成为国家祭祀秩序的组织中心",
    representativeCase: "北京太庙、北京社稷坛",
  },
};

const palaceStructureNodes = [
  { key: "outer-city", id: "outer-city", name: "外城", left: "50%", top: "9.5%", hitWidth: "24%", hitHeight: "11%" },
  { key: "imperial-city", id: "imperial-city", name: "皇城", left: "50%", top: "22.5%", hitWidth: "22%", hitHeight: "11%" },
  { key: "palace-city", id: "palace-city", name: "宫城", left: "50%", top: "36%", hitWidth: "20%", hitHeight: "11%" },
  { key: "front", id: "front", name: "前朝", left: "50%", top: "45%", hitWidth: "17%", hitHeight: "12%" },
  { key: "rear", id: "rear", name: "后寝", left: "50%", top: "60%", hitWidth: "16%", hitHeight: "11%" },
  { key: "ritual-wing-left", id: "ritual-wing", name: "礼制侧翼", left: "30.5%", top: "49%", hitWidth: "14%", hitHeight: "12%" },
  { key: "ritual-wing-right", id: "ritual-wing", name: "礼制侧翼", left: "69.5%", top: "49%", hitWidth: "14%", hitHeight: "12%" },
  { key: "axis", id: "axis", name: "中轴线", left: "50%", top: "50%", hitWidth: "11%", hitHeight: "80%" },
] as const;

const palaceCapitalSamples = [
  {
    id: "erlitou",
    name: "二里头宫殿区",
    image: "/diagrams/capital-axis-erlitou.png",
    period: "夏商时期",
    palacePosition: "位于早期都邑或聚落核心区域",
    axisRelation: "出现宫殿院落和轴线组织雏形，中轴关系尚处早期发展阶段",
    cityStructure: "宫殿区与宗庙、作坊等空间共同构成早期王权中心",
    ritualMeaning: "宫殿空间开始成为政治、祭祀和王权表达的核心",
    representativeValue: "体现中国早期宫殿空间和王权中心形成的重要线索",
    diagram: {
      cityInset: "14%",
      palaceLeft: "48%",
      palaceTop: "47%",
      palaceWidth: "26%",
      palaceHeight: "22%",
      axisLeft: "52%",
      relationTag: "轴线雏形",
      relationTagLeft: "62%",
      relationTagTop: "33%",
      cityTag: "早期都邑核心",
      cityTagLeft: "16%",
      cityTagTop: "17%",
    },
  },
  {
    id: "sui-tang-changan",
    name: "隋唐长安",
    image: "/diagrams/capital-axis-changan.png",
    period: "隋唐",
    palacePosition: "宫城位于都城北部中轴附近，与皇城和外郭城形成层级关系",
    axisRelation: "宫城与朱雀大街等都城轴线共同组织城市秩序",
    cityStructure: "外郭城、皇城、宫城层次分明，坊市制度强化城市管理",
    ritualMeaning: "通过宫城位置和南北轴线强化中央集权与礼制秩序",
    representativeValue: "体现中国古代礼制都城和宫城规划的成熟形态",
    diagram: {
      cityInset: "8%",
      palaceLeft: "50%",
      palaceTop: "25%",
      palaceWidth: "20%",
      palaceHeight: "16%",
      axisLeft: "50%",
      relationTag: "朱雀大街 / 都城轴线",
      relationTagLeft: "62%",
      relationTagTop: "55%",
      cityTag: "外郭城—皇城—宫城",
      cityTagLeft: "12%",
      cityTagTop: "80%",
    },
  },
  {
    id: "ming-qing-beijing",
    name: "明清北京",
    image: "/diagrams/capital-axis-beijing.png",
    period: "明清",
    palacePosition: "紫禁城位于北京城中轴核心，处于皇城之内",
    axisRelation: "中轴线贯穿宫门、三大殿、后三宫，并延伸至城市礼制空间",
    cityStructure: "外城、内城、皇城、宫城层级分明，形成由城市到皇权核心的空间收束",
    ritualMeaning: "中轴线将皇权秩序扩展到整个都城结构",
    representativeValue: "中国古代都城中轴秩序和皇宫礼制空间高度成熟的代表",
    linkCaseName: "北京故宫",
    diagram: {
      cityInset: "6%",
      palaceLeft: "50%",
      palaceTop: "47%",
      palaceWidth: "18%",
      palaceHeight: "20%",
      axisLeft: "50%",
      relationTag: "北京中轴线",
      relationTagLeft: "64%",
      relationTagTop: "18%",
      cityTag: "外城—内城—皇城—宫城",
      cityTagLeft: "11%",
      cityTagTop: "82%",
    },
  },
] as const;

type PalaceAccessRoleKey = "emperor" | "officials" | "ritual-officers" | "guards" | "public";
type PalaceAccessState = "allow" | "limited" | "deny";

const palaceAccessRoleLabels: Array<{ key: PalaceAccessRoleKey; label: string }> = [
  { key: "emperor", label: "皇帝" },
  { key: "officials", label: "百官" },
  { key: "ritual-officers", label: "礼官" },
  { key: "guards", label: "侍卫" },
  { key: "public", label: "普通民众" },
];

const palacePermissionLabelMap: Record<PalaceAccessState, string> = {
  allow: "可进入",
  limited: "受限进入",
  deny: "不可进入",
};

const palaceRitualAccessSpaces = [
  {
    id: "main-hall",
    name: "正殿",
    ritualLevel: "最高礼制核心",
    userGroup: "皇帝、百官、使节、礼官",
    ritualFunction: "大朝、册封、典礼、政务象征",
    accessibility: "高度受限",
    symbolicMeaning: "皇权至高无上与国家礼制中心",
    representativeCase: "北京故宫太和殿、唐大明宫含元殿",
    axisNodeIds: ["hall"],
    permissions: {
      emperor: "allow",
      officials: "limited",
      "ritual-officers": "limited",
      guards: "limited",
      public: "deny",
    } satisfies Record<PalaceAccessRoleKey, PalaceAccessState>,
  },
  {
    id: "grand-court",
    name: "广庭",
    ritualLevel: "公共仪式空间",
    userGroup: "百官、仪仗、侍卫、礼官",
    ritualFunction: "候朝、集结、仪仗排列、大型礼仪活动",
    accessibility: "受礼制约束",
    symbolicMeaning: "通过尺度与秩序强化皇权威仪",
    representativeCase: "太和门前广场、含元殿前庭",
    axisNodeIds: ["court"],
    permissions: {
      emperor: "allow",
      officials: "allow",
      "ritual-officers": "allow",
      guards: "allow",
      public: "deny",
    } satisfies Record<PalaceAccessRoleKey, PalaceAccessState>,
  },
  {
    id: "palace-gate",
    name: "宫门",
    ritualLevel: "入口控制空间",
    userGroup: "皇帝、百官、侍卫、礼官",
    ritualFunction: "出入控制、仪式入口、内外区隔",
    accessibility: "严格管控",
    symbolicMeaning: "区分城市空间与皇权禁地",
    representativeCase: "北京故宫午门、唐大明宫丹凤门",
    axisNodeIds: ["gate"],
    permissions: {
      emperor: "allow",
      officials: "limited",
      "ritual-officers": "limited",
      guards: "allow",
      public: "deny",
    } satisfies Record<PalaceAccessRoleKey, PalaceAccessState>,
  },
  {
    id: "rear-bedroom",
    name: "后寝",
    ritualLevel: "内廷私密空间",
    userGroup: "皇帝、后妃、皇室成员、近侍",
    ritualFunction: "起居生活、内廷事务、皇室日常",
    accessibility: "极低开放",
    symbolicMeaning: "前朝后寝制度中的内廷生活核心",
    representativeCase: "北京故宫后三宫、乾清宫区域",
    axisNodeIds: ["bedroom"],
    permissions: {
      emperor: "allow",
      officials: "deny",
      "ritual-officers": "deny",
      guards: "limited",
      public: "deny",
    } satisfies Record<PalaceAccessRoleKey, PalaceAccessState>,
  },
  {
    id: "side-ritual",
    name: "左祖右社",
    ritualLevel: "辅助祭祀空间",
    userGroup: "皇帝、礼官、祭祀人员",
    ritualFunction: "祖先祭祀、社稷祭祀、国家礼制表达",
    accessibility: "严格管控",
    symbolicMeaning: "宗法秩序与国家社稷的礼制象征",
    representativeCase: "北京太庙、北京社稷坛",
    axisNodeIds: ["left-ancestor", "right-sheji"],
    permissions: {
      emperor: "allow",
      officials: "limited",
      "ritual-officers": "allow",
      guards: "limited",
      public: "deny",
    } satisfies Record<PalaceAccessRoleKey, PalaceAccessState>,
  },
] as const;

const palaceRitualStairOrder = ["main-hall", "grand-court", "palace-gate", "side-ritual", "rear-bedroom"] as const;
const palaceRitualMatrixOrder = ["main-hall", "grand-court", "palace-gate", "rear-bedroom", "side-ritual"] as const;

const palaceCaseStageOrder = ["erlitou-palace", "han-weiyang-palace", "daming-palace", "forbidden-city"] as const;

type PalaceCaseDeepMeta = {
  stage: string;
  stageRole: string;
  period: string;
  caseType: string;
  spaceStructure: string;
  ritualMeaning: string;
  developmentPosition: string;
  maturity: {
    axis: number;
    scale: number;
    ritual: number;
    capital: number;
  };
  vrLink: string;
};

const palaceDeepReadDimensions = [
  { key: "axis", label: "中轴性", description: "是否形成清晰的空间轴线" },
  { key: "scale", label: "宫城规模", description: "是否形成集中复杂的宫城空间" },
  { key: "ritual", label: "礼制等级", description: "是否承担国家仪式与等级表达" },
  { key: "capital", label: "都城关联", description: "是否嵌入城市中轴与都城结构" },
] as const;

const palaceCaseDeepMetaMap: Record<(typeof palaceCaseStageOrder)[number], PalaceCaseDeepMeta> = {
  "erlitou-palace": {
    stage: "宫殿制度萌芽",
    stageRole: "说明皇宫空间的早期雏形",
    period: "夏商时期",
    caseType: "早期王权中心",
    spaceStructure: "以夯土基址、院落和轴线组织为主要特征，宫殿区开始形成相对集中的核心空间。",
    ritualMeaning: "宫殿区与宗庙、祭祀空间共同构成早期王权表达场所，体现政治权力与礼制活动的初步结合。",
    developmentPosition: "它是皇宫专题的起点，说明宫殿空间并非突然成熟，而是从早期王权中心逐步走向制度化。",
    maturity: { axis: 2, scale: 2, ritual: 2, capital: 1 },
    vrLink: "https://www.720yun.com/t/87vki7qeO8b?scene_id=35219794",
  },
  "han-weiyang-palace": {
    stage: "宫城规模扩展",
    stageRole: "说明国家权力空间扩大",
    period: "西汉时期",
    caseType: "帝国宫城中枢",
    spaceStructure: "以大尺度台基、宫殿组群与轴线关系组织宫城核心，形成更明确的宫城层级与空间秩序。",
    ritualMeaning: "未央宫承载朝会、政务与礼仪表达，强化了宫殿作为国家权力中心与制度舞台的地位。",
    developmentPosition: "它标志皇宫从早期原型走向规模化，推动宫城由“王权中心”进入“帝国制度空间”的关键阶段。",
    maturity: { axis: 3, scale: 4, ritual: 3, capital: 3 },
    vrLink: "https://www.720yun.com/t/ecdjrrtm5u4?scene_id=24868693",
  },
  "daming-palace": {
    stage: "中轴秩序强化",
    stageRole: "说明宫殿与都城中轴结合",
    period: "唐代",
    caseType: "礼制都城宫殿",
    spaceStructure: "宫殿组群沿主轴展开并与都城秩序协同，前朝后寝、门庭层级与景观视线组织更加成熟。",
    ritualMeaning: "大明宫将帝国礼仪、朝会制度与宫廷秩序整合为统一空间体系，礼制表达进入高成熟阶段。",
    developmentPosition: "它承上启下，说明皇宫不仅是宫内秩序系统，也开始深度影响都城尺度的礼制结构。",
    maturity: { axis: 4, scale: 4, ritual: 4, capital: 4 },
    vrLink: "https://www.720yun.com/t/a36jvdhara1?scene_id=18526131",
  },
  "forbidden-city": {
    stage: "礼制空间成熟",
    stageRole: "说明皇宫制度高度定型",
    period: "明清时期",
    caseType: "礼制成熟皇宫范式",
    spaceStructure: "紫禁城以中轴主线统摄宫门、三大殿与后三宫，形成由外至内、层层递进的完整宫城系统。",
    ritualMeaning: "其礼制等级、功能分区与建筑象征高度统一，成为国家仪式与皇权秩序最成熟的空间表达。",
    developmentPosition: "它是皇宫发展链的终点样本，标志中轴、礼制与宫城制度在都城尺度上实现高度定型。",
    maturity: { axis: 5, scale: 5, ritual: 5, capital: 5 },
    vrLink: "https://pano.dpm.org.cn/#/panorama?panorama_id=50&scene_id=3036&scene_name=scene_3036_summer",
  },
};

type TopicProfile = {
  themeLabel: string;
  heroSurface: string;
  heroOverlay: string;
  heroPattern: string;
  heroPatternSize: string;
  sectionSurface: string;
  coreQuestion: string;
  oneLiner: string;
  focusModules: string[];
  conceptCards: Array<{ term: string; summary: string }>;
  quickQuestions: string[];
  learningActions: string[];
  evolutionDrivers: string[];
  comparisonHint: { target: string; angle: string };
};

type FocusModuleKey = "timeline" | "lineage" | "region" | "structure" | "interaction" | "case" | null;

const projectChinaPoint = ([lon, lat]: [number, number]) => {
  const x = ((lon - 73) / 62) * 340;
  const y = ((54 - lat) / 36) * 240;
  return [Number(x.toFixed(2)), Number(y.toFixed(2))] as const;
};

const ringToPath = (ring: number[][]) =>
  ring
    .map((point, index) => {
      const [x, y] = projectChinaPoint(point as [number, number]);
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ") + " Z";

const geoJsonToSvgPaths = (geojson: any) => {
  const features = Array.isArray(geojson?.features) ? geojson.features : [];
  return features.flatMap((feature: any) => {
    const geometry = feature?.geometry;
    if (!geometry) return [];
    if (geometry.type === "Polygon") return geometry.coordinates.map((ring: number[][]) => ringToPath(ring));
    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates.flatMap((polygon: number[][][]) => polygon.map((ring: number[][]) => ringToPath(ring)));
    }
    return [];
  });
};

const topicProfiles: Record<TopicCompetitionContent["key"], TopicProfile> = {
  residential: {
    themeLabel: "烟火居住",
    heroSurface: "linear-gradient(135deg,rgba(97,62,41,0.98),rgba(58,40,31,0.95))",
    heroOverlay: "linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.58)), linear-gradient(135deg,rgba(143,91,51,0.3),rgba(152,82,54,0.08))",
    heroPattern: "repeating-linear-gradient(0deg,rgba(255,240,218,0.14) 0 2px,transparent 2px 14px), repeating-linear-gradient(90deg,rgba(255,240,218,0.12) 0 2px,transparent 2px 18px)",
    heroPatternSize: "280px 180px",
    sectionSurface: "linear-gradient(180deg,rgba(255,251,244,0.94),rgba(243,235,222,0.96))",
    coreQuestion: "古代民居如何同时适应气候、家族结构和地域生活方式？",
    oneLiner: "民居不是单纯房屋类型，而是家庭秩序、材料技术与地方环境共同塑造的生活空间。",
    focusModules: ["地域差异", "生活场景", "气候适应", "家族组织"],
    conceptCards: [
      { term: "地域适应", summary: "民居形态受气候、地形、水系和材料影响。" },
      { term: "家族秩序", summary: "院落布局体现长幼、内外与宗族关系。" },
      { term: "地方材料", summary: "木、砖、石、土、夯土因地制宜使用。" },
      { term: "生活空间", summary: "起居、生产、防御、礼俗共同构成居住形态。" },
    ],
    quickQuestions: [
      "为什么福建土楼适合宗族聚居？",
      "北京四合院体现了怎样的家庭秩序？",
      "徽州民居为什么多用马头墙？",
    ],
    learningActions: ["帮我总结本专题", "生成民居学习卡片", "对比四合院与土楼"],
    evolutionDrivers: ["气候带差异", "家族组织方式", "地方材料与工艺"],
    comparisonHint: { target: "福建土楼", angle: "对比围合逻辑与共同体组织方式" },
  },
  government: {
    themeLabel: "制度秩序",
    heroSurface: "linear-gradient(135deg,rgba(66,31,26,0.98),rgba(34,18,16,0.96))",
    heroOverlay: "linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.62)), linear-gradient(135deg,rgba(122,75,49,0.25),rgba(149,53,38,0.1))",
    heroPattern: "repeating-linear-gradient(90deg,rgba(219,184,151,0.17) 0 3px,transparent 3px 22px), radial-gradient(circle at 8% 24%,rgba(231,194,150,0.2) 0 18px,transparent 19px)",
    heroPatternSize: "220px 220px",
    sectionSurface: "linear-gradient(180deg,rgba(252,248,243,0.94),rgba(240,231,220,0.96))",
    coreQuestion: "官署建筑如何把行政等级与礼法秩序转化为可见的空间程序？",
    oneLiner: "官署的核心不在造型，而在门、堂、院、宅层层递进形成的治理动线。",
    focusModules: ["空间序列", "等级秩序", "公私分区", "城市治理"],
    conceptCards: [
      { term: "仪门", summary: "建立进入门槛，强化身份筛选与秩序感。" },
      { term: "大堂", summary: "承载审理与发布，是官署权力界面。" },
      { term: "前公后私", summary: "通过空间分区组织行政与后勤系统。" },
    ],
    quickQuestions: [
      "衙署为什么要有明显的中轴线？",
      "大堂、二堂、后宅分别承担什么功能？",
      "官署建筑如何体现等级制度？",
    ],
    learningActions: ["帮我总结本专题", "生成官署学习卡片", "对比中央官署与地方衙署"],
    evolutionDrivers: ["中央-地方治理体系", "礼法程序标准化", "城市主轴与官署耦合"],
    comparisonHint: { target: "北宋开封府", angle: "对比同为政务核心的空间序列差异" },
  },
  palace: {
    themeLabel: "皇家礼制",
    heroSurface: "linear-gradient(135deg,rgba(105,35,25,0.98),rgba(58,19,13,0.96))",
    heroOverlay: "linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.6)), linear-gradient(135deg,rgba(170,122,31,0.34),rgba(44,79,129,0.12))",
    heroPattern: "repeating-linear-gradient(90deg,rgba(246,207,149,0.16) 0 2px,transparent 2px 26px), repeating-linear-gradient(180deg,rgba(246,207,149,0.12) 0 2px,transparent 2px 24px)",
    heroPatternSize: "260px 220px",
    sectionSurface: "linear-gradient(180deg,rgba(254,249,240,0.94),rgba(245,236,222,0.96))",
    coreQuestion: "皇宫空间如何通过中轴节点与礼制权限形成秩序？",
    oneLiner: "皇宫是中轴性、象征性与礼制性的集中表达，体现了国家秩序的空间化。",
    focusModules: ["中轴层级", "礼制空间", "前朝后寝", "权力象征"],
    conceptCards: [
      { term: "中轴线", summary: "以空间递进表达等级、秩序与中心性。" },
      { term: "前朝后寝", summary: "前部重礼仪政务，后部重居住日常。" },
      { term: "三朝五门", summary: "通过门庭系统放大礼制层级与仪式感。" },
    ],
    quickQuestions: [
      "紫禁城为什么强调中轴对称？",
      "前朝后寝是什么意思？",
      "宫殿建筑如何体现皇权？",
    ],
    learningActions: ["帮我总结本专题", "生成皇宫学习卡片", "对比未央宫与故宫"],
    evolutionDrivers: ["都城制度演化", "礼制等级强化", "皇家营造技术升级"],
    comparisonHint: { target: "汉未央宫", angle: "对比不同时代中轴与礼制表达策略" },
  },
  bridge: {
    themeLabel: "工程智慧",
    heroSurface: "linear-gradient(135deg,rgba(34,73,62,0.98),rgba(24,50,45,0.96))",
    heroOverlay: "linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.52)), linear-gradient(135deg,rgba(85,122,107,0.32),rgba(76,139,167,0.12))",
    heroPattern: "repeating-radial-gradient(circle at 20% 110%,rgba(193,236,223,0.18) 0 6px,transparent 6px 18px), repeating-linear-gradient(12deg,rgba(176,222,210,0.14) 0 2px,transparent 2px 14px)",
    heroPatternSize: "260px 160px",
    sectionSurface: "linear-gradient(180deg,rgba(247,251,248,0.94),rgba(233,241,236,0.96))",
    coreQuestion: "桥梁如何在跨越能力、结构稳定与水文适应之间实现平衡？",
    oneLiner: "桥梁不仅连接道路，也连接工程技术、城市网络与区域文明交流。",
    focusModules: ["桥型结构", "受力逻辑", "交通功能", "水文适配"],
    conceptCards: [
      { term: "拱券结构", summary: "将桥面荷载传导到桥台，提升跨度与稳定性。" },
      { term: "敞肩拱", summary: "减轻自重并增强泄洪能力，是赵州桥关键创新。" },
      { term: "梁桥系统", summary: "构造直接，适合中小跨度与高频通行场景。" },
    ],
    quickQuestions: [
      "赵州桥为什么是工程奇迹？",
      "石拱桥和梁桥有什么区别？",
      "古代桥梁如何兼顾交通和水利？",
    ],
    learningActions: ["帮我总结本专题", "生成桥梁学习卡片", "对比赵州桥与卢沟桥"],
    evolutionDrivers: ["水系与地貌条件", "交通网络升级", "结构材料与施工技术"],
    comparisonHint: { target: "卢沟桥", angle: "对比结构创新与交通场景侧重点" },
  },
};

const TopicCompetitionShowcase = ({ content }: Props) => {
  const profile = topicProfiles[content.key];
  const floatingTocItems =
    content.key === "residential"
      ? residentialTocItems
      : content.key === "government"
        ? governmentTocItems
        : content.key === "palace"
          ? palaceTocItems
          : content.key === "bridge"
            ? bridgeTocItems
            : [];
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(content.timeline.length - 1);
  const [activeRegionIndex, setActiveRegionIndex] = useState(0);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activeResidentialIndex, setActiveResidentialIndex] = useState(0);
  const [activeResidentialSpaceIndex, setActiveResidentialSpaceIndex] = useState(2);
  const [activeGovernmentIndex, setActiveGovernmentIndex] = useState(0);
  const [activeGovernmentFlowIndex, setActiveGovernmentFlowIndex] = useState(0);
  const [activePalacePlanId, setActivePalacePlanId] = useState("hall");
  const [activeBridgeIndex, setActiveBridgeIndex] = useState(0);
  const [aiFocusedModule, setAiFocusedModule] = useState<FocusModuleKey>(null);
  const [activeResidentialStageIndex, setActiveResidentialStageIndex] = useState(residentialTimelineStages.length - 1);
  const [lineagePeriodFilter, setLineagePeriodFilter] = useState("全部时期");
  const [lineageRegionFilter, setLineageRegionFilter] = useState("全部地域");
  const [lineageTypeFilter, setLineageTypeFilter] = useState("全部类型");
  const [lineageFeatureFilter, setLineageFeatureFilter] = useState("全部特征");
  const [lineageExpanded, setLineageExpanded] = useState(false);
  const [governmentPeriodFilter, setGovernmentPeriodFilter] = useState("全部时期");
  const [governmentLevelFilter, setGovernmentLevelFilter] = useState("全部层级");
  const [governmentFunctionFilter, setGovernmentFunctionFilter] = useState("全部功能");
  const [governmentFeatureFilter, setGovernmentFeatureFilter] = useState("全部特征");
  const [governmentLineageExpanded, setGovernmentLineageExpanded] = useState(false);
  const [palacePeriodFilter, setPalacePeriodFilter] = useState("全部时期");
  const [palaceFunctionFilter, setPalaceFunctionFilter] = useState("全部功能");
  const [palaceFeatureFilter, setPalaceFeatureFilter] = useState("全部空间特征");
  const [palaceLineageExpanded, setPalaceLineageExpanded] = useState(false);
  const [bridgePeriodFilter, setBridgePeriodFilter] = useState("全部朝代");
  const [bridgeTypeFilter, setBridgeTypeFilter] = useState("全部桥型");
  const [bridgeStageFilter, setBridgeStageFilter] = useState("全部阶段");
  const [bridgeRegionFilter, setBridgeRegionFilter] = useState("全部水系");
  const [bridgeLineageExpanded, setBridgeLineageExpanded] = useState(false);
  const [activePalaceCapitalSampleId, setActivePalaceCapitalSampleId] = useState("sui-tang-changan");
  const [activePalaceStructureId, setActivePalaceStructureId] = useState("outer-city");
  const [activePalaceAccessSpaceId, setActivePalaceAccessSpaceId] = useState("palace-gate");
  const [activeResidentialRegionIndex, setActiveResidentialRegionIndex] = useState(0);
  const [activeResidentialPlanSpaceId, setActiveResidentialPlanSpaceId] = useState("main-room");
  const [activeResidentialCaseId, setActiveResidentialCaseId] = useState("siheyuan");
  const [compareLeftId, setCompareLeftId] = useState("siheyuan");
  const [compareRightId, setCompareRightId] = useState("fujian-tulou");
  const [activeSectionId, setActiveSectionId] = useState(floatingTocItems[0]?.id ?? "section-overview");
  const [residentialMapPaths, setResidentialMapPaths] = useState<string[]>([]);
  const [showResidentialStructure, setShowResidentialStructure] = useState(false);
  const [aiSeedQuestion, setAiSeedQuestion] = useState("");
  const [structureZoom, setStructureZoom] = useState(1);
  const [structurePan, setStructurePan] = useState({ x: 0, y: 0 });
  const [structureDragStart, setStructureDragStart] = useState<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const structureViewerRef = useRef<HTMLDivElement | null>(null);

  const activeTimeline = content.timeline[activeTimelineIndex] ?? content.timeline[0];
  const activeRegion = content.regions.zones[activeRegionIndex] ?? content.regions.zones[0];
  const activeCase = content.cases[activeCaseIndex] ?? content.cases[0];
  const resolvePalaceCaseMeta = (caseItem: TopicCompetitionContent["cases"][number]) => {
    const direct = palaceCaseDeepMetaMap[caseItem.id as keyof typeof palaceCaseDeepMetaMap];
    if (direct) return direct;
    if (caseItem.name.includes("二里头")) return palaceCaseDeepMetaMap["erlitou-palace"];
    if (caseItem.name.includes("未央宫")) return palaceCaseDeepMetaMap["han-weiyang-palace"];
    if (caseItem.name.includes("大明宫")) return palaceCaseDeepMetaMap["daming-palace"];
    if (caseItem.name.includes("故宫")) return palaceCaseDeepMetaMap["forbidden-city"];
    return palaceCaseDeepMetaMapFallback;
  };
  const palaceCaseDeepMetaMapFallback = palaceCaseDeepMetaMap["erlitou-palace"];
  const activePalaceCaseMeta = content.key === "palace" ? resolvePalaceCaseMeta(activeCase) : palaceCaseDeepMetaMapFallback;
  const palaceCaseStageChain =
    content.key === "palace"
      ? palaceCaseStageOrder
          .map((caseId) => {
            const caseIndex = content.cases.findIndex(item => item.id === caseId);
            if (caseIndex < 0) return null;
            const caseItem = content.cases[caseIndex];
            return {
              caseIndex,
              caseItem,
              meta: resolvePalaceCaseMeta(caseItem),
            };
          })
          .filter((item): item is { caseIndex: number; caseItem: TopicCompetitionContent["cases"][number]; meta: PalaceCaseDeepMeta } => Boolean(item))
      : [];
  const palaceMaturityMetrics = [
    { key: "axis", label: "中轴性", value: activePalaceCaseMeta.maturity.axis },
    { key: "scale", label: "宫城规模", value: activePalaceCaseMeta.maturity.scale },
    { key: "ritual", label: "礼制等级", value: activePalaceCaseMeta.maturity.ritual },
    { key: "capital", label: "都城关联", value: activePalaceCaseMeta.maturity.capital },
  ] as const;
  const activeResidential = residentialPanels[activeResidentialIndex] ?? residentialPanels[0];
  const activeResidentialPin = residentialMapPins.find(item => item.id === activeResidential.id) ?? residentialMapPins[0];
  const selectedResidentialSpace =
    activeResidential.spaces[activeResidentialSpaceIndex] ?? activeResidential.spaces[0] ?? "院落空间";
  const activeGovernment = governmentPanels[activeGovernmentIndex] ?? governmentPanels[0];
  const activeGovernmentFlow = governmentProcessFlow[activeGovernmentFlowIndex] ?? governmentProcessFlow[0];
  const activePalaceAxisDetail = palaceAxisDetailMap[activePalacePlanId] ?? palaceAxisDetailMap.hall;
  const activePalaceStructure =
    palaceStructureDetailsMap[activePalaceStructureId] ?? palaceStructureDetailsMap["outer-city"];
  const activePalaceCapitalSample =
    palaceCapitalSamples.find(item => item.id === activePalaceCapitalSampleId) ?? palaceCapitalSamples[1];
  const activePalaceAccessSpace =
    palaceRitualAccessSpaces.find(item => item.id === activePalaceAccessSpaceId) ?? palaceRitualAccessSpaces[0];
  const activePalaceEvolution = palaceEvolutionMap[activeTimeline.period] ?? palaceEvolutionMap["明清紫禁城成熟"];
  const activeBridge = bridgePanels[activeBridgeIndex] ?? bridgePanels[0];
  const activeResidentialStage = residentialTimelineStages[activeResidentialStageIndex] ?? residentialTimelineStages[0];
  const activeResidentialStageObjects = residentialLineageItems.filter(item => activeResidentialStage.objectIds.includes(item.id));
  const activeResidentialRegion = residentialRegionAtlas[activeResidentialRegionIndex] ?? residentialRegionAtlas[0];
  const activeResidentialRegionObjects = residentialLineageItems.filter(item => activeResidentialRegion.objectIds.includes(item.id));
  const activeResidentialPlanSpace = residentialSpaces.find(item => item.id === activeResidentialPlanSpaceId) ?? residentialSpaces[2];
  const residentialMaturityData = residentialTimelineStages.map((stage, index) => ({
    period: stage.period,
    value: 58 + index * 9,
    node: [
      "二里头：早期居住",
      "汉代坞壁：防御聚居",
      "隋唐里坊：城市住宅制度化",
      "宋元宅第：合院成熟",
      "明清地域民居：多样化高峰",
    ][index],
  }));
  const activeResidentialCase =
    residentialLineageItems.find(item => item.id === activeResidentialCaseId) ??
    residentialLineageItems.find(item => item.id === "siheyuan") ??
    residentialLineageItems[0];
  const activeResidentialDeepDive =
    residentialCaseDeepDives[activeResidentialCaseId as keyof typeof residentialCaseDeepDives] ??
    residentialCaseDeepDives.siheyuan;
  const residentialCaseTabs = residentialClassicIds.map(id => residentialCaseDeepDives[id as keyof typeof residentialCaseDeepDives]);
  const compareLeft = residentialLineageItems.find(item => item.id === compareLeftId) ?? residentialLineageItems[9];
  const compareRight = residentialLineageItems.find(item => item.id === compareRightId) ?? residentialLineageItems[11];
  const lineagePeriodOptions = ["全部时期", ...Array.from(new Set(residentialLineageItems.map(item => item.period)))];
  const lineageRegionOptions = ["全部地域", ...Array.from(new Set(residentialLineageItems.map(item => item.region)))];
  const lineageTypeOptions = ["全部类型", ...Array.from(new Set(residentialLineageItems.map(item => item.type)))];
  const lineageFeatureOptions = ["全部特征", ...Array.from(new Set(residentialLineageItems.map(item => item.feature)))];
  const lineageDefaultVisibleCount = 3;
  const filteredResidentialLineage = residentialLineageItems.filter(item =>
    (lineagePeriodFilter === "全部时期" || item.period === lineagePeriodFilter) &&
    (lineageRegionFilter === "全部地域" || item.region === lineageRegionFilter) &&
    (lineageTypeFilter === "全部类型" || item.type === lineageTypeFilter) &&
    (lineageFeatureFilter === "全部特征" || item.feature === lineageFeatureFilter),
  );
  const visibleResidentialLineage = lineageExpanded ? filteredResidentialLineage : filteredResidentialLineage.slice(0, lineageDefaultVisibleCount);
  const governmentPeriodOptions = ["全部时期", "周", "汉", "魏晋南北朝", "隋唐", "宋元", "明清"];
  const governmentLevelOptions = ["全部层级", "中央官署", "地方府衙", "军政机构", "教育礼制机构"];
  const governmentFunctionOptions = ["全部功能", "行政", "司法", "礼制", "军事", "教育"];
  const governmentFeatureOptions = ["全部特征", "中轴线", "大堂", "门仪", "公私分区", "礼法秩序"];
  const filteredGovernmentLineage = governmentLineageItems.filter(item =>
    (governmentPeriodFilter === "全部时期" || item.period === governmentPeriodFilter) &&
    (governmentLevelFilter === "全部层级" || item.level === governmentLevelFilter) &&
    (governmentFunctionFilter === "全部功能" || item.functions.includes(governmentFunctionFilter)) &&
    (governmentFeatureFilter === "全部特征" || item.features.includes(governmentFeatureFilter)),
  );
  const visibleGovernmentLineage = governmentLineageExpanded ? filteredGovernmentLineage : filteredGovernmentLineage.slice(0, lineageDefaultVisibleCount);
  const palacePeriodOptions = ["全部时期", ...Array.from(new Set(palaceLineageItems.map(item => item.period)))];
  const palaceFunctionOptions = ["全部功能", ...Array.from(new Set(palaceLineageItems.map(item => item.functionType)))];
  const palaceFeatureOptions = ["全部空间特征", ...Array.from(new Set(palaceLineageItems.map(item => item.feature)))];
  const filteredPalaceLineage = palaceLineageItems.filter(item =>
    (palacePeriodFilter === "全部时期" || item.period === palacePeriodFilter) &&
    (palaceFunctionFilter === "全部功能" || item.functionType === palaceFunctionFilter) &&
    (palaceFeatureFilter === "全部空间特征" || item.feature === palaceFeatureFilter),
  );
  const visiblePalaceLineage = palaceLineageExpanded ? filteredPalaceLineage : filteredPalaceLineage.slice(0, lineageDefaultVisibleCount);
  const bridgePeriodOptions = ["全部朝代", ...Array.from(new Set(bridgeLineageItems.map(item => item.period)))];
  const bridgeTypeOptions = ["全部桥型", ...bridgeTypeFilterOrder];
  const bridgeStageOptions = ["全部阶段", ...bridgeStageFilterOrder];
  const bridgeRegionOptions = ["全部水系", ...bridgeRegionFilterOrder];
  const filteredBridgeLineage = bridgeLineageItems.filter(item =>
    (bridgePeriodFilter === "全部朝代" || item.period === bridgePeriodFilter) &&
    (bridgeTypeFilter === "全部桥型" || item.typeTags.includes(bridgeTypeFilter)) &&
    (bridgeStageFilter === "全部阶段" || item.stage === bridgeStageFilter) &&
    (bridgeRegionFilter === "全部水系" || item.regionWater === bridgeRegionFilter),
  );
  const visibleBridgeLineage = bridgeLineageExpanded ? filteredBridgeLineage : filteredBridgeLineage.slice(0, lineageDefaultVisibleCount);
  const governmentAttributeBars = [
    { label: "行政层级", value: activeGovernment.spaceScore, hint: activeGovernment.spaceLabel },
    { label: "开放性", value: activeGovernment.opennessScore, hint: activeGovernment.opennessLabel },
    { label: "权力属性", value: activeGovernment.powerScore, hint: activeGovernment.powerLabel },
  ];
  const residentialAiQuestions = activeResidentialCase
    ? [
        activeResidentialDeepDive.aiQuestion,
        `${activeResidentialDeepDive.name}的空间结构怎么看？`,
        `${activeResidentialDeepDive.name}体现了怎样的${activeResidentialDeepDive.meaning}？`,
        `${activeResidentialCase.name}和${compareRight.name}有什么区别？`,
      ]
    : [];
  const governmentAiQuestions = [
    ...activeGovernment.aiQuestions,
    `比较${activeGovernment.name}与${activeGovernment.relatedCases[0]}的制度空间关系`,
    "总结前衙后宅如何体现官署治理逻辑",
  ];
  const palaceAiQuestions = [
    `从“${activePalaceAxisDetail.name}”看，中轴节点承担了哪些礼制功能？`,
    `为什么“${activePalaceStructure.name}”在皇权空间中处于这一层级？`,
    `请解读“${activePalaceCapitalSample.name}”中都城—宫城—中轴的关系。`,
    `谁能进入“${activePalaceAccessSpace.name}”？它的礼制等级如何区分？`,
    `比较“${activePalaceAccessSpace.name}”与“${activePalaceAxisDetail.name}”在权限和仪式上的差异。`,
  ];
  const topicAiContextBullets =
    content.key === "residential"
      ? [...residentialAiQuestions, "生成学习卡片", "总结本专题", "对比两种民居"]
      : content.key === "government"
        ? governmentAiQuestions
        : content.key === "palace"
          ? [...palaceAiQuestions, ...profile.learningActions]
          : [...profile.quickQuestions, ...profile.learningActions];
  const aiContextTitle =
    content.key === "residential"
      ? `${content.title} / ${activeResidentialCase.name}`
      : content.key === "government"
        ? `${content.title} / ${activeGovernment.name}`
        : `${content.title} / ${activeCase.name}`;
  const aiContextSummary =
    content.key === "residential"
      ? activeResidentialCase.value
      : content.key === "government"
        ? `${activeGovernment.functionLabel}；开放性：${activeGovernment.opennessLabel}；权力属性：${activeGovernment.powerLabel}`
        : content.key === "palace"
          ? `${activePalaceAxisDetail.name} · ${activePalaceStructure.name} · ${activePalaceCapitalSample.name} · ${activePalaceAccessSpace.name}`
          : activeCase.summary;
  const topicAiContextText = [
    `专题：${content.title}`,
    `副标题：${content.subtitle}`,
    content.key === "bridge" ? "" : `核心问题：${profile.coreQuestion}`,
    `一句话总论：${profile.oneLiner}`,
    `专题论点：${content.thesis}`,
    `专题概述：${content.overview}`,
    `当前阶段：${activeTimeline.period} / ${activeTimeline.title}`,
    `阶段摘要：${activeTimeline.summary}`,
    content.key !== "palace" ? `当前区域：${activeRegion.name}` : "",
    content.key !== "palace" ? `区域摘要：${activeRegion.summary}` : "",
    `当前案例：${activeCase.name}`,
    `案例朝代：${activeCase.dynasty}`,
    `案例地点：${activeCase.location}`,
    `案例摘要：${activeCase.summary}`,
    `案例价值：${activeCase.significance}`,
    `案例关键词：${activeCase.keywords.join("、")}`,
    content.key === "government" ? `当前轴线节点：${activeGovernment.name}` : "",
    content.key === "government" ? `节点功能：${activeGovernment.functionLabel}` : "",
    content.key === "government" ? `节点开放性：${activeGovernment.opennessLabel}（${activeGovernment.opennessScore}）` : "",
    content.key === "government" ? `节点权力属性：${activeGovernment.powerLabel}（${activeGovernment.powerScore}）` : "",
    content.key === "government" ? `节点空间属性：${activeGovernment.spaceLabel}（${activeGovernment.spaceScore}）` : "",
    content.key === "government" ? `关联案例：${activeGovernment.relatedCases.join("、")}` : "",
    content.key === "palace" ? `当前中轴节点：${activePalaceAxisDetail.name}` : "",
    content.key === "palace" ? `当前宫城层级：${activePalaceStructure.name}（开放性${activePalaceStructure.openness} / 控制强度${activePalaceStructure.controlStrength}）` : "",
    content.key === "palace" ? `当前都城样本：${activePalaceCapitalSample.name}（${activePalaceCapitalSample.period}）` : "",
    content.key === "palace" ? `当前礼制空间：${activePalaceAccessSpace.name}（${activePalaceAccessSpace.ritualLevel}）` : "",
    content.key === "residential" ? `民居谱系对象：${residentialLineageItems.map(item => `${item.name}（${item.period}/${item.region}/${item.type}）`).join("；")}` : "",
    content.key === "residential" ? `当前民居阶段：${activeResidentialStage.period} / ${activeResidentialStage.name}` : "",
    content.key === "residential" ? `当前地域：${activeResidentialRegion.region} / ${activeResidentialRegion.reason}` : "",
    content.key === "residential" ? `当前重点案例：${activeResidentialCase.name} / ${activeResidentialCase.value}` : "",
    `演进驱动：${profile.evolutionDrivers.join("、")}`,
    `专题结论：${content.conclusion.summary}`,
  ].filter(Boolean).join("\n");
  const timelineChartData = useMemo(() => content.timeline.map((item) => ({ period: item.period, value: item.score })), [content.timeline]);
  const radarData = useMemo(
    () => (
      content.key === "government"
        ? governmentFunctionProfileSeed.map(item => ({
            axis: item.axis,
            value: item.values[Math.min(activeRegionIndex, item.values.length - 1)],
          }))
        : content.structure.axes.map((axis) => ({ axis: axis.label, value: axis.value }))
    ),
    [content.key, content.structure.axes, activeRegionIndex],
  );
  const timelineTitleMap: Record<TopicCompetitionContent["key"], string> = {
    residential: "生活演进脉络",
    government: "对比分析",
    palace: "中轴演进脉络",
    bridge: "工程技术演进脉络",
  };
  const timelineCurveLabelMap: Record<TopicCompetitionContent["key"], string> = {
    residential: "阶段强度曲线",
    government: "官署制度空间演变曲线",
    palace: "制度空间演变图",
    bridge: "桥梁技术成熟度曲线",
  };
  const regionTitleMap: Record<TopicCompetitionContent["key"], string> = {
    residential: "地域生活分布",
    government: "治理网络图",
    palace: "都城—宫城—中轴关系图",
    bridge: "水系交通分布",
  };
  const structureTitleMap: Record<TopicCompetitionContent["key"], string> = {
    residential: "生活空间解剖",
    government: "前衙后宅结构解剖",
    palace: "礼制等级与使用权限图",
    bridge: "桥梁结构解剖",
  };

  const normalizeToken = (value: string) => value.replace(/[\s，。、·\-（）()]/g, "");

  const periodKeywordMap: Record<string, string[]> = {
    "先秦": ["先秦", "周", "夏商"],
    "周代": ["周代", "周"],
    "秦汉": ["秦汉", "秦", "汉"],
    "隋唐": ["隋唐", "隋", "唐"],
    "宋元": ["宋元", "宋", "元"],
    "明清": ["明清", "明", "清"],
    "早期宫殿雏形": ["先秦", "夏商", "周"],
    "秦汉宫城扩展": ["秦汉", "秦", "汉"],
    "隋唐中轴秩序强化": ["隋唐", "隋", "唐"],
    "宋元宫城制度调整": ["宋元", "宋", "元"],
    "明清紫禁城成熟": ["明清", "明", "清"],
  };

  const isNameRelated = (left: string, right: string) => {
    const a = normalizeToken(left);
    const b = normalizeToken(right);
    if (!a || !b) return false;
    const a2 = a.slice(0, 2);
    const b2 = b.slice(0, 2);
    return a.includes(b2) || b.includes(a2);
  };

  const findTimelineIndexForCase = (caseIndex: number) => {
    const target = content.cases[caseIndex];
    if (!target) return 0;
    const byDynasty = content.timeline.findIndex(step => {
      const keywords = periodKeywordMap[step.period] ?? [step.period];
      return keywords.some(word => target.dynasty.includes(word));
    });
    if (byDynasty >= 0) return byDynasty;
    return Math.min(content.timeline.length - 1, caseIndex);
  };

  const findCaseIndexForTimeline = (timelineIndex: number) => {
    const step = content.timeline[timelineIndex];
    if (!step) return 0;
    const keywords = periodKeywordMap[step.period] ?? [step.period];
    const byDynasty = content.cases.findIndex(item => keywords.some(word => item.dynasty.includes(word)));
    if (byDynasty >= 0) return byDynasty;
    const byTitle = content.cases.findIndex(item => isNameRelated(item.name, step.title));
    if (byTitle >= 0) return byTitle;
    return Math.min(content.cases.length - 1, timelineIndex);
  };

  const findCaseIndexForRegion = (regionIndex: number) => {
    const zone = content.regions.zones[regionIndex];
    if (!zone) return 0;
    const matchedCase = content.cases.findIndex(item =>
      zone.examples.some(example => isNameRelated(example, item.name)),
    );
    if (matchedCase >= 0) return matchedCase;
    return Math.min(content.cases.length - 1, regionIndex);
  };

  const findRegionIndexForCase = (caseIndex: number) => {
    const target = content.cases[caseIndex];
    if (!target) return 0;
    const regionIdx = content.regions.zones.findIndex(zone =>
      zone.examples.some(example => isNameRelated(example, target.name)),
    );
    if (regionIdx >= 0) return regionIdx;
    return Math.min(content.regions.zones.length - 1, caseIndex);
  };

  const handleTimelineSelect = (index: number) => {
    setActiveTimelineIndex(index);
    const caseIndex = findCaseIndexForTimeline(index);
    setActiveCaseIndex(caseIndex);
    setActiveRegionIndex(findRegionIndexForCase(caseIndex));
  };

  const handleRegionSelect = (index: number) => {
    setActiveRegionIndex(index);
    const caseIndex = findCaseIndexForRegion(index);
    setActiveCaseIndex(caseIndex);
    setActiveTimelineIndex(findTimelineIndexForCase(caseIndex));
  };

  const handleCaseSelect = (index: number) => {
    setActiveCaseIndex(index);
    setActiveTimelineIndex(findTimelineIndexForCase(index));
    setActiveRegionIndex(findRegionIndexForCase(index));
  };

  const handlePalaceStructureSelect = (id: string) => {
    setActivePalaceStructureId(id);
  };

  const handlePalaceCapitalSampleSelect = (sampleId: string) => {
    setActivePalaceCapitalSampleId(sampleId);
    const targetSample = palaceCapitalSamples.find(item => item.id === sampleId);
    if (!targetSample?.linkCaseName) return;
    const matchedCaseIndex = content.cases.findIndex(item => isNameRelated(item.name, targetSample.linkCaseName));
    if (matchedCaseIndex >= 0) handleCaseSelect(matchedCaseIndex);
  };

  const handlePalaceAccessSpaceSelect = (spaceId: string) => {
    const selected = palaceRitualAccessSpaces.find(item => item.id === spaceId);
    if (!selected) return;
    setActivePalaceAccessSpaceId(spaceId);
    if (selected.axisNodeIds[0]) {
      setActivePalacePlanId(selected.axisNodeIds[0]);
    }
  };

  const handleGovernmentSpaceSelect = (index: number) => {
    setActiveGovernmentIndex(index);
    const flowIndex = governmentProcessFlow.findIndex(item => item.panelIndex === index);
    if (flowIndex >= 0) setActiveGovernmentFlowIndex(flowIndex);
  };

  const handleGovernmentFlowSelect = (index: number) => {
    setActiveGovernmentFlowIndex(index);
    setActiveGovernmentIndex(governmentProcessFlow[index]?.panelIndex ?? 0);
  };

  const focusGovernmentObject = (item: GovernmentLineageItem) => {
    const stageIndex = content.timeline.findIndex(step => step.title === item.stageTitle);
    if (stageIndex >= 0) setActiveTimelineIndex(stageIndex);
    document.getElementById("section-timeline")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const focusResidentialObject = (id: string) => {
    const item = residentialLineageItems.find(entry => entry.id === id);
    if (!item) return;
    setActiveResidentialCaseId(item.id);
    setShowResidentialStructure(false);
    setStructureZoom(1);
    setStructurePan({ x: 0, y: 0 });
    setStructureDragStart(null);
    const stageIndex = residentialTimelineStages.findIndex(stage => stage.objectIds.includes(item.id));
    if (stageIndex >= 0) setActiveResidentialStageIndex(stageIndex);
    const regionIndex = residentialRegionAtlas.findIndex(region => region.objectIds.includes(item.id));
    if (regionIndex >= 0) setActiveResidentialRegionIndex(regionIndex);
  };

  const residentialCaseDetails = [
    { label: "建筑特征", value: activeResidentialDeepDive.feature },
    { label: "形成原因", value: activeResidentialDeepDive.reason },
    { label: "空间组织", value: activeResidentialDeepDive.organization },
    { label: "材料与技术", value: activeResidentialDeepDive.material },
    { label: "生活方式", value: activeResidentialDeepDive.lifestyle },
    { label: "文化含义", value: activeResidentialDeepDive.meaning },
  ];

  const comparisonDimensions = [
    { label: "空间组织", left: compareLeft.type, right: compareRight.type },
    { label: "形成原因", left: compareLeft.feature, right: compareRight.feature },
    { label: "地域环境", left: compareLeft.region, right: compareRight.region },
    { label: "历史阶段", left: compareLeft.period, right: compareRight.period },
    { label: "文化意义", left: compareLeft.value, right: compareRight.value },
  ];

  const clampZoom = (value: number) => Math.min(3.2, Math.max(1, Number(value.toFixed(2))));

  const resetStructureViewer = () => {
    setStructureZoom(1);
    setStructurePan({ x: 0, y: 0 });
    setStructureDragStart(null);
  };

  const detectFocusModule = (text: string): FocusModuleKey => {
    const source = text.toLowerCase();
    if (/中轴|照壁|仪门|桥面|拱券|剖面|结构图|序列|权限矩阵|收束|宫城层级/.test(source)) return "interaction";
    if (/谱系|对象|筛选|类型|民居总览/.test(source)) return "lineage";
    if (/时间|朝代|演进|脉络/.test(source)) return "timeline";
    if (/地域|地区|省份|分布|气候|都城|城市/.test(source)) return "region";
    if (/结构|受力|构造|空间组织/.test(source)) return "structure";
    if (/案例|对比|样本|故宫|赵州桥|四合院|开封府/.test(source)) return "case";
    return null;
  };

  const outlineFor = (_module: Exclude<FocusModuleKey, null>) => undefined;

  useEffect(() => {
    if (content.key !== "residential") return;
    let cancelled = false;
    fetch("/maps/china-residential.geojson")
      .then(response => response.json())
      .then(data => {
        if (!cancelled) setResidentialMapPaths(geoJsonToSvgPaths(data));
      })
      .catch(() => {
        if (!cancelled) setResidentialMapPaths([]);
      });
    return () => {
      cancelled = true;
    };
  }, [content.key]);

  useEffect(() => {
    if (!floatingTocItems.length) return;
    const sections = floatingTocItems
      .map(item => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    const updateActiveSection = () => {
      const anchor = window.innerHeight * 0.28;
      const passed = sections.filter(section => section.getBoundingClientRect().top <= anchor);
      const current = passed.length ? passed[passed.length - 1] : sections[0];
      if (current?.id) setActiveSectionId(current.id);
    };

    const observer = new IntersectionObserver(
      () => updateActiveSection(),
      { rootMargin: "-18% 0px -58% 0px", threshold: [0, 0.12, 0.28, 0.48] },
    );

    sections.forEach(section => observer.observe(section));
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [floatingTocItems]);

  useEffect(() => {
    if (!floatingTocItems.length) return;
    setActiveSectionId(floatingTocItems[0].id);
  }, [floatingTocItems]);

  useEffect(() => {
    const viewer = structureViewerRef.current;
    if (!viewer || !showResidentialStructure) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setStructureZoom(value => clampZoom(value + (event.deltaY < 0 ? 0.16 : -0.16)));
    };

    viewer.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewer.removeEventListener("wheel", handleWheel);
  }, [showResidentialStructure]);

  return (
    <div className={`topic-competition topic-competition--${content.key} mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-10`}>
      {floatingTocItems.length ? (
        <nav
          className="group fixed right-3 top-1/2 z-30 hidden w-11 -translate-y-1/2 overflow-hidden rounded-full border px-2 py-3 shadow-[0_12px_26px_rgba(122,86,52,0.12)] backdrop-blur-md transition-all duration-300 hover:w-32 lg:block 2xl:right-[max(16px,calc((100vw-1280px)/2-120px))]"
          style={{ borderColor: `${content.accent}3a`, background: content.key === "palace" ? "rgba(255,248,236,0.88)" : "rgba(255,252,246,0.82)" }}
        >
          <div className="mb-2 flex h-7 items-center gap-2 rounded-full px-2" style={{ background: `${content.accent}14` }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: content.accent }} />
            <p className="whitespace-nowrap text-[10px] tracking-[0.14em] text-foreground/58 opacity-0 transition-opacity group-hover:opacity-100">目录</p>
          </div>
          <div className="space-y-0.5">
            {floatingTocItems.map(item => {
              const active = item.id === activeSectionId;
              return (
                <button
                  key={item.id}
                  title={item.label}
                  onClick={() => {
                    setActiveSectionId(item.id);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex h-7 w-full items-center gap-2 rounded-full px-2 text-left text-[11px] transition-all ${active ? "bg-white/88 text-foreground shadow-[0_8px_16px_rgba(122,86,52,0.1)]" : "text-foreground/58 hover:bg-white/62 hover:text-foreground/78"}`}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all ${active ? "scale-125" : "bg-[rgba(129,90,53,0.24)]"}`}
                    style={active ? { backgroundColor: content.accent } : undefined}
                  />
                  <span className="whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      ) : null}
      <section
        id="section-overview"
        className="order-1 scroll-mt-24 overflow-hidden rounded-[36px] border text-[hsl(38,30%,92%)] shadow-[0_26px_56px_rgba(67,43,29,0.18)]"
        style={{ background: profile.heroSurface, borderColor: `${content.accent}38` }}
      >
        <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="p-8 md:p-10">
            <div className="inline-flex items-center rounded-full border border-white/18 bg-white/8 px-4 py-1.5 text-xs tracking-[0.22em] text-[hsl(34,16%,76%)]">
              {profile.themeLabel}
            </div>
            <p className="mt-4 text-xs tracking-[0.26em] text-[hsl(34,16%,70%)]">TOPIC NARRATIVE</p>
            <p className="mt-3 text-sm tracking-[0.18em] text-[hsl(35,18%,78%)]">{content.subtitle}</p>
            <h1 className="mt-3 text-4xl font-serif-cn font-bold text-white md:text-5xl">{content.title}</h1>
            {content.key === "residential" || content.key === "government" || content.key === "palace" || content.key === "bridge" ? null : <p className="mt-5 max-w-3xl text-lg leading-8 text-[hsl(35,16%,84%)]">{content.thesis}</p>}
            {content.key === "residential" || content.key === "government" || content.key === "palace" || content.key === "bridge" ? null : <p className="mt-5 max-w-3xl text-sm leading-8 text-[hsl(35,12%,74%)]">{content.overview}</p>}
            <div
              className={`mt-6 rounded-[22px] border p-4 ${content.key === "residential" ? "border-[rgba(255,219,145,0.46)] bg-[linear-gradient(135deg,rgba(255,225,160,0.18),rgba(255,255,255,0.08))] shadow-[0_14px_30px_rgba(0,0,0,0.14)]" : "border-white/14 bg-white/8"}`}
            >
              <p className="text-xs tracking-[0.16em] text-[hsl(35,18%,78%)]">核心问题</p>
              <p className="mt-2 text-base leading-7 text-white">{profile.coreQuestion}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {content.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-[hsl(35,16%,82%)]">
                  {keyword}
                </span>
              ))}
            </div>
            <div className={`mt-8 grid gap-4 ${content.key === "residential" || content.key === "government" || content.key === "palace" ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
              {(content.key === "residential"
                ? residentialHeroStats
                : content.openingStats
              ).map((item, index) => (
                <div
                  key={item.label}
                  className={`topic-drift rounded-[24px] border border-white/10 bg-white/6 p-4 animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}
                >
                  <p className="text-xs tracking-[0.18em] text-[hsl(35,12%,68%)]">{item.label}</p>
                  {content.key === "residential" ? (
                    <>
                      <p className="mt-2 text-3xl font-serif-cn font-bold text-white">{item.value}</p>
                      <p className="mt-2 text-xs leading-5 text-[hsl(35,16%,78%)]">{"note" in item ? item.note : ""}</p>
                    </>
                  ) : content.key === "government" || content.key === "palace" || content.key === "bridge" ? (
                    <p className="mt-2 text-3xl font-serif-cn font-bold text-white">{item.value}</p>
                  ) : (
                    <p className="mt-3 text-base leading-7 text-white">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden border-l border-white/10">
            <img src={content.heroImage} alt={content.title} className="h-full w-full object-cover opacity-90" />
            <div
              className="pointer-events-none absolute inset-0 opacity-35"
              style={{ backgroundImage: profile.heroPattern, backgroundSize: profile.heroPatternSize }}
            />
            <div
              className="topic-banner-sheen pointer-events-none absolute inset-y-[-20%] left-[-30%] w-1/2"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,238,204,0.4),transparent)" }}
            />
            <div
              className="absolute inset-0"
              style={{ background: profile.heroOverlay }}
            />
            {content.key === "residential" ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,transparent,rgba(30,18,12,0.72))]" />
            ) : null}
            {content.key === "palace" ? (
              <div className="topic-axis-glow pointer-events-none absolute bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,215,128,0.08),rgba(255,215,128,0.7),rgba(255,215,128,0.08))]" />
            ) : null}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-xs tracking-[0.24em] text-[hsl(35,18%,78%)]">专题立意</p>
              <p className="mt-3 max-w-xl text-2xl font-serif-cn font-bold text-white">{content.thesis}</p>
            </div>
          </div>
        </div>
      </section>

      {content.key !== "government" && content.key !== "palace" ? (
      <section
        id="section-factors"
        className={`${content.key === "bridge" ? "order-7" : "order-2"} scroll-mt-24 rounded-[30px] border p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]`}
        style={{ background: profile.sectionSurface, borderColor: content.key === "bridge" ? `${content.accent}2e` : "transparent" }}
      >
        {content.key === "residential" ? (
          <div>
            <p className="text-xs tracking-[0.22em] text-[hsl(28,28%,48%)]">FORMATION MODEL</p>
            <h2 className="mt-2 text-2xl font-serif-cn font-bold">民居形成因素</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-foreground/72">
              民居形态不是单一审美选择，而是自然环境、家族制度、地方材料与生活方式持续叠加后的结果。
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              {residentialFormationFactors.map(item => (
                <article key={item.name} className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/78 p-5">
                  <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: item.color }} />
                  <h3 className="mt-4 text-xl font-serif-cn font-bold">{item.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-foreground/74">{item.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.examples.map(example => (
                      <button
                        key={example}
                        onClick={() => {
                          const matched = residentialLineageItems.find(entry => entry.name === example || entry.name.includes(example) || example.includes(entry.name));
                          if (matched) focusResidentialObject(matched.id);
                        }}
                        className="rounded-full border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.9)] px-3 py-1.5 text-xs text-foreground/74"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
        <div>
          <p className="text-xs tracking-[0.22em] text-[hsl(28,28%,48%)]">SEVENTH SCREEN</p>
          <h2 className="mt-2 text-2xl font-serif-cn font-bold">桥型对比分析</h2>
          <div className="mt-5 grid gap-5">
            <article className="rounded-[22px] border border-[rgba(78,118,101,0.2)] bg-[rgba(247,252,249,0.94)] p-5 shadow-[0_10px_18px_rgba(60,100,84,0.1)]">
              <p className="text-xs tracking-[0.22em] text-[hsl(154,24%,36%)]">对比对象</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {bridgeComparisonObjects.map((name) => (
                  <div key={name} className="rounded-[16px] border border-[rgba(78,118,101,0.2)] bg-white/90 p-3.5">
                    <p className="text-lg font-serif-cn font-semibold text-foreground">{name}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {name === "梁桥" && "基础跨越类型，结构直接。"}
                      {name === "浮桥" && "临时跨越类型，机动性强。"}
                      {name === "拱桥" && "成熟跨越类型，稳定性高。"}
                      {name === "复合桥" && "综合跨越类型，适应复杂环境。"}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[22px] border border-[rgba(78,118,101,0.2)] bg-[rgba(247,252,249,0.94)] p-5 shadow-[0_10px_18px_rgba(60,100,84,0.1)]">
              <p className="text-xs tracking-[0.22em] text-[hsl(154,24%,36%)]">对比矩阵</p>
              <div className="mt-4 overflow-x-auto rounded-[16px] border border-[rgba(78,118,101,0.18)] bg-white/92">
                <table className="min-w-[880px] w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(78,118,101,0.16)] bg-[rgba(78,118,101,0.08)]">
                      <th className="px-3 py-2.5 font-medium text-foreground/72">维度</th>
                      <th className="px-3 py-2.5 font-medium text-foreground/72">梁桥</th>
                      <th className="px-3 py-2.5 font-medium text-foreground/72">浮桥</th>
                      <th className="px-3 py-2.5 font-medium text-foreground/72">拱桥</th>
                      <th className="px-3 py-2.5 font-medium text-foreground/72">复合桥</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bridgeComparisonMatrix.map((row) => (
                      <tr key={row.dimension} className="border-b border-[rgba(78,118,101,0.1)] last:border-b-0">
                        <td className="px-3 py-2.5 font-medium text-foreground/80">{row.dimension}</td>
                        <td className="px-3 py-2.5 text-foreground/74">{row.beam}</td>
                        <td className="px-3 py-2.5 text-foreground/74">{row.pontoon}</td>
                        <td className="px-3 py-2.5 text-foreground/74">{row.arch}</td>
                        <td className="px-3 py-2.5 text-foreground/74">{row.composite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-[22px] border border-[rgba(78,118,101,0.2)] bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(239,249,244,0.92))] p-5 shadow-[0_10px_18px_rgba(60,100,84,0.1)]">
              <p className="text-xs tracking-[0.22em] text-[hsl(154,24%,36%)]">对比结论</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {bridgeComparisonConclusions.map((item) => (
                  <p key={item} className="rounded-[14px] border border-[rgba(78,118,101,0.16)] bg-white/90 px-3.5 py-3 text-sm leading-7 text-foreground/76">
                    {item}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </div>
        )}
      </section>
      ) : null}

      <section id="section-timeline" className={`${content.key === "residential" ? "order-3" : content.key === "government" ? "order-6" : content.key === "palace" ? "order-4" : "order-3"} grid scroll-mt-24 gap-6 xl:grid-cols-[0.92fr_1.08fr]`} style={outlineFor("timeline")}>
        {content.key === "residential" ? (
          <>
            <article className="rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)] xl:col-span-2">
              <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">DOUBLE TIMELINE</p>
              <h2 className="mt-2 text-2xl font-serif-cn font-bold">民居时间演进</h2>
              <p className="mt-3 text-sm leading-7 text-foreground/72">以 14 个民居对象串起从早期居住遗存到成熟地域民居的形态变化。</p>
              <div className="mt-6 flex gap-3 overflow-x-auto pb-3">
                {residentialTimelineStages.map((stage, index) => {
                  const active = index === activeResidentialStageIndex;
                  return (
                    <button
                      key={stage.name}
                      onClick={() => {
                        setActiveResidentialStageIndex(index);
                        focusResidentialObject(stage.objectIds[0]);
                      }}
                      className={`min-w-[220px] rounded-[22px] border px-4 py-4 text-left transition-all ${active ? "text-white" : "bg-white/82 text-foreground/82"}`}
                      style={active ? { backgroundColor: content.accent, borderColor: content.accent } : { borderColor: "rgba(129,90,53,0.14)" }}
                    >
                      <p className={`text-xs ${active ? "text-white/78" : "text-muted-foreground"}`}>{stage.period}</p>
                      <h3 className="mt-2 text-lg font-serif-cn font-semibold">{stage.name}</h3>
                      <p className={`mt-2 text-xs ${active ? "text-white/82" : "text-muted-foreground"}`}>{stage.shape} · {stage.keywords}</p>
                    </button>
                  );
                })}
              </div>
            </article>
            <article className="rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
              <h3 className="text-2xl font-serif-cn font-bold">{activeResidentialStage.name}</h3>
              <p className="mt-3 text-sm leading-8 text-foreground/76">{activeResidentialStage.summary}</p>
              <div className="mt-5 h-32 overflow-y-auto overscroll-contain pr-2">
                <div className="grid gap-3">
                {activeResidentialStageObjects.map(item => (
                  <button
                    key={item.id}
                    onClick={() => focusResidentialObject(item.id)}
                    className="flex items-center gap-3 rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-white/78 p-3 text-left"
                  >
                    <img src={item.image} alt={item.name} className="h-16 w-20 rounded-[14px] object-cover" />
                    <span>
                      <span className="block text-sm font-semibold text-foreground">{item.name}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{item.type} / {item.feature}</span>
                    </span>
                  </button>
                ))}
                </div>
              </div>
            </article>
            <article className="rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
              <p className="text-sm font-medium text-foreground/74">民居形态成熟度演进</p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">曲线表达民居从环境适应、聚落组织到地域类型成熟的复杂度变化。</p>
              <div className="mt-3 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={residentialMaturityData} margin={{ top: 38, right: 8, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="residential-maturity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={content.accent} stopOpacity={0.42} />
                        <stop offset="100%" stopColor={content.accent} stopOpacity={0.06} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,90,53,0.12)" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [value, "成熟度"]} />
                    <Area type="monotone" dataKey="value" stroke={content.accent} fill="url(#residential-maturity)" strokeWidth={2.4} />
                    {residentialMaturityData.map(point => (
                      <ReferenceDot
                        key={point.period}
                        x={point.period}
                        y={point.value}
                        r={4}
                        fill={content.accent}
                        stroke="white"
                        label={{ value: point.node, position: "top", fontSize: 10, fill: "#6e5846" }}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>
          </>
        ) : content.key === "government" ? (
          <article className="xl:col-span-2 relative overflow-hidden rounded-[36px] border border-transparent bg-[linear-gradient(140deg,rgba(255,253,249,0.98),rgba(239,221,195,0.94))] shadow-[0_26px_56px_rgba(79,42,24,0.2)]">
            <div className="pointer-events-none absolute -left-20 top-[-36px] h-52 w-52 rounded-full bg-[rgba(166,56,34,0.18)] blur-3xl" />
            <div className="pointer-events-none absolute right-[-80px] top-[42%] h-72 w-72 rounded-full bg-[rgba(97,65,46,0.2)] blur-3xl" />
            <div className="relative grid gap-0 xl:grid-cols-[0.3fr_0.42fr_0.28fr]">
              <aside className="border-b border-[rgba(129,90,53,0.14)] bg-[rgba(255,248,237,0.72)] p-3 xl:border-b-0 xl:border-r">
                <p className="text-xs tracking-[0.24em] text-[hsl(20,38%,40%)]">TIMELINE SCALE</p>
                <h2 className="mt-1.5 text-xl font-serif-cn font-bold text-[hsl(22,58%,20%)]">{timelineTitleMap[content.key]}</h2>
                <div className="mt-3 space-y-1.5">
                  {content.timeline.map((step, index) => {
                    const active = index === activeTimelineIndex;
                    return (
                      <button
                        key={`${step.period}-${step.title}`}
                        onClick={() => handleTimelineSelect(index)}
                        className="w-full text-left transition-all"
                      >
                        <div
                          className={`rounded-[14px] border px-3 py-2.5 ${active ? "border-[rgba(129,90,53,0.36)] bg-[rgba(129,90,53,0.12)] text-[hsl(22,48%,24%)]" : "border-[rgba(129,90,53,0.14)] bg-white/78 text-foreground/78"}`}
                        >
                          <div className="grid grid-cols-[36px_1fr] items-center gap-3">
                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold tracking-[0.08em] ${active ? "bg-[rgba(129,90,53,0.2)] text-[hsl(22,48%,24%)]" : "bg-[rgba(129,90,53,0.08)] text-muted-foreground"}`}>
                              {`0${index + 1}`.slice(-2)}
                            </span>
                            <span>
                              <span className={`block text-base leading-5 ${active ? "font-semibold text-[hsl(22,48%,24%)]" : "text-foreground/80"}`}>{step.period}</span>
                              <span className={`mt-0.5 block text-sm leading-5 ${active ? "font-semibold text-[hsl(22,44%,26%)]" : "text-foreground/86"}`}>{step.title}</span>
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <section className="border-b border-[rgba(129,90,53,0.14)] p-5 xl:border-b-0 xl:border-r">
                <div className="flex items-start justify-start rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.7)] px-4 py-3">
                  <div>
                    <p className="text-[11px] tracking-[0.14em] text-[hsl(20,30%,46%)]">当前阶段</p>
                    <h3 className="mt-1 text-xl font-serif-cn font-semibold text-[hsl(22,48%,24%)] md:text-2xl">{activeTimeline.period} · {activeTimeline.title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-foreground/76">{activeTimeline.summary}</p>

                <div className="mt-4 rounded-[22px] border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.82)] p-3">
                  <p className="text-sm font-medium text-foreground/74">官署制度空间演变曲线</p>
                  <div className="mt-2 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineChartData} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`timeline-${content.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={content.accent} stopOpacity={0.34} />
                            <stop offset="100%" stopColor={content.accent} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,90,53,0.12)" />
                        <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                        <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value: number) => [value, "制度指数"]} />
                        <Area type="monotone" dataKey="value" stroke={content.accent} fill={`url(#timeline-${content.key})`} strokeWidth={2.1} />
                        <ReferenceDot x={activeTimeline.period} y={activeTimeline.score} r={4} fill={content.accent} stroke="white" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-3 overflow-hidden rounded-[16px] border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.82)]">
                  {[
                    ["阶段位置", `${activeTimelineIndex + 1} / ${content.timeline.length}`],
                    ["变化驱动", profile.evolutionDrivers.join(" / ")],
                  ].map(([label, value], index) => (
                    <div key={label} className={`grid grid-cols-[76px_1fr] gap-3 px-3 py-2 text-sm ${index > 0 ? "border-t border-[rgba(129,90,53,0.1)]" : ""}`}>
                      <span className="text-[11px] tracking-[0.14em] text-muted-foreground">{label}</span>
                      <span className="text-foreground/78">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="p-4">
                <div className="overflow-hidden rounded-[20px] border border-[rgba(129,90,53,0.16)] bg-white/74">
                  <img src={activeTimeline.image} alt={activeTimeline.title} className="h-40 w-full object-cover" />
                </div>
                {activeTimeline.institution ? (
                  <div className="mt-3 overflow-hidden rounded-[20px] border border-[rgba(129,90,53,0.16)] bg-white/74">
                    <p className="border-b border-[rgba(129,90,53,0.1)] px-4 py-3 text-xs tracking-[0.14em] text-muted-foreground">制度剖面</p>
                    {[
                      ["代表建筑", activeTimeline.institution.representative],
                      ["行政层级", activeTimeline.institution.level],
                      ["空间特征", activeTimeline.institution.feature],
                      ["制度意义", activeTimeline.institution.meaning],
                    ].map(([label, value], index) => (
                      <div key={label} className={`px-4 py-3 ${index > 0 ? "border-t border-[rgba(129,90,53,0.08)]" : ""}`}>
                        <p className="text-[11px] tracking-[0.12em] text-muted-foreground">{label}</p>
                        <p className="mt-1 text-sm leading-6 text-foreground/78">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeTimeline.focus.map(item => (
                    <span key={item} className="rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.88)] px-3 py-1 text-xs text-foreground/72">
                      {item}
                    </span>
                  ))}
                </div>
              </aside>
            </div>
          </article>
        ) : content.key === "palace" ? (
          <article className="xl:col-span-2 rounded-[32px] border border-transparent bg-[rgba(255,251,245,0.84)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
            <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">PALACE EVOLUTION</p>
            <h2 className="mt-2 text-2xl font-serif-cn font-bold">中轴演进脉络</h2>
            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {content.timeline.map((step, index) => {
                const active = index === activeTimelineIndex;
                return (
                  <button
                    key={step.period}
                    onClick={() => handleTimelineSelect(index)}
                    className={`min-w-[220px] rounded-[20px] border px-4 py-3 text-left transition-all ${active ? "text-white" : "bg-white/82 text-foreground/82"}`}
                    style={active ? { backgroundColor: content.accent, borderColor: content.accent } : { borderColor: "rgba(129,90,53,0.14)" }}
                  >
                    <p className={`text-xs ${active ? "text-white/78" : "text-muted-foreground"}`}>{`0${index + 1}`.slice(-2)} / 05</p>
                    <h3 className="mt-1 text-base font-serif-cn font-semibold">{step.period}</h3>
                    <p className={`mt-1 text-xs ${active ? "text-white/84" : "text-muted-foreground"}`}>{step.title}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-4">
                <p className="text-sm font-medium text-foreground/74">制度空间演变图</p>
                <div className="mt-3 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineChartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`timeline-${content.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={content.accent} stopOpacity={0.42} />
                          <stop offset="100%" stopColor={content.accent} stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,90,53,0.12)" />
                      <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                      <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: number) => [value, "制度指数"]} />
                      <Area type="monotone" dataKey="value" stroke={content.accent} fill={`url(#timeline-${content.key})`} strokeWidth={2.4} />
                      <ReferenceDot x={activeTimeline.period} y={activeTimeline.score} r={5} fill={content.accent} stroke="white" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74">
                <img src={activeTimeline.image} alt={activeTimeline.period} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-2xl font-serif-cn font-bold">{activeTimeline.period}</h3>
                  <p className="mt-2 text-sm leading-7 text-foreground/75">{activeTimeline.summary}</p>
                  <div className="mt-4 overflow-hidden rounded-[16px] border border-[rgba(129,90,53,0.12)]">
                    {[
                      ["代表案例", activePalaceEvolution.representative],
                      ["空间特征", activePalaceEvolution.spatialFeature],
                      ["礼制变化", activePalaceEvolution.ritualChange],
                      ["代表价值", activePalaceEvolution.value],
                    ].map(([label, value], index) => (
                      <div key={label} className={`grid grid-cols-[72px_1fr] gap-3 px-3 py-2.5 text-sm ${index > 0 ? "border-t border-[rgba(129,90,53,0.1)]" : ""}`}>
                        <span className="text-[11px] tracking-[0.1em] text-muted-foreground">{label}</span>
                        <span className="text-foreground/78">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <article className="xl:col-span-2 rounded-[30px] border border-[rgba(78,118,101,0.24)] bg-[linear-gradient(160deg,rgba(246,252,249,0.98),rgba(233,245,239,0.92))] p-6 shadow-[0_22px_42px_rgba(54,95,79,0.16)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">ENGINEERING EVOLUTION</p>
                <h2 className="mt-2 text-2xl font-serif-cn font-bold">{timelineTitleMap[content.key]}</h2>
              </div>
              <span className="rounded-full border border-[rgba(129,90,53,0.12)] bg-white/78 px-3 py-1.5 text-xs text-muted-foreground">
                {content.timeline.length} 个阶段 · 点击切换
              </span>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {content.timeline.map((step, index) => {
                const isActive = index === activeTimelineIndex;
                return (
                  <button
                    key={step.period}
                    onClick={() => handleTimelineSelect(index)}
                    className={`min-w-[220px] rounded-[20px] border px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${isActive ? "border-transparent bg-[linear-gradient(145deg,rgba(85,122,107,0.24),rgba(85,122,107,0.16))] shadow-[0_16px_26px_rgba(54,95,79,0.22)]" : "border-[rgba(78,118,101,0.24)] bg-[rgba(255,255,255,0.9)] shadow-[0_8px_16px_rgba(60,100,84,0.1)] hover:border-[rgba(78,118,101,0.4)] hover:bg-[rgba(243,251,247,0.96)] hover:shadow-[0_14px_24px_rgba(54,95,79,0.18)]"}`}
                    style={isActive ? { boxShadow: `0 0 0 1px ${content.accent} inset` } : undefined}
                  >
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] ${isActive ? "text-white" : "text-foreground/72"}`}
                      style={isActive ? { backgroundColor: content.accent } : { backgroundColor: "rgba(129,90,53,0.08)" }}
                    >
                      {step.period}
                    </span>
                    <h3 className="mt-2 text-base font-serif-cn font-semibold text-foreground">{step.title}</h3>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[1.04fr_0.96fr]">
              <section className="rounded-[24px] border border-[rgba(78,118,101,0.2)] bg-[linear-gradient(165deg,rgba(255,255,255,0.94),rgba(242,250,246,0.9))] p-5 shadow-[0_14px_26px_rgba(60,100,84,0.12)] transition-all duration-300 hover:shadow-[0_18px_30px_rgba(54,95,79,0.18)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-serif-cn font-bold text-foreground">{activeTimeline.title}</h3>
                  <span className="rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.92)] px-3 py-1 text-xs text-muted-foreground">
                    阶段 {activeTimelineIndex + 1} / {content.timeline.length}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{activeTimeline.period}</p>
                <p className="mt-3 text-sm leading-7 text-foreground/76">{activeTimeline.summary}</p>
                {activeTimeline.technicalProfile ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      ["代表桥梁", activeTimeline.technicalProfile.representative],
                      ["核心技术", activeTimeline.technicalProfile.coreTechnology],
                      ["适用环境", activeTimeline.technicalProfile.environment],
                      ["交通意义", activeTimeline.technicalProfile.trafficMeaning],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[14px] border border-[rgba(78,118,101,0.18)] bg-[rgba(247,252,249,0.94)] px-4 py-3 shadow-[0_8px_14px_rgba(60,100,84,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(78,118,101,0.36)] hover:shadow-[0_14px_22px_rgba(54,95,79,0.16)]">
                        <p className="text-xs tracking-[0.12em] text-muted-foreground">{label}</p>
                        <p className="mt-1 text-sm leading-7 text-foreground/78">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
                  {activeTimeline.technicalProfile ? (
                    <div className="rounded-[16px] border border-[rgba(78,118,101,0.18)] bg-[rgba(247,252,249,0.92)] px-4 py-3 shadow-[0_8px_14px_rgba(60,100,84,0.08)] transition-all duration-300 hover:border-[rgba(78,118,101,0.34)] hover:shadow-[0_14px_22px_rgba(54,95,79,0.16)]">
                      <p className="text-xs tracking-[0.12em] text-muted-foreground">阶段价值</p>
                      <p className="mt-1 text-sm leading-7 text-foreground/76">{activeTimeline.technicalProfile.stageValue}</p>
                    </div>
                  ) : null}
                  <div className="rounded-[16px] border border-[rgba(78,118,101,0.18)] bg-[rgba(247,252,249,0.92)] px-4 py-3 shadow-[0_8px_14px_rgba(60,100,84,0.08)] transition-all duration-300 hover:border-[rgba(78,118,101,0.34)] hover:shadow-[0_14px_22px_rgba(54,95,79,0.16)]">
                    <p className="text-xs tracking-[0.12em] text-muted-foreground">关键标签</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeTimeline.focus.map((item) => (
                        <span key={item} className="rounded-full border border-[rgba(78,118,101,0.22)] bg-[rgba(240,249,245,0.92)] px-3 py-1.5 text-xs text-foreground/74 shadow-[0_4px_10px_rgba(60,100,84,0.08)] transition-all duration-300 hover:border-[rgba(78,118,101,0.38)] hover:shadow-[0_8px_14px_rgba(54,95,79,0.14)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-[16px] border border-[rgba(78,118,101,0.18)] bg-[rgba(247,252,249,0.92)] px-4 py-3 shadow-[0_8px_14px_rgba(60,100,84,0.08)] transition-all duration-300 hover:border-[rgba(78,118,101,0.34)] hover:shadow-[0_14px_22px_rgba(54,95,79,0.16)]">
                  <p className="text-xs tracking-[0.12em] text-muted-foreground">演进驱动</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {profile.evolutionDrivers.map((item) => (
                      <span key={item} className="rounded-full border border-[rgba(78,118,101,0.2)] bg-[rgba(240,249,245,0.9)] px-3 py-1.5 text-xs text-foreground/76 shadow-[0_4px_10px_rgba(60,100,84,0.08)] transition-all duration-300 hover:border-[rgba(78,118,101,0.36)] hover:shadow-[0_8px_14px_rgba(54,95,79,0.14)]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <section className="grid gap-4">
                <div className="overflow-hidden rounded-[24px] border border-[rgba(78,118,101,0.2)] bg-[rgba(246,252,249,0.9)] shadow-[0_14px_26px_rgba(60,100,84,0.12)] transition-all duration-300 hover:shadow-[0_18px_30px_rgba(54,95,79,0.18)]">
                  <img src={activeTimeline.image} alt={activeTimeline.title} className="h-56 w-full object-cover" />
                </div>
                <div className="rounded-[24px] border border-[rgba(78,118,101,0.2)] bg-[linear-gradient(165deg,rgba(255,255,255,0.94),rgba(242,250,246,0.9))] p-4 shadow-[0_14px_26px_rgba(60,100,84,0.12)] transition-all duration-300 hover:shadow-[0_18px_30px_rgba(54,95,79,0.18)]">
                  <p className="text-sm font-medium text-foreground/74">{timelineCurveLabelMap[content.key]}</p>
                  <div className="mt-3 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineChartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`timeline-${content.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={content.accent} stopOpacity={0.42} />
                            <stop offset="100%" stopColor={content.accent} stopOpacity={0.06} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,90,53,0.12)" />
                        <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                        <YAxis domain={[40, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value: number) => [value, "阶段指数"]} />
                        <Area type="monotone" dataKey="value" stroke={content.accent} fill={`url(#timeline-${content.key})`} strokeWidth={2.4} />
                        <ReferenceDot x={activeTimeline.period} y={activeTimeline.score} r={5} fill={content.accent} stroke="white" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>
            </div>
          </article>
        )}
      </section>

      {content.key === "residential" ? (
        <section
          id="section-lineage"
          className="order-4 scroll-mt-24 rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]"
          style={outlineFor("lineage")}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">LINEAGE ATLAS</p>
              <h2 className="mt-2 text-2xl font-serif-cn font-bold">民居谱系总览</h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-foreground/72">
                从早期居住遗存到成熟地域民居，梳理 14 个对象在时期、地域、类型和特征上的知识关系。
              </p>
            </div>
            <button
              onClick={() => {
                setLineagePeriodFilter("全部时期");
                setLineageRegionFilter("全部地域");
                setLineageTypeFilter("全部类型");
                setLineageFeatureFilter("全部特征");
              }}
              className="rounded-full border border-[rgba(129,90,53,0.14)] bg-white/78 px-4 py-2 text-sm text-foreground/72"
            >
              重置筛选
            </button>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "按时期", value: lineagePeriodFilter, setter: setLineagePeriodFilter, options: lineagePeriodOptions },
              { label: "按地域", value: lineageRegionFilter, setter: setLineageRegionFilter, options: lineageRegionOptions },
              { label: "按类型", value: lineageTypeFilter, setter: setLineageTypeFilter, options: lineageTypeOptions },
              { label: "按特征", value: lineageFeatureFilter, setter: setLineageFeatureFilter, options: lineageFeatureOptions },
            ].map(filter => (
              <label key={filter.label} className="rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-white/72 px-4 py-3">
                <span className="block text-xs tracking-[0.14em] text-muted-foreground">{filter.label}</span>
                <select
                  value={filter.value}
                  onChange={(event) => filter.setter(event.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.92)] px-3 py-2 text-sm outline-none"
                >
                  {filter.options.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleResidentialLineage.map(item => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/76 shadow-[0_14px_24px_rgba(122,86,52,0.06)]"
              >
                <img src={item.image} alt={item.name} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-serif-cn font-semibold text-foreground">{item.name}</h3>
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{item.period} / {item.region} / {item.type}</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/74">{item.value}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[rgba(129,90,53,0.08)] px-3 py-1 text-xs text-foreground/70">{item.feature}</span>
                    <button
                      onClick={() => focusResidentialObject(item.id)}
                      className="rounded-full px-3 py-1.5 text-xs text-white"
                      style={{ backgroundColor: content.accent }}
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">当前显示 {visibleResidentialLineage.length} / {filteredResidentialLineage.length} 个对象</p>
            {filteredResidentialLineage.length > lineageDefaultVisibleCount ? (
              <button
                onClick={() => setLineageExpanded(value => !value)}
                className="rounded-full border border-[rgba(129,90,53,0.14)] bg-white/78 px-4 py-2 text-sm text-foreground/74"
              >
                {lineageExpanded ? "收起谱系" : "展开更多"}
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {content.key === "government" ? (
        <section
          id="section-lineage"
          className="order-4 scroll-mt-24 rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]"
          style={outlineFor("lineage")}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">LINEAGE ATLAS</p>
              <h2 className="mt-2 text-2xl font-serif-cn font-bold">官署谱系总览</h2>
            </div>
            <button
              onClick={() => {
                setGovernmentPeriodFilter("全部时期");
                setGovernmentLevelFilter("全部层级");
                setGovernmentFunctionFilter("全部功能");
                setGovernmentFeatureFilter("全部特征");
              }}
              className="rounded-full border border-[rgba(129,90,53,0.14)] bg-white/78 px-4 py-2 text-sm text-foreground/72"
            >
              重置筛选
            </button>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "按时期", value: governmentPeriodFilter, setter: setGovernmentPeriodFilter, options: governmentPeriodOptions },
              { label: "按层级", value: governmentLevelFilter, setter: setGovernmentLevelFilter, options: governmentLevelOptions },
              { label: "按功能", value: governmentFunctionFilter, setter: setGovernmentFunctionFilter, options: governmentFunctionOptions },
              { label: "按空间特征", value: governmentFeatureFilter, setter: setGovernmentFeatureFilter, options: governmentFeatureOptions },
            ].map(filter => (
              <label key={filter.label} className="rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-white/72 px-4 py-3">
                <span className="block text-xs tracking-[0.14em] text-muted-foreground">{filter.label}</span>
                <select
                  value={filter.value}
                  onChange={(event) => filter.setter(event.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.92)] px-3 py-2 text-sm outline-none"
                >
                  {filter.options.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleGovernmentLineage.map(item => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/76 shadow-[0_14px_24px_rgba(122,86,52,0.06)]"
              >
                <img src={item.image} alt={item.name} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-serif-cn font-semibold text-foreground">{item.name}</h3>
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{item.period} / {item.level}</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/74">{item.value}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[rgba(129,90,53,0.08)] px-3 py-1 text-xs text-foreground/70">功能：{item.functions.join(" + ")}</span>
                    <span className="rounded-full bg-[rgba(129,90,53,0.08)] px-3 py-1 text-xs text-foreground/70">{item.features.join("、")}</span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => focusGovernmentObject(item)}
                      className="rounded-full px-3 py-1.5 text-xs text-white"
                      style={{ backgroundColor: content.accent }}
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">当前显示 {visibleGovernmentLineage.length} / {filteredGovernmentLineage.length} 个对象</p>
            {filteredGovernmentLineage.length > lineageDefaultVisibleCount ? (
              <button
                onClick={() => setGovernmentLineageExpanded(value => !value)}
                className="rounded-full border border-[rgba(129,90,53,0.14)] bg-white/78 px-4 py-2 text-sm text-foreground/74"
              >
                {governmentLineageExpanded ? "收起谱系" : "展开更多"}
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {content.key === "palace" ? (
        <section
          id="section-lineage"
          className="order-5 scroll-mt-24 rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]"
          style={outlineFor("lineage")}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">PALACE LINEAGE</p>
              <h2 className="mt-2 text-2xl font-serif-cn font-bold">宫殿谱系总览</h2>
            </div>
            <button
              onClick={() => {
                setPalacePeriodFilter("全部时期");
                setPalaceFunctionFilter("全部功能");
                setPalaceFeatureFilter("全部空间特征");
              }}
              className="rounded-full border border-[rgba(129,90,53,0.14)] bg-white/78 px-4 py-2 text-sm text-foreground/72"
            >
              重置筛选
            </button>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              { label: "按时期", value: palacePeriodFilter, setter: setPalacePeriodFilter, options: palacePeriodOptions },
              { label: "按功能", value: palaceFunctionFilter, setter: setPalaceFunctionFilter, options: palaceFunctionOptions },
              { label: "按空间特征", value: palaceFeatureFilter, setter: setPalaceFeatureFilter, options: palaceFeatureOptions },
            ].map(filter => (
              <label key={filter.label} className="rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-white/72 px-4 py-3">
                <span className="block text-xs tracking-[0.14em] text-muted-foreground">{filter.label}</span>
                <select
                  value={filter.value}
                  onChange={(event) => filter.setter(event.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.92)] px-3 py-2 text-sm outline-none"
                >
                  {filter.options.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visiblePalaceLineage.map(item => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/76 shadow-[0_14px_24px_rgba(122,86,52,0.06)]"
              >
                <img src={item.image} alt={item.name} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-serif-cn font-semibold text-foreground">{item.name}</h3>
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{item.period} / {item.level}</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/74">{item.value}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[rgba(129,90,53,0.08)] px-3 py-1 text-xs text-foreground/70">{item.functionType}</span>
                    <span className="rounded-full bg-[rgba(129,90,53,0.08)] px-3 py-1 text-xs text-foreground/70">{item.feature}</span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        const caseIndex = content.cases.findIndex(caseItem => isNameRelated(caseItem.name, item.name));
                        if (caseIndex >= 0) handleCaseSelect(caseIndex);
                      }}
                      className="rounded-full px-3 py-1.5 text-xs text-white"
                      style={{ backgroundColor: content.accent }}
                    >
                      查看案例
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">当前显示 {visiblePalaceLineage.length} / {filteredPalaceLineage.length} 个对象</p>
            {filteredPalaceLineage.length > lineageDefaultVisibleCount ? (
              <button
                onClick={() => setPalaceLineageExpanded(value => !value)}
                className="rounded-full border border-[rgba(129,90,53,0.14)] bg-white/78 px-4 py-2 text-sm text-foreground/74"
              >
                {palaceLineageExpanded ? "收起谱系" : "展开更多"}
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {content.key === "bridge" ? (
        <section
          id="section-lineage"
          className="order-4 scroll-mt-24 rounded-[30px] border border-[rgba(78,118,101,0.24)] bg-[linear-gradient(160deg,rgba(246,252,249,0.98),rgba(233,245,239,0.92))] p-6 shadow-[0_22px_42px_rgba(54,95,79,0.16)]"
          style={outlineFor("lineage")}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">FOURTH SCREEN</p>
              <h2 className="mt-2 text-2xl font-serif-cn font-bold">桥梁谱系概览（18 座）</h2>
            </div>
            <button
              onClick={() => {
                setBridgePeriodFilter("全部朝代");
                setBridgeTypeFilter("全部桥型");
                setBridgeStageFilter("全部阶段");
                setBridgeRegionFilter("全部水系");
                setBridgeLineageExpanded(false);
              }}
              className="rounded-full border border-[rgba(78,118,101,0.24)] bg-[rgba(247,252,249,0.94)] px-4 py-2 text-sm text-foreground/72 shadow-[0_8px_14px_rgba(60,100,84,0.1)] transition-all duration-300 hover:border-[rgba(78,118,101,0.4)] hover:shadow-[0_14px_22px_rgba(54,95,79,0.16)]"
            >
              重置筛选
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "按朝代", value: bridgePeriodFilter, setter: setBridgePeriodFilter, options: bridgePeriodOptions },
              { label: "按桥型分类", value: bridgeTypeFilter, setter: setBridgeTypeFilter, options: bridgeTypeOptions },
              { label: "按历史阶段", value: bridgeStageFilter, setter: setBridgeStageFilter, options: bridgeStageOptions },
              { label: "按水系 / 地域", value: bridgeRegionFilter, setter: setBridgeRegionFilter, options: bridgeRegionOptions },
            ].map(filter => (
              <label key={filter.label} className="rounded-[20px] border border-[rgba(78,118,101,0.2)] bg-[rgba(247,252,249,0.92)] px-4 py-3 shadow-[0_8px_14px_rgba(60,100,84,0.08)] transition-all duration-300 hover:border-[rgba(78,118,101,0.36)] hover:shadow-[0_14px_22px_rgba(54,95,79,0.14)]">
                <span className="block text-xs tracking-[0.14em] text-muted-foreground">{filter.label}</span>
                <select
                  value={filter.value}
                  onChange={(event) => filter.setter(event.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-[rgba(78,118,101,0.2)] bg-[rgba(255,255,255,0.92)] px-3 py-2 text-sm outline-none"
                >
                  {filter.options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleBridgeLineage.map(item => (
              <article key={item.id} className="rounded-[24px] border border-[rgba(78,118,101,0.2)] bg-[linear-gradient(165deg,rgba(255,255,255,0.95),rgba(242,250,246,0.9))] p-4 shadow-[0_14px_24px_rgba(60,100,84,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(78,118,101,0.36)] hover:shadow-[0_20px_30px_rgba(54,95,79,0.18)]">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-serif-cn font-semibold text-foreground">{item.name}</h3>
                  <span className="rounded-full border border-[rgba(78,118,101,0.22)] bg-[rgba(240,249,245,0.92)] px-3 py-1 text-xs text-foreground/72">{item.stage}</span>
                </div>
                <div className="mt-3 overflow-hidden rounded-[16px] border border-[rgba(78,118,101,0.18)] bg-[rgba(247,252,249,0.94)]">
                  {[
                    ["桥梁名称", item.name],
                    ["历史时期", item.period],
                    ["所在区域 / 水系", item.regionWater],
                    ["桥型结构", item.bridgeStructure],
                    ["核心技术", item.coreTech],
                    ["交通功能", item.transportFunction],
                    ["一句话价值", item.value],
                  ].map(([label, value], index) => (
                    <div key={label} className={`grid grid-cols-[94px_1fr] gap-3 px-3 py-2.5 text-sm ${index > 0 ? "border-t border-[rgba(78,118,101,0.12)]" : ""}`}>
                      <span className="text-[11px] tracking-[0.1em] text-muted-foreground">{label}</span>
                      <span className="text-foreground/78">{value}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">当前显示 {visibleBridgeLineage.length} / {filteredBridgeLineage.length} 座桥梁</p>
            {filteredBridgeLineage.length > lineageDefaultVisibleCount ? (
              <button
                onClick={() => setBridgeLineageExpanded(value => !value)}
                className="rounded-full border border-[rgba(78,118,101,0.24)] bg-[rgba(247,252,249,0.94)] px-4 py-2 text-sm text-foreground/74 shadow-[0_8px_14px_rgba(60,100,84,0.1)] transition-all duration-300 hover:border-[rgba(78,118,101,0.4)] hover:shadow-[0_14px_22px_rgba(54,95,79,0.16)]"
              >
                {bridgeLineageExpanded ? "收起" : "展开全部"}
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className={`grid gap-6 ${content.key === "residential" ? "order-5" : content.key === "government" ? "order-5" : content.key === "palace" ? "order-6" : content.key === "bridge" ? "order-5" : "order-5 xl:grid-cols-[1fr_0.95fr]"}`}>
        <article
          id="section-region"
          className={`scroll-mt-24 rounded-[30px] border p-6 ${content.key === "bridge" ? "border-[rgba(78,118,101,0.24)] bg-[linear-gradient(160deg,rgba(246,252,249,0.98),rgba(233,245,239,0.92))] shadow-[0_22px_42px_rgba(54,95,79,0.16)]" : "border-transparent bg-[rgba(255,251,245,0.84)] shadow-[0_18px_34px_rgba(122,86,52,0.08)]"}`}
          style={outlineFor("region")}
        >
          <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">THIRD SCREEN</p>
          <h2 className="mt-2 text-2xl font-serif-cn font-bold">{regionTitleMap[content.key]}</h2>
          {content.key === "residential" ? (
            <div>
              <p className="mt-4 text-sm leading-7 text-foreground/72">
                用“地域 - 建筑 - 形成原因”的方式观察民居分布，点击区域即可同步切换代表对象和后续案例。
              </p>
              <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr_1fr]">
                <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.9)] p-4">
                  <p className="text-sm font-medium text-foreground/74">区域地图 / 点位图</p>
                  <svg viewBox="0 0 340 240" className="mt-3 h-[360px] w-full">
                    <defs>
                      <linearGradient id="residential-map-fill" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgba(222,190,153,0.44)" />
                        <stop offset="100%" stopColor="rgba(178,126,82,0.24)" />
                      </linearGradient>
                    </defs>
                    {residentialMapPaths.length ? (
                      residentialMapPaths.map((path, index) => (
                        <path
                          key={`${path.slice(0, 18)}-${index}`}
                          d={path}
                          fill="url(#residential-map-fill)"
                          stroke="rgba(143,91,51,0.26)"
                          strokeWidth="0.6"
                        />
                      ))
                    ) : (
                      <path d="M58 58 L118 35 L190 43 L268 70 L306 120 L278 174 L208 202 L130 192 L62 154 L34 98 Z" fill="rgba(212,184,156,0.25)" stroke="rgba(143,91,51,0.28)" strokeWidth="1.5" />
                    )}
                    {residentialRegionAtlas.map((region, index) => {
                      const active = index === activeResidentialRegionIndex;
                      const [pointX, pointY] = projectChinaPoint([region.lon, region.lat]);
                      return (
                        <g
                          key={region.id}
                          className="cursor-pointer"
                          onClick={() => {
                            setActiveResidentialRegionIndex(index);
                            focusResidentialObject(region.objectIds[0]);
                          }}
                        >
                          <circle cx={pointX} cy={pointY} r={active ? 7 : 5} fill={active ? content.accent : "rgba(143,91,51,0.62)"} />
                          <circle cx={pointX} cy={pointY} r={active ? 13 : 9} fill="none" stroke={active ? content.accent : "rgba(143,91,51,0.2)"} strokeWidth="1.2" />
                          <text x={pointX} y={pointY + 15} textAnchor="middle" fontSize="9" fill="rgba(78,55,37,0.88)">
                            {region.region.replace("地区", "").replace(" / ", "/")}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-5">
                  <p className="text-xs tracking-[0.16em] text-muted-foreground">代表建筑列表</p>
                  <h3 className="mt-2 text-2xl font-serif-cn font-bold">{activeResidentialRegion.region}</h3>
                  <div className="mt-5 grid gap-3">
                    {activeResidentialRegionObjects.map(item => (
                      <button
                        key={item.id}
                        onClick={() => focusResidentialObject(item.id)}
                        className={`flex items-center gap-3 rounded-[18px] border p-3 text-left transition-all ${activeResidentialCase.id === item.id ? "border-transparent bg-[rgba(129,90,53,0.08)]" : "border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.9)]"}`}
                        style={activeResidentialCase.id === item.id ? { boxShadow: `0 0 0 1px ${content.accent} inset` } : undefined}
                      >
                        <img src={item.image} alt={item.name} className="h-14 w-20 rounded-[12px] object-cover" />
                        <span>
                          <span className="block text-sm font-semibold text-foreground">{item.name}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">{item.period} / {item.type}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-5">
                  <p className="text-xs tracking-[0.16em] text-muted-foreground">形成原因与关键词</p>
                  <h3 className="mt-2 text-2xl font-serif-cn font-bold">{activeResidentialRegion.region}</h3>
                  <div className="mt-4 rounded-[18px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-4">
                    <p className="text-xs tracking-[0.14em] text-muted-foreground">形成原因</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/76">{activeResidentialRegion.summary}</p>
                  </div>
                  <div className="mt-5 rounded-[18px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-4">
                    <p className="text-xs tracking-[0.14em] text-muted-foreground">关键词</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeResidentialRegion.keywords.map(keyword => (
                        <span key={keyword} className="rounded-full bg-[rgba(129,90,53,0.08)] px-3 py-1.5 text-xs text-foreground/72">{keyword}</span>
                      ))}
                    </div>
                    <p className="mt-4 text-xs leading-6 text-muted-foreground">点击左侧点位或中间建筑，可同步切换地域说明、谱系位置与重点案例。</p>
                  </div>
                </div>
              </div>
            </div>
          ) : content.key === "government" ? (
            <div>
              <p className="mt-4 text-sm leading-6 text-foreground/72">{content.regions.intro}</p>
              <div className="mt-5 grid gap-4 xl:grid-cols-[0.72fr_1.18fr_0.9fr]">
                <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-[linear-gradient(180deg,rgba(255,252,246,0.94),rgba(247,237,225,0.92))] p-4">
                  <p className="text-sm font-medium text-foreground/74">治理层级塔</p>
                  <div className="mt-3 space-y-2">
                    {content.regions.zones.map((zone, index) => {
                      const active = index === activeRegionIndex;
                      return (
                        <button
                          key={zone.name}
                          onClick={() => handleRegionSelect(index)}
                          className={`w-full rounded-[16px] border px-3 py-3 text-left transition-all ${active ? "border-transparent bg-[rgba(122,75,49,0.12)]" : "border-[rgba(129,90,53,0.12)] bg-white/84"}`}
                          style={active ? { boxShadow: `0 0 0 1px ${content.accent} inset` } : undefined}
                        >
                          <p className="text-base font-serif-cn font-semibold">{zone.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{zone.clue}</p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 space-y-1 text-center text-sm text-[hsl(24,42%,38%)]">
                    <p>中央中枢</p>
                    <p>↓</p>
                    <p>地方府州县</p>
                    <p>↓</p>
                    <p>基层治理 / 军政边防 / 教育礼制</p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-4">
                  <p className="text-sm font-medium text-foreground/74">治理网络画布</p>
                  <div className="relative mt-3 h-[260px] overflow-hidden rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-[linear-gradient(135deg,rgba(255,252,246,0.96),rgba(236,218,194,0.72))]">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                      <line x1="16" y1="48" x2="44" y2="34" stroke={activeRegionIndex <= 1 ? content.accent : "rgba(129,90,53,0.24)"} strokeWidth="1.8" />
                      <line x1="16" y1="48" x2="44" y2="64" stroke={activeRegionIndex === 2 ? content.accent : "rgba(129,90,53,0.24)"} strokeWidth="1.8" />
                      <line x1="44" y1="34" x2="78" y2="28" stroke={activeRegionIndex === 2 ? "rgba(129,90,53,0.38)" : "rgba(129,90,53,0.2)"} strokeWidth="1.4" />
                      <line x1="44" y1="64" x2="78" y2="72" stroke={activeRegionIndex === 2 ? "rgba(129,90,53,0.38)" : "rgba(129,90,53,0.2)"} strokeWidth="1.4" />
                    </svg>

                    <button
                      onClick={() => handleRegionSelect(0)}
                      className={`absolute left-[8%] top-[39%] rounded-full border px-3 py-2 text-xs transition-all ${activeRegionIndex === 0 ? "text-white" : "bg-white/86 text-foreground/76"}`}
                      style={activeRegionIndex === 0 ? { backgroundColor: content.accent, borderColor: content.accent } : { borderColor: "rgba(129,90,53,0.14)" }}
                    >
                      中央中枢
                    </button>
                    <button
                      onClick={() => handleRegionSelect(1)}
                      className={`absolute left-[39%] top-[24%] rounded-full border px-3 py-2 text-xs transition-all ${activeRegionIndex === 1 ? "text-white" : "bg-white/86 text-foreground/76"}`}
                      style={activeRegionIndex === 1 ? { backgroundColor: content.accent, borderColor: content.accent } : { borderColor: "rgba(129,90,53,0.14)" }}
                    >
                      地方府州县
                    </button>
                    <button
                      onClick={() => handleRegionSelect(2)}
                      className={`absolute left-[39%] top-[56%] rounded-full border px-3 py-2 text-xs transition-all ${activeRegionIndex === 2 ? "text-white" : "bg-white/86 text-foreground/76"}`}
                      style={activeRegionIndex === 2 ? { backgroundColor: content.accent, borderColor: content.accent } : { borderColor: "rgba(129,90,53,0.14)" }}
                    >
                      基层治理网络
                    </button>

                    <span className="absolute left-[72%] top-[16%] rounded-full bg-[rgba(169,68,47,0.12)] px-3 py-1 text-xs text-[hsl(18,42%,34%)]">军政边防</span>
                    <span className="absolute left-[72%] top-[68%] rounded-full bg-[rgba(127,118,104,0.16)] px-3 py-1 text-xs text-[hsl(34,12%,32%)]">教育礼制</span>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {governmentGovernanceDirections.map(item => (
                      <div key={item.id} className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-2.5">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-4">
                  <h3 className="text-2xl font-serif-cn font-bold">{activeRegion.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{activeRegion.clue}</p>
                  <p className="mt-3 text-sm leading-6 text-foreground/75">{activeRegion.summary}</p>
                  <div className="mt-3 rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-3">
                    <p className="text-sm font-medium text-foreground/74">该层级治理范围</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeRegion.examples.map(example => (
                        <span key={example} className="rounded-full border border-[rgba(129,90,53,0.12)] bg-white px-3 py-1 text-xs text-foreground/72">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activeRegion.metrics} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,90,53,0.12)" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value: number) => [value, "指数"]} />
                        <Bar dataKey="value" radius={[7, 7, 0, 0]} fill={content.accent} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 grid gap-2">
                    {activeRegion.metrics.map(item => (
                      <div key={item.label} className="flex items-center justify-between rounded-[12px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-3 py-2 text-xs">
                        <span className="text-foreground/72">{item.label}</span>
                        <span className="font-semibold text-foreground/82">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : content.key === "palace" ? (
            <div>
              <div className="mt-5 grid gap-4 xl:grid-cols-[1.14fr_0.86fr]">
                <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-4">
                  <p className="text-sm font-medium text-foreground/74">都城—宫城—中轴关系图</p>
                  <div className="relative mt-3 h-[320px] overflow-hidden rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.96)] p-2">
                    <img
                      src={activePalaceCapitalSample.image}
                      alt={`${activePalaceCapitalSample.name}都城—宫城—中轴关系图`}
                      className="h-full w-full rounded-[14px] object-contain"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-3 text-xs leading-6 text-muted-foreground">展示城市尺度关系：都城范围、宫城位置、城市中轴与结构关系，不再展开宫城内部构造。</p>
                </div>

                <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-4">
                  <p className="text-xs tracking-[0.16em] text-muted-foreground">当前都城样本</p>
                  <h3 className="mt-2 text-2xl font-serif-cn font-bold">{activePalaceCapitalSample.name}</h3>
                  <div className="mt-4 overflow-hidden rounded-[16px] border border-[rgba(129,90,53,0.12)]">
                    {[
                      ["历史时期", activePalaceCapitalSample.period],
                      ["宫城位置", activePalaceCapitalSample.palacePosition],
                      ["中轴关系", activePalaceCapitalSample.axisRelation],
                      ["城市结构", activePalaceCapitalSample.cityStructure],
                      ["礼制意义", activePalaceCapitalSample.ritualMeaning],
                      ["代表价值", activePalaceCapitalSample.representativeValue],
                    ].map(([label, value], index) => (
                      <div key={label} className={`grid grid-cols-[72px_1fr] gap-3 px-3 py-2.5 text-sm ${index > 0 ? "border-t border-[rgba(129,90,53,0.1)]" : ""}`}>
                        <span className="text-[11px] tracking-[0.1em] text-muted-foreground">{label}</span>
                        <span className="text-foreground/78">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {palaceCapitalSamples.map(sample => {
                  const isActive = sample.id === activePalaceCapitalSampleId;
                  return (
                    <button
                      key={sample.id}
                      onClick={() => handlePalaceCapitalSampleSelect(sample.id)}
                      className={`rounded-[18px] border px-4 py-3 text-left transition-all ${isActive ? "border-transparent bg-[rgba(170,122,31,0.12)]" : "border-[rgba(129,90,53,0.14)] bg-white/82"}`}
                      style={isActive ? { boxShadow: `0 0 0 1px ${content.accent} inset` } : undefined}
                    >
                      <p className="text-base font-serif-cn font-semibold">{sample.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{sample.period}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {content.regions.intro ? <p className="mt-4 text-sm leading-7 text-foreground/72">{content.regions.intro}</p> : null}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {content.regions.zones.map((zone, index) => {
                  const isActive = index === activeRegionIndex;
                  return (
                    <button
                      key={zone.name}
                      onClick={() => handleRegionSelect(index)}
                      className={`rounded-[18px] border px-4 py-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 ${isActive ? "border-transparent bg-[linear-gradient(145deg,rgba(85,122,107,0.24),rgba(85,122,107,0.16))] shadow-[0_16px_24px_rgba(54,95,79,0.22)]" : "border-[rgba(78,118,101,0.24)] bg-[rgba(255,255,255,0.92)] shadow-[0_8px_14px_rgba(60,100,84,0.1)] hover:border-[rgba(78,118,101,0.4)] hover:bg-[rgba(243,251,247,0.96)] hover:shadow-[0_14px_20px_rgba(54,95,79,0.16)]"}`}
                      style={isActive ? { boxShadow: `0 0 0 1px ${content.accent} inset` } : undefined}
                    >
                      <h3 className="text-base font-serif-cn font-semibold">{zone.name}</h3>
                      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{zone.clue}</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
                <article className="rounded-[24px] border border-[rgba(78,118,101,0.2)] bg-[linear-gradient(165deg,rgba(255,255,255,0.95),rgba(242,250,246,0.9))] p-5 shadow-[0_14px_26px_rgba(60,100,84,0.12)]">
                  <p className="text-xs tracking-[0.16em] text-muted-foreground">当前交通区</p>
                  <h3 className="mt-2 text-xl font-serif-cn font-bold">{activeRegion.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{activeRegion.clue}</p>
                  <p className="mt-4 text-sm leading-7 text-foreground/75">{activeRegion.summary}</p>

                  {activeRegion.oneLineSummary ? (
                    <div className="mt-4 rounded-[16px] border border-[rgba(78,118,101,0.24)] bg-[linear-gradient(140deg,rgba(224,243,234,0.78),rgba(236,250,244,0.74))] px-4 py-3">
                      <p className="text-xs tracking-[0.16em] text-[hsl(154,24%,36%)]">一句话总结</p>
                      <p className="mt-1.5 text-sm leading-7 text-foreground/78">{activeRegion.oneLineSummary}</p>
                    </div>
                  ) : null}

                  <div className="mt-4 rounded-[18px] border border-[rgba(78,118,101,0.2)] bg-[rgba(247,252,249,0.96)] p-4 shadow-[0_8px_14px_rgba(60,100,84,0.08)]">
                    <p className="text-xs tracking-[0.16em] text-muted-foreground">代表桥梁</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeRegion.examples.map((example) => (
                        <span key={example} className="rounded-full border border-[rgba(78,118,101,0.24)] bg-[rgba(240,249,245,0.92)] px-3 py-1.5 text-xs text-foreground/74">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="rounded-[24px] border border-[rgba(78,118,101,0.2)] bg-[linear-gradient(165deg,rgba(255,255,255,0.95),rgba(242,250,246,0.9))] p-5 shadow-[0_14px_26px_rgba(60,100,84,0.12)]">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ["水系环境", activeRegion.waterEnvironment ?? activeRegion.summary],
                      ["交通功能", activeRegion.trafficFunction ?? activeRegion.clue],
                      ["桥型选择", activeRegion.bridgeTypeChoice ?? "根据水文与交通需求选择桥型结构。"],
                      ["工程适应", activeRegion.engineeringAdaptation ?? activeRegion.summary],
                    ].map(([label, value]) => (
                      <article
                        key={label}
                        className={`rounded-[18px] border border-[rgba(78,118,101,0.2)] bg-[rgba(247,252,249,0.96)] p-4 shadow-[0_8px_14px_rgba(60,100,84,0.08)] ${label === "工程适应" ? "sm:col-span-2" : ""}`}
                      >
                        <p className="text-xs tracking-[0.16em] text-muted-foreground">{label}</p>
                        <p className="mt-2 text-sm leading-7 text-foreground/76">{value}</p>
                      </article>
                    ))}
                  </div>
                </article>
              </div>
            </>
          )}
        </article>

        {content.key === "palace" ? (
        <article
          id="section-space"
          className="scroll-mt-24 rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]"
          style={outlineFor("structure")}
        >
          <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">FOURTH SCREEN</p>
          <h2 className="mt-2 text-2xl font-serif-cn font-bold">{structureTitleMap[content.key]}</h2>
          {content.key === "palace" ? (
            <>
              <div className="mt-6 grid gap-5 xl:grid-cols-[0.86fr_1.14fr] xl:items-stretch">
                <article className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-5 xl:h-full">
                  <p className="text-sm font-medium text-foreground/74">礼制等级阶梯图</p>
                  <div className="mt-4 rounded-[18px] border border-[rgba(129,90,53,0.1)] bg-[linear-gradient(180deg,rgba(255,252,246,0.94),rgba(246,236,220,0.72))] p-3">
                    <div className="relative space-y-2.5 py-1.5">
                      <div className="pointer-events-none absolute inset-y-2 left-1/2 hidden w-px -translate-x-1/2 bg-[rgba(129,90,53,0.18)] sm:block" />
                      {palaceRitualStairOrder.map((spaceId, index) => {
                        const space = palaceRitualAccessSpaces.find(item => item.id === spaceId);
                        if (!space) return null;
                        const widths = ["w-[54%]", "w-[64%]", "w-[74%]", "w-[84%]", "w-[94%]"];
                        const highlighted = activePalaceAccessSpaceId === space.id;
                        return (
                          <button key={space.id} className="mx-auto block w-full" onClick={() => handlePalaceAccessSpaceSelect(space.id)}>
                            <div
                              className={`${widths[index]} relative mx-auto rounded-[14px] border px-3.5 py-2.5 transition-all ${highlighted ? "text-white shadow-[0_10px_16px_rgba(95,58,37,0.14)]" : "bg-[rgba(255,252,246,0.92)] text-foreground/78 hover:bg-[rgba(255,249,240,0.96)]"}`}
                              style={highlighted ? { backgroundColor: content.accent, borderColor: content.accent } : { borderColor: "rgba(129,90,53,0.14)" }}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`inline-flex h-5 min-w-[30px] items-center justify-center rounded-full border px-1 text-[10px] font-semibold tracking-[0.08em] ${highlighted ? "border-white/45 text-white/92" : "border-[rgba(129,90,53,0.22)] text-[hsl(28,28%,46%)]"}`}
                                >
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] ${highlighted ? "bg-white/22 text-white/92" : "bg-[rgba(129,90,53,0.1)] text-foreground/64"}`}
                                >
                                  {space.accessibility}
                                </span>
                              </div>
                              <div className="mt-2 space-y-1 text-center">
                                <p className={`text-xs sm:text-sm ${highlighted ? "text-white/84" : "text-muted-foreground"}`}>{space.ritualLevel}</p>
                                <p className="text-xl font-serif-cn font-bold leading-tight sm:text-2xl">{space.name}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </article>

                <div className="grid gap-4 xl:h-full xl:grid-rows-[0.9fr_1.1fr]">
                  <article className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-4 xl:h-full">
                    <h3 className="text-lg font-serif-cn font-semibold">当前空间说明</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{activePalaceAccessSpace.name}</p>
                    <div className="mt-3 overflow-hidden rounded-[16px] border border-[rgba(129,90,53,0.12)]">
                      {[
                        ["礼制等级", activePalaceAccessSpace.ritualLevel],
                        ["主要使用人群", activePalaceAccessSpace.userGroup],
                        ["仪式功能", activePalaceAccessSpace.ritualFunction],
                        ["可达性", activePalaceAccessSpace.accessibility],
                        ["象征意义", activePalaceAccessSpace.symbolicMeaning],
                        ["代表案例", activePalaceAccessSpace.representativeCase],
                      ].map(([label, value], index) => (
                        <div key={label} className={`grid grid-cols-[86px_1fr] gap-3 px-3 py-2.5 text-sm ${index > 0 ? "border-t border-[rgba(129,90,53,0.1)]" : ""}`}>
                          <span className="text-[11px] tracking-[0.1em] text-muted-foreground">{label}</span>
                          <span className="text-foreground/78">{value}</span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/78 p-4 xl:h-full">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-serif-cn font-semibold">使用权限矩阵</h3>
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(87,139,95,0.16)] px-2 py-1 text-[hsl(124,32%,32%)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(124,32%,32%)]" />
                          可进入
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(170,122,31,0.16)] px-2 py-1 text-[hsl(28,46%,36%)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(28,46%,36%)]" />
                          受限进入
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(118,106,92,0.16)] px-2 py-1 text-[hsl(30,12%,36%)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(30,12%,36%)]" />
                          不可进入
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 overflow-x-auto rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)]">
                      <table className="min-w-[620px] text-xs">
                        <thead>
                          <tr className="border-b border-[rgba(129,90,53,0.12)] bg-[rgba(129,90,53,0.06)]">
                            <th className="px-2 py-2 text-left text-muted-foreground">空间</th>
                            {palaceAccessRoleLabels.map(role => (
                              <th key={role.key} className="px-2 py-2 text-center text-muted-foreground">{role.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {palaceRitualMatrixOrder.map(spaceId => {
                            const space = palaceRitualAccessSpaces.find(item => item.id === spaceId);
                            if (!space) return null;
                            const isActive = space.id === activePalaceAccessSpaceId;
                            return (
                              <tr
                                key={space.id}
                                className={`cursor-pointer border-b border-[rgba(129,90,53,0.08)] transition-all ${isActive ? "bg-[rgba(170,122,31,0.1)]" : "hover:bg-[rgba(129,90,53,0.04)]"}`}
                                onClick={() => handlePalaceAccessSpaceSelect(space.id)}
                              >
                                <td className="px-2 py-2 font-medium text-foreground/82">{space.name}</td>
                                {palaceAccessRoleLabels.map(role => {
                                  const permission = space.permissions[role.key];
                                  return (
                                    <td key={role.key} className="px-1 py-2 text-center">
                                      <span
                                        className={`inline-flex min-w-[56px] items-center justify-center rounded-full px-2 py-1 ${permission === "allow" ? "bg-[rgba(87,139,95,0.16)] text-[hsl(124,32%,32%)]" : permission === "limited" ? "bg-[rgba(170,122,31,0.16)] text-[hsl(28,46%,36%)]" : "bg-[rgba(118,106,92,0.16)] text-[hsl(30,12%,36%)]"}`}
                                      >
                                        {palacePermissionLabelMap[permission]}
                                      </span>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </article>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm leading-7 text-foreground/72">{content.structure.intro}</p>
              <div className="mt-6 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-[24px] border border-[rgba(78,118,101,0.2)] bg-[linear-gradient(165deg,rgba(255,255,255,0.95),rgba(242,250,246,0.9))] p-4 shadow-[0_14px_24px_rgba(60,100,84,0.12)]">
                  <p className="text-sm font-medium text-foreground/74">{content.key === "government" ? "官署功能画像" : "结构维度雷达图"}</p>
                  {content.key === "government" ? (
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">聚焦行政、司法、礼制、军事、教育五类功能，随治理层级切换显示侧重点。</p>
                  ) : null}
                  <div className="mt-3 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} outerRadius="66%">
                        <PolarGrid stroke="rgba(129,90,53,0.14)" />
                        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#6e5846" }} />
                        <Radar dataKey="value" stroke={content.accent} fill={content.accent} fillOpacity={0.22} strokeWidth={2} />
                        <Tooltip formatter={(value: number) => [value, "指数"]} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid gap-4">
                  {content.structure.blocks.map((block) => (
                    <article key={block.title} className="rounded-[22px] border border-[rgba(78,118,101,0.2)] bg-[rgba(247,252,249,0.94)] p-4 shadow-[0_10px_18px_rgba(60,100,84,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(78,118,101,0.38)] hover:shadow-[0_16px_24px_rgba(54,95,79,0.16)]">
                      <h3 className="text-lg font-serif-cn font-semibold">{block.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-foreground/74">{block.summary}</p>
                      <div className="mt-4 space-y-2">
                        {block.bullets.map((bullet) => (
                          <p key={bullet} className="text-sm leading-7 text-muted-foreground">{bullet}</p>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}
        </article>
        ) : null}
      </section>

      <section
        id="section-compare"
        className={content.key === "government" ? "order-2 scroll-mt-24" : `${content.key === "residential" ? "order-6" : "order-2"} scroll-mt-24 rounded-[30px] border p-6 ${content.key === "bridge" ? "shadow-[0_22px_42px_rgba(54,95,79,0.16)]" : "shadow-[0_18px_34px_rgba(122,86,52,0.08)]"}`}
        style={
          content.key === "government"
            ? { ...(outlineFor("interaction") ?? {}) }
            : content.key === "bridge"
              ? { background: "linear-gradient(160deg,rgba(246,252,249,0.98),rgba(233,245,239,0.92))", borderColor: "rgba(78,118,101,0.24)", ...(outlineFor("interaction") ?? {}) }
              : { background: profile.sectionSurface, borderColor: content.key === "bridge" ? `${content.accent}2e` : "transparent", ...(outlineFor("interaction") ?? {}) }
        }
      >
        {content.key === "palace" ? <div id="section-axis" className="scroll-mt-24" /> : null}
        {content.key !== "government" && (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">CORE INTERACTION</p>
            <h2 className="mt-2 text-2xl font-serif-cn font-bold">
              {content.key === "residential" && "地域民居对比"}
              {content.key === "government" && "官署空间序列"}
              {content.key === "palace" && "中轴节点功能图"}
              {content.key === "bridge" && "桥型结构与受力原理"}
            </h2>
            {content.key === "palace" || content.key === "bridge" ? null : <p className="mt-3 text-sm leading-7 text-foreground/72">{profile.coreQuestion}</p>}
          </div>
        </div>
        )}

        {content.key === "residential" && (
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {[{ label: "左侧民居", value: compareLeftId, setter: setCompareLeftId }, { label: "右侧民居", value: compareRightId, setter: setCompareRightId }].map(control => (
                <div key={control.label} className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/72 p-4">
                  <p className="text-xs tracking-[0.16em] text-muted-foreground">{control.label}</p>
                  <select
                    value={control.value}
                    onChange={(event) => {
                      control.setter(event.target.value);
                      focusResidentialObject(event.target.value);
                    }}
                    className="mt-3 w-full rounded-[14px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.92)] px-3 py-2 text-sm outline-none"
                  >
                    {residentialClassicIds.map(id => {
                      const item = residentialLineageItems.find(entry => entry.id === id);
                      return item ? <option key={item.id} value={item.id}>{item.name}</option> : null;
                    })}
                  </select>
                  <img
                    src={(control.label === "左侧民居" ? compareLeft : compareRight).image}
                    alt={(control.label === "左侧民居" ? compareLeft : compareRight).name}
                    className="mt-4 h-32 w-full rounded-[18px] object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="rounded-[26px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
                <div>
                  <h3 className="text-2xl font-serif-cn font-bold">{compareLeft.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{compareLeft.period} / {compareLeft.region}</p>
                </div>
                <div className="flex items-center justify-center text-xs tracking-[0.2em] text-muted-foreground">VS</div>
                <div className="text-left md:text-right">
                  <h3 className="text-2xl font-serif-cn font-bold">{compareRight.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{compareRight.period} / {compareRight.region}</p>
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-[22px] border border-[rgba(129,90,53,0.12)]">
                {comparisonDimensions.map((row, index) => (
                  <div key={row.label} className={`grid gap-0 md:grid-cols-[1fr_0.42fr_1fr] ${index > 0 ? "border-t border-[rgba(129,90,53,0.1)]" : ""}`}>
                    <div className="bg-[rgba(255,252,246,0.9)] p-4 text-sm leading-7 text-foreground/74">{row.left}</div>
                    <div className="flex items-center justify-center bg-[rgba(129,90,53,0.06)] px-3 py-4 text-sm font-medium text-foreground/76">{row.label}</div>
                    <div className="bg-white/84 p-4 text-sm leading-7 text-foreground/74">{row.right}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {[compareLeft, compareRight].map(item => (
                  <button
                    key={item.id}
                    onClick={() => focusResidentialObject(item.id)}
                    className="rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.9)] px-3 py-1.5 text-xs text-foreground/74"
                  >
                    查看 {item.name} 谱系位置
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {content.key === "government" && (
          <div id="section-axis" className="scroll-mt-24 relative overflow-hidden rounded-[28px] border border-[rgba(122,75,49,0.16)] bg-[rgba(255,252,246,0.86)] p-5 shadow-[0_16px_34px_rgba(84,52,30,0.08)] md:p-6">
            <p className="text-xs tracking-[0.34em] text-[hsl(18,42%,42%)]">CORE VISUAL</p>
            <h2 className="mt-2 font-serif-cn text-[30px] font-bold leading-tight text-[hsl(24,52%,18%)] md:text-[34px]">官署空间序列 / 轴线结构图</h2>

            <div className="mt-5 rounded-[22px] border border-[rgba(122,75,49,0.12)] bg-[rgba(255,252,246,0.74)] p-3 md:p-4">
              <p className="text-xs tracking-[0.16em] text-muted-foreground">可点击轴线节点</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
                {governmentAxisNodes.map((node) => {
                  const palette = governmentZonePalette[node.zone];
                  const isActive = node.panelIndex === activeGovernmentIndex;
                  const clickable = node.panelIndex !== undefined;
                  return (
                    <button
                      key={node.id}
                      onClick={() => {
                        if (node.panelIndex !== undefined) handleGovernmentSpaceSelect(node.panelIndex);
                      }}
                      className={`rounded-[14px] border px-3 py-2 text-left transition-all ${isActive ? "border-transparent text-white shadow-[0_10px_18px_rgba(97,61,38,0.14)]" : "bg-white/86 text-foreground/78"} ${clickable ? "cursor-pointer" : "cursor-default opacity-90"}`}
                      style={{
                        borderColor: isActive ? palette.start : "rgba(129,90,53,0.14)",
                        background: isActive ? `linear-gradient(135deg,${palette.start},${palette.end})` : undefined,
                      }}
                    >
                      <p className="text-base font-serif-cn font-semibold">{node.name}</p>
                      <p className={`mt-1 text-[11px] ${isActive ? "text-white/85" : "text-muted-foreground"}`}>{palette.label}</p>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-5 text-foreground/58">点击节点后，右侧说明与属性指标会同步更新。</p>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
              <div className="rounded-[22px] border border-[rgba(122,75,49,0.12)] bg-[rgba(255,252,246,0.72)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs tracking-[0.2em] text-[hsl(28,28%,48%)]">当前节点</p>
                    <h3 className="mt-1 font-serif-cn text-2xl font-bold text-[hsl(24,52%,18%)]">{activeGovernment.name}</h3>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: governmentZonePalette[activeGovernment.zone].chip,
                      color: governmentZonePalette[activeGovernment.zone].start,
                    }}
                  >
                    {activeGovernment.stage}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/74">{activeGovernment.summary}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    { label: "功能", value: activeGovernment.functionLabel },
                    { label: "开放性", value: activeGovernment.opennessLabel },
                    { label: "权力属性", value: activeGovernment.powerLabel },
                    { label: "空间意义", value: activeGovernment.spaceLabel },
                  ].map(item => (
                    <div key={item.label} className="rounded-[12px] border border-[rgba(129,90,53,0.1)] bg-white/82 px-3 py-2">
                      <p className="text-[11px] tracking-[0.12em] text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-foreground/78">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-white/82 p-3">
                  <p className="text-xs tracking-[0.14em] text-muted-foreground">相关案例</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeGovernment.relatedCases.map(item => (
                      <span key={item} className="rounded-full border border-[rgba(129,90,53,0.12)] bg-white px-3 py-1 text-xs text-foreground/74">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[22px] border border-[rgba(122,75,49,0.12)] bg-[rgba(255,252,246,0.72)] p-4">
                  <p className="text-xs tracking-[0.2em] text-[hsl(28,28%,48%)]">三维属性联动</p>
                  <div className="mt-3 grid gap-3">
                    {[
                      { label: "公开性", value: activeGovernment.opennessScore, hint: activeGovernment.opennessLabel },
                      { label: "权力属性", value: activeGovernment.powerScore, hint: activeGovernment.powerLabel },
                      { label: "空间属性", value: activeGovernment.spaceScore, hint: activeGovernment.spaceLabel },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-foreground/74">{item.label}</span>
                          <span className="text-muted-foreground">{item.hint}</span>
                        </div>
                        <div className="relative mt-1.5 h-2 rounded-full bg-[rgba(129,90,53,0.16)]">
                          <span
                            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_5px_10px_rgba(87,54,34,0.2)]"
                            style={{ left: `${item.value}%`, backgroundColor: content.accent }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-foreground/58">指示点会随节点切换移动，展示权力可见性从外向内变化。</p>
                </div>
                <div className="rounded-[22px] border border-[rgba(122,75,49,0.12)] bg-[rgba(255,252,246,0.72)] p-4">
                  <p className="text-xs tracking-[0.2em] text-[hsl(28,28%,48%)]">属性对比条</p>
                  <div className="mt-2 h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={governmentAttributeBars} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,90,53,0.12)" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value: number) => [value, "属性指数"]} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill={content.accent} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {governmentAttributeBars.map(item => (
                      <span
                        key={`${item.label}-${item.hint}`}
                        className="rounded-full bg-[rgba(129,90,53,0.08)] px-3 py-1.5 text-center text-xs text-foreground/74"
                      >
                        {item.label}：{item.hint}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {content.key === "government" && (
          <div id="section-process" className="scroll-mt-24 relative mt-6 overflow-hidden rounded-[28px] border border-[rgba(122,75,49,0.16)] bg-[rgba(255,252,246,0.72)] p-4 shadow-[0_14px_28px_rgba(84,52,30,0.08)] md:p-5">
            <div className="relative">
              <p className="text-xs tracking-[0.34em] text-[hsl(18,42%,42%)]">PROCESS FLOW</p>
              <h2 className="mt-2 font-serif-cn text-3xl font-bold leading-tight text-[hsl(24,52%,18%)] md:text-4xl">行政审理流程</h2>

              <div className="mt-5">
                <div className="overflow-hidden rounded-[22px]">
                  <div className="relative overflow-hidden rounded-[22px]">
                    <img
                      src="/diagrams/government-process-flow.png"
                      alt="行政审理流程"
                      className="block w-full select-none"
                      draggable={false}
                    />
                    {governmentProcessFlow.map((item, index) => {
                      const isActive = index === activeGovernmentFlowIndex;
                      const left = [1.6, 17.9, 34.2, 49.9, 66.4, 82.7][index];
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleGovernmentFlowSelect(index)}
                          aria-label={`查看${item.title}`}
                          title={item.title}
                          className="absolute top-[7.5%] h-[66.5%] w-[14.2%] rounded-[18px] border-0 bg-transparent transition-all hover:bg-[rgba(255,248,235,0.1)]"
                          style={{
                            left: `${left}%`,
                          }}
                        >
                          <span className="sr-only">{item.title}</span>
                        </button>
                      );
                    })}
                    {[0, 1, 2, 4, 5].map((flowIndex, chipIndex) => {
                      const item = governmentProcessFlow[flowIndex];
                      const isActive = flowIndex === activeGovernmentFlowIndex;
                      const left = [22.8, 39.2, 55.4, 71.9, 88.4][chipIndex];
                      return (
                        <button
                          key={`${item.id}-space`}
                          onClick={() => handleGovernmentFlowSelect(flowIndex)}
                          aria-label={`查看对应空间${item.space}`}
                          className="absolute top-[82%] h-[13%] -translate-x-1/2 rounded-full border-0 bg-transparent transition-all hover:bg-[rgba(255,248,235,0.1)]"
                          style={{
                            left: `${left}%`,
                            width: chipIndex === 4 ? "13.5%" : "10.2%",
                          }}
                        >
                          <span className="sr-only">{item.space}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
                <div className="rounded-[20px] border border-[rgba(122,75,49,0.14)] bg-[rgba(255,252,246,0.82)] p-4">
                  <p className="text-xs tracking-[0.2em] text-[hsl(28,28%,48%)]">相关案例</p>
                  <h3 className="mt-2 font-serif-cn text-2xl font-bold text-[hsl(24,52%,18%)]">{activeGovernmentFlow.caseTitle}</h3>
                  <p className="mt-3 text-sm leading-7 text-foreground/74">{activeGovernmentFlow.caseText}</p>
                </div>
                <div className="rounded-[20px] border border-[rgba(122,75,49,0.14)] bg-[rgba(255,252,246,0.7)] p-4">
                  <p className="text-xs tracking-[0.2em] text-[hsl(28,28%,48%)]">流程特点</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/72">
                    审理流程从门前受理开始，经过大门和仪门完成身份与礼法转换，在大堂公开审理，再进入二堂复核和文书归档，体现“公开审理”和“内部行政”分层推进。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {content.key === "palace" && (
          <div className="mt-6 space-y-6">
            <article className="rounded-[26px] border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.78)] p-5">
              <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/78 p-4">
                  <div
                    className="relative h-[340px] overflow-hidden rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.82)]"
                    style={{
                      backgroundImage: "url('/diagrams/palace-axis-bg.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {[
                      { id: "gate", left: "50%", top: "14%", width: "16%", height: "13%" },
                      { id: "court", left: "50%", top: "31%", width: "16%", height: "13%" },
                      { id: "hall", left: "50%", top: "48%", width: "18%", height: "14%" },
                      { id: "bedroom", left: "50%", top: "74%", width: "16%", height: "13%" },
                      { id: "left-ancestor", left: "23%", top: "48%", width: "16%", height: "13%" },
                      { id: "right-sheji", left: "77%", top: "48%", width: "16%", height: "13%" },
                    ].map(node => {
                      const item = palacePlanNodes.find(entry => entry.id === node.id);
                      if (!item) return null;
                      return (
                        <button
                          key={item.id}
                          aria-label={`切换到${item.name}`}
                          onClick={() => setActivePalacePlanId(item.id)}
                          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-0 bg-transparent p-0"
                          style={{
                            left: node.left,
                            top: node.top,
                            width: node.width,
                            height: node.height,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    {palacePlanNodes.map(item => {
                      const active = activePalacePlanId === item.id;
                      return (
                        <button
                          key={`${item.id}-chip`}
                          onClick={() => setActivePalacePlanId(item.id)}
                          className={`min-w-[64px] rounded-full border px-3 py-1 text-xs transition-all ${active ? "text-white shadow-[0_8px_16px_rgba(95,58,37,0.14)]" : "bg-white/88 text-foreground/74"}`}
                          style={active ? { backgroundColor: content.accent, borderColor: content.accent } : { borderColor: "rgba(129,90,53,0.16)" }}
                        >
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/78 p-4">
                  <p className="text-xs tracking-[0.16em] text-muted-foreground">当前节点</p>
                  <h4 className="mt-2 text-2xl font-serif-cn font-bold">{activePalaceAxisDetail.name}</h4>
                  <div className="mt-4 overflow-hidden rounded-[16px] border border-[rgba(129,90,53,0.12)]">
                    {[
                      ["空间位置", activePalaceAxisDetail.position],
                      ["主要功能", activePalaceAxisDetail.function],
                      ["礼制等级", activePalaceAxisDetail.ritualLevel],
                      ["仪式含义", activePalaceAxisDetail.ritualMeaning],
                      ["皇权象征", activePalaceAxisDetail.imperialSymbol],
                      ["代表案例", activePalaceAxisDetail.representativeCase],
                    ].map(([label, value], index) => (
                      <div key={label} className={`grid grid-cols-[72px_1fr] gap-3 px-3 py-2.5 text-sm ${index > 0 ? "border-t border-[rgba(129,90,53,0.1)]" : ""}`}>
                        <span className="text-[11px] tracking-[0.1em] text-muted-foreground">{label}</span>
                        <span className="text-foreground/78">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

          </div>
        )}

        {content.key === "bridge" && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-stretch justify-between gap-3">
              {bridgePanels.map((item, index) => {
                const isActive = index === activeBridgeIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveBridgeIndex(index)}
                    className={`rounded-[22px] border px-5 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${isActive ? "border-transparent bg-[linear-gradient(145deg,rgba(85,122,107,0.24),rgba(85,122,107,0.16))] shadow-[0_16px_26px_rgba(54,95,79,0.22)]" : "border-[rgba(78,118,101,0.24)] bg-[rgba(255,255,255,0.9)] shadow-[0_8px_16px_rgba(60,100,84,0.1)] hover:border-[rgba(78,118,101,0.4)] hover:bg-[rgba(243,251,247,0.96)] hover:shadow-[0_14px_24px_rgba(54,95,79,0.18)]"}`}
                    style={isActive ? { boxShadow: `0 0 0 1px ${content.accent} inset` } : undefined}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-serif-cn font-semibold">{item.name}</h3>
                      <span className="text-xs text-muted-foreground">{item.clue}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="grid gap-6 xl:grid-cols-[0.52fr_0.48fr]">
              <div className="rounded-[24px] border border-[rgba(78,118,101,0.2)] bg-[linear-gradient(165deg,rgba(255,255,255,0.95),rgba(242,250,246,0.9))] p-4 shadow-[0_14px_24px_rgba(60,100,84,0.12)] transition-all duration-300 hover:shadow-[0_18px_30px_rgba(54,95,79,0.18)]">
                <p className="text-sm font-medium text-foreground/74">桥型结构与受力原理字段</p>
                <h3 className="mt-2 text-2xl font-serif-cn font-bold">{activeBridge.name}</h3>
                <div className="mt-4 overflow-hidden rounded-[16px] border border-[rgba(78,118,101,0.18)] bg-[rgba(247,252,249,0.94)]">
                  {[
                    ["结构形式", activeBridge.structureForm],
                    ["受力路径", activeBridge.forcePath],
                    ["适用环境", activeBridge.environment],
                    ["建造材料", activeBridge.materials],
                    ["技术优势", activeBridge.advantages],
                    ["局限性", activeBridge.limitations],
                    ["代表桥梁", activeBridge.representatives.join("、")],
                  ].map(([label, value], index) => (
                    <div key={label} className={`grid grid-cols-[92px_1fr] gap-3 px-3 py-2.5 text-sm ${index > 0 ? "border-t border-[rgba(78,118,101,0.12)]" : ""}`}>
                      <span className="text-[11px] tracking-[0.1em] text-muted-foreground">{label}</span>
                      <span className="text-foreground/78">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[rgba(78,118,101,0.2)] bg-[linear-gradient(165deg,rgba(255,255,255,0.95),rgba(242,250,246,0.9))] p-4 shadow-[0_14px_24px_rgba(60,100,84,0.12)] transition-all duration-300 hover:shadow-[0_18px_30px_rgba(54,95,79,0.18)]">
                <div className="overflow-hidden rounded-[18px] border border-[rgba(78,118,101,0.18)] bg-[rgba(247,252,249,0.94)]">
                  <img src={activeBridge.diagram} alt={`${activeBridge.name}桥型结构与受力原理`} className="h-[460px] w-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section id="section-cases" className={`${content.key === "residential" ? "order-7" : content.key === "government" ? "order-7" : content.key === "palace" ? "order-8" : "order-6"} grid scroll-mt-24 gap-6 xl:grid-cols-[0.88fr_1.12fr]`} style={outlineFor("case")}>
        {content.key === "residential" ? (
          <article className="xl:col-span-2 overflow-hidden rounded-[32px] border border-transparent bg-[rgba(255,251,245,0.86)] shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
            <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="p-6">
                <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">CASE READING</p>
                <h2 className="mt-2 text-2xl font-serif-cn font-bold">经典案例深读</h2>
                <p className="mt-3 text-sm leading-7 text-foreground/72">围绕 5 个成熟地域民居案例，切换查看图像、结构、成因与代表价值。</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {residentialCaseTabs.map(item => {
                    const active = item.id === activeResidentialCaseId;
                    return (
                      <button
                        key={item.id}
                        onClick={() => focusResidentialObject(item.id)}
                        className={`rounded-full border px-4 py-2 text-sm transition-all ${active ? "border-transparent text-white" : "border-[rgba(129,90,53,0.14)] bg-white/80 text-foreground/74"}`}
                        style={active ? { backgroundColor: content.accent } : undefined}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs tracking-[0.16em] text-muted-foreground">案例名称</p>
                      <h3 className="mt-2 text-3xl font-serif-cn font-bold">{activeResidentialDeepDive.name}</h3>
                    </div>
                    <span className="rounded-full px-3 py-1.5 text-xs text-white" style={{ backgroundColor: content.accent }}>{activeResidentialDeepDive.period}</span>
                  </div>
                  <p className="mt-4 text-base leading-8 text-foreground/78">{activeResidentialDeepDive.oneLine}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "所在地域", value: activeResidentialDeepDive.region },
                      { label: "建筑类型", value: activeResidentialDeepDive.type },
                      { label: "历史时期", value: activeResidentialDeepDive.period },
                    ].map(item => (
                      <div key={item.label} className="rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-3">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="mt-1 text-sm font-medium text-foreground/82">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeResidentialDeepDive.keywords.map(keyword => (
                      <span key={keyword} className="rounded-full bg-[rgba(129,90,53,0.08)] px-3 py-1.5 text-xs text-foreground/72">{keyword}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowResidentialStructure(value => !value);
                        resetStructureViewer();
                      }}
                      className="rounded-full px-5 py-2.5 text-sm text-white shadow-[0_10px_18px_rgba(95,58,37,0.14)]"
                      style={{ backgroundColor: content.accent }}
                    >
                      {showResidentialStructure ? "返回案例大图" : "查看空间结构"}
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.92)] px-5 py-2.5 text-sm text-foreground/74"
                      onClick={() => {
                        setAiSeedQuestion(activeResidentialDeepDive.aiQuestion);
                        window.setTimeout(() => document.getElementById("section-ai")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
                      }}
                    >
                      AI讲解这个案例
                    </button>
                    {activeResidentialDeepDive.vrLink ? (
                      <a
                        href={activeResidentialDeepDive.vrLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.92)] px-5 py-2.5 text-sm text-foreground/74"
                      >
                        VR导览
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.92)] px-5 py-2.5 text-sm text-foreground/74"
                      >
                        VR导览
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-t border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.54)] p-6 xl:border-l xl:border-t-0">
                <div className="overflow-hidden rounded-[28px] border border-[rgba(129,90,53,0.12)] bg-white/76">
                  {showResidentialStructure ? (
                    <div className="p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground/74">{activeResidentialDeepDive.name} · 空间结构图解</p>
                          <p className="mt-1 text-xs text-muted-foreground">滚轮缩放，按住图片拖动查看细节。</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setStructureZoom(value => clampZoom(value - 0.2))}
                            className="h-8 w-8 rounded-full border border-[rgba(129,90,53,0.14)] bg-white/80 text-sm text-foreground/72"
                          >
                            -
                          </button>
                          <span className="w-12 text-center text-xs text-muted-foreground">{Math.round(structureZoom * 100)}%</span>
                          <button
                            type="button"
                            onClick={() => setStructureZoom(value => clampZoom(value + 0.2))}
                            className="h-8 w-8 rounded-full border border-[rgba(129,90,53,0.14)] bg-white/80 text-sm text-foreground/72"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={resetStructureViewer}
                            className="rounded-full border border-[rgba(129,90,53,0.14)] bg-white/80 px-3 py-1.5 text-xs text-foreground/72"
                          >
                            复位
                          </button>
                        </div>
                      </div>
                      <div
                        ref={structureViewerRef}
                        className="mt-4 h-[520px] cursor-grab overflow-hidden rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.92)] active:cursor-grabbing"
                        onMouseDown={(event) => setStructureDragStart({ x: event.clientX, y: event.clientY, panX: structurePan.x, panY: structurePan.y })}
                        onMouseMove={(event) => {
                          if (!structureDragStart) return;
                          setStructurePan({
                            x: structureDragStart.panX + event.clientX - structureDragStart.x,
                            y: structureDragStart.panY + event.clientY - structureDragStart.y,
                          });
                        }}
                        onMouseUp={() => setStructureDragStart(null)}
                        onMouseLeave={() => setStructureDragStart(null)}
                      >
                        <img
                          src={activeResidentialDeepDive.structureImage}
                          alt={`${activeResidentialDeepDive.name}空间结构图`}
                          draggable={false}
                          className="h-full w-full select-none object-contain transition-transform duration-100"
                          style={{
                            transform: `translate(${structurePan.x}px, ${structurePan.y}px) scale(${structureZoom})`,
                            transformOrigin: "center center",
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <img src={activeResidentialCase.image} alt={activeResidentialDeepDive.name} className="h-80 w-full object-cover" />
                      <div className="p-5">
                        <p className="text-xs tracking-[0.16em] text-muted-foreground">右侧大图</p>
                        <p className="mt-2 text-sm leading-7 text-foreground/74">{activeResidentialDeepDive.oneLine}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-[rgba(129,90,53,0.12)] p-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {residentialCaseDetails.map(detail => (
                  <div key={detail.label} className="rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-4">
                    <p className="text-xs tracking-[0.14em] text-muted-foreground">{detail.label}</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/76">{detail.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[22px] border border-transparent bg-[rgba(255,252,246,0.9)] p-5">
                <p className="text-xs tracking-[0.16em] text-muted-foreground">代表价值</p>
                <p className="mt-3 text-base leading-8 text-foreground/78">{activeResidentialDeepDive.value}</p>
              </div>
            </div>
          </article>
        ) : content.key === "government" ? (
          <>
            <article className="rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">FIFTH SCREEN</p>
                  <h2 className="mt-2 text-2xl font-serif-cn font-bold">官署经典案例</h2>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {content.cases.map((item, index) => {
                  const isActive = index === activeCaseIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleCaseSelect(index)}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${isActive ? "border-transparent text-white" : "border-[rgba(129,90,53,0.14)] bg-white/80 text-foreground/74"}`}
                      style={isActive ? { backgroundColor: content.accent } : undefined}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/72 p-5">
                <p className="text-xs tracking-[0.16em] text-muted-foreground">案例名称</p>
                <h3 className="mt-2 text-3xl font-serif-cn font-bold text-foreground">{activeCase.name}</h3>
                <p className="mt-4 text-sm leading-8 text-foreground/76">{activeCase.summary}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "历史时期", value: activeCase.dynasty },
                    { label: "行政层级", value: activeCase.adminLevel ?? "—" },
                    { label: "功能类型", value: activeCase.functionType ?? "—" },
                    { label: "空间结构", value: activeCase.spatialStructure ?? "—" },
                  ].map(item => (
                    <div key={item.label} className="rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-3">
                      <p className="text-xs tracking-[0.14em] text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-sm leading-7 text-foreground/76">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.92)] px-5 py-2.5 text-sm text-foreground/74"
                  onClick={() => {
                    setAiSeedQuestion(`请讲解${activeCase.name}在${activeCase.dynasty}时期的行政层级、功能类型、空间结构与制度意义。`);
                    window.setTimeout(() => document.getElementById("section-ai")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
                  }}
                >
                  AI讲解这个案例
                </button>
                {activeCase.vrLink ? (
                  <a
                    href={activeCase.vrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.92)] px-5 py-2.5 text-sm text-foreground/74"
                  >
                    VR导览
                  </a>
                ) : (
                  <button
                    type="button"
                    className="rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.92)] px-5 py-2.5 text-sm text-foreground/74"
                  >
                    VR导览
                  </button>
                )}
              </div>
            </article>

            <article className="overflow-hidden rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
              <img src={activeCase.image} alt={activeCase.name} className="h-80 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.18em] text-[hsl(28,28%,48%)]">案例档案</p>
                    <h3 className="mt-3 text-4xl font-serif-cn font-bold text-foreground">{activeCase.name}</h3>
                    <p className="mt-4 text-lg text-muted-foreground">{activeCase.location}</p>
                  </div>
                  <span className="rounded-full px-4 py-2 text-sm text-white" style={{ backgroundColor: content.accent }}>{activeCase.dynasty}</span>
                </div>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-4">
                    <p className="text-xs tracking-[0.14em] text-muted-foreground">制度意义</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/76">{activeCase.institutionalMeaning ?? activeCase.significance}</p>
                  </div>
                  <div className="rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-4">
                    <p className="text-xs tracking-[0.14em] text-muted-foreground">代表价值</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/76">{activeCase.representativeValue ?? activeCase.significance}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {activeCase.keywords.map(keyword => (
                    <span key={keyword} className="rounded-full border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.84)] px-3 py-1.5 text-xs text-foreground/74">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </>
        ) : content.key === "palace" ? (
          <>
            <article className="rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
              <div>
                <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">FIFTH SCREEN</p>
                <h2 className="mt-2 text-2xl font-serif-cn font-bold">典型案例深读</h2>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {palaceCaseStageChain.map((item) => {
                  const active = item.caseIndex === activeCaseIndex;
                  return (
                    <button
                      key={item.caseItem.id}
                      onClick={() => handleCaseSelect(item.caseIndex)}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${active ? "border-transparent text-white" : "border-[rgba(129,90,53,0.14)] bg-white/80 text-foreground/74"}`}
                      style={active ? { backgroundColor: content.accent } : undefined}
                    >
                      {item.caseItem.name}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-4">
                <p className="text-xs tracking-[0.16em] text-muted-foreground">当前案例成熟度</p>
                <h3 className="mt-2 text-lg font-serif-cn font-semibold">{activeCase.name}</h3>
                <div className="mt-3 rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.92)] p-3">
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={palaceMaturityMetrics} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,90,53,0.12)" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#7a6754" }} interval={0} />
                        <YAxis
                          domain={[0, 5]}
                          ticks={[0, 1, 2, 3, 4, 5]}
                          tick={{ fontSize: 10, fill: "#8a7661" }}
                        />
                        <Tooltip formatter={(value: number) => [`${value} / 5`, "成熟度"]} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill={content.accent} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {palaceMaturityMetrics.map(item => (
                    <div key={item.key} className="flex items-center justify-between rounded-[12px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-3 py-2 text-xs">
                      <span className="text-foreground/72">{item.label}</span>
                      <span className="font-semibold text-foreground/82">{item.value} / 5</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-4">
                <p className="text-xs tracking-[0.16em] text-muted-foreground">案例深读操作</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.92)] px-5 py-2.5 text-sm text-foreground/74"
                    onClick={() => {
                      setAiSeedQuestion(`请深读${activeCase.name}，从空间结构、礼制意义、发展定位与四项成熟度指标进行讲解。`);
                      window.setTimeout(() => document.getElementById("section-ai")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
                    }}
                  >
                    AI讲解这个案例
                  </button>
                  <a
                    href={activePalaceCaseMeta.vrLink || activeCase.vrLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.92)] px-5 py-2.5 text-sm text-foreground/74"
                  >
                    VR导览
                  </a>
                </div>
              </div>
            </article>

            <article className="overflow-hidden rounded-[30px] border border-transparent bg-[rgba(255,251,245,0.84)] shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
              <img src={activeCase.image} alt={activeCase.name} className="h-80 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.18em] text-[hsl(28,28%,48%)]">案例档案</p>
                    <h3 className="mt-3 text-4xl font-serif-cn font-bold text-foreground">{activeCase.name}</h3>
                  </div>
                  <span className="rounded-full px-4 py-2 text-sm text-white" style={{ backgroundColor: content.accent }}>{activePalaceCaseMeta.stage}</span>
                </div>

                <div className="mt-4 overflow-hidden rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(129,90,53,0.08)]">
                  <div className="grid gap-px bg-[rgba(129,90,53,0.08)] sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: "历史时期", value: activePalaceCaseMeta.period },
                      { label: "所在地", value: activeCase.location },
                      { label: "阶段定位", value: activePalaceCaseMeta.stage },
                      { label: "案例类型", value: activePalaceCaseMeta.caseType },
                    ].map(item => (
                      <div key={item.label} className="bg-[rgba(255,252,246,0.94)] px-3 py-2.5">
                        <p className="text-[11px] tracking-[0.12em] text-muted-foreground">{item.label}</p>
                        <p className="mt-1 text-sm font-medium leading-6 text-foreground/78">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-4">
                    <p className="text-xs tracking-[0.14em] text-muted-foreground">空间结构</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/76">{activePalaceCaseMeta.spaceStructure}</p>
                  </div>
                  <div className="rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-4">
                    <p className="text-xs tracking-[0.14em] text-muted-foreground">礼制意义</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/76">{activePalaceCaseMeta.ritualMeaning}</p>
                  </div>
                  <div className="rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-4">
                    <p className="text-xs tracking-[0.14em] text-muted-foreground">发展定位</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/76">{activePalaceCaseMeta.developmentPosition}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {activeCase.keywords.map(keyword => (
                    <span key={keyword} className="rounded-full border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.84)] px-3 py-1.5 text-xs text-foreground/74">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </>
        ) : (
          <>
            <article className="rounded-[30px] border border-[rgba(78,118,101,0.24)] bg-[linear-gradient(160deg,rgba(246,252,249,0.98),rgba(233,245,239,0.92))] p-6 shadow-[0_22px_42px_rgba(54,95,79,0.16)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">FIFTH SCREEN</p>
                  <h2 className="mt-2 text-2xl font-serif-cn font-bold">经典案例</h2>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {content.cases.map((item, index) => {
                  const isActive = index === activeCaseIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleCaseSelect(index)}
                      className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 ${isActive ? "border-transparent text-white shadow-[0_12px_20px_rgba(54,95,79,0.2)]" : "border-[rgba(78,118,101,0.24)] bg-[rgba(255,255,255,0.9)] text-foreground/74 shadow-[0_8px_14px_rgba(60,100,84,0.1)] hover:border-[rgba(78,118,101,0.4)] hover:bg-[rgba(243,251,247,0.96)] hover:shadow-[0_14px_22px_rgba(54,95,79,0.16)]"}`}
                      style={isActive ? { backgroundColor: content.accent } : undefined}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 rounded-[24px] border border-[rgba(78,118,101,0.2)] bg-[linear-gradient(165deg,rgba(255,255,255,0.95),rgba(242,250,246,0.9))] p-5 shadow-[0_14px_24px_rgba(60,100,84,0.12)]">
                <p className="text-xs tracking-[0.16em] text-muted-foreground">当前案例</p>
                <h3 className="mt-2 text-2xl font-serif-cn font-bold text-foreground">{activeCase.name}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/76">{activeCase.summary}</p>
                <div className="mt-4 overflow-hidden rounded-[16px] border border-[rgba(78,118,101,0.2)]">
                  {[
                    ["历史时期", activeCase.dynasty],
                    ["所在地", activeCase.location],
                    ["桥型", activeCase.bridgeType ?? "—"],
                    ["核心技术", activeCase.coreTechnology ?? "—"],
                  ].map(([label, value], index) => (
                    <div key={label} className={`grid grid-cols-[78px_1fr] gap-3 px-3 py-2.5 text-sm ${index > 0 ? "border-t border-[rgba(78,118,101,0.12)]" : ""}`}>
                      <span className="text-[11px] tracking-[0.1em] text-muted-foreground">{label}</span>
                      <span className="text-foreground/78">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full border border-[rgba(78,118,101,0.24)] bg-[rgba(255,255,255,0.92)] px-5 py-2.5 text-sm text-foreground/74 shadow-[0_8px_14px_rgba(60,100,84,0.1)]"
                    onClick={() => {
                      setAiSeedQuestion(`请深读${activeCase.name}，重点讲解其核心技术、水文适应策略、交通意义与代表价值。`);
                      window.setTimeout(() => document.getElementById("section-ai")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
                    }}
                  >
                    AI讲解这个案例
                  </button>
                  {activeCase.vrLink ? (
                    <a
                      href={activeCase.vrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-[rgba(78,118,101,0.24)] bg-[rgba(255,255,255,0.92)] px-5 py-2.5 text-sm text-foreground/74 shadow-[0_8px_14px_rgba(60,100,84,0.1)]"
                    >
                      VR导览
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="rounded-full border border-[rgba(78,118,101,0.24)] bg-[rgba(255,255,255,0.92)] px-5 py-2.5 text-sm text-foreground/74 shadow-[0_8px_14px_rgba(60,100,84,0.1)]"
                    >
                      VR导览
                    </button>
                  )}
                </div>
              </div>
            </article>

            <article className="overflow-hidden rounded-[30px] border border-[rgba(78,118,101,0.24)] bg-[linear-gradient(160deg,rgba(246,252,249,0.98),rgba(233,245,239,0.92))] shadow-[0_22px_42px_rgba(54,95,79,0.16)]">
              <img src={activeCase.image} alt={activeCase.name} className="h-80 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.18em] text-[hsl(28,28%,48%)]">案例说明牌</p>
                    <h3 className="mt-3 text-4xl font-serif-cn font-bold text-foreground">{activeCase.name}</h3>
                    <p className="mt-4 text-lg text-muted-foreground">{activeCase.location}</p>
                  </div>
                  <span className="rounded-full px-4 py-2 text-sm text-white" style={{ backgroundColor: content.accent }}>{activeCase.dynasty}</span>
                </div>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-[22px] border border-[rgba(78,118,101,0.2)] bg-[rgba(247,252,249,0.94)] p-5 shadow-[0_8px_14px_rgba(60,100,84,0.1)]">
                    <p className="text-sm font-medium text-foreground/76">工程深读</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/74">核心技术：{activeCase.coreTechnology ?? "—"}</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/76">{activeCase.engineeringValue ?? activeCase.summary}</p>
                  </div>
                  <div className="rounded-[22px] border border-[rgba(78,118,101,0.2)] bg-[rgba(247,252,249,0.94)] p-5 shadow-[0_8px_14px_rgba(60,100,84,0.1)]">
                    <p className="text-sm font-medium text-foreground/76">水文适应</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/76">{activeCase.hydrologyAdaptation ?? activeCase.summary}</p>
                  </div>
                  <div className="rounded-[22px] border border-[rgba(78,118,101,0.2)] bg-[rgba(247,252,249,0.94)] p-5 shadow-[0_8px_14px_rgba(60,100,84,0.1)]">
                    <p className="text-sm font-medium text-foreground/76">交通价值</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/74">交通意义：{activeCase.trafficMeaning ?? "—"}</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/76">代表价值：{activeCase.representativeValue ?? activeCase.significance}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {activeCase.keywords.map((keyword) => <span key={keyword} className="rounded-full border border-[rgba(78,118,101,0.24)] bg-[rgba(240,249,245,0.92)] px-3 py-1.5 text-xs text-foreground/74 shadow-[0_4px_10px_rgba(60,100,84,0.08)] transition-all duration-300 hover:border-[rgba(78,118,101,0.38)] hover:shadow-[0_8px_14px_rgba(54,95,79,0.14)]">{keyword}</span>)}
                </div>
                {activeCase.vrLink ? (
                  <div className="mt-5">
                    <a
                      href={activeCase.vrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full px-4 py-2 text-sm text-white shadow-[0_10px_18px_rgba(54,95,79,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_22px_rgba(54,95,79,0.24)]"
                      style={{ backgroundColor: content.accent }}
                    >
                      进入VR导览
                    </a>
                  </div>
                ) : null}
              </div>
            </article>
          </>
        )}
      </section>

      <section
        id="section-ai"
        className={`${content.key === "residential" ? "order-8" : content.key === "government" ? "order-8" : content.key === "palace" ? "order-9" : "order-8"} scroll-mt-24 rounded-[30px] border p-2 ${content.key === "bridge" ? "border-[rgba(78,118,101,0.24)] bg-[linear-gradient(160deg,rgba(246,252,249,0.98),rgba(233,245,239,0.92))] shadow-[0_22px_42px_rgba(54,95,79,0.16)]" : "border-transparent bg-[rgba(255,251,245,0.84)] shadow-[0_18px_34px_rgba(122,86,52,0.08)]"}`}
      >
        <CompetitionAiAssistant
          title="专题问答助手"
          subtitle={content.key === "bridge" || content.key === "government" ? "" : "提供专题快捷提问、学习卡片与案例对比，支持从展示型浏览转向学习型探索。"}
          accent={content.accent}
          contextTitle={aiContextTitle}
          contextSummary={aiContextSummary}
          contextBullets={topicAiContextBullets}
          contextText={topicAiContextText}
          initialQuestion={aiSeedQuestion}
          onAnswerGenerated={({ question, answer }) => {
            setAiFocusedModule(detectFocusModule(`${question}\n${answer}`));
          }}
          badge="专题模式"
        />
      </section>
    </div>
  );
};

export default TopicCompetitionShowcase;
