import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ChinaGeoMap, { type GeoCircleOverlay, type GeoLineOverlay, type GeoNodeOverlay } from "@/components/site/ChinaGeoMapV2";
import { useAtlasPoints } from "@/hooks/useAtlasPoints";
import { getTopicContent, topicContents, type TopicKey } from "@/data/siteContentV2";
import type { AtlasHeritagePoint } from "@/data/atlasHeritagePoints";

type RegionProfile = {
  id: string;
  label: string;
  positioning: string;
  formationReason: string;
  topics: TopicKey[];
  provinces: string[];
  focus: string;
  dominantFactor: string;
  representativeIds: string[];
  energyInsight: string;
  match: {
    regionIds?: string[];
    provinceCodes?: string[];
    pointIds?: string[];
  };
  mapContext: {
    rings: GeoCircleOverlay[];
    hydrology: GeoLineOverlay[];
    transport: GeoLineOverlay[];
    capitals: GeoNodeOverlay[];
  };
};

const REGION_PROFILES: RegionProfile[] = [
  {
    id: "north-ritual-axis",
    label: "北方礼制轴线区",
    positioning: "以北京、洛阳、长安等政治中心为核心，宫殿、官署、礼制建筑和交通节点高度集中。",
    formationReason: "长期作为王朝政治中心和都城核心区域，礼制轴线、宫城规划、官署体系和大型交通工程在此集中发展。",
    topics: ["residential", "government", "palace", "bridge"],
    provinces: ["北京", "河南", "陕西", "山西", "河北"],
    focus: "礼制秩序、宫城轴线、官式营造、桥梁交通节点",
    dominantFactor: "政治中心 / 礼制轴线 / 官式营造",
    representativeIds: ["forbidden-city", "siheyuan", "changan-office", "lugou-bridge", "zhaozhou-bridge", "daming-palace"],
    energyInsight: "该区域以制度性建筑和礼制空间最突出，民居与桥梁更多承担生活延续和交通连接功能。",
    match: {
      provinceCodes: ["110000", "130000", "140000", "410000", "610000"],
      pointIds: ["forbidden-city", "daming-palace", "weiyang-palace"],
    },
    mapContext: {
      rings: [
        { id: "north-ring-1", label: "礼制核心圈", longitude: 116.4, latitude: 39.9, radius: 64, color: "rgba(183,124,63,0.45)" },
        { id: "north-ring-2", label: "都城轴线圈", longitude: 112.7, latitude: 34.7, radius: 72, color: "rgba(176,112,56,0.4)" },
      ],
      hydrology: [
        {
          id: "north-hydrology",
          label: "黄河线索",
          coordinates: [
            [110.2, 35.0],
            [112.1, 34.8],
            [114.1, 34.7],
            [116.0, 37.8],
          ],
          color: "rgba(92,136,172,0.74)",
          width: 2.4,
        },
      ],
      transport: [
        {
          id: "north-axis-route",
          label: "都城轴线连接",
          coordinates: [
            [108.9, 34.3],
            [112.5, 34.7],
            [114.3, 34.8],
            [116.4, 39.9],
          ],
          color: "rgba(165,106,51,0.78)",
          width: 2.1,
          dashed: true,
        },
      ],
      capitals: [
        { id: "capital-beijing", label: "北京", longitude: 116.4, latitude: 39.9, color: "#8f512b" },
        { id: "capital-luoyang", label: "洛阳", longitude: 112.45, latitude: 34.66, color: "#8f512b" },
        { id: "capital-changan", label: "长安", longitude: 108.95, latitude: 34.27, color: "#8f512b" },
      ],
    },
  },
  {
    id: "central-institution-spread",
    label: "中原制度传播区",
    positioning: "以洛阳、开封与中原腹地为核心，呈现早期王权中心、都城制度和交通通道的扩散网络。",
    formationReason: "中原长期承担制度中心与交通枢纽双重角色，宫殿、官署、桥梁和民居样本在此形成高频交叠。",
    topics: ["residential", "government", "palace", "bridge"],
    provinces: ["河南", "山东", "安徽北部"],
    focus: "早期王权、都城制度、河道交通、样本扩散",
    dominantFactor: "制度扩散 / 早期王权 / 交通通道",
    representativeIds: ["erlitou-palace", "tianjin-bridge", "kaifeng-fu", "hongqiao", "han-wubi"],
    energyInsight: "该区域兼具王权源头与制度传播属性，官署与桥梁在交通和治理维度上耦合明显。",
    match: {
      provinceCodes: ["410000", "340000"],
      pointIds: ["erlitou-palace", "yinxu-palace", "kaifeng-fu", "hongqiao", "tianjin-bridge", "sandian-bridge"],
    },
    mapContext: {
      rings: [
        { id: "central-ring-1", label: "制度源头圈", longitude: 112.6, latitude: 34.7, radius: 68, color: "rgba(177,124,63,0.45)" },
        { id: "central-ring-2", label: "传播通道圈", longitude: 114.3, latitude: 34.8, radius: 54, color: "rgba(170,116,57,0.4)" },
      ],
      hydrology: [
        {
          id: "central-hydrology",
          label: "洛水 / 汴河线索",
          coordinates: [
            [112.3, 34.6],
            [113.1, 34.7],
            [114.35, 34.8],
            [115.2, 34.7],
          ],
          color: "rgba(92,136,172,0.74)",
          width: 2.2,
        },
      ],
      transport: [
        {
          id: "central-route",
          label: "制度传播路径",
          coordinates: [
            [112.45, 34.66],
            [113.63, 34.75],
            [114.35, 34.8],
          ],
          color: "rgba(165,106,51,0.78)",
          width: 2.1,
          dashed: true,
        },
      ],
      capitals: [
        { id: "capital-luoyang-2", label: "洛阳", longitude: 112.45, latitude: 34.66, color: "#8f512b" },
        { id: "capital-kaifeng", label: "开封", longitude: 114.35, latitude: 34.8, color: "#8f512b" },
      ],
    },
  },
  {
    id: "jiangnan-water-network",
    label: "江南水网聚落区",
    positioning: "江南平原与城市水系共同塑造居住、园居和交通复合空间，民居与桥梁协同发展。",
    formationReason: "密集水网、商贸市镇与园居文化长期叠加，推动院落居住、城市桥巷和景观空间持续演进。",
    topics: ["residential", "palace", "bridge"],
    provinces: ["江苏", "浙江", "上海", "安徽南部"],
    focus: "水网交通、商贸市镇、院落聚居、园居融合",
    dominantFactor: "水系网络 / 商贸流通 / 地域生活",
    representativeIds: ["huizhou-residence", "suzhou", "yingxiang-bridge", "nanjing-palace", "deshou-palace"],
    energyInsight: "该区域民居与桥梁样本密度最高，显示出水系环境对日常生活空间和交通组织的强塑造力。",
    match: {
      provinceCodes: ["320000", "330000", "340000"],
      regionIds: ["jiangnan"],
    },
    mapContext: {
      rings: [
        { id: "jiangnan-ring-1", label: "水网聚落圈", longitude: 120.2, latitude: 31.1, radius: 76, color: "rgba(124,169,192,0.42)" },
        { id: "jiangnan-ring-2", label: "徽州聚居圈", longitude: 118.35, latitude: 29.75, radius: 58, color: "rgba(145,178,197,0.38)" },
      ],
      hydrology: [
        {
          id: "jiangnan-hydrology",
          label: "江南水网线索",
          coordinates: [
            [118.0, 31.4],
            [119.2, 31.2],
            [120.4, 31.1],
            [121.4, 31.2],
          ],
          color: "rgba(85,136,175,0.78)",
          width: 2.4,
        },
      ],
      transport: [
        {
          id: "jiangnan-route",
          label: "市镇交通连接",
          coordinates: [
            [118.34, 29.72],
            [120.16, 30.27],
            [120.58, 31.29],
          ],
          color: "rgba(165,106,51,0.75)",
          width: 2.1,
          dashed: true,
        },
      ],
      capitals: [
        { id: "capital-nanjing", label: "南京", longitude: 118.8, latitude: 32.04, color: "#7d603f" },
        { id: "capital-hangzhou", label: "杭州", longitude: 120.17, latitude: 30.25, color: "#7d603f" },
      ],
    },
  },
  {
    id: "southeast-clan",
    label: "东南宗族聚居区",
    positioning: "以闽粤赣南为核心，宗族聚居、防御性民居与港口桥梁共同构成区域空间特征。",
    formationReason: "山地地形、宗族组织和潮汐水文叠加，促使聚居建筑与复合桥梁形成高适应性的营造体系。",
    topics: ["residential", "bridge"],
    provinces: ["福建", "广东", "江西南部"],
    focus: "宗族组织、山地防御、海潮水运、复合桥型",
    dominantFactor: "宗族结构 / 山地地形 / 潮汐水运",
    representativeIds: ["fujian-tulou", "luoyang-bridge", "guangji-bridge"],
    energyInsight: "该区域以民居与桥梁联动最鲜明，体现复杂水文与宗族聚居对工程策略的直接影响。",
    match: {
      provinceCodes: ["350000", "440000", "360000"],
      regionIds: ["southeast"],
    },
    mapContext: {
      rings: [
        { id: "southeast-ring-1", label: "宗族聚居圈", longitude: 116.7, latitude: 24.8, radius: 62, color: "rgba(160,132,88,0.42)" },
        { id: "southeast-ring-2", label: "港口桥梁圈", longitude: 118.7, latitude: 24.95, radius: 52, color: "rgba(146,120,79,0.38)" },
      ],
      hydrology: [
        {
          id: "southeast-hydrology",
          label: "海港水系",
          coordinates: [
            [116.6, 23.7],
            [117.8, 24.2],
            [118.7, 24.95],
            [119.4, 25.3],
          ],
          color: "rgba(87,136,175,0.76)",
          width: 2.3,
        },
      ],
      transport: [
        {
          id: "southeast-route",
          label: "港口交通路径",
          coordinates: [
            [116.63, 23.67],
            [118.73, 24.97],
          ],
          color: "rgba(165,106,51,0.75)",
          width: 2.1,
          dashed: true,
        },
      ],
      capitals: [{ id: "capital-quanzhou", label: "泉州", longitude: 118.73, latitude: 24.97, color: "#8f512b" }],
    },
  },
  {
    id: "northwest-capital-ruins",
    label: "西北都城遗址区",
    positioning: "以关中与河西走廊为核心，聚集秦汉隋唐都城遗址、宫殿体系与军事交通工程。",
    formationReason: "作为帝国营建和边疆交通的重要舞台，大尺度宫殿、官署及跨河桥梁在此持续叠加演进。",
    topics: ["residential", "government", "palace", "bridge"],
    provinces: ["陕西", "甘肃", "山西部分地区"],
    focus: "都城遗址、宫殿轴线、夯土台基、军事交通",
    dominantFactor: "都城遗址 / 边疆交通 / 军事防御",
    representativeIds: ["chang-an-lifang", "pujin-float", "han-baqiao", "weiyang-palace", "daming-palace"],
    energyInsight: "该区域皇宫与桥梁样本密度显著，体现都城营建与跨河交通工程之间的系统耦合。",
    match: {
      provinceCodes: ["610000", "620000", "140000"],
      regionIds: ["northwest"],
    },
    mapContext: {
      rings: [
        { id: "northwest-ring-1", label: "都城遗址圈", longitude: 108.95, latitude: 34.27, radius: 80, color: "rgba(184,123,62,0.44)" },
        { id: "northwest-ring-2", label: "边疆交通圈", longitude: 103.8, latitude: 36.1, radius: 56, color: "rgba(170,112,56,0.38)" },
      ],
      hydrology: [
        {
          id: "northwest-hydrology",
          label: "渭河 / 黄河",
          coordinates: [
            [108.7, 34.35],
            [109.6, 34.3],
            [110.45, 34.87],
            [103.82, 36.06],
          ],
          color: "rgba(92,136,172,0.74)",
          width: 2.3,
        },
      ],
      transport: [
        {
          id: "northwest-route",
          label: "都城与边疆交通",
          coordinates: [
            [108.95, 34.27],
            [110.45, 34.87],
            [103.82, 36.06],
          ],
          color: "rgba(165,106,51,0.76)",
          width: 2.1,
          dashed: true,
        },
      ],
      capitals: [
        { id: "capital-xian", label: "西安", longitude: 108.95, latitude: 34.27, color: "#8f512b" },
        { id: "capital-lanzhou", label: "兰州", longitude: 103.82, latitude: 36.06, color: "#8f512b" },
      ],
    },
  },
  {
    id: "yellow-river-transport",
    label: "黄河—大河交通区",
    positioning: "围绕黄河沿线渡口与跨河节点，观察浮桥、石桥与近代铁桥的连续演进。",
    formationReason: "大河水位波动、军事调度和区域通行需求持续存在，驱动桥梁技术从机动跨越走向长期稳定再到近代转型。",
    topics: ["bridge", "government", "palace"],
    provinces: ["甘肃", "山西", "河南", "河北", "陕西"],
    focus: "大河渡口、军事交通、跨河稳定性、近代转型",
    dominantFactor: "大河水文 / 军事交通 / 工程转型",
    representativeIds: ["pujin-float", "yellow-river-iron-bridge", "duyu-float", "zhaozhou-bridge", "lugou-bridge"],
    energyInsight: "该区域桥梁专题优势最明显，样本集中体现了从浮桥机动性到固定桥稳定性的技术升级。",
    match: {
      pointIds: ["pujin-float", "yellow-river-iron-bridge", "duyu-float", "zhaozhou-bridge", "lugou-bridge", "lugou", "qin-weiqiao", "han-baqiao", "shang-bridge"],
      provinceCodes: ["620000", "140000", "410000", "130000", "610000"],
    },
    mapContext: {
      rings: [
        { id: "river-ring-1", label: "黄河交通圈", longitude: 110.6, latitude: 35.3, radius: 74, color: "rgba(189,124,62,0.45)" },
        { id: "river-ring-2", label: "跨河工程圈", longitude: 103.82, latitude: 36.06, radius: 52, color: "rgba(173,112,56,0.4)" },
      ],
      hydrology: [
        {
          id: "yellow-river-main",
          label: "黄河主线",
          coordinates: [
            [103.8, 36.05],
            [106.5, 36.4],
            [109.1, 35.8],
            [110.45, 34.87],
            [113.6, 34.75],
            [116.2, 39.86],
          ],
          color: "rgba(92,136,172,0.78)",
          width: 2.6,
        },
      ],
      transport: [
        {
          id: "yellow-river-route",
          label: "大河交通路径",
          coordinates: [
            [103.82, 36.06],
            [110.45, 34.87],
            [113.63, 34.75],
            [116.22, 39.86],
          ],
          color: "rgba(165,106,51,0.78)",
          width: 2.2,
          dashed: true,
        },
      ],
      capitals: [
        { id: "river-lanzhou", label: "兰州", longitude: 103.82, latitude: 36.06, color: "#8f512b" },
        { id: "river-yongji", label: "永济", longitude: 110.45, latitude: 34.87, color: "#8f512b" },
      ],
    },
  },
];

const pointInRegion = (point: AtlasHeritagePoint, region: RegionProfile) => {
  const byRegion = region.match.regionIds?.includes(point.regionId) ?? false;
  const byProvince = region.match.provinceCodes?.includes(point.provinceCode) ?? false;
  const byId = region.match.pointIds?.includes(point.id) ?? false;
  return byRegion || byProvince || byId;
};

const ExploreRegionsPageV2 = () => {
  const [activeRegionId, setActiveRegionId] = useState(REGION_PROFILES[0].id);
  const [activeTopicKey, setActiveTopicKey] = useState<TopicKey>("residential");
  const { points: atlasPoints } = useAtlasPoints();

  const activeRegion = useMemo(
    () => REGION_PROFILES.find(region => region.id === activeRegionId) ?? REGION_PROFILES[0],
    [activeRegionId],
  );
  const currentTopic = getTopicContent(activeTopicKey);

  const regionPoints = useMemo(
    () => atlasPoints.filter(point => pointInRegion(point, activeRegion)),
    [atlasPoints, activeRegion],
  );

  const filteredPoints = useMemo(
    () => regionPoints.filter(point => point.topic === activeTopicKey),
    [regionPoints, activeTopicKey],
  );

  const topicColors = useMemo(
    () =>
      topicContents.reduce<Record<string, string>>((acc, topic) => {
        acc[topic.key] = topic.accent;
        return acc;
      }, {}),
    [],
  );

  const representativeSamples = useMemo(
    () =>
      activeRegion.representativeIds
        .map(id => regionPoints.find(point => point.id === id) ?? atlasPoints.find(point => point.id === id))
        .filter((point): point is AtlasHeritagePoint => Boolean(point)),
    [activeRegion, regionPoints, atlasPoints],
  );

  const densityOverlays = useMemo(
    () =>
      [...regionPoints]
        .sort((a, b) => b.heat - a.heat)
        .slice(0, 3)
        .map(point => ({
          id: `density-${point.id}`,
          label: point.label,
          longitude: point.longitude,
          latitude: point.latitude,
          radius: Math.max(34, Math.round(point.heat * 0.5)),
          color: "rgba(217,145,74,0.3)",
          opacity: 0.72,
        })),
    [regionPoints],
  );

  const displaySamples = useMemo(
    () => [...filteredPoints].sort((a, b) => b.heat - a.heat).slice(0, 12),
    [filteredPoints],
  );

  const relatedTopics = useMemo(
    () => activeRegion.topics.map(key => getTopicContent(key).shortTitle),
    [activeRegion],
  );

  const regionValueForPoint = (point: AtlasHeritagePoint) => point.summary;

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-10 md:px-6">
      <section className="relative overflow-hidden rounded-[34px] border border-[rgba(129,90,53,0.22)] bg-[linear-gradient(135deg,#4b2f1d_0%,#7b4d2f_48%,#b17a3f_100%)] p-8 text-white shadow-[0_24px_46px_rgba(86,54,33,0.18)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[rgba(255,231,192,0.16)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-16 h-64 w-64 rounded-full bg-[rgba(255,241,217,0.14)] blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="max-w-3xl">
            <p className="text-sm tracking-[0.28em] text-[rgba(255,236,211,0.88)]">REGIONAL IMMERSIVE VIEW</p>
            <h1 className="mt-3 text-4xl font-serif-cn font-bold leading-tight">地域分布与建筑格局</h1>
            <p className="mt-4 text-base leading-8 text-[rgba(255,240,220,0.92)]">
              在同一地图舞台上观察四类建筑的样本密度、区域成因与空间风格，理解地形、水系、政治中心和交通网络如何塑造建筑分布。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "当前区域", value: activeRegion.label, sub: `${activeRegion.provinces.join(" / ")}` },
              { label: "当前专题", value: currentTopic.shortTitle, sub: `${filteredPoints.length} 个区域样本` },
              { label: "区域样本数", value: `${regionPoints.length}`, sub: "当前区域全专题累计" },
              { label: "主导因素", value: activeRegion.dominantFactor, sub: "空间成因关键词" },
            ].map(card => (
              <article key={card.label} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs tracking-[0.16em] text-[rgba(255,233,203,0.86)]">{card.label}</p>
                <p className="mt-2 text-2xl font-serif-cn font-bold leading-snug">{card.value}</p>
                <p className="mt-1 text-xs text-[rgba(255,238,214,0.86)]">{card.sub}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[30px] border border-border bg-[linear-gradient(180deg,hsl(40,32%,97%),hsl(35,22%,93%))] p-6 shadow-[0_18px_34px_rgba(121,84,49,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.2em] text-muted-foreground">第一层</p>
              <h2 className="mt-1 text-2xl font-serif-cn font-bold">地图总览</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["样本点位", "区域圈层", "水系提示", "都城核心点", "交通路线", "专题高亮"].map(tag => (
                <span key={tag} className="rounded-full border border-[hsl(35,22%,82%)] bg-white/75 px-3 py-1 text-xs text-foreground/72">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {topicContents.map(topic => (
              <button
                key={topic.key}
                onClick={() => setActiveTopicKey(topic.key)}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  topic.key === activeTopicKey
                    ? "border-transparent text-white shadow-[0_10px_18px_rgba(90,63,42,0.2)]"
                    : "border-[hsl(35,20%,84%)] bg-card text-foreground hover:-translate-y-0.5"
                }`}
                style={topic.key === activeTopicKey ? { backgroundColor: topic.accent } : undefined}
              >
                {topic.shortTitle}
              </button>
            ))}
          </div>

          <ChinaGeoMap
            className="mt-5 h-[620px] w-full rounded-[28px] border border-[hsl(35,20%,84%)] bg-[radial-gradient(circle_at_72%_22%,rgba(247,195,120,0.25),transparent_34%),radial-gradient(circle_at_22%_78%,rgba(120,164,204,0.2),transparent_30%),linear-gradient(180deg,#f7f2e7,#f2ecdf)] p-3"
            points={regionPoints}
            accent={currentTopic.accent}
            activeTopic={activeTopicKey}
            topicColors={topicColors}
            regionOverlays={activeRegion.mapContext.rings}
            densityOverlays={densityOverlays}
            hydrologyLines={activeRegion.mapContext.hydrology}
            transportLines={activeRegion.mapContext.transport}
            capitalNodes={activeRegion.mapContext.capitals}
          />

          <div className="mt-5 rounded-2xl border border-[hsl(35,20%,84%)] bg-[hsl(40,32%,97%)] p-4">
            <p className="text-xs tracking-[0.2em] text-muted-foreground">地图图例</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {topicContents.map(topic => (
                <div key={topic.key} className="flex items-center gap-2 text-sm text-foreground/78">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: topic.accent }} />
                  <span>{topic.shortTitle}</span>
                  {topic.key === activeTopicKey ? <span className="text-xs text-[hsl(24,58%,34%)]">高亮</span> : null}
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm text-foreground/78">
                <span className="h-3 w-3 rounded-full bg-[rgba(217,145,74,0.38)] ring-1 ring-[rgba(182,109,52,0.65)]" />
                <span>综合高密区</span>
              </div>
            </div>
          </div>
        </article>

        <article className="space-y-6">
          <section className="rounded-[30px] border border-border bg-card p-6 shadow-[0_18px_34px_rgba(121,84,49,0.08)]">
            <p className="text-xs tracking-[0.2em] text-muted-foreground">第二层</p>
            <h2 className="mt-1 text-2xl font-serif-cn font-bold">区域类型</h2>
            <div className="mt-4 grid gap-2">
              {REGION_PROFILES.map(region => (
                <button
                  key={region.id}
                  onClick={() => setActiveRegionId(region.id)}
                  className={`w-full rounded-2xl border px-3 py-3 text-left text-sm transition-all ${
                    region.id === activeRegion.id
                      ? "border-transparent text-white shadow-[0_12px_18px_rgba(94,66,42,0.18)]"
                      : "border-[hsl(35,22%,84%)] bg-[hsl(40,32%,97%)] text-foreground/80 hover:-translate-y-0.5"
                  }`}
                  style={region.id === activeRegion.id ? { backgroundColor: currentTopic.accent } : undefined}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[30px] border border-border bg-card p-6 shadow-[0_18px_34px_rgba(121,84,49,0.08)]">
            <p className="text-xs tracking-[0.2em] text-muted-foreground">第三层</p>
            <h2 className="mt-1 text-2xl font-serif-cn font-bold">区域成因</h2>
            <div className="mt-4 grid gap-3">
              {[
                ["区域定位", activeRegion.positioning],
                ["形成原因", activeRegion.formationReason],
                ["涉及专题", relatedTopics.join(" / ")],
                ["代表省份", activeRegion.provinces.join(" / ")],
                ["观察重点", activeRegion.focus],
                ["代表样本", representativeSamples.map(item => item.label).join("、") || "暂无样本"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[hsl(35,22%,84%)] bg-[hsl(40,32%,97%)] p-3.5">
                  <p className="text-xs tracking-[0.18em] text-muted-foreground">{label}</p>
                  <p className="mt-1.5 text-sm leading-7 text-foreground/78">{value}</p>
                </div>
              ))}
            </div>
          </section>

        </article>
      </section>

      <section className="mt-8 rounded-[30px] border border-border bg-card p-6 shadow-[0_18px_34px_rgba(121,84,49,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted-foreground">第四层</p>
            <h2 className="mt-1 text-2xl font-serif-cn font-bold">当前区域代表样本</h2>
            <p className="mt-1 text-sm text-muted-foreground">根据当前区域与专题筛选，展示最能体现区域特征的建筑样本。</p>
          </div>
          <span className="rounded-full px-3 py-1 text-xs text-white" style={{ backgroundColor: currentTopic.accent }}>
            {currentTopic.shortTitle}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {displaySamples.length > 0 ? (
            displaySamples.map(point => {
              const topic = getTopicContent(point.topic);
              return (
                <article
                  key={point.id}
                  className="rounded-2xl border border-[hsl(35,20%,84%)] bg-[hsl(40,32%,97%)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_18px_rgba(115,78,45,0.1)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold">{point.label}</p>
                      <p className="mt-1 text-sm text-foreground/65">{point.location}</p>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs text-white" style={{ backgroundColor: topic.accent }}>
                      {point.dynasty}
                    </span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                    <dt className="text-muted-foreground">所属专题</dt>
                    <dd className="text-right">{topic.shortTitle}</dd>
                    <dt className="text-muted-foreground">地点</dt>
                    <dd className="text-right">{point.location}</dd>
                    <dt className="text-muted-foreground">历史时期</dt>
                    <dd className="text-right">{point.dynasty}</dd>
                  </dl>
                  <div className="mt-3 rounded-xl border border-[hsl(35,22%,84%)] bg-white/70 p-3">
                    <p className="text-xs tracking-[0.14em] text-muted-foreground">区域价值</p>
                    <p className="mt-1 text-sm leading-6 text-foreground/76">{regionValueForPoint(point)}</p>
                  </div>
                  <Link
                    to={`/knowledge-base/${point.id}`}
                    className="mt-3 inline-flex rounded-full border border-[hsl(35,22%,80%)] bg-white px-3 py-1.5 text-xs text-[hsl(24,58%,34%)] transition-colors hover:border-[hsl(30,46%,56%)]"
                  >
                    查看详情
                  </Link>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-[hsl(35,20%,82%)] bg-[hsl(40,32%,97%)] p-4 text-sm leading-7 text-muted-foreground md:col-span-2 xl:col-span-3">
              当前区域下还没有该专题的重点样本点，可以切换上方专题或选择其他区域继续查看。
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExploreRegionsPageV2;
