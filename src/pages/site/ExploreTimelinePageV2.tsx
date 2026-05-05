import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTopicContent } from "@/data/siteContentV2";

const topicKeys = ["residential", "government", "palace", "bridge"] as const;
type TopicKey = (typeof topicKeys)[number];

type StageCategoryDetail = {
  coreChange: string;
  representatives: string[];
  keywords: string[];
  timelineNode: string;
};

type EvolutionStage = {
  id: "pre-qin" | "qin-han" | "sui-tang-song-yuan" | "ming-qing";
  order: "01" | "02" | "03" | "04";
  period: string;
  phase: string;
  timeRange: string;
  stageTheme: string;
  summary: string;
  categories: Record<TopicKey, StageCategoryDetail>;
};

const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    id: "pre-qin",
    order: "01",
    period: "先秦",
    phase: "萌芽期",
    timeRange: "约公元前21世纪—前221年",
    stageTheme: "从生存适应到礼制萌芽",
    summary: "建筑首先回应遮蔽、居住、礼制和跨越需求，四类建筑尚未完全分化。",
    categories: {
      residential: {
        coreChange: "从穴居、半地穴到早期院落组织。",
        representatives: ["二里头遗址半地穴式房屋"],
        keywords: ["生存适应", "聚落空间", "居住雏形"],
        timelineNode: "半地穴 / 早期院落",
      },
      government: {
        coreChange: "政治、礼仪和居住空间尚未完全分离。",
        representatives: ["周代士大夫住宅形制"],
        keywords: ["居政合一", "等级萌芽", "礼制雏形"],
        timelineNode: "礼制雏形",
      },
      palace: {
        coreChange: "早期宫殿区与王权中心开始形成。",
        representatives: ["二里头宫殿区"],
        keywords: ["王权中心", "轴线雏形", "宫殿原型"],
        timelineNode: "宫殿雏形",
      },
      bridge: {
        coreChange: "从简易跨越到早期浮桥组织。",
        representatives: ["商代拒桥", "周文王渭河浮桥"],
        keywords: ["基础跨越", "渡河交通", "浮桥萌芽"],
        timelineNode: "拒桥 / 浮桥萌芽",
      },
    },
  },
  {
    id: "qin-han",
    order: "02",
    period: "秦汉",
    phase: "成型期",
    timeRange: "前221年—220年",
    stageTheme: "统一国家与都城系统推动类型定型",
    summary: "统一国家、都城建设和道路交通推动建筑类型逐渐成型。",
    categories: {
      residential: {
        coreChange: "里坊、坞壁和庄园式居住空间发展。",
        representatives: ["汉代坞壁", "三杨庄遗址"],
        keywords: ["防御聚居", "农业庄园", "基层社会"],
        timelineNode: "坞壁 / 里坊聚居",
      },
      government: {
        coreChange: "中央官署和宫城政务空间逐渐清晰。",
        representatives: ["西汉长安城中央官署遗址", "东汉却非殿"],
        keywords: ["中央集权", "政务空间", "都城机构"],
        timelineNode: "中央官署成型",
      },
      palace: {
        coreChange: "大型宫城和前殿制度发展。",
        representatives: ["汉未央宫"],
        keywords: ["宫城扩展", "前殿空间", "国家权力"],
        timelineNode: "宫城扩展",
      },
      bridge: {
        coreChange: "都城道路桥梁和多跨梁桥发展。",
        representatives: ["秦渭桥", "汉霸桥", "西汉七星桥", "三殿汉代古桥"],
        keywords: ["道路交通", "桥墩支撑", "都城联系"],
        timelineNode: "道路桥梁发展",
      },
    },
  },
  {
    id: "sui-tang-song-yuan",
    order: "03",
    period: "隋唐—宋元",
    phase: "成熟期",
    timeRange: "581年—1368年",
    stageTheme: "城市、礼制与技术协同成熟",
    summary: "都城、礼制、城市生活和工程技术高度发展，四类建筑进入成熟阶段。",
    categories: {
      residential: {
        coreChange: "里坊住宅、府第、院落和地域居住形态丰富。",
        representatives: ["隋唐长安城里坊住宅", "敦煌壁画院落", "北宋许驸马府", "元代后英房遗址"],
        keywords: ["里坊居住", "院落组织", "家族生活"],
        timelineNode: "府第 / 院落成熟",
      },
      government: {
        coreChange: "衙署制度和官学、行政空间更加完整。",
        representatives: ["正平坊遗址", "北宋开封府"],
        keywords: ["行政秩序", "办公审判", "城市治理"],
        timelineNode: "衙署制度成熟",
      },
      palace: {
        coreChange: "宫殿与都城中轴关系强化。",
        representatives: ["唐大明宫"],
        keywords: ["中轴强化", "朝会空间", "都城礼制"],
        timelineNode: "中轴秩序强化",
      },
      bridge: {
        coreChange: "石拱桥、城市桥梁和海港桥梁技术成熟。",
        representatives: ["赵州桥", "隋灞桥", "洛阳天津桥", "洛阳桥", "汴京虹桥"],
        keywords: ["石拱技术", "城市桥梁", "水文适应"],
        timelineNode: "石拱 / 城市桥成熟",
      },
    },
  },
  {
    id: "ming-qing",
    order: "04",
    period: "明清",
    phase: "分化期",
    timeRange: "1368年—1911年",
    stageTheme: "制度强化与地域分化并进",
    summary: "地域风格、制度空间和工程类型进一步分化，建筑体系高度成熟。",
    categories: {
      residential: {
        coreChange: "四合院、徽州住宅、福建土楼、窑洞、一颗印等地域民居成熟。",
        representatives: ["北京四合院", "徽州明代住宅", "福建土楼", "窑洞", "一颗印"],
        keywords: ["地域适应", "宗族空间", "生活分化"],
        timelineNode: "四合院 / 土楼 / 窑洞分化",
      },
      government: {
        coreChange: "地方衙署和专门行政空间成熟。",
        representatives: ["霍州署大堂", "南阳府衙", "蓟辽督师府", "绥远城将军衙署"],
        keywords: ["地方治理", "审判办公", "等级空间"],
        timelineNode: "地方衙署成熟",
      },
      palace: {
        coreChange: "中轴对称、前朝后寝和礼制空间高度成熟。",
        representatives: ["北京故宫", "沈阳故宫"],
        keywords: ["中轴秩序", "礼制成熟", "皇权象征"],
        timelineNode: "紫禁城礼制成熟",
      },
      bridge: {
        coreChange: "大型石桥、复合桥和近代桥梁技术转型。",
        representatives: ["广济桥", "卢沟桥", "黄河铁桥"],
        keywords: ["联拱石桥", "复合桥型", "近代转型"],
        timelineNode: "联拱 / 复合桥与转型",
      },
    },
  },
];

const ExploreTimelinePageV2 = () => {
  const [activeStageId, setActiveStageId] = useState<EvolutionStage["id"]>("pre-qin");

  const activeStageIndex = useMemo(
    () => Math.max(0, EVOLUTION_STAGES.findIndex(stage => stage.id === activeStageId)),
    [activeStageId],
  );

  const activeStage = EVOLUTION_STAGES[activeStageIndex] ?? EVOLUTION_STAGES[0];
  const nextStage = EVOLUTION_STAGES[activeStageIndex + 1];

  const topicRows = useMemo(
    () =>
      topicKeys.map(key => {
        const topic = getTopicContent(key);
        return {
          key,
          title: topic.shortTitle,
          accent: topic.accent,
          route: topic.route,
          detail: activeStage.categories[key],
        };
      }),
    [activeStage],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="relative overflow-hidden rounded-[30px] border border-[rgba(129,90,53,0.22)] bg-[linear-gradient(130deg,#4b2f1d_0%,#7b4d2f_52%,#b17840_100%)] p-8 text-white shadow-[0_26px_50px_rgba(72,42,20,0.18)]">
        <div className="pointer-events-none absolute -right-12 -top-14 h-52 w-52 rounded-full bg-[rgba(255,228,190,0.17)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-14 h-64 w-64 rounded-full bg-[rgba(255,241,216,0.14)] blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.14fr_0.86fr]">
          <div>
            <p className="text-sm tracking-[0.28em] text-[rgba(255,236,211,0.9)]">HISTORICAL TIMELINE OVERVIEW</p>
            <h1 className="mt-3 text-4xl font-serif-cn font-bold leading-tight">时间演进总览</h1>
            <p className="mt-4 text-base leading-8 text-[rgba(255,242,222,0.94)]">
              以历史阶段为轴，对照民居、官署、皇宫、桥梁四类建筑的共同演进路径。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/18 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs tracking-[0.15em] text-[rgba(255,233,203,0.86)]">当前阶段</p>
              <p className="mt-2 text-xl font-serif-cn font-bold">
                {activeStage.period} · {activeStage.phase.replace("期", "")}
              </p>
            </article>
            <article className="rounded-2xl border border-white/18 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs tracking-[0.15em] text-[rgba(255,233,203,0.86)]">时间范围</p>
              <p className="mt-2 text-sm leading-6 text-[rgba(255,242,222,0.96)]">{activeStage.timeRange}</p>
            </article>
            <article className="rounded-2xl border border-white/18 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs tracking-[0.15em] text-[rgba(255,233,203,0.86)]">阶段主题</p>
              <p className="mt-2 text-sm leading-7 text-[rgba(255,242,222,0.96)]">{activeStage.stageTheme}</p>
            </article>
            <article className="rounded-2xl border border-white/18 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs tracking-[0.15em] text-[rgba(255,233,203,0.86)]">下一阶段</p>
              <p className="mt-2 text-base font-serif-cn font-bold">
                {nextStage ? `${nextStage.period} · ${nextStage.phase.replace("期", "")}` : "阶段终点"}
              </p>
              <p className="mt-1 text-xs text-[rgba(255,238,214,0.86)]">{nextStage ? nextStage.timeRange : "已到演进末端"}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[hsl(35,24%,83%)] bg-card p-4 shadow-[0_16px_34px_rgba(120,83,49,0.08)]">
        <div className="grid gap-2 md:grid-cols-4">
          {EVOLUTION_STAGES.map(stage => {
            const active = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageId(stage.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                  active
                    ? "border-transparent text-white shadow-[0_12px_20px_rgba(88,58,34,0.22)]"
                    : "border-[hsl(35,22%,84%)] bg-[hsl(40,34%,97%)] text-foreground/78 hover:-translate-y-0.5 hover:shadow-[0_10px_16px_rgba(120,83,49,0.09)]"
                }`}
                style={active ? { backgroundColor: "#8c5731" } : undefined}
              >
                <p className="text-xs tracking-[0.14em]">{stage.period}</p>
                <p className="mt-1 text-lg font-serif-cn font-bold">{stage.phase}</p>
                <p className={`mt-1 text-xs ${active ? "text-white/88" : "text-muted-foreground"}`}>{stage.timeRange}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[hsl(35,24%,83%)] bg-card p-6 shadow-[0_16px_34px_rgba(120,83,49,0.08)]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-[hsl(26,28%,44%)]">PARALLEL EVOLUTION TRACKS</p>
            <h2 className="mt-1.5 text-2xl font-serif-cn font-bold">四类建筑并行时间轴</h2>
          </div>
          <span className="rounded-full border border-[hsl(35,22%,84%)] bg-[hsl(40,34%,97%)] px-3 py-1 text-xs text-muted-foreground">
            当前高亮：{activeStage.period} · {activeStage.phase.replace("期", "")}
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[170px_repeat(4,minmax(0,1fr))]">
              <div className="border-b border-[hsl(35,20%,84%)] px-3 py-3 text-xs tracking-[0.14em] text-muted-foreground">建筑类型</div>
              {EVOLUTION_STAGES.map(stage => {
                const active = stage.id === activeStageId;
                return (
                  <div
                    key={`head-${stage.id}`}
                    className={`border-b border-l border-[hsl(35,20%,84%)] px-3 py-3 ${active ? "bg-[hsl(31,68%,93%)]" : "bg-[hsl(40,34%,97%)]"}`}
                  >
                    <p className="text-xs tracking-[0.14em] text-muted-foreground">{stage.order}</p>
                    <p className="mt-0.5 text-base font-serif-cn font-bold">{stage.period}</p>
                  </div>
                );
              })}
            </div>

            {topicRows.map(row => (
              <div key={`lane-${row.key}`} className="grid grid-cols-[170px_repeat(4,minmax(0,1fr))]">
                <div className="border-b border-[hsl(35,20%,84%)] px-3 py-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(40,34%,97%)] px-2.5 py-1">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.accent }} />
                    <p className="text-sm font-medium">{row.title}</p>
                  </div>
                </div>
                {EVOLUTION_STAGES.map(stage => {
                  const active = stage.id === activeStageId;
                  return (
                    <div
                      key={`${row.key}-${stage.id}`}
                      className={`border-b border-l border-[hsl(35,20%,84%)] px-3 py-3 transition-colors ${
                        active ? "bg-[hsl(33,70%,95%)]" : "bg-[hsl(40,32%,98%)]"
                      }`}
                    >
                      <p className="text-sm leading-6 text-foreground/80">{stage.categories[row.key].timelineNode}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {topicRows.map(row => (
            <article key={`trend-${row.key}`} className="rounded-2xl border border-[hsl(35,22%,84%)] bg-[hsl(40,34%,97%)] p-3.5">
              <p className="text-sm font-serif-cn font-bold">{row.title}变化趋势</p>
              <p className="mt-1.5 text-sm text-foreground/78">
                {EVOLUTION_STAGES.map(stage => stage.categories[row.key].keywords[0]).join(" → ")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.06fr_0.94fr]">
        <article className="rounded-3xl border border-[hsl(35,24%,83%)] bg-card p-6 shadow-[0_16px_34px_rgba(120,83,49,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-serif-cn font-bold">阶段主线</h2>
            <span className="rounded-full border border-[hsl(35,22%,84%)] bg-[hsl(40,34%,97%)] px-3 py-1 text-xs text-muted-foreground">
              阶段 {activeStage.order}
            </span>
          </div>
          <p className="mt-3 rounded-2xl border border-[hsl(35,22%,84%)] bg-[hsl(40,34%,97%)] px-4 py-3 text-sm leading-7 text-foreground/80">
            {activeStage.summary}
          </p>

          <div className="mt-5 space-y-3">
            {topicRows.map(row => (
              <article
                key={`detail-${row.key}`}
                className="rounded-2xl border border-[hsl(35,22%,84%)] bg-[hsl(40,34%,97%)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_18px_rgba(120,83,49,0.08)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-serif-cn font-bold">{row.title}</p>
                  <Link
                    to={row.route}
                    className="rounded-full px-2.5 py-1 text-xs text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: row.accent }}
                  >
                    进入专题
                  </Link>
                </div>

                <dl className="mt-3 space-y-2.5 text-sm">
                  <div>
                    <dt className="text-xs tracking-[0.12em] text-muted-foreground">核心变化</dt>
                    <dd className="mt-1 leading-6 text-foreground/84">{row.detail.coreChange}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-[0.12em] text-muted-foreground">代表对象</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {row.detail.representatives.map(item => (
                        <Link
                          key={`${row.key}-rep-${item}`}
                          to={row.route}
                          className="rounded-full border border-[hsl(35,22%,82%)] bg-white/86 px-2.5 py-1 text-xs text-foreground/80 transition-colors hover:border-[hsl(30,46%,56%)] hover:text-[hsl(24,58%,26%)]"
                          title={`查看${item}所在专题`}
                        >
                          {item}
                        </Link>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-[0.12em] text-muted-foreground">变化关键词</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {row.detail.keywords.map(tag => (
                        <span
                          key={`${row.key}-kw-${tag}`}
                          className="rounded-full border border-[hsl(35,22%,82%)] bg-[hsl(39,35%,95%)] px-2.5 py-1 text-xs text-foreground/78"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[hsl(35,24%,83%)] bg-card p-6 shadow-[0_16px_34px_rgba(120,83,49,0.08)]">
          <h2 className="text-2xl font-serif-cn font-bold">变化对照矩阵</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            按当前阶段同步对照四类建筑的阶段变化、代表案例与关键词。
          </p>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-[hsl(35,22%,84%)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[hsl(40,34%,96%)]">
                <tr className="text-foreground/84">
                  <th className="px-3 py-2.5 font-medium">建筑类别</th>
                  <th className="px-3 py-2.5 font-medium">阶段变化</th>
                  <th className="px-3 py-2.5 font-medium">代表案例</th>
                  <th className="px-3 py-2.5 font-medium">关键词</th>
                </tr>
              </thead>
              <tbody>
                {topicRows.map(row => (
                  <tr key={`matrix-${row.key}`} className="border-t border-[hsl(35,22%,84%)] bg-white/86 align-top">
                    <td className="px-3 py-3.5">
                      <div className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.accent }} />
                        <span className="font-medium">{row.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 leading-6 text-foreground/80">{row.detail.coreChange}</td>
                    <td className="px-3 py-3.5">
                      <p className="leading-6 text-foreground/80">{row.detail.representatives.join("、")}</p>
                      <Link to={row.route} className="mt-1 inline-block text-xs text-[hsl(24,60%,35%)] underline-offset-4 hover:underline">
                        查看专题详情
                      </Link>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {row.detail.keywords.map(tag => (
                          <span key={`${row.key}-matrix-${tag}`} className="rounded-full bg-[hsl(39,35%,94%)] px-2 py-0.5 text-xs text-foreground/76">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
};

export default ExploreTimelinePageV2;
