import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ProvinceAmapPanel from "@/components/site/ProvinceAmapPanel";
import { buildingOfficialSourcesV2 } from "@/data/buildingOfficialSourcesV2";
import { getProvinceAtlasRecord, hasProvinceAtlasRecord, provinceCodeToName } from "@/data/provinceAtlas";
import { topicContents } from "@/data/siteContentV2";
import { resolveUserBuildingImage } from "@/data/userBuildingImageMap";
import { useAtlasPoints } from "@/hooks/useAtlasPoints";
import imgForbiddenCity from "@/assets/buildings/forbidden-city.jpg";
import imgWeiyang from "@/assets/buildings/weiyang.jpg";
import imgDaming from "@/assets/buildings/daming.jpg";
import imgZhaozhou from "@/assets/buildings/zhaozhou-bridge.jpg";
import imgLugou from "@/assets/buildings/lugou.jpg";
import imgHuizhou from "@/assets/buildings/huizhou.jpg";
import imgSuzhouGarden from "@/assets/buildings/suzhou-garden.jpg";
import imgYinxu from "@/assets/buildings/yinxu.jpg";
import imgQinHan from "@/assets/dynasty-qin-han.jpg";
import imgSuiTang from "@/assets/dynasty-sui-tang.jpg";
import imgSong from "@/assets/dynasty-song.jpg";
import imgMingQing from "@/assets/dynasty-ming-qing.jpg";

type PointImageMap = Record<string, string>;

const pieColors = ["#b96a39", "#3a7da6", "#d0a34a", "#6c8a72"];
const pointImages: PointImageMap = {
  "forbidden-city": imgForbiddenCity,
  "weiyang-palace": imgWeiyang,
  "xianyang-palace": imgQinHan,
  "epang-palace": imgQinHan,
  "changle-palace": imgQinHan,
  "jianzhang-palace": imgQinHan,
  "daming-palace": imgDaming,
  "daxing-palace": imgSuiTang,
  "huaqing-palace": imgSuiTang,
  "zhaozhou-bridge": imgZhaozhou,
  "lugou-bridge": imgLugou,
  "huizhou-residence": imgHuizhou,
  "fujian-tulou": imgHuizhou,
  "deshou-palace": imgSuzhouGarden,
  "nanjing-palace": imgSuzhouGarden,
  "jiankang-palace": imgSuzhouGarden,
  "aristocrat-house": imgSuzhouGarden,
  "taiji-hall": imgYinxu,
  "yinxu-palace": imgYinxu,
  "tokyo-palace": imgSong,
  "yuan-capital-palace": imgSong,
  "luoyang-bridge": imgSong,
  "guangji-bridge": imgSong,
  "hongqiao": imgSong,
  "siheyuan": imgMingQing,
  "gongwangfu": imgMingQing,
  "shenyang-palace": imgMingQing,
};

const topicLabels = {
  residential: "民居",
  government: "官署",
  palace: "皇宫",
  bridge: "桥梁",
} as const;

const compositeIndexHint =
  "综合指数由样本数量、代表性、历史跨度、专题覆盖度和研究关注度综合计算，仅用于页面内部比较。";

const ProvinceAnalysisPage = () => {
  const { provinceCode = "110000" } = useParams();
  const { points: provincePoints } = useAtlasPoints({ provinceCode });
  const detail = useMemo(() => getProvinceAtlasRecord(provinceCode), [provinceCode]);
  const provinceName = provinceCodeToName[provinceCode] ?? detail.name;
  const isSupportedProvince = hasProvinceAtlasRecord(provinceCode) || provincePoints.length > 0;
  const [selectedPointId, setSelectedPointId] = useState<string | undefined>(provincePoints[0]?.id);

  useEffect(() => {
    setSelectedPointId(provincePoints[0]?.id);
  }, [provincePoints]);

  const selectedPoint = provincePoints.find(point => point.id === selectedPointId) ?? provincePoints[0];
  const selectedTopic = topicContents.find(topic => topic.key === selectedPoint?.topic);
  const selectedImage = selectedPoint
    ? resolveUserBuildingImage(
        selectedPoint.label,
        selectedPoint.image || pointImages[selectedPoint.id] || selectedTopic?.heroImage,
      )
    : selectedTopic?.heroImage;
  const officialSources = selectedPoint ? buildingOfficialSourcesV2[selectedPoint.id] ?? [] : [];

  if (!isSupportedProvince) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <section className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(245,236,221,0.96))] p-8 text-center shadow-[0_24px_54px_rgba(120,83,49,0.1)]">
          <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">PROVINCE SCREEN</p>
          <h1 className="mt-3 text-3xl font-serif-cn font-bold">{provinceName}暂未开放省份分析</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-foreground/72">
            当前只支持已整理完成课程数据的省份页面跳转。你可以先回到总览主屏，点击已有数据的省份继续查看。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/atlas"
              className="rounded-full bg-[hsl(21,54%,38%)] px-5 py-2.5 text-sm text-white shadow-[0_10px_18px_rgba(95,58,37,0.14)]"
            >
              返回总览主屏
            </Link>
            <Link
              to="/explore/regions"
              className="rounded-full border border-[rgba(129,90,53,0.16)] bg-white/75 px-5 py-2.5 text-sm text-foreground/78 transition-colors hover:border-[rgba(129,90,53,0.28)]"
            >
              查看地域分布
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(245,236,221,0.96))] p-6 shadow-[0_24px_54px_rgba(120,83,49,0.1)]">
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,255,255,0.55)] px-5 py-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">PROVINCE SCREEN</p>
            <h1 className="mt-2 text-3xl font-serif-cn font-bold">{provinceName}古代建筑分析页</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/75">{detail.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/atlas"
              className="rounded-full border border-[rgba(129,90,53,0.16)] bg-white/75 px-4 py-2 text-sm text-foreground/78 transition-colors hover:border-[rgba(129,90,53,0.28)]"
            >
              返回总览主屏
            </Link>
            <Link
              to="/explore/regions"
              className="rounded-full bg-[hsl(21,54%,38%)] px-4 py-2 text-sm text-white shadow-[0_10px_18px_rgba(95,58,37,0.14)]"
            >
              返回地域分布
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {detail.cards.map(card => (
            <div
              key={card.label}
              className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,255,255,0.66)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)]"
            >
              <p className="text-3xl font-serif-cn font-bold text-[hsl(24,42%,26%)]">{card.value}</p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground/72">
                {card.label}
                {card.label === "综合指数" ? (
                  <span className="group relative inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-[rgba(129,90,53,0.2)] text-[10px] text-[hsl(28,28%,42%)]" aria-label={compositeIndexHint} title={compositeIndexHint}>
                    ?
                    <span className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-20 w-64 -translate-x-1/2 rounded-[10px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,252,246,0.98)] px-2.5 py-2 text-[11px] leading-5 text-foreground/76 opacity-0 shadow-[0_10px_20px_rgba(122,86,52,0.12)] transition-opacity group-hover:opacity-100">
                      {compositeIndexHint}
                    </span>
                  </span>
                ) : null}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_420px]">
          <div className="grid gap-6">
            <ProvinceAmapPanel
              provinceCode={provinceCode}
              provinceName={provinceName}
              provincePoints={provincePoints}
              selectedPointId={selectedPoint?.id}
              onPointSelect={setSelectedPointId}
            />
          </div>

          <div className="grid gap-6">
            <article className="overflow-hidden rounded-[36px] border border-[rgba(129,90,53,0.16)] bg-[linear-gradient(180deg,rgba(255,252,246,0.99),rgba(241,232,216,0.95))] shadow-[0_20px_40px_rgba(122,86,52,0.1)]">
              {selectedImage ? <img src={selectedImage} alt={selectedPoint?.label ?? provinceName} className="h-64 w-full object-cover" /> : null}
              <div className="border-t border-[rgba(129,90,53,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">展陈说明牌</p>
                    <h2 className="mt-2 text-2xl font-serif-cn font-bold">{selectedPoint?.label ?? `${provinceName}重点建筑`}</h2>
                  </div>
                </div>

                {selectedPoint ? (
                  <p className="mt-3 text-xs tracking-[0.18em] text-muted-foreground">
                    {selectedPoint.dynasty} / {selectedPoint.location}
                  </p>
                ) : null}

                <div className="mt-4 rounded-[22px] border border-[rgba(129,90,53,0.1)] bg-white/64 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  <p className="text-sm leading-7 text-foreground/76">
                    {selectedPoint?.summary ?? `${provinceName}已接入局部地图，可继续从省内建筑点位进行阅读。`}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {selectedPoint ? (
                    <span className="inline-flex items-center rounded-full border border-[rgba(129,90,53,0.12)] bg-white/68 px-3 py-2 text-xs text-muted-foreground">
                      {topicLabels[selectedPoint.topic]}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center rounded-full border border-[rgba(129,90,53,0.12)] bg-white/68 px-3 py-2 text-xs text-muted-foreground">
                    省内点位联动
                  </span>
                </div>

                {officialSources.length ? (
                  <div className="mt-6 rounded-[26px] border border-[rgba(129,90,53,0.12)] bg-[rgba(113,76,45,0.05)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                    <p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">官方来源</p>
                    <div className="mt-3 space-y-3">
                      {officialSources.map(source => (
                        <a
                          key={`${selectedPoint?.id}-${source.label}`}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-3 transition-all hover:translate-y-[-1px] hover:shadow-[0_10px_16px_rgba(120,83,49,0.08)]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">{source.label}</p>
                            <span className="rounded-full bg-[rgba(129,90,53,0.08)] px-2 py-1 text-[11px] text-foreground/72">{source.type}</span>
                          </div>
                          <p className="mt-2 text-xs leading-6 text-muted-foreground">{source.note}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}              </div>
            </article>

            <article className="rounded-[28px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,255,255,0.72)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif-cn font-bold">保护与活化散点</h2>
                  <p className="mt-2 text-sm leading-7 text-foreground/68">
                    横轴代表保护水平，纵轴代表活化程度，越靠右上说明保护和利用都更强。
                  </p>
                </div>
                <div className="rounded-full border border-[rgba(129,90,53,0.12)] bg-white/70 px-3 py-1.5 text-xs text-muted-foreground">
                  读图提示：右上更成熟
                </div>
              </div>
              <div className="mt-4 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 12, right: 16, bottom: 10, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,90,53,0.12)" />
                    <XAxis type="number" dataKey="protection" name="保护" tick={{ fontSize: 11 }} domain={[40, 100]} />
                    <YAxis type="number" dataKey="vitality" name="活化" tick={{ fontSize: 11 }} domain={[35, 100]} />
                    <Tooltip formatter={(value: number) => [value, "数值"]} />
                    <Scatter data={detail.scatter} fill="#b96a39">
                      <LabelList dataKey="name" position="top" fontSize={11} fill="#7a5b3d" />
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.18fr_0.9fr_0.9fr]">
          <article className="rounded-[28px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,255,255,0.72)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif-cn font-bold">建筑活跃度演进</h2>
                <p className="mt-2 text-sm leading-7 text-foreground/68">
                  这条曲线帮助观察该省在不同历史阶段的建筑活跃重心，峰值越高说明该阶段代表性样本越集中。
                </p>
              </div>
              <div className="rounded-full border border-[rgba(129,90,53,0.12)] bg-white/70 px-3 py-1.5 text-xs text-muted-foreground">
                峰值阶段最值得细看
              </div>
            </div>
            <div className="mt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={detail.trend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="province-trend-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#b96a39" stopOpacity={0.42} />
                      <stop offset="100%" stopColor="#b96a39" stopOpacity={0.06} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,90,53,0.12)" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [value, "活跃度"]} />
                  <Area type="monotone" dataKey="value" stroke="#9a582e" strokeWidth={2.6} fill="url(#province-trend-fill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-[28px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,255,255,0.72)] p-5">
            <div>
              <h2 className="text-xl font-serif-cn font-bold">地市建筑活跃分布</h2>
              <p className="mt-2 text-sm leading-7 text-foreground/68">
                棕色是样本数量，金色是活跃度，蓝色是研究关注度，三组柱体放在一起看更容易比较城市差异。
              </p>
            </div>
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={detail.cityMetrics} margin={{ top: 10, right: 8, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,90,53,0.12)" />
                  <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="sites" name="样本数量" fill="#b96a39" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="activity" name="活跃度" fill="#d0a34a" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="study" name="研究关注" fill="#5f839c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-[28px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,255,255,0.72)] p-5">
            <div>
              <h2 className="text-xl font-serif-cn font-bold">建筑类型结构</h2>
              <p className="mt-2 text-sm leading-7 text-foreground/68">
                这张环图用来判断本省更偏向哪类样本，是宫殿遗址集中，还是桥梁、官署或民居更突出。
              </p>
            </div>
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={detail.categories} dataKey="value" nameKey="name" innerRadius={60} outerRadius={92} paddingAngle={3}>
                    {detail.categories.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                    <LabelList dataKey="name" position="outside" fontSize={11} fill="#7a5b3d" />
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, "占比值"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {detail.categories.map((entry, index) => (
                <div
                  key={`legend-${entry.name}`}
                  className="flex items-center justify-between rounded-[16px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.86)] px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-3 w-3 rounded-full"
                      style={{ backgroundColor: pieColors[index % pieColors.length] }}
                    />
                    <span className="text-sm text-foreground/78">{entry.name}</span>
                  </div>
                  <span className="text-sm font-medium text-[hsl(24,42%,28%)]">{entry.value}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default ProvinceAnalysisPage;





