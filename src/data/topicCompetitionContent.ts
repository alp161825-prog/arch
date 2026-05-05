import imgForbiddenCity from "@/assets/buildings/forbidden-city.jpg";
import imgWeiyang from "@/assets/buildings/weiyang.jpg";
import imgDaming from "@/assets/buildings/daming.jpg";
import imgZhaozhou from "@/assets/buildings/zhaozhou-bridge.jpg";
import imgLugou from "@/assets/buildings/lugou.jpg";
import imgHuizhou from "@/assets/buildings/huizhou.jpg";
import imgSuzhouGarden from "@/assets/buildings/suzhou-garden.jpg";
import imgYinxu from "@/assets/buildings/yinxu.jpg";
import imgYuandadu from "@/assets/buildings/yuandadu.jpg";
import imgErlitou from "@/assets/buildings/erlitou.jpg";
import imgHanBridge from "@/assets/buildings/han-bridge.jpg";
import imgQingming from "@/assets/buildings/qingming.jpg";
import imgYongcheng from "@/assets/buildings/yongcheng.jpg";
import imgTempleHeaven from "@/assets/buildings/temple-heaven.jpg";
import imgSummerPalace from "@/assets/buildings/summer-palace.jpg";
import imgYongle from "@/assets/buildings/yongle.jpg";
import { resolveUserBuildingImage } from "@/data/userBuildingImageMap";

export type TopicCompetitionKey = "residential" | "government" | "palace" | "bridge";

export type TopicCompetitionContent = {
  key: TopicCompetitionKey;
  title: string;
  subtitle: string;
  thesis: string;
  overview: string;
  accent: string;
  accentSoft: string;
  heroImage: string;
  keywords: string[];
  openingStats: Array<{ label: string; value: string }>;
  timeline: Array<{
    period: string;
    title: string;
    score: number;
    summary: string;
    focus: string[];
    image: string;
    institution?: {
      representative: string;
      level: string;
      feature: string;
      meaning: string;
    };
    technicalProfile?: {
      representative: string;
      coreTechnology: string;
      environment: string;
      trafficMeaning: string;
      stageValue: string;
    };
  }>;
  regions: {
    intro: string;
    zones: Array<{
      name: string;
      clue: string;
      summary: string;
      examples: string[];
      metrics: Array<{ label: string; value: number }>;
      waterEnvironment?: string;
      trafficFunction?: string;
      bridgeTypeChoice?: string;
      engineeringAdaptation?: string;
      oneLineSummary?: string;
    }>;
  };
  structure: {
    intro: string;
    axes: Array<{ label: string; value: number }>;
    blocks: Array<{
      title: string;
      summary: string;
      bullets: string[];
    }>;
  };
  cases: Array<{
    id: string;
    name: string;
    dynasty: string;
    location: string;
    image: string;
    summary: string;
    significance: string;
    keywords: string[];
    adminLevel?: string;
    functionType?: string;
    spatialStructure?: string;
    institutionalMeaning?: string;
    representativeValue?: string;
    bridgeType?: string;
    coreTechnology?: string;
    engineeringValue?: string;
    hydrologyAdaptation?: string;
    trafficMeaning?: string;
    vrLink?: string;
    sourceHint: string;
  }>;
  conclusion: {
    title: string;
    summary: string;
    bullets: string[];
    sourceStatement: string;
  };
};

const userImage = (name: string, fallback: string) => resolveUserBuildingImage(name, fallback);

export const topicCompetitionContents: TopicCompetitionContent[] = [
  {
    key: "residential",
    title: "民居专题",
    subtitle: "从栖居到家族秩序",
    thesis: "中国古代民居不是单纯的住房类型集合，而是自然环境、家族伦理与地方材料共同塑造的生活空间。",
    overview:
      "本专题把民居放回真实生活场景中观察，重点不是只看外观差异，而是理解不同地区为何形成不同的院落、天井、群居和山地居住方式。",
    accent: "#8f5b33",
    accentSoft: "rgba(143,91,51,0.16)",
    heroImage: userImage("徽州明代住宅", imgHuizhou),
    keywords: ["地域适应", "家族伦理", "院落组织", "日常生活"],
    openingStats: [
      { label: "专题立意", value: "从居住方式理解建筑形态" },
      { label: "重点区域", value: "华北 / 江南 / 闽南 / 西北" },
      { label: "代表样本", value: "四合院 / 徽州住宅 / 土楼 / 窑洞" },
    ],
    timeline: [
      {
        period: "先秦",
        title: "聚落雏形与生存回应",
        score: 64,
        summary: "半地穴式房屋强调保温、遮蔽与聚落组织，民居首先回应的是生存需求。",
        focus: ["保温遮蔽", "聚落起点", "材料就地取用"],
        image: userImage("二里头遗址半地穴式房屋", imgErlitou),
      },
      {
        period: "秦汉",
        title: "居住与防御并行",
        score: 80,
        summary: "坞壁与宅院同时发展，民居开始兼顾居住安全、生产组织与家庭秩序。",
        focus: ["院落雏形", "防御加强", "生活生产并置"],
        image: userImage("汉代坞壁", imgYongcheng),
      },
      {
        period: "隋唐",
        title: "里坊住宅建立秩序",
        score: 78,
        summary: "住宅与里坊制度结合，院落和巷道关系更加清晰，城市居住开始成型。",
        focus: ["里坊格局", "住宅分区", "城市生活"],
        image: imgQingming,
      },
      {
        period: "宋元",
        title: "城市民居走向成熟",
        score: 86,
        summary: "商业城市推动居住空间更重采光、通风与街巷联系，民居与城市日常结合得更紧密。",
        focus: ["城市成熟", "街巷联动", "天井与排水"],
        image: userImage("姬氏民居", imgSuzhouGarden),
      },
      {
        period: "明清",
        title: "地方民居高度分化",
        score: 94,
        summary: "四合院、徽州住宅、福建土楼、窑洞等类型逐渐定型，形成鲜明的地域风格。",
        focus: ["类型定型", "地域风格", "家族秩序"],
        image: userImage("徽州明代住宅", imgHuizhou),
      },
    ],
    regions: {
      intro:
        "民居分布最能说明古代建筑如何因地制宜。这里关注的不只是哪里有建筑，而是气候、地形与家族结构如何共同塑造居住形式。",
      zones: [
        {
          name: "华北院落区",
          clue: "围合与中轴最明显",
          summary: "寒冷气候和聚族而居的需求，让华北民居强调围合院落、正房尊位和中轴秩序。",
          examples: ["北京四合院", "晋中院落", "坞壁聚落"],
          metrics: [
            { label: "围合度", value: 95 },
            { label: "礼序性", value: 92 },
            { label: "保温性", value: 88 },
          ],
        },
        {
          name: "江南水乡区",
          clue: "天井与水系联系紧密",
          summary: "江南民居更强调排水、采光和街巷水网关系，形成细密而灵活的空间组织。",
          examples: ["徽州住宅", "苏州民居", "临水宅院"],
          metrics: [
            { label: "排水性", value: 95 },
            { label: "采光性", value: 90 },
            { label: "街巷联系", value: 92 },
          ],
        },
        {
          name: "闽南群居区",
          clue: "聚族与防御并重",
          summary: "福建土楼等群居建筑把家族、礼序与防御整合在一个整体中，形成强烈的共同体特征。",
          examples: ["福建土楼", "宗族围屋", "山地聚居"],
          metrics: [
            { label: "聚族性", value: 96 },
            { label: "防御性", value: 92 },
            { label: "共享性", value: 94 },
          ],
        },
        {
          name: "西北地貌区",
          clue: "对地形利用直接",
          summary: "窑洞等居住形式展示了对黄土高原地貌和干燥气候的直接回应。",
          examples: ["窑洞", "土坯院落", "坡地村落"],
          metrics: [
            { label: "地貌适应", value: 97 },
            { label: "材料经济", value: 88 },
            { label: "营造效率", value: 84 },
          ],
        },
      ],
    },
    structure: {
      intro: "民居最值得理解的不是装饰，而是它如何组织家庭关系、应对气候并支持日常起居。",
      axes: [
        { label: "地域适应", value: 96 },
        { label: "家族秩序", value: 88 },
        { label: "生活效率", value: 90 },
        { label: "防御能力", value: 72 },
        { label: "审美表达", value: 79 },
      ],
      blocks: [
        {
          title: "院落组织",
          summary: "院落是民居最稳定的空间骨架，用来聚合起居、礼序与家庭活动。",
          bullets: ["正房与厢房体现尊卑", "院心承担采光与通风", "围合提升私密性与安全感"],
        },
        {
          title: "气候回应",
          summary: "天井、厚墙、屋顶坡度与开窗方式，都是对真实环境的被动式回应。",
          bullets: ["北方更重保温", "江南更重通风与排水", "西北更重蓄热与挡风"],
        },
        {
          title: "家族伦理",
          summary: "从厅堂到居室，民居把家庭关系转译成空间位置和行走路径。",
          bullets: ["厅堂是礼序中心", "祖先祭祀进入核心空间", "房间位置体现家庭结构"],
        },
      ],
    },
    cases: [
      {
        id: "siheyuan",
        name: "北京四合院",
        dynasty: "明清",
        location: "北京",
        image: userImage("北京四合院", imgSummerPalace),
        summary: "以正房、厢房和院心构成稳定家庭空间，是北方围合式居住的典型。",
        significance: "四合院最能说明中国古代民居如何把家族秩序与日常生活整合到一个院落中。",
        keywords: ["围合院落", "中轴尊位", "北方气候"],
        vrLink: "https://www.720yun.com/vr/bfdjtrekem1",
        sourceHint: "",
      },
      {
        id: "huizhou-house",
        name: "徽州明代住宅",
        dynasty: "明清",
        location: "安徽黄山",
        image: userImage("徽州明代住宅", imgHuizhou),
        summary: "白墙黛瓦、马头墙与天井共同构成江南住宅的代表性形象。",
        significance: "徽州住宅把家族伦理、商业文化与江南营造技术结合得最为完整。",
        keywords: ["天井采光", "马头墙", "宗族文化"],
        vrLink: "https://www.720yun.com/t/313jugenzy1?scene_id=24033671",
        sourceHint: "",
      },
      {
        id: "fujian-tulou",
        name: "福建土楼",
        dynasty: "明清",
        location: "福建龙岩",
        image: userImage("福建土楼", imgTempleHeaven),
        summary: "大型夯土群居建筑，兼具防御、聚族与共享生活功能。",
        significance: "土楼能直观说明民居不只是住宅，更是共同体空间。",
        keywords: ["聚族而居", "夯土围合", "山地防御"],
        vrLink: "https://www.720yun.com/vr/c3ejOduvum6",
        sourceHint: "",
      },
      {
        id: "cave-dwelling",
        name: "窑洞",
        dynasty: "明清延续",
        location: "黄土高原",
        image: userImage("窑洞", imgYongcheng),
        summary: "依地貌开掘的居住形式，体现了对高原地形与气候的直接回应。",
        significance: "窑洞最能说明因地制宜在居住建筑中的具体含义。",
        keywords: ["依坡而居", "蓄热保温", "材料经济"],
        vrLink: "https://www.720yun.com/t/1cvkOyplr8b?scene_id=53291484",
        sourceHint: "",
      },
    ],
    conclusion: {
      title: "民居专题的经典案例解读",
      summary: "民居专题更关心建筑如何回应真实生活，而不是只做外观分类。",
      bullets: [
        "把地域、气候、家族制度与空间形态做成联动关系。",
        "用典型案例突出民居类型的差异与共同逻辑。",
        "从今天的地域建筑和乡土保护视角重新理解民居价值。",
      ],
      sourceStatement: "",
    },
  },
  {
    key: "government",
    title: "官署专题",
    subtitle: "从空间秩序看国家治理",
    thesis: "官署建筑的核心不是办公本身，而是把行政等级、礼法程序和城市治理关系转译成可感知的空间秩序。",
    overview:
      "本专题从制度空间切入，重点解释仪门、大堂、二堂、后宅等空间如何共同组织古代治理流程，让抽象制度转化为具体可见的建筑序列。",
    accent: "#7a4b31",
    accentSoft: "rgba(122,75,49,0.16)",
    heroImage: userImage("南阳府衙", imgYuandadu),
    keywords: ["行政等级", "礼法秩序", "审理流程", "公私分区", "城市治理"],
    openingStats: [
      { label: "官署对象", value: "11 个" },
      { label: "历史阶段", value: "5 个" },
      { label: "空间节点", value: "6 类" },
      { label: "治理功能", value: "4 类" },
    ],
    timeline: [
      {
        period: "周代",
        title: "早期官署雏形",
        score: 58,
        summary: "早期官署空间仍与贵族宅第、礼制空间交织，公共治理与居住礼序尚未完全分化。",
        focus: ["周代士大夫住宅形制", "贵族礼制", "公私边界"],
        image: userImage("西汉长安城中央官署遗址", imgYinxu),
        institution: {
          representative: "周代士大夫住宅形制",
          level: "贵族治理 / 礼制前史",
          feature: "宅第、礼仪与政务功能交织，空间等级开始影响公共建筑秩序。",
          meaning: "说明官署制度空间并非突然出现，而是由礼制宅第和早期治理空间逐步分化而来。",
        },
      },
      {
        period: "秦汉",
        title: "中央行政空间形成",
        score: 78,
        summary: "统一帝国推动中央机构集中布局，官署从功能性办公场所转向国家行政权力的空间组织。",
        focus: ["西汉长安城中央官署遗址", "中央中枢", "集中布局"],
        image: userImage("西汉长安城中央官署遗址", imgWeiyang),
        institution: {
          representative: "西汉长安城中央官署遗址",
          level: "中央行政机构",
          feature: "都城中枢行政机构集中布局，官署与宫城、道路体系关系密切。",
          meaning: "体现国家行政权力在都城空间中的集中组织。",
        },
      },
      {
        period: "隋唐",
        title: "都城官署制度化",
        score: 84,
        summary: "都城规划、坊里制度与官学政务空间结合，使官署被纳入更稳定的城市管理秩序。",
        focus: ["正平坊遗址（含国子监）", "都城规划", "坊署制度"],
        image: userImage("南阳府衙", imgDaming),
        institution: {
          representative: "正平坊遗址（含国子监）",
          level: "都城官署 / 官学机构",
          feature: "坊里边界、官学机构与政务空间共同嵌入都城结构。",
          meaning: "说明官署空间开始服从都城制度、教育制度与城市治理的综合组织。",
        },
      },
      {
        period: "宋元",
        title: "地方府衙成熟",
        score: 88,
        summary: "城市治理机构逐渐成熟，司法、行政和城市管理功能在地方官署中形成稳定组合。",
        focus: ["北宋开封府", "霍州署大堂", "城市治理"],
        image: userImage("北宋开封府", imgQingming),
        institution: {
          representative: "北宋开封府",
          level: "都城地方治理机构",
          feature: "司法、行政与城市管理功能结合，府衙成为城市治理的重要节点。",
          meaning: "反映城市治理与地方行政空间的结合。",
        },
      },
      {
        period: "明清",
        title: "明清衙署体系完善",
        score: 94,
        summary: "府县衙署形成可复制的空间范式，中轴对称、前堂后宅和公私分区成为制度表达的核心。",
        focus: ["南阳府衙", "绥远将军衙署", "前堂后宅"],
        image: userImage("南阳府衙", imgYuandadu),
        institution: {
          representative: "南阳府衙",
          level: "地方府级官署",
          feature: "中轴对称、前堂后宅、公私分明，审理、办公、居住层层递进。",
          meaning: "体现地方行政空间的规范化和制度化。",
        },
      },
    ],
    regions: {
      intro: "",
      zones: [
        {
          name: "中央中枢",
          clue: "都城官署统筹国家政令",
          summary: "中央官署集中于都城中枢，负责制度制定、政令发布与礼制统摄，是治理网络的源头层级。",
          examples: ["西汉长安城中央官署遗址", "正平坊遗址（含国子监）", "都城政务机构群"],
          metrics: [
            { label: "决策统摄", value: 96 },
            { label: "制度密度", value: 94 },
            { label: "礼仪强度", value: 90 },
          ],
        },
        {
          name: "地方府州县",
          clue: "府衙承接中央制度并执行地方治理",
          summary: "地方府州县官署把中央政令转化为地方行政与司法实践，是国家治理在城市中的执行层。",
          examples: ["北宋开封府", "南阳府衙", "霍州署大堂"],
          metrics: [
            { label: "执行效率", value: 90 },
            { label: "制度复制", value: 92 },
            { label: "司法公开", value: 87 },
          ],
        },
        {
          name: "基层治理网络",
          clue: "基层治理 / 军政边防 / 教育礼制并行",
          summary: "治理功能在基层层面分化为行政司法、军政边防与教化礼制三条线，形成更复杂的功能网络。",
          examples: ["蓟辽督师府", "国子监与学宫体系", "州县基层治理空间"],
          metrics: [
            { label: "基层覆盖", value: 88 },
            { label: "军政协同", value: 94 },
            { label: "教化能力", value: 90 },
          ],
        },
      ],
    },
    structure: {
      intro:
        "官署结构应围绕“前衙后宅”理解：外部礼仪区、公共审理区、内部行政区与生活私密区沿中轴递进，把制度程序转化为可见的空间秩序。",
      axes: [
        { label: "礼仪入口", value: 95 },
        { label: "公共行政", value: 93 },
        { label: "内部办公", value: 90 },
        { label: "私人生活", value: 82 },
        { label: "制度可视化", value: 96 },
      ],
      blocks: [
        {
          title: "外部礼仪区",
          summary: "照壁、大门、仪门组成进入序列，先建立官署与街巷之间的秩序边界。",
          bullets: ["照壁过滤视线并形成威仪前场", "大门承担准入与身份筛选", "仪门标记礼法程序正式开始"],
        },
        {
          title: "公共审理区",
          summary: "大堂是官署公开行政核心，承担审理、会见与政令发布等公共功能。",
          bullets: ["大堂对应公开权力展示", "审理程序在此被社会看见", "礼仪与司法在同一空间叠合"],
        },
        {
          title: "内部行政区",
          summary: "二堂、签押房、书吏房等空间承接复核、议事和文书运行，构成制度执行后台。",
          bullets: ["二堂连接公开审理与内部决策", "签押房处理命令与文书签核", "书吏房维持档案与行政连续性"],
        },
        {
          title: "生活私密区",
          summary: "后宅与后勤空间保障官署日常运转，体现“前衙后宅”的制度性公私分区。",
          bullets: ["后宅承接官员居住与内务", "后场支持长期行政运行", "公私界线强化治理秩序稳定"],
        },
      ],
    },
    cases: [
      {
        id: "central-offices",
        name: "西汉长安城中央官署遗址",
        dynasty: "秦汉",
        location: "陕西西安",
        image: userImage("西汉长安城中央官署遗址", imgWeiyang),
        summary: "都城中枢官署群，体现中央权力在首都空间中的组织方式。",
        significance: "有助于理解中央集权如何通过官署布局形成稳定制度秩序。",
        keywords: ["中央官署", "都城中枢", "行政布局"],
        adminLevel: "中央中枢官署",
        functionType: "行政、礼制、政令发布",
        spatialStructure: "都城核心集中布局，与宫城及主干道耦合",
        institutionalMeaning: "体现国家决策中心的空间集中化与等级化",
        representativeValue: "是理解秦汉中央官署制度空间的重要起点",
        sourceHint: "",
      },
      {
        id: "kaifeng-prefecture",
        name: "北宋开封府",
        dynasty: "宋代",
        location: "河南开封",
        image: userImage("北宋开封府", imgQingming),
        summary: "都城中的地方治理核心，行政与司法功能高度聚合。",
        significance: "开封府展示了城市治理与地方官署制度的紧密耦合关系。",
        keywords: ["地方府衙", "司法行政", "城市治理"],
        adminLevel: "地方府级官署（都城治理中枢）",
        functionType: "行政、司法、城市管理",
        spatialStructure: "以大堂为核心的前公后私格局",
        institutionalMeaning: "反映宋代地方治理空间的制度成熟",
        representativeValue: "是理解宋代城市治理机制的关键案例",
        vrLink: "https://www.720yun.com/vr/8382buav91v",
        sourceHint: "",
      },
      {
        id: "huozhou-office",
        name: "霍州署大堂",
        dynasty: "元明清",
        location: "山西临汾",
        image: userImage("霍州署大堂", imgYongle),
        summary: "保留完整的大堂空间形态，突出官署公开审理与政令发布功能。",
        significance: "能直观展示“大堂”在官署建筑中的权力象征意义。",
        keywords: ["大堂", "地方官署", "公开审理"],
        adminLevel: "地方官署核心建筑",
        functionType: "公开审理、政令发布、礼仪展示",
        spatialStructure: "以大堂为中心，前场礼仪与后场行政递进",
        institutionalMeaning: "强调公共权力在建筑中心空间中的可见化表达",
        representativeValue: "突出官署建筑中“大堂”作为制度核心的象征地位",
        vrLink: "https://www.720yun.com/vr/69cj5ptavu3",
        sourceHint: "",
      },
      {
        id: "nanyang-yamen",
        name: "南阳府衙",
        dynasty: "明清",
        location: "河南南阳",
        image: userImage("南阳府衙", imgYuandadu),
        summary: "明清地方府衙代表案例，完整体现中轴与前衙后宅制度。",
        significance: "是观察地方行政、司法与礼仪空间规范化的经典样本。",
        keywords: ["前衙后宅", "中轴对称", "地方治理"],
        adminLevel: "地方府级官署",
        functionType: "行政、司法、礼仪",
        spatialStructure: "中轴对称、堂院递进、前衙后宅",
        institutionalMeaning: "体现明清地方治理空间的标准化与程序化",
        representativeValue: "是理解明清地方官署制度的关键案例",
        vrLink: "https://www.720yun.com/vr/7f3j5semra3",
        sourceHint: "",
      },
      {
        id: "jiliao-office",
        name: "蓟辽督师府",
        dynasty: "明清",
        location: "北方边防重镇",
        image: userImage("蓟辽督师府", imgYuandadu),
        summary: "军政复合官署，面向边防治理与军事统筹。",
        significance: "展示官署在边疆语境下如何整合行政与军事职能。",
        keywords: ["军政边防", "边疆治理", "统筹指挥"],
        adminLevel: "军政边防机构",
        functionType: "军事指挥、边防治理、行政统筹",
        spatialStructure: "前场礼仪与公堂、后场军政内务复合组织",
        institutionalMeaning: "体现国家治理在边防场景中的军政一体化机制",
        representativeValue: "是理解边疆官署类型与治理功能分化的重要样本",
        vrLink: "https://www.720yun.com/vr/14dj5Oewey6",
        sourceHint: "",
      },
    ],
    conclusion: {
      title: "官署专题的经典案例解读",
      summary: "官署建筑应从“治理网络 + 前衙后宅轴线”两条线并读，才能看清行政关系如何被建筑化。",
      bullets: [
        "地域分布要升级为治理层级关系图，回答“它管什么”。",
        "以街巷—照壁—大门—仪门—大堂—二堂—后宅作为官署视觉主轴。",
        "精选 5 个案例，用固定字段呈现制度意义与代表价值。",
      ],
      sourceStatement: "",
    },
  },
  {
    key: "palace",
    title: "皇宫专题",
    subtitle: "从王权象征到礼制高峰",
    thesis: "皇宫建筑是中国古代建筑中制度性、象征性与艺术性最集中的类型，也是礼制秩序最完整的空间表达。",
    overview:
      "本专题通过二里头、汉唐宫殿与明清故宫的连续案例，帮助理解皇宫建筑如何从早期王权中心逐步走向成熟的制度空间。",
    accent: "#aa7a1f",
    accentSoft: "rgba(170,122,31,0.14)",
    heroImage: userImage("北京故宫", imgForbiddenCity),
    keywords: ["中轴秩序", "礼制等级", "前朝后寝", "皇权象征", "国家仪式"],
    openingStats: [
      { label: "代表对象", value: "18 个" },
      { label: "历史阶段", value: "5 个" },
      { label: "中轴节点", value: "6 类" },
      { label: "礼制功能", value: "4 类" },
    ],
    timeline: [
      {
        period: "早期宫殿雏形",
        title: "礼制空间原型建立",
        score: 66,
        summary: "二里头和殷墟等案例说明宫殿与礼制中心在早期就开始并置。",
        focus: ["王权起点", "宫殿与宗庙", "礼制雏形"],
        image: userImage("二里头宫殿区", imgErlitou),
      },
      {
        period: "秦汉宫城扩展",
        title: "都城宫城规模化扩张",
        score: 84,
        summary: "咸阳宫、阿房宫、未央宫等案例展示了皇宫规模与都城轴线的迅速放大。",
        focus: ["规模扩张", "都城轴线", "权力集中"],
        image: userImage("汉未央宫", imgWeiyang),
      },
      {
        period: "隋唐中轴秩序强化",
        title: "礼制中轴与都城整合",
        score: 90,
        summary: "大明宫等样本把朝会、礼仪、山水与都城格局结合成更成熟的宫殿体系。",
        focus: ["前朝后寝", "都城关系", "礼制成熟"],
        image: userImage("唐大明宫", imgDaming),
      },
      {
        period: "宋元宫城制度调整",
        title: "政治中心迁移下的宫城重组",
        score: 86,
        summary: "东京城皇宫、德寿宫与元大都皇宫说明皇宫空间在不同政治中心中继续调整。",
        focus: ["都城迁移", "功能分区", "空间重组"],
        image: userImage("元上都大安阁", imgYuandadu),
      },
      {
        period: "明清紫禁城成熟",
        title: "礼制空间范式定型",
        score: 98,
        summary: "北京故宫与沈阳故宫共同展示了皇宫建筑在礼制、轴线和等级上的高峰。",
        focus: ["中轴极致", "国家象征", "空间成熟"],
        image: userImage("北京故宫", imgForbiddenCity),
      },
    ],
    regions: {
      intro: "皇宫的分布与都城变迁紧密相连，西安、洛阳、南京、北京等地共同串联起皇宫制度的演进脉络。",
      zones: [
        {
          name: "中原早期王权区",
          clue: "礼制起点鲜明",
          summary: "二里头与殷墟等遗址把宫殿与宗庙并置，展示出早期礼制空间的基本形态。",
          examples: ["二里头宫殿区", "殷墟宫殿宗庙遗址"],
          metrics: [
            { label: "王权中心", value: 94 },
            { label: "礼制起点", value: 95 },
            { label: "空间雏形", value: 88 },
          ],
        },
        {
          name: "西北都城遗址区",
          clue: "秦汉唐宫殿最集中",
          summary: "西安一带集中分布咸阳宫、未央宫、建章宫和大明宫，是理解皇宫演化的核心区域。",
          examples: ["未央宫", "建章宫", "大明宫"],
          metrics: [
            { label: "遗址密度", value: 96 },
            { label: "都城关系", value: 94 },
            { label: "制度成熟", value: 92 },
          ],
        },
        {
          name: "北方礼制轴线区",
          clue: "中轴秩序最完整",
          summary: "北京与沈阳的宫殿样本最能集中展示中轴、院落层级和国家象征的成熟表达。",
          examples: ["北京故宫", "沈阳故宫"],
          metrics: [
            { label: "中轴完整", value: 98 },
            { label: "等级秩序", value: 96 },
            { label: "象征强度", value: 97 },
          ],
        },
      ],
    },
    structure: {
      intro: "皇宫的观看重点在于一条中轴线如何组织门、庭、殿、寝，并把礼制和权力层层放大。",
      axes: [
        { label: "礼制性", value: 99 },
        { label: "轴线秩序", value: 98 },
        { label: "象征性", value: 97 },
        { label: "营造技术", value: 91 },
        { label: "景观组织", value: 88 },
      ],
      blocks: [
        {
          title: "中轴秩序",
          summary: "中轴不是单一线条，而是一整套空间等级递进的组织方式。",
          bullets: ["门负责筛选与界定", "庭放大礼仪尺度", "殿集中象征与权威"],
        },
        {
          title: "前朝后寝",
          summary: "前部面向国家仪礼与政务，后部转入日常居住，形成完整宫廷生活体系。",
          bullets: ["前部重礼仪", "后部重居住", "功能分区清晰"],
        },
        {
          title: "工艺与象征",
          summary: "台基、屋顶、色彩和装饰共同强化了皇宫的等级感与国家象征意义。",
          bullets: ["台基提升权威", "色彩强化识别", "工艺细节塑造神圣性"],
        },
      ],
    },
    cases: [
      {
        id: "erlitou-palace",
        name: "二里头宫殿区",
        dynasty: "先秦",
        location: "河南洛阳",
        image: userImage("二里头宫殿区", imgErlitou),
        summary: "早期王权中心的空间雏形，展示了宫殿与礼制中心的最初结合。",
        significance: "它是皇宫专题的起点，有助于理解宫殿并非突然出现，而是逐步形成。",
        keywords: ["王权中心", "礼制萌芽", "宫殿原型"],
        vrLink: "https://www.720yun.com/t/87vki7qeO8b?scene_id=35219794",
        sourceHint: "",
      },
      {
        id: "han-weiyang-palace",
        name: "汉未央宫",
        dynasty: "秦汉",
        location: "陕西西安",
        image: userImage("汉未央宫", imgWeiyang),
        summary: "汉代宫殿制度与中轴格局的集大成样本。",
        significance: "未央宫把宫殿规模、轴线与都城关系推向更明确的制度化表达。",
        keywords: ["宫城扩张", "中轴强化", "都城关系"],
        vrLink: "https://www.720yun.com/t/ecdjrrtm5u4?scene_id=24868693",
        sourceHint: "",
      },
      {
        id: "daming-palace",
        name: "大明宫",
        dynasty: "隋唐",
        location: "陕西西安",
        image: userImage("唐大明宫", imgDaming),
        summary: "宫殿群将帝国权力、礼仪与山水视线整合为一体。",
        significance: "大明宫最能体现唐代皇宫在尺度、礼制与景观组织上的成熟。",
        keywords: ["唐代宫殿", "前朝后寝", "都城视线"],
        vrLink: "https://www.720yun.com/t/a36jvdhara1?scene_id=18526131",
        sourceHint: "",
      },
      {
        id: "forbidden-city",
        name: "北京故宫",
        dynasty: "明清",
        location: "北京",
        image: userImage("北京故宫", imgForbiddenCity),
        summary: "中轴、院落、等级与工艺高度统一，是中国古代皇宫建筑最成熟的代表。",
        significance: "它最能集中展示中轴、等级与国家象征，是皇宫体系最成熟的代表。",
        keywords: ["中轴极致", "礼制高峰", "国家象征"],
        vrLink: "https://pano.dpm.org.cn/#/panorama?panorama_id=50&scene_id=3036&scene_name=scene_3036_summer",
        sourceHint: "",
      },
    ],
    conclusion: {
      title: "皇宫专题的经典案例解读",
      summary: "皇宫专题最值得关注的是礼制逻辑如何转化为空间秩序，并在不同朝代不断走向成熟。",
      bullets: [
        "把都城迁移与宫殿布局放在一起看，脉络会更清楚。",
        "从中轴、前朝后寝与工艺等级三个维度观察皇宫。",
        "通过代表性样本理解皇宫如何成为国家形象的集中表达。",
      ],
      sourceStatement: "",
    },
  },
  {
    key: "bridge",
    title: "桥梁专题",
    subtitle: "跨越山河的工程文明",
    thesis: "桥梁建筑不仅连接道路，更连接技术、交通、城市与文明交流，是中国古代建筑中最能体现工程智慧的一类。",
    overview:
      "桥梁专题把桥型结构、水系分布与交通联系放在一起观察，更容易看清从浮桥到石拱桥的技术演化线。",
    accent: "#557a6b",
    accentSoft: "rgba(85,122,107,0.16)",
    heroImage: userImage("赵州桥", imgZhaozhou),
    keywords: ["结构技术", "交通节点", "水系适应", "工程智慧", "区域交流"],
    openingStats: [
      { label: "代表桥梁", value: "18" },
      { label: "桥型结构", value: "5 类" },
      { label: "技术阶段", value: "6 个" },
    ],
    timeline: [
      {
        period: "商周以前至商代",
        title: "早期跨越萌芽",
        score: 48,
        summary: "桥梁由自然涉渡向人工跨越转化，木梁铺设与简易支撑构成最早的工程雏形。",
        focus: ["木梁铺设", "基础跨越", "聚落通道"],
        image: userImage("商代拒桥", imgHanBridge),
        technicalProfile: {
          representative: "商代拒桥",
          coreTechnology: "木梁铺设、简易支撑、基础跨越",
          environment: "小河沟、水渠、聚落通道",
          trafficMeaning: "满足早期聚落、道路和生产活动中的跨越需求",
          stageValue: "标志着桥梁从自然通行设施向人工工程构筑物转化。",
        },
      },
      {
        period: "周代至魏晋",
        title: "浮桥与军事交通",
        score: 63,
        summary: "浮桥体系强调快速搭设和机动通行，体现桥梁技术对军事与大河渡运的适应能力。",
        focus: ["舟船连桥", "锚固系统", "军事渡河"],
        image: userImage("蒲津渡浮桥", imgHanBridge),
        technicalProfile: {
          representative: "周文王渭河浮桥、蒲津渡浮桥、杜预浮桥",
          coreTechnology: "舟船连桥、绳索固定、铁牛锚固、临时搭设",
          environment: "大河渡口、军事渡河、水位变化区域",
          trafficMeaning: "服务军队调度、临时通行、渡口管理和大河交通",
          stageValue: "体现古代桥梁技术对军事行动和水文环境变化的灵活适应。",
        },
      },
      {
        period: "秦汉",
        title: "秦汉道路桥梁发展",
        score: 76,
        summary: "桥梁开始稳定嵌入国家道路与都城交通体系，形成多跨梁桥和桥墩支撑等基础工程模式。",
        focus: ["桥墩支撑", "多跨梁桥", "道路衔接"],
        image: userImage("秦渭桥", imgHanBridge),
        technicalProfile: {
          representative: "秦渭桥、汉霸桥、西汉七星桥、三殿汉代古桥",
          coreTechnology: "桥墩支撑、多跨梁桥、都城道路衔接",
          environment: "都城周边河流、宫苑水系、驿路交通",
          trafficMeaning: "桥梁成为都城道路、军事交通和区域联系的重要节点",
          stageValue: "桥梁开始与统一国家道路系统、都城空间和行政交通紧密结合。",
        },
      },
      {
        period: "隋唐",
        title: "隋唐石拱技术突破",
        score: 92,
        summary: "石拱结构在受力传导、减重与泄洪方面实现综合突破，显著提升桥梁稳定性与耐久性。",
        focus: ["石拱结构", "敞肩拱", "泄洪减重"],
        image: userImage("赵州桥", imgZhaozhou),
        technicalProfile: {
          representative: "赵州桥、隋灞桥、洛阳天津桥、洛阳旅人桥",
          coreTechnology: "石拱结构、敞肩拱、桥墩优化、城市水系跨越",
          environment: "较大跨度河道、都城水系、长期道路通行",
          trafficMeaning: "提高桥梁跨越能力、稳定性和城市交通组织能力",
          stageValue: "以赵州桥为代表的石拱桥技术，标志着中国古代桥梁工程进入成熟阶段。",
        },
      },
      {
        period: "宋代",
        title: "宋代城市桥梁繁荣",
        score: 88,
        summary: "桥梁深度进入城市水网、商贸航运与日常生活系统，成为连接生产、交易与居住的关键节点。",
        focus: ["城市桥梁", "商业水道", "海潮适应"],
        image: userImage("汴京虹桥", imgQingming),
        technicalProfile: {
          representative: "洛阳桥、汴京虹桥、迎祥桥",
          coreTechnology: "大型石梁桥、木构拱桥、城市水道跨越、海潮环境适应",
          environment: "城市水网、港口水域、商业河道、市镇交通",
          trafficMeaning: "桥梁成为城市商业、水陆交通和日常生活的重要节点",
          stageValue: "桥梁不仅承担跨越功能，也成为城市经济、景观和公共生活的组成部分。",
        },
      },
      {
        period: "明清至清末",
        title: "明清复合桥梁成熟与近代转型",
        score: 86,
        summary: "复合桥梁技术走向综合化，并逐步出现铁桥等近代工程体系，桥梁功能向区域网络与现代交通延伸。",
        focus: ["复合桥梁", "通航组织", "近代转型"],
        image: userImage("卢沟桥", imgLugou),
        technicalProfile: {
          representative: "广济桥、卢沟桥、黄河铁桥",
          coreTechnology: "多孔联拱、启闭式浮梁、石墩梁桥组合、铁桥桁架结构",
          environment: "大河交通、城市门户、通航水域、近代交通节点",
          trafficMeaning: "桥梁承担区域通行、城市门户、军事交通与近代城市交通功能",
          stageValue: "体现传统桥梁技术的综合化成熟，并出现向近代金属桥梁工程转型的趋势。",
        },
      },
    ],
    regions: {
      intro: "",
      zones: [
        {
          name: "渭河 / 关中交通区",
          clue: "都城交通、军事路线与国家道路系统高度耦合",
          summary: "渭河及关中平原水系与都城道路密切相关，是连接都城、军事通道和区域交通的重要水系。",
          examples: ["周文王渭河浮桥", "秦渭桥", "汉霸桥", "隋灞桥"],
          metrics: [
            { label: "交通强度", value: 93 },
            { label: "工程连续性", value: 86 },
            { label: "区域联通", value: 91 },
          ],
          waterEnvironment: "渭河及关中平原水系与都城道路密切相关，是连接都城、军事通道和区域交通的重要水系。",
          trafficFunction: "服务都城出入、军事调度、驿路交通和区域联系。",
          bridgeTypeChoice: "浮桥、梁桥、多跨道路桥。",
          engineeringAdaptation: "面对水位变化和道路通行需求，早期采用浮桥实现灵活跨越，后期逐渐发展为固定梁桥和多跨桥。",
          oneLineSummary: "关中桥梁体现了桥梁与都城交通、军事路线和国家道路系统的紧密关系。",
        },
        {
          name: "黄河及北方交通区",
          clue: "从浮桥机动性到固定桥稳定性再到近代铁桥",
          summary: "黄河及北方大河水流宽阔，水位变化大，对桥梁稳定性和跨越能力要求较高。",
          examples: ["蒲津渡浮桥", "杜预浮桥", "卢沟桥", "黄河铁桥"],
          metrics: [
            { label: "跨越难度", value: 95 },
            { label: "工程稳定", value: 89 },
            { label: "技术转型", value: 90 },
          ],
          waterEnvironment: "黄河及北方大河水流宽阔，水位变化大，对桥梁稳定性和跨越能力要求较高。",
          trafficFunction: "服务大河渡口、军事调度、区域商旅和近代城市交通。",
          bridgeTypeChoice: "浮桥、多孔石拱桥、铁桥。",
          engineeringAdaptation: "浮桥适合临时渡河和军事交通；多孔石桥适合长期稳定通行；铁桥体现近代材料与工程技术转型。",
          oneLineSummary: "北方大河桥梁体现了从浮桥机动性到固定桥稳定性，再到近代铁桥技术转型的发展脉络。",
        },
        {
          name: "洛阳城市水系区",
          clue: "都城交通与城市景观复合组织",
          summary: "洛阳城市内部水系与都城道路、礼仪空间和城市景观紧密结合。",
          examples: ["洛阳旅人桥", "洛阳天津桥"],
          metrics: [
            { label: "城市联系", value: 92 },
            { label: "景观协同", value: 88 },
            { label: "轴线组织", value: 87 },
          ],
          waterEnvironment: "洛阳城市内部水系与都城道路、礼仪空间和城市景观紧密结合。",
          trafficFunction: "连接城内道路、水系两岸、行旅活动和城市公共空间。",
          bridgeTypeChoice: "城市桥、景观桥、道路桥。",
          engineeringAdaptation: "桥梁不仅要满足跨河通行，还要服务城市轴线、景观视线和都城空间秩序。",
          oneLineSummary: "洛阳城市桥梁体现了桥梁在古代都城交通和城市景观中的复合功能。",
        },
        {
          name: "中原 / 华北交通区",
          clue: "从早期跨越到成熟工程技术的集中样本区",
          summary: "中原与华北地区河道类型多样，既有早期小型跨越，也有城市河道和区域道路桥梁。",
          examples: ["商代拒桥", "赵州桥", "汴京虹桥", "迎祥桥"],
          metrics: [
            { label: "桥型多样", value: 94 },
            { label: "技术成熟", value: 91 },
            { label: "城市联系", value: 89 },
          ],
          waterEnvironment: "中原与华北地区河道类型多样，既有早期小型跨越，也有城市河道和区域道路桥梁。",
          trafficFunction: "服务区域道路、城市商业、河运交通和地方交流。",
          bridgeTypeChoice: "梁桥、石拱桥、木构拱桥、城市桥。",
          engineeringAdaptation: "从早期简易梁桥发展到成熟石拱桥，再到城市商业桥梁，桥梁技术不断适应道路交通和城市生活。",
          oneLineSummary: "中原与华北桥梁集中体现了中国古代桥梁从早期跨越到成熟工程技术的发展过程。",
        },
        {
          name: "东南水网与岭南交通区",
          clue: "复杂水文与通航需求下的综合工程适应",
          summary: "水网密集，潮汐明显，通航需求强，桥梁需要同时适应水流、潮汐和船只通行。",
          examples: ["洛阳桥", "广济桥"],
          metrics: [
            { label: "水文挑战", value: 95 },
            { label: "通航协同", value: 93 },
            { label: "综合工程", value: 96 },
          ],
          waterEnvironment: "水网密集，潮汐明显，通航需求强，桥梁需要同时适应水流、潮汐和船只通行。",
          trafficFunction: "连接城市两岸、港口交通、区域商业和水陆网络。",
          bridgeTypeChoice: "大型石梁桥、复合桥、启闭式浮梁桥。",
          engineeringAdaptation: "洛阳桥通过筏形基础和养蛎固基适应海潮环境；广济桥通过梁桥与浮桥结合兼顾通行和通航。",
          oneLineSummary: "东南与岭南桥梁体现了复杂水文环境下古代桥梁工程的高度适应性和综合化水平。",
        },
      ],
    },
    structure: {
      intro: "桥梁最重要的不是名称，而是桥型、受力方式与交通功能如何统一起来。",
      axes: [
        { label: "结构技术", value: 96 },
        { label: "交通效率", value: 93 },
        { label: "耐久性", value: 89 },
        { label: "景观性", value: 76 },
        { label: "地域适应", value: 87 },
      ],
      blocks: [
        {
          title: "梁桥",
          summary: "梁桥构造直接，施工速度快，适合中小跨度和高频交通需求。",
          bullets: ["结构清晰", "施工便捷", "适合常规通行"],
        },
        {
          title: "拱桥",
          summary: "拱桥强调受力传导与减重处理，是古代桥梁技术最成熟的代表。",
          bullets: ["受力连续", "跨度更大", "结构与美学统一"],
        },
        {
          title: "浮桥",
          summary: "浮桥适合快速架设和临时跨越，体现出工程组织与交通应急能力。",
          bullets: ["搭建迅速", "适应临时交通", "便于拆装维护"],
        },
      ],
    },
    cases: [
      {
        id: "zhaozhou-bridge",
        name: "赵州桥",
        dynasty: "隋代",
        location: "河北赵县",
        image: userImage("赵州桥", imgZhaozhou),
        summary: "单孔敞肩石拱桥代表，以结构减重与泄洪能力统一实现大跨度稳定跨越。",
        significance: "中国古代石拱桥技术成熟的重要代表。",
        bridgeType: "单孔敞肩石拱桥",
        coreTechnology: "敞肩拱、大跨度、泄洪减重",
        engineeringValue: "在保证跨度的同时减轻桥体自重，并增强泄洪能力。",
        hydrologyAdaptation: "通过敞肩与拱券组合提升洪水通过效率，适应季节性水流变化的河道环境。",
        trafficMeaning: "连接区域道路通行。",
        representativeValue: "中国古代石拱桥技术成熟的重要代表。",
        keywords: ["石拱桥", "敞肩拱", "泄洪减重"],
        vrLink: "https://www.720yun.com/t/c4926985mcs?scene_id=1726717",
        sourceHint: "",
      },
      {
        id: "luoyang-bridge",
        name: "洛阳桥",
        dynasty: "北宋",
        location: "福建泉州",
        image: userImage("洛阳桥", imgHanBridge),
        summary: "大型跨海石梁桥，围绕潮汐与海港水文条件形成系统化工程适应。",
        significance: "中国古代海港桥梁工程的重要代表。",
        bridgeType: "大型跨海石梁桥",
        coreTechnology: "筏形基础、养蛎固基、长桥多孔",
        engineeringValue: "适应潮汐、水流和海港环境。",
        hydrologyAdaptation: "通过筏形基础与养蛎固基降低冲刷风险，提升海潮环境下的桥基稳定性。",
        trafficMeaning: "连接泉州港区与区域交通。",
        representativeValue: "中国古代海港桥梁工程的重要代表。",
        keywords: ["跨海石梁桥", "筏形基础", "养蛎固基"],
        vrLink: "https://www.720yun.com/vr/4fej5g4OtO9",
        sourceHint: "",
      },
      {
        id: "guangji-bridge",
        name: "广济桥",
        dynasty: "宋始建，明清发展",
        location: "广东潮州",
        image: userImage("广济桥", imgQingming),
        summary: "梁桥与浮桥结合的复合桥，以启闭机制兼顾跨江通行与航运需求。",
        significance: "中国古代复合桥梁和启闭式桥梁的代表。",
        bridgeType: "梁桥、浮桥结合的复合桥",
        coreTechnology: "启闭式浮梁、石墩梁桥组合",
        engineeringValue: "兼顾跨江通行与船只通航。",
        hydrologyAdaptation: "通过浮梁启闭应对韩江水位与航运变化，实现通行与通航动态切换。",
        trafficMeaning: "连接韩江两岸与潮州城市交通。",
        representativeValue: "中国古代复合桥梁和启闭式桥梁的代表。",
        keywords: ["复合桥", "启闭浮梁", "通行通航协同"],
        vrLink: "https://www.720yun.com/t/1avkil7lOqb?scene_id=32847946",
        sourceHint: "",
      },
      {
        id: "bianjing-hongqiao",
        name: "汴京虹桥",
        dynasty: "北宋",
        location: "河南开封",
        image: userImage("汴京虹桥", imgQingming),
        summary: "城市木构拱桥代表，在汴河航运通道中实现无桥墩跨越与城市交通联动。",
        significance: "体现宋代城市桥梁与商业生活的结合。",
        bridgeType: "城市木构拱桥",
        coreTechnology: "无柱木拱、跨越汴河",
        engineeringValue: "在城市河道中实现无桥墩跨越，减少对水运影响。",
        hydrologyAdaptation: "无桥墩结构降低对河道行水与行船干扰，适应高频城市水运环境。",
        trafficMeaning: "连接市井商业与水陆交通。",
        representativeValue: "体现宋代城市桥梁与商业生活的结合。",
        keywords: ["木构拱桥", "无柱跨越", "城市商业交通"],
        vrLink: "https://www.720yun.com/t/o6al6z4nq5iq57jxi7?pano_id=egezQM2XYrRyVnC3",
        sourceHint: "",
      },
    ],
    conclusion: {
      title: "桥梁专题的经典案例解读",
      summary: "桥梁专题把技术、交通与地域环境放在一起看，更容易读出工程文明的连续演化。",
      bullets: [
        "用桥型、受力和水系三条线索理解桥梁差异。",
        "把交通需求和工程技术联系起来，而不是只看外观。",
        "从桥梁与城市、商贸、水网的关系中理解它的文明价值。",
      ],
      sourceStatement: "",
    },
  },
];

export const getTopicCompetitionContent = (key: TopicCompetitionKey) => {
  const match = topicCompetitionContents.find(item => item.key === key);
  if (!match) {
    throw new Error(`Unknown topic competition content key: ${key}`);
  }
  return match;
};

