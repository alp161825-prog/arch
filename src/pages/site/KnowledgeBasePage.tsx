import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Clock3, Database, MapPinned, Network, Search } from "lucide-react";
import { knowledgeTopics } from "@/data/knowledgeBaseV2";
import { useKnowledgeEntries } from "@/hooks/useKnowledgeEntries";

const topicColorMap = Object.fromEntries(
  knowledgeTopics.map(item => [item.key, item.accent] as const)
) as Record<string, string>;

const moduleOptions = [
  { key: "search", label: "搜索查询", english: "SEARCH", icon: Search, title: "搜索查询", description: "按建筑名称、专题、朝代与省份组合检索，横向查看结果列表与知识卡片。" },
  { key: "overview", label: "总体概览", english: "OVERVIEW", icon: Database, title: "总体概览", description: "从条目规模、覆盖范围与热点区域快速把握知识库全貌。" },
  { key: "analysis", label: "统计分析", english: "ANALYSIS", icon: BarChart3, title: "统计分析", description: "集中查看领域分布、时间层次、关键词排行与专题占比。" },
  { key: "timeline", label: "时间视图", english: "TIMELINE", icon: Clock3, title: "时间视图", description: "把知识条目放回时间带中，横向观察不同朝代的代表样本如何演进。" },
  { key: "graph", label: "关系图谱", english: "GRAPH", icon: Network, title: "关系图谱", description: "把专题、朝代、建筑与省份连接成一张大图，展示知识组织逻辑。" },
] as const;

type ModuleKey = (typeof moduleOptions)[number]["key"];

const cn = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

const KnowledgeBasePage = () => {
  const {
    entries: knowledgeEntries,
    dynasties: knowledgeDynasties,
    provinces: knowledgeProvinces,
  } = useKnowledgeEntries();
  const [activeModule, setActiveModule] = useState<ModuleKey>("search");
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [dynastyFilter, setDynastyFilter] = useState<string>("all");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string>("");
  const [activeTimelineDynasty, setActiveTimelineDynasty] = useState<string>(knowledgeDynasties[0] ?? "先秦");
  const hasSearchIntent = search.trim().length > 0 || topicFilter !== "all" || dynastyFilter !== "all" || provinceFilter !== "all";

  useEffect(() => {
    if (!selectedId && knowledgeEntries[0]?.id) {
      setSelectedId(knowledgeEntries[0].id);
    }
  }, [knowledgeEntries, selectedId]);

  useEffect(() => {
    if (!activeTimelineDynasty && knowledgeDynasties[0]) {
      setActiveTimelineDynasty(knowledgeDynasties[0]);
    }
  }, [activeTimelineDynasty, knowledgeDynasties]);

  const filteredEntries = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return knowledgeEntries.filter(item => {
      const matchKeyword = !keyword || [item.name, item.topicTitle, item.dynasty, item.location, item.summary, ...item.keywords].join(" ").toLowerCase().includes(keyword);
      const matchTopic = topicFilter === "all" || item.topic === topicFilter;
      const matchDynasty = dynastyFilter === "all" || item.dynasty === dynastyFilter;
      const matchProvince = provinceFilter === "all" || item.provinceName === provinceFilter;
      return matchKeyword && matchTopic && matchDynasty && matchProvince;
    });
  }, [search, topicFilter, dynastyFilter, provinceFilter, knowledgeEntries]);

  const selectedEntry = filteredEntries.find(item => item.id === selectedId) ?? filteredEntries[0] ?? knowledgeEntries[0];

  const overviewCards = useMemo(() => {
    const provinces = new Set(filteredEntries.map(item => item.provinceName));
    const dynasties = new Set(filteredEntries.map(item => item.dynasty));
    const topics = new Set(filteredEntries.map(item => item.topic));
    return [
      { label: "知识条目", value: String(filteredEntries.length), icon: Database },
      { label: "覆盖省份", value: String(provinces.size), icon: MapPinned },
      { label: "时间层次", value: String(dynasties.size), icon: Clock3 },
      { label: "关联专题", value: String(topics.size), icon: Search },
    ];
  }, [filteredEntries]);

  const topicStats = useMemo(() => knowledgeTopics.map(topic => {
    const items = filteredEntries.filter(entry => entry.topic === topic.key);
    return { ...topic, count: items.length };
  }), [filteredEntries]);

  const dynastyStats = useMemo(() => knowledgeDynasties.map(dynasty => {
    const items = filteredEntries.filter(entry => entry.dynasty === dynasty);
    return { dynasty, count: items.length };
  }), [filteredEntries, knowledgeDynasties]);

  const provinceStats = useMemo(() => {
    const map = new Map<string, { provinceName: string; count: number }>();
    filteredEntries.forEach(item => {
      const current = map.get(item.provinceName);
      if (current) {
        current.count += 1;
      } else {
        map.set(item.provinceName, { provinceName: item.provinceName, count: 1 });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [filteredEntries]);

  const keywordStats = useMemo(() => {
    const counter = new Map<string, number>();
    filteredEntries.forEach(item => {
      item.keywords.forEach(keyword => {
        if (keyword.length < 2) return;
        counter.set(keyword, (counter.get(keyword) ?? 0) + 1);
      });
    });
    return Array.from(counter.entries()).map(([keyword, count]) => ({ keyword, count })).sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword, "zh-CN")).slice(0, 12);
  }, [filteredEntries]);

  const topicShare = useMemo(() => {
    const total = filteredEntries.length || 1;
    return topicStats.filter(item => item.count > 0).map(item => ({ ...item, percent: Math.round((item.count / total) * 100) }));
  }, [filteredEntries, topicStats]);

  const topicRingStyle = useMemo(() => {
    if (!topicShare.length) return { background: "conic-gradient(#d8c7b0 0deg 360deg)" };
    let cursor = 0;
    const stops = topicShare.map(item => {
      const start = cursor;
      const end = cursor + (item.count / (filteredEntries.length || 1)) * 360;
      cursor = end;
      return `${item.accent} ${start}deg ${end}deg`;
    });
    return { background: `conic-gradient(${stops.join(", ")})` };
  }, [filteredEntries.length, topicShare]);
  const timelineEntries = useMemo(() => filteredEntries.filter(item => item.dynasty === activeTimelineDynasty).slice(0, 10), [activeTimelineDynasty, filteredEntries]);

  const graphData = useMemo(() => {
    const sampleEntries = filteredEntries.slice(0, 12);
    const topicNodes = knowledgeTopics.filter(topic => sampleEntries.some(entry => entry.topic === topic.key)).map((topic, index) => ({ id: `topic-${topic.key}`, label: topic.title, x: 180, y: 120 + index * 145, color: topic.accent }));
    const dynastyNodes = Array.from(new Set(sampleEntries.map(entry => entry.dynasty))).map((dynasty, index) => ({ id: `dynasty-${dynasty}`, label: dynasty, x: 560, y: 90 + index * 88, color: "#a8733a" }));
    const buildingNodes = sampleEntries.map((entry, index) => ({ id: `building-${entry.id}`, label: entry.name, x: 980, y: 70 + index * 52, color: topicColorMap[entry.topic], topicId: `topic-${entry.topic}`, dynastyId: `dynasty-${entry.dynasty}` }));
    const provinceNodes = Array.from(new Set(sampleEntries.map(entry => entry.provinceName))).map((province, index) => ({ id: `province-${province}`, label: province, x: 1450, y: 120 + index * 108, color: "#6d8e9d" }));
    const provinceByBuilding = new Map(sampleEntries.map(entry => [entry.id, `province-${entry.provinceName}`]));
    const links = [
      ...buildingNodes.map(node => ({ from: node.topicId, to: node.id, color: node.color })),
      ...buildingNodes.map(node => ({ from: node.dynastyId, to: node.id, color: "#b28552" })),
      ...buildingNodes.map(node => ({ from: node.id, to: provinceByBuilding.get(node.id.replace("building-", "")) ?? "", color: "#8ea6b2" })).filter(link => link.to),
    ];
    return { nodes: [...topicNodes, ...dynastyNodes, ...buildingNodes, ...provinceNodes], links };
  }, [filteredEntries]);

  const maxTopicCount = Math.max(...topicStats.map(item => item.count), 1);
  const maxDynastyCount = Math.max(...dynastyStats.map(item => item.count), 1);
  const maxProvinceCount = Math.max(...provinceStats.map(item => item.count), 1);
  const maxKeywordCount = Math.max(...keywordStats.map(item => item.count), 1);
  const matrixRows = provinceStats.slice(0, 4);
  const matrixColumns = knowledgeTopics;
  const activeModuleMeta = moduleOptions.find(item => item.key === activeModule) ?? moduleOptions[0];

  return (
    <div className="mx-auto max-w-[1760px] px-4 py-8 md:px-6 md:py-10">
      <section className="overflow-hidden rounded-[40px] border border-[rgba(129,90,53,0.18)] bg-[linear-gradient(180deg,rgba(255,251,243,0.98),rgba(240,229,208,0.96))] shadow-[0_24px_52px_rgba(120,83,49,0.12)]">
        <div className="relative px-6 py-8 md:px-8 md:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(214,174,111,0.2),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(157,102,54,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]" />
          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm tracking-[0.24em] text-[hsl(28,28%,48%)]">KNOWLEDGE BASE</p>
              <h1 className="mt-2 text-4xl font-serif-cn font-bold">古代建筑知识库系统</h1>            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/72 px-4 py-4 backdrop-blur-sm"><p className="text-xs tracking-[0.18em] text-muted-foreground">可检索</p><p className="mt-2 text-lg font-serif-cn font-semibold">搜索查询</p></div>
              <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/72 px-4 py-4 backdrop-blur-sm"><p className="text-xs tracking-[0.18em] text-muted-foreground">可分析</p><p className="mt-2 text-lg font-serif-cn font-semibold">统计与时序</p></div>
              <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/72 px-4 py-4 backdrop-blur-sm"><p className="text-xs tracking-[0.18em] text-muted-foreground">可组织</p><p className="mt-2 text-lg font-serif-cn font-semibold">关系图谱</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-4 shadow-[0_18px_34px_rgba(122,86,52,0.08)] md:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {moduleOptions.map(item => {
            const active = activeModule === item.key;
            const Icon = item.icon;
            return <button key={item.key} onClick={() => setActiveModule(item.key)} className={cn("rounded-[24px] border px-4 py-4 text-left transition-all", active ? "border-transparent text-white shadow-[0_16px_28px_rgba(95,58,37,0.16)]" : "border-[rgba(129,90,53,0.12)] bg-white/78 hover:border-[rgba(129,90,53,0.2)]")} style={active ? { background: "linear-gradient(135deg,#8f5b33,#c99857)" } : undefined}><div className="flex items-center justify-between gap-3"><p className={cn("text-xs tracking-[0.18em]", active ? "text-white/72" : "text-muted-foreground")}>{item.english}</p><Icon className={cn("h-4 w-4", active ? "text-white/88" : "text-[hsl(28,28%,44%)]")} /></div><p className="mt-3 text-lg font-serif-cn font-semibold">{item.label}</p></button>;
          })}
        </div>
      </section>

      <section className="mt-6 rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div><p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">{activeModuleMeta.english}</p><h2 className="mt-2 text-3xl font-serif-cn font-bold">{activeModuleMeta.title}</h2></div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{activeModuleMeta.description}</p>
        </div>
      </section>
      {activeModule === "search" && <section className="mt-6 space-y-5">
        <article className="rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
          <div className="grid gap-3 lg:grid-cols-[1.6fr_repeat(3,minmax(0,0.72fr))]">
            <label className="flex items-center gap-3 rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/88 px-5 py-4"><Search className="h-4 w-4 text-[hsl(28,28%,44%)]" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="输入建筑名称、专题关键词、地点或说明" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label>
            <select value={topicFilter} onChange={event => setTopicFilter(event.target.value)} className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/88 px-4 py-4 text-sm outline-none"><option value="all">全部专题</option>{knowledgeTopics.map(item => <option key={item.key} value={item.key}>{item.title}</option>)}</select>
            <select value={dynastyFilter} onChange={event => setDynastyFilter(event.target.value)} className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/88 px-4 py-4 text-sm outline-none"><option value="all">全部朝代</option>{knowledgeDynasties.map(item => <option key={item} value={item}>{item}</option>)}</select>
            <select value={provinceFilter} onChange={event => setProvinceFilter(event.target.value)} className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/88 px-4 py-4 text-sm outline-none"><option value="all">全部省份</option>{knowledgeProvinces.map(item => <option key={item} value={item}>{item}</option>)}</select>
          </div>
        </article>

        {hasSearchIntent ? <section className="grid gap-5">
          <article className="rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
            <div className="flex items-center justify-between"><p className="text-sm font-medium text-foreground/78">检索结果</p><span className="rounded-full border border-[rgba(129,90,53,0.12)] bg-white/88 px-3 py-1 text-xs text-muted-foreground">{filteredEntries.length} 条</span></div>
            {filteredEntries.length ? <div className="mt-4 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{filteredEntries.map(item => <article key={item.id} className={cn("rounded-[24px] border px-5 py-5 transition-all", selectedEntry?.id === item.id ? "border-transparent text-white shadow-[0_14px_26px_rgba(95,58,37,0.18)]" : "border-[rgba(129,90,53,0.12)] bg-white/88 text-foreground hover:border-[rgba(129,90,53,0.22)]")} style={selectedEntry?.id === item.id ? { backgroundColor: topicColorMap[item.topic] } : undefined}><div className="flex items-start justify-between gap-3"><div><p className="text-2xl font-serif-cn font-bold">{item.name}</p><p className={cn("mt-2 text-sm", selectedEntry?.id === item.id ? "text-white/78" : "text-muted-foreground")}>{item.dynasty} / {item.location}</p></div><span className={cn("rounded-full px-2.5 py-1 text-[11px]", selectedEntry?.id === item.id ? "bg-white/16 text-white" : "bg-[rgba(129,90,53,0.08)] text-foreground/72")}>{item.topicTitle}</span></div><p className={cn("mt-4 line-clamp-4 text-sm leading-8", selectedEntry?.id === item.id ? "text-white/88" : "text-foreground/72")}>{item.summary}</p><div className="mt-5 flex flex-wrap gap-2">{item.keywords.slice(0, 4).map(keyword => <span key={keyword} className={cn("rounded-full px-3 py-1 text-[11px]", selectedEntry?.id === item.id ? "bg-white/14 text-white/88" : "border border-[rgba(129,90,53,0.12)] bg-white/86 text-foreground/68")}>{keyword}</span>)}</div><div className="mt-5 flex flex-wrap gap-3"><button onClick={() => setSelectedId(item.id)} className={cn("inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs transition-colors", selectedEntry?.id === item.id ? "bg-white/16 text-white hover:bg-white/22" : "border border-[rgba(129,90,53,0.12)] bg-white/88 text-foreground/76 hover:border-[rgba(129,90,53,0.2)]")}>选中条目</button><Link to={`/knowledge-base/${item.id}`} className={cn("inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs transition-colors", selectedEntry?.id === item.id ? "bg-white/16 text-white hover:bg-white/22" : "border border-[rgba(129,90,53,0.12)] bg-white/88 text-foreground/76 hover:border-[rgba(129,90,53,0.2)]")}>查看详情<ArrowRight className="h-3.5 w-3.5" /></Link></div></article>)}</div> : <div className="mt-4 rounded-[24px] border border-dashed border-[rgba(129,90,53,0.18)] bg-white/74 px-5 py-10 text-sm leading-7 text-muted-foreground">当前筛选条件下没有匹配条目，可以更换关键词，或放宽专题、朝代、省份条件。</div>}
          </article>
        </section> : null}
      </section>}

      {activeModule === "overview" && <section className="mt-6 space-y-6"><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{overviewCards.map(card => { const Icon = card.icon; return <article key={card.label} className="rounded-[28px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-5 shadow-[0_18px_30px_rgba(122,86,52,0.08)]"><div className="flex items-center justify-between"><p className="text-sm tracking-[0.18em] text-[hsl(28,28%,48%)]">{card.label}</p><Icon className="h-4 w-4 text-[hsl(28,28%,44%)]" /></div><p className="mt-4 text-4xl font-serif-cn font-bold">{card.value}</p></article>; })}</section><section className="grid gap-5 xl:grid-cols-[0.96fr_1.04fr]"><article className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-5 shadow-[0_18px_30px_rgba(122,86,52,0.08)]"><p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">PROVINCE OVERVIEW</p><h2 className="mt-2 text-2xl font-serif-cn font-bold">总体概览</h2><div className="mt-5 space-y-4">{provinceStats.map(item => <div key={item.provinceName}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><p className="font-medium text-foreground/82">{item.provinceName}</p><p className="text-muted-foreground">{item.count} 条</p></div><div className="h-3 overflow-hidden rounded-full bg-[rgba(129,90,53,0.08)]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#7c4d32,#c6974f)]" style={{ width: `${(item.count / maxProvinceCount) * 100}%` }} /></div></div>)}</div></article><article className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-5 shadow-[0_18px_30px_rgba(122,86,52,0.08)]"><p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">SYSTEM IDEA</p><h2 className="mt-2 text-2xl font-serif-cn font-bold">知识库设计说明</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{[["搜索查询","支持按建筑名称、朝代、专题和省份进行组合检索，形成面向展陈与讲解的可用入口。"],["总体概览","用统一指标展示样本规模、覆盖区域和时间层次，帮助快速把握知识库全貌。"],["领域分析","按民居、官署、宫殿、桥梁四大专题组织知识结构，体现项目的分类逻辑与主题深度。"],["时间分析","把先秦到明清的建筑样本放到同一时间线上，便于观察建筑类型如何萌芽、成熟与分化。"]].map(([title, desc]) => <div key={title} className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/78 p-4"><p className="text-sm font-medium text-foreground">{title}</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{desc}</p></div>)}</div></article></section></section>}
      {activeModule === "analysis" && <section className="mt-6 space-y-6"><section className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]"><article className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-5 shadow-[0_18px_30px_rgba(122,86,52,0.08)]"><p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">DOMAIN ANALYSIS</p><h2 className="mt-2 text-2xl font-serif-cn font-bold">领域分析</h2><div className="mt-5 space-y-4">{topicStats.map(item => <div key={item.key}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><p className="font-medium text-foreground/82">{item.title}</p><p className="text-muted-foreground">{item.count} 条</p></div><div className="h-3 overflow-hidden rounded-full bg-[rgba(129,90,53,0.08)]"><div className="h-full rounded-full" style={{ width: `${(item.count / maxTopicCount) * 100}%`, backgroundColor: item.accent }} /></div></div>)}</div></article><article className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-5 shadow-[0_18px_30px_rgba(122,86,52,0.08)]"><p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">TIME ANALYSIS</p><h2 className="mt-2 text-2xl font-serif-cn font-bold">时间分析</h2><div className="mt-5 grid gap-3">{dynastyStats.map(item => <div key={item.dynasty} className="rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-white/78 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-foreground/82">{item.dynasty}</p><p className="text-muted-foreground">{item.count} 条</p></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[rgba(129,90,53,0.08)]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#9b5c35,#d2a45d)]" style={{ width: `${(item.count / maxDynastyCount) * 100}%` }} /></div></div>)}</div></article></section><section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]"><article className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-5 shadow-[0_18px_30px_rgba(122,86,52,0.08)]"><p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">KEYWORD RANKING</p><h2 className="mt-2 text-2xl font-serif-cn font-bold">关键词排行</h2><div className="mt-5 space-y-3">{keywordStats.map((item, index) => <div key={item.keyword} className="grid grid-cols-[30px_1fr_auto] items-center gap-3"><p className="text-sm font-medium text-[hsl(28,28%,44%)]">{index + 1}</p><div><div className="mb-2 flex items-center justify-between gap-3 text-sm"><p className="font-medium text-foreground/82">{item.keyword}</p><p className="text-muted-foreground">{item.count} 次</p></div><div className="h-2.5 overflow-hidden rounded-full bg-[rgba(129,90,53,0.08)]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#8f5b33,#c99958)]" style={{ width: `${(item.count / maxKeywordCount) * 100}%` }} /></div></div><span className="rounded-full border border-[rgba(129,90,53,0.1)] bg-white/82 px-2 py-1 text-[11px] text-foreground/68">高频</span></div>)}</div></article><article className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-5 shadow-[0_18px_30px_rgba(122,86,52,0.08)]"><p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">TOPIC SHARE</p><h2 className="mt-2 text-2xl font-serif-cn font-bold">专题占比环图</h2><div className="mt-5 grid gap-5 lg:grid-cols-[260px_1fr] lg:items-center"><div className="flex justify-center"><div className="relative h-56 w-56 rounded-full shadow-[inset_0_0_0_1px_rgba(129,90,53,0.08)]" style={topicRingStyle}><div className="absolute inset-[26px] rounded-full bg-[linear-gradient(180deg,rgba(255,251,245,0.98),rgba(245,236,221,0.98))] shadow-[inset_0_0_0_1px_rgba(129,90,53,0.08)]" /><div className="absolute inset-0 flex flex-col items-center justify-center"><p className="text-xs tracking-[0.18em] text-muted-foreground">专题结构</p><p className="mt-2 text-3xl font-serif-cn font-bold">{filteredEntries.length}</p><p className="mt-1 text-sm text-muted-foreground">条知识项</p></div></div></div><div className="space-y-3">{topicShare.map(item => <div key={item.key} className="rounded-[18px] border border-[rgba(129,90,53,0.1)] bg-white/78 px-4 py-3"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.accent }} /><p className="text-sm font-medium text-foreground/82">{item.title}</p></div><p className="text-sm text-muted-foreground">{item.count} 条 / {item.percent}%</p></div></div>)}</div></div></article></section><section><article className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-5 shadow-[0_18px_30px_rgba(122,86,52,0.08)]"><p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">HOT PROVINCE MATRIX</p><h2 className="mt-2 text-2xl font-serif-cn font-bold">热点省份矩阵</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">用热点省份与四类专题交叉观察当前知识库的分布密度，颜色越深说明该省份在这一专题中的知识条目越集中。</p><div className="mt-5 overflow-x-auto"><div className="min-w-[720px]"><div className="grid grid-cols-[180px_repeat(4,minmax(0,1fr))] gap-3"><div />{matrixColumns.map(column => <div key={column.key} className="rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-white/78 px-4 py-3 text-center text-sm font-medium text-foreground/82">{column.title}</div>)}{matrixRows.map(row => <div key={row.provinceName} className="contents"><div className="rounded-[18px] border border-[rgba(129,90,53,0.12)] bg-white/78 px-4 py-4 text-sm font-medium text-foreground/82">{row.provinceName}</div>{matrixColumns.map(column => { const count = filteredEntries.filter(item => item.provinceName === row.provinceName && item.topic === column.key).length; const intensity = count === 0 ? 0.08 : Math.min(0.24 + count * 0.12, 0.92); return <div key={`${row.provinceName}-${column.key}`} className="rounded-[18px] border border-[rgba(129,90,53,0.08)] px-4 py-4 text-center" style={{ backgroundColor: count === 0 ? "rgba(255,255,255,0.72)" : `${column.accent}${Math.round(intensity * 255).toString(16).padStart(2, "0")}` }}><p className="text-2xl font-serif-cn font-bold text-foreground/82">{count}</p><p className="mt-1 text-xs text-muted-foreground">条目</p></div>; })}</div>)}</div></div></div></article></section></section>}

      {activeModule === "timeline" && <section className="mt-6 space-y-6"><section className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-5 shadow-[0_18px_30px_rgba(122,86,52,0.08)]"><p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">TIMELINE VIEW</p><h2 className="mt-2 text-2xl font-serif-cn font-bold">时间轴知识视图</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">把知识条目直接放回朝代时间带中，点击不同朝代后，横向查看该阶段的代表建筑样本。</p><div className="mt-5 flex flex-wrap gap-3">{knowledgeDynasties.map(item => { const active = item === activeTimelineDynasty; return <button key={item} onClick={() => setActiveTimelineDynasty(item)} className={cn("rounded-full px-4 py-2.5 text-sm transition-all", active ? "text-white shadow-[0_12px_20px_rgba(95,58,37,0.14)]" : "border border-[rgba(129,90,53,0.12)] bg-white/82 text-foreground/78")} style={active ? { backgroundColor: "#8f5b33" } : undefined}>{item}</button>; })}</div><div className="mt-6 overflow-x-auto pb-2"><div className="min-w-[1200px]"><div className="relative h-2 rounded-full bg-[rgba(129,90,53,0.12)]"><div className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#8f5b33,#d2a45d)]" style={{ width: "100%" }} /></div><div className="mt-3 grid grid-cols-6 gap-6">{knowledgeDynasties.map(item => <div key={`${item}-label`} className="text-center text-sm tracking-[0.12em] text-muted-foreground">{item}</div>)}</div></div></div><div className="mt-6 flex gap-4 overflow-x-auto pb-2">{timelineEntries.length ? timelineEntries.map(item => <article key={item.id} className="min-w-[320px] rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/84 p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-lg font-serif-cn font-bold">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{item.topicTitle} / {item.location}</p></div></div><p className="mt-4 text-sm leading-7 text-foreground/74">{item.summary}</p></article>) : <div className="rounded-[20px] border border-dashed border-[rgba(129,90,53,0.16)] bg-white/70 px-4 py-8 text-sm text-muted-foreground">当前筛选条件下，这个朝代暂时没有可展示条目。</div>}</div></section></section>}

      {activeModule === "graph" && <section className="mt-6"><article className="rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.88)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]"><div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">KNOWLEDGE GRAPH</p><h2 className="mt-2 text-3xl font-serif-cn font-bold">知识图谱关系页</h2></div><p className="max-w-2xl text-sm leading-7 text-muted-foreground">把建筑、专题、朝代与省份连接成同一张大图，让知识库不再是孤立卡片，而是一套有组织的知识网络。</p></div><div className="mt-6 overflow-hidden rounded-[28px] border border-[rgba(129,90,53,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(241,233,218,0.96))] p-5"><div className="overflow-x-auto"><svg viewBox="0 0 1680 760" className="min-w-[1480px] w-full">{graphData.links.map((link, index) => { const from = graphData.nodes.find(node => node.id === link.from); const to = graphData.nodes.find(node => node.id === link.to); if (!from || !to) return null; return <path key={`${link.from}-${link.to}-${index}`} d={`M ${from.x} ${from.y} C ${(from.x + to.x) / 2} ${from.y}, ${(from.x + to.x) / 2} ${to.y}, ${to.x} ${to.y}`} fill="none" stroke={link.color} strokeOpacity="0.34" strokeWidth="2.8" />; })}{graphData.nodes.map(node => <g key={node.id}><circle cx={node.x} cy={node.y} r={node.id.startsWith("building-") ? 11 : 9} fill={node.color} /><circle cx={node.x} cy={node.y} r={node.id.startsWith("building-") ? 22 : 16} fill={node.color} opacity="0.12" /><rect x={node.x + 18} y={node.y - 20} width={Math.max(110, node.label.length * 18)} height="38" rx="19" fill="rgba(255,255,255,0.94)" stroke="rgba(129,90,53,0.12)" /><text x={node.x + 34} y={node.y + 4} fontSize="16" fill="#5d4b3a">{node.label}</text></g>)}</svg></div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-4"><p className="text-sm font-medium text-foreground/82">阅读方式</p><p className="mt-2 text-sm leading-7 text-muted-foreground">左侧是专题节点，中间是朝代节点，右侧是建筑与省份节点，线条表示知识归属与关联方向。</p></div><div className="rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-4"><p className="text-sm font-medium text-foreground/82">图谱意义</p><p className="mt-2 text-sm leading-7 text-muted-foreground">这一屏把知识条目之间的归属、并列与跨地域关系集中展开，方便直观看清项目的知识组织逻辑。</p></div></div></article></section>}
    </div>
  );
};

export default KnowledgeBasePage;










