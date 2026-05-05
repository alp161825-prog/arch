import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getTopicContent } from "@/data/siteContentV2";
import { compareBarData, compareRadarData } from "@/data/siteInteractiveData";

const topicMeta = [
  { key: "residential", label: "民居建筑" },
  { key: "government", label: "官府建筑" },
  { key: "palace", label: "皇宫建筑" },
  { key: "bridge", label: "古代桥梁" },
] as const;
type TopicKey = (typeof topicMeta)[number]["key"];

const metricMeta = [
  {
    key: "organization",
    oldLabel: "空间秩序",
    label: "空间组织力",
    meaning: "建筑如何组织人、活动、秩序和功能分区。",
    explanation:
      "官署与皇宫在流程与层级组织上更强，民居与桥梁更多聚焦生活适应与工程跨越。",
    winnerReason: "官署以办公、审判、仪式和等级流线为核心，空间秩序最清晰。",
  },
  {
    key: "technology",
    oldLabel: "结构复杂度",
    label: "结构 / 技术复杂度",
    meaning: "建筑在结构、工程和营造技术上的复杂程度。",
    explanation:
      "桥梁最高，因为要处理跨越、承重与水文协同；皇宫次之，因其大规模群体组织与复杂建造体系。",
    winnerReason:
      "桥梁强调跨越、承重与水文适应，皇宫强调大规模空间组织，两者复杂度接近。",
  },
  {
    key: "diffusion",
    oldLabel: "传播广度",
    label: "地域传播度",
    meaning: "建筑类型在不同地域和时代中的扩散程度。",
    explanation:
      "民居在各地形成多样类型，官署随制度体系传播；皇宫与桥梁则受政治中心和工程条件约束更强。",
    winnerReason:
      "民居因气候、材料、家族制度和地域生活差异形成更广泛的地方类型。",
  },
  {
    key: "symbol",
    oldLabel: "象征强度",
    label: "文化象征强度",
    meaning: "建筑承载礼制、权力、身份或文化记忆的程度。",
    explanation:
      "皇宫最强，官署次之；桥梁和民居更多体现生活与工程实践中的文化表达。",
    winnerReason:
      "皇宫集中承载皇权、礼制、国家仪式和中轴秩序，象征表达最强。",
  },
] as const;
type MetricKey = (typeof metricMeta)[number]["key"];

const metricLabelMap = Object.fromEntries(metricMeta.map(item => [item.oldLabel, item.label])) as Record<string, string>;
const metricKeyMap = Object.fromEntries(metricMeta.map(item => [item.oldLabel, item.key])) as Record<string, MetricKey>;

const topicInsights: Record<TopicKey, { conclusion: string; evidence: string }> = {
  residential: {
    conclusion: "地域样式多，生活适应性最强。",
    evidence: "民居在“地域传播度”得分最高，类型覆盖最广。",
  },
  palace: {
    conclusion: "礼制空间与皇权表达最集中。",
    evidence: "皇宫在“文化象征强度”达到全场最高。",
  },
  bridge: {
    conclusion: "工程技术与水文适应能力突出。",
    evidence: "桥梁在“结构 / 技术复杂度”领先且稳定。",
  },
  government: {
    conclusion: "制度流程清晰，但视觉形态分化较少。",
    evidence: "官府在“空间组织力”表现强，传播和象征维度次于民居与皇宫。",
  },
};

const radarChartData = compareRadarData.map(row => ({
  subject: row.dimension,
  residential: row.residential,
  government: row.government,
  palace: row.palace,
  bridge: row.bridge,
}));

const ExploreComparePageV2 = () => {
  const [activeRadarTopic, setActiveRadarTopic] = useState<"all" | TopicKey>("all");
  const [activeMetricKey, setActiveMetricKey] = useState<MetricKey>("organization");
  const [evidenceTopic, setEvidenceTopic] = useState<TopicKey | null>(null);

  const metricRows = useMemo(
    () =>
      compareBarData.map(row => ({
        key: metricKeyMap[row.label] ?? "organization",
        label: metricLabelMap[row.label] ?? row.label,
        residential: row.residential,
        government: row.government,
        palace: row.palace,
        bridge: row.bridge,
      })),
    []
  );

  const topicScores = useMemo(
    () =>
      topicMeta
        .map(topic => {
          const content = getTopicContent(topic.key);
          const radarAvg = Math.round(compareRadarData.reduce((sum, row) => sum + row[topic.key], 0) / compareRadarData.length);
          const bestMetric = metricRows.reduce(
            (best, row) => (row[topic.key] > best.value ? { name: row.label, value: row[topic.key] } : best),
            { name: metricRows[0].label, value: metricRows[0][topic.key] }
          );
          return {
            ...topic,
            accent: content.accent,
            radarAvg,
            bestMetric,
            conclusion: topicInsights[topic.key].conclusion,
            evidence: topicInsights[topic.key].evidence,
          };
        })
        .sort((a, b) => b.radarAvg - a.radarAvg),
    [metricRows]
  );

  const metricWinners = useMemo(
    () =>
      metricRows.map(row => {
        const ranking = topicMeta
          .map(topic => ({
            key: topic.key,
            label: topic.label,
            value: row[topic.key],
            accent: getTopicContent(topic.key).accent,
          }))
          .sort((a, b) => b.value - a.value);
        const metricDetail = metricMeta.find(item => item.key === row.key)!;
        return {
          key: row.key,
          metric: row.label,
          winner: ranking[0],
          runnerUp: ranking[1],
          gap: ranking[0].value - ranking[1].value,
          reason: metricDetail.winnerReason,
        };
      }),
    [metricRows]
  );

  const activeMetric = metricMeta.find(item => item.key === activeMetricKey) ?? metricMeta[0];

  const knowledgeRows = [
    {
      dimension: "核心目标",
      residential: "居住生活",
      government: "行政治理",
      palace: "皇权礼制",
      bridge: "交通跨越",
    },
    {
      dimension: "空间组织",
      residential: "院落 / 围屋",
      government: "门厅堂院",
      palace: "中轴殿阁群",
      bridge: "梁 / 拱 / 浮 / 复合",
    },
    {
      dimension: "主要结构",
      residential: "木构、砖土围护",
      government: "厅堂轴线与院落序列",
      palace: "高台基+大屋顶群",
      bridge: "拱券、梁体与复合跨越",
    },
    {
      dimension: "关键驱动力",
      residential: "气候、材料、家族",
      government: "制度、等级、审判",
      palace: "礼制、皇权、中轴",
      bridge: "水文、交通、工程",
    },
    {
      dimension: "成熟阶段",
      residential: "宋元至明清",
      government: "秦汉至明清",
      palace: "隋唐至明清",
      bridge: "隋唐至近代",
    },
    {
      dimension: "代表样本",
      residential: "北京四合院、福建土楼",
      government: "南阳府衙、霍州署",
      palace: "北京故宫、唐大明宫",
      bridge: "赵州桥、广济桥",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="relative overflow-hidden rounded-[30px] border border-[rgba(129,90,53,0.2)] bg-[linear-gradient(135deg,#3c2315_0%,#6a3f25_46%,#986d3e_100%)] p-8 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[rgba(255,229,186,0.18)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-24 h-64 w-64 rounded-full bg-[rgba(255,241,219,0.12)] blur-3xl" />
        <div className="relative">
          <p className="text-sm tracking-[0.28em] text-[rgba(255,237,214,0.88)]">COMPARISON COMMAND CENTER</p>
          <h1 className="mt-3 text-4xl font-serif-cn font-bold">对比分析总览</h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-[rgba(255,240,220,0.92)]">
            把四类建筑放进同一评估坐标系，直接看清“谁在何处更强、差距有多大、背后逻辑是什么”。
          </p>
          <p className="mt-3 max-w-5xl rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm leading-7 text-[rgba(255,241,222,0.94)]">
            评分用于信息表达对比，综合空间组织力、结构 / 技术复杂度、地域传播度与文化象征强度四项指标，并非历史价值排名。
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topicScores.map(topic => (
          <article key={topic.key} className="rounded-3xl border border-border bg-card p-5 shadow-[0_14px_26px_rgba(114,83,53,0.08)]">
            <p className="text-xs tracking-[0.2em] text-muted-foreground">{topic.label}</p>
            <p className="mt-2 text-4xl font-serif-cn font-bold" style={{ color: topic.accent }}>
              {topic.radarAvg}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">综合表达均分</p>
            <div className="mt-4 rounded-2xl bg-[hsl(40,32%,97%)] p-3">
              <p className="text-xs tracking-[0.18em] text-muted-foreground">强项</p>
              <p className="mt-1 text-sm font-medium text-foreground/82">{topic.bestMetric.name}</p>
              <p className="mt-1 text-sm text-foreground/76">结论：{topic.conclusion}</p>
            </div>
            <button
              type="button"
              onClick={() => setEvidenceTopic(current => (current === topic.key ? null : topic.key))}
              className="mt-3 rounded-full border border-[hsl(35,20%,80%)] bg-white px-3 py-1.5 text-xs text-[hsl(24,58%,34%)] transition-colors hover:border-[hsl(30,46%,56%)]"
            >
              依据
            </button>
            {evidenceTopic === topic.key ? (
              <p className="mt-2 rounded-xl border border-[hsl(35,20%,84%)] bg-[hsl(40,32%,97%)] px-3 py-2 text-xs leading-6 text-foreground/75">
                {topic.evidence}
              </p>
            ) : null}
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-serif-cn font-bold">四类建筑雷达图</h2>
            <span className="text-xs text-muted-foreground">能力轮廓</span>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveRadarTopic("all")}
              className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                activeRadarTopic === "all" ? "border-transparent bg-[hsl(26,54%,36%)] text-white" : "border-[hsl(35,22%,82%)] bg-white text-foreground/78"
              }`}
            >
              全部显示
            </button>
            {topicMeta.map(topic => {
              const accent = getTopicContent(topic.key).accent;
              return (
                <button
                  key={`radar-filter-${topic.key}`}
                  type="button"
                  onClick={() => setActiveRadarTopic(topic.key)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                    activeRadarTopic === topic.key ? "border-transparent text-white" : "border-[hsl(35,22%,82%)] bg-white text-foreground/78"
                  }`}
                  style={activeRadarTopic === topic.key ? { backgroundColor: accent } : undefined}
                >
                  只看{topic.label}
                </button>
              );
            })}
          </div>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData}>
                <PolarGrid stroke="#decbb1" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#6a594a" }} />
                {topicMeta.map(topic => {
                  const content = getTopicContent(topic.key);
                  const highlighted = activeRadarTopic === "all" || activeRadarTopic === topic.key;
                  return (
                    <Radar
                      key={topic.key}
                      name={topic.label}
                      dataKey={topic.key}
                      stroke={content.accent}
                      fill={content.accent}
                      strokeWidth={highlighted ? 2.4 : 1.5}
                      strokeOpacity={highlighted ? 0.98 : 0.24}
                      fillOpacity={highlighted ? 0.2 : 0.04}
                    />
                  );
                })}
                <Tooltip
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid rgba(129,90,53,0.22)",
                    background: "rgba(255,251,245,0.95)",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 rounded-xl border border-[hsl(35,20%,84%)] bg-[hsl(40,32%,97%)] px-3 py-2 text-xs leading-6 text-foreground/74">
            雷达图用于观察四类建筑的能力轮廓：民居更均衡，皇宫象征强，桥梁技术强，官署制度秩序强。
          </p>
        </article>

        <article className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-serif-cn font-bold">关键指标条形图</h2>
            <span className="text-xs text-muted-foreground">点击柱图切换解释</span>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {metricMeta.map(metric => (
              <button
                key={metric.key}
                type="button"
                onClick={() => setActiveMetricKey(metric.key)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                  activeMetricKey === metric.key
                    ? "border-transparent bg-[hsl(26,54%,36%)] text-white"
                    : "border-[hsl(35,22%,82%)] bg-white text-foreground/78"
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metricRows}
                margin={{ top: 10, right: 18, left: -8, bottom: 0 }}
                onClick={(state: { activeLabel?: string }) => {
                  const label = state?.activeLabel;
                  const target = metricRows.find(item => item.label === label);
                  if (target) setActiveMetricKey(target.key);
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eadfcf" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid rgba(129,90,53,0.22)",
                    background: "rgba(255,251,245,0.95)",
                  }}
                />
                {topicMeta.map(topic => {
                  const content = getTopicContent(topic.key);
                  return <Bar key={topic.key} dataKey={topic.key} fill={content.accent} radius={[7, 7, 0, 0]} />;
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 rounded-2xl border border-[hsl(35,20%,84%)] bg-[hsl(40,32%,97%)] p-3.5">
            <p className="text-sm font-semibold">{activeMetric.label}</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{activeMetric.meaning}</p>
            <p className="mt-1.5 text-sm leading-7 text-foreground/76">{activeMetric.explanation}</p>
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-2xl font-serif-cn font-bold">关键指标结论</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">每个指标同时显示赢家、接近者、差距与差异原因。</p>
          <div className="mt-4 space-y-3">
            {metricWinners.map(row => (
              <div key={row.metric} className="rounded-2xl border border-[hsl(35,20%,84%)] bg-[hsl(40,32%,97%)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground/84">{row.metric}</p>
                  <span className="rounded-full bg-card px-2.5 py-1 text-xs text-muted-foreground">差距 {row.gap}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <p className="font-medium" style={{ color: row.winner.accent }}>
                    {row.winner.label} {row.winner.value}
                  </p>
                  <p className="text-foreground/70">{row.runnerUp.label} {row.runnerUp.value}</p>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[rgba(129,90,53,0.12)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(10, row.winner.value)}%`,
                      background: `linear-gradient(90deg, ${row.winner.accent}, ${row.winner.accent}AA)`,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs leading-6 text-foreground/72">原因：{row.reason}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="grid grid-cols-5 border-b border-border bg-muted/50 text-sm font-medium text-foreground">
            <div className="p-4">对比知识表</div>
            {topicMeta.map(topic => (
              <div key={topic.key} className="p-4">
                {topic.label}
              </div>
            ))}
          </div>
          {knowledgeRows.map(row => (
            <div key={row.dimension} className="grid grid-cols-1 border-b border-border last:border-b-0 md:grid-cols-5">
              <div className="p-4 text-sm font-serif-cn font-semibold text-foreground">{row.dimension}</div>
              {topicMeta.map(topic => (
                <div key={topic.key} className="p-4 text-sm leading-7 text-foreground/80">
                  {row[topic.key]}
                </div>
              ))}
            </div>
          ))}
        </article>
      </section>

      <section className="mt-8 rounded-3xl border border-border bg-card p-6">
        <h2 className="text-2xl font-serif-cn font-bold">综合结论</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "民居强在地域适应：从气候、材料和家族生活中形成多样形态。",
            "官署强在制度秩序：以行政、审判和等级流线组织空间。",
            "皇宫强在象征表达：通过中轴、礼制和宫城层级集中体现皇权。",
            "桥梁强在工程技术：通过结构、材料和水文适应实现交通连接。",
          ].map(line => (
            <article key={line} className="rounded-2xl border border-[hsl(35,20%,84%)] bg-[hsl(40,32%,97%)] p-4 text-sm leading-7 text-foreground/80">
              {line}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExploreComparePageV2;
