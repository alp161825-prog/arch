import { ExternalLink } from "lucide-react";
import type { KnowledgeEntry } from "@/data/knowledgeBaseV2";

type Props = {
  entry: KnowledgeEntry;
};

type DocxModule = NonNullable<KnowledgeEntry["docxModules"]>[number];
type DocxBlock = DocxModule["blocks"][number];

const buildCultureCards = (entry: KnowledgeEntry) => {
  if (entry.topic === "residential") {
    return [
      {
        title: "家族与生活秩序",
        desc: `${entry.name}通过院落、房间主次和日常动线，把家庭关系与生活秩序转化为可读的空间结构。`,
      },
      {
        title: "地方环境适配",
        desc: `建筑形态与${entry.location}的气候、材料和聚居方式紧密相关，体现“在地化营建”逻辑。`,
      },
      {
        title: "民居文化价值",
        desc: "该类建筑的核心意义，在于把日常生活、社会组织和地方文化长期沉淀为稳定空间样式。",
      },
    ];
  }
  if (entry.topic === "government") {
    return [
      {
        title: "行政秩序表达",
        desc: `${entry.name}通过门、院、堂、宅的递进关系，清晰呈现古代行政流程和身份层级。`,
      },
      {
        title: "公共治理空间",
        desc: "官署建筑不仅服务办公，也组织接见、审理、文书处理等公共治理活动。",
      },
      {
        title: "制度可视化价值",
        desc: "这类建筑的价值在于把抽象制度变成可进入、可观察、可解释的空间秩序。",
      },
    ];
  }
  if (entry.topic === "palace") {
    return [
      {
        title: "王权与礼制中心",
        desc: `${entry.name}作为高等级宫殿样本，通过轴线、殿庭和院落层级强化国家礼制与王权表达。`,
      },
      {
        title: "空间等级体系",
        desc: "建筑序列、台基尺度和门禁路径共同形成明确的尊卑秩序和仪式性体验。",
      },
      {
        title: "都城核心意义",
        desc: "宫殿不仅是居住或朝会空间，也常是都城政治结构与城市意象的中心节点。",
      },
    ];
  }
  return [
    {
      title: "交通秩序与跨越能力",
      desc: `${entry.name}以稳定跨越水系为核心任务，是区域交通网络中的关键基础设施。`,
    },
    {
      title: "工程技术表达",
      desc: "桥型选择、受力路径与构件组织共同决定桥梁的耐久性、通行效率与维护成本。",
    },
    {
      title: "文化与城市记忆",
      desc: "古桥常兼具地标意义，长期参与地方历史记忆、景观识别和公共空间组织。",
    },
  ];
};

const buildModule3Title = (entry: KnowledgeEntry) => {
  if (entry.topic === "bridge") return "模块3：跨越组织与空间关系";
  if (entry.topic === "government") return "模块3：官署序列与空间组织";
  if (entry.topic === "residential") return "模块3：院落组织与居住结构";
  return "模块3：空间与布局";
};

const buildModule6Title = (entry: KnowledgeEntry) => {
  if (entry.topic === "bridge") return "模块6：文化意象与交通秩序";
  if (entry.topic === "government") return "模块6：文化象征与行政秩序";
  if (entry.topic === "residential") return "模块6：文化象征与居住秩序";
  return "模块6：文化象征与礼制秩序";
};

const ensureSentenceEnd = (value: string) => (/[。！？]$/.test(value) ? value : `${value}。`);

const buildSpatialConclusions = (entry: KnowledgeEntry) => {
  const highlights = entry.detail.featureHighlights
    .slice(0, 3)
    .map(item => item.replace(/[。；\s]+$/g, "").trim())
    .filter(Boolean)
    .join("；");

  return [entry.detail.buildingOverview, entry.detail.spatialPattern, highlights ? `${entry.name}的关键空间证据包括：${highlights}` : ""]
    .map(item => item.trim())
    .filter(Boolean)
    .map(ensureSentenceEnd);
};

const parseModuleTitle = (title: string) => {
  const matched = title.match(/^模块\s*([1-7])\s*[：:]\s*(.*)$/);
  if (!matched) return { number: "", text: title };
  return { number: matched[1], text: matched[2] };
};

const cleanDocxText = (text: string) => text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\s+/g, " ").trim();

const splitClauseItems = (text: string) =>
  cleanDocxText(text)
    .split(/[；;]/)
    .map(item => item.trim().replace(/[。]$/g, ""))
    .filter(Boolean);

const splitLabelValue = (text: string) => {
  const normalized = cleanDocxText(text);
  const index = normalized.search(/[：:]/);
  if (index <= 0) return null;
  const label = normalized.slice(0, index).trim();
  const value = normalized.slice(index + 1).trim();
  if (!label || !value || label.length > 18) return null;
  return { label, value };
};

const renderDocxParagraph = (text: string, key: string) => {
  const normalized = cleanDocxText(text);
  const pair = splitLabelValue(normalized);
  if (pair) {
    return (
      <div key={key} className="rounded-[14px] border border-[rgba(129,90,53,0.12)] bg-white/88 px-4 py-3">
        <p className="text-xs tracking-[0.14em] text-[hsl(28,28%,42%)]">{pair.label}</p>
        <p className="mt-1.5 text-sm leading-8 text-muted-foreground">{pair.value}</p>
      </div>
    );
  }
  if (/^[-•]\s*/.test(normalized)) {
    const bulletText = normalized.replace(/^[-•]\s*/, "");
    return (
      <div key={key} className="rounded-[14px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
        <p className="text-sm leading-8 text-muted-foreground">{bulletText}</p>
      </div>
    );
  }

  const clauses = splitClauseItems(normalized);
  if (clauses.length >= 2 && normalized.length >= 20) {
    return (
      <div key={key} className="rounded-[14px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
        <div className="space-y-1.5">
          {clauses.map(item => (
            <div key={item} className="grid grid-cols-[10px_1fr] gap-2">
              <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-[hsl(28,34%,40%)]" />
              <p className="text-sm leading-8 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div key={key} className="rounded-[14px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
      <p className="text-sm leading-8 text-muted-foreground whitespace-pre-wrap">{normalized}</p>
    </div>
  );
};

const renderDocxModuleBlock = (block: DocxBlock, blockIndex: number) => {
  if (block.type === "paragraph") {
    return renderDocxParagraph(block.text, `paragraph-${blockIndex}`);
  }

  const rows = block.rows.filter(row => row.length > 0);
  if (rows.length === 0) return null;
  const firstRow = rows[0].map(item => item.trim());
  const hasHeader = firstRow.length >= 2 && firstRow[0] === "项目" && firstRow[1] === "内容";
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const normalizedRows = dataRows
    .map(row => ({
      label: (row[0] ?? "").trim(),
      value: row.slice(1).join(" / ").trim(),
    }))
    .filter(item => item.label && item.value);

  if (normalizedRows.length === 0) {
    return (
      <div key={`table-fallback-${blockIndex}`} className="space-y-2">
        {rows.map((row, rowIndex) => (
          <p key={`row-text-${rowIndex}`} className="text-sm leading-8 text-muted-foreground">
            {row.join(" / ")}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div key={`table-${blockIndex}`} className="grid gap-3 md:grid-cols-2">
      {normalizedRows.map((item, rowIndex) => (
        <div key={`kv-${blockIndex}-${rowIndex}`} className="rounded-[14px] border border-[rgba(129,90,53,0.12)] bg-white/88 px-4 py-3">
          <p className="text-xs tracking-[0.14em] text-[hsl(28,28%,42%)]">{item.label}</p>
          <p className="mt-1.5 text-sm leading-8 text-muted-foreground">{cleanDocxText(item.value)}</p>
        </div>
      ))}
    </div>
  );
};

const StandardKnowledgeDeepDive = ({ entry }: Props) => {
  const cultureCards = buildCultureCards(entry);
  const spatialConclusions = buildSpatialConclusions(entry);
  const docxModules = entry.docxModules ?? [];
  const orderedDocxModules = [...docxModules].sort((a, b) => {
    const aNo = Number(parseModuleTitle(a.title).number || 999);
    const bNo = Number(parseModuleTitle(b.title).number || 999);
    return aNo - bNo;
  });

  if (orderedDocxModules.length > 0) {
    return (
      <article className="rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
        <p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">BUILDING INTERPRETATION</p>
        <h2 className="mt-2 text-2xl font-serif-cn font-bold">建筑详细解读（七模块）</h2>
        {orderedDocxModules.map((module, moduleIndex) => (
          <section
            key={`${module.title}-${moduleIndex}`}
            className={`${moduleIndex === 0 ? "mt-6" : "mt-5"} rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5`}
          >
            <h3 className="text-xl font-serif-cn font-bold">{module.title}</h3>
            <div className="mt-4 space-y-3">
              {module.blocks.map((block, blockIndex) => renderDocxModuleBlock(block, blockIndex))}
            </div>
          </section>
        ))}
      </article>
    );
  }

  return (
    <article className="rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
      <p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">BUILDING INTERPRETATION</p>
      <h2 className="mt-2 text-2xl font-serif-cn font-bold">建筑详细解读（七模块）</h2>

      <section className="mt-6 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块1：身份档案</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            { label: "建筑名称", value: entry.name },
            { label: "建筑类型", value: entry.detail.typeLabel },
            { label: "所属专题", value: entry.topicTitle },
            { label: "所属朝代", value: entry.dynasty },
            { label: "所在地区", value: entry.location },
            { label: "所属省份", value: entry.provinceName },
          ].map(item => (
            <div key={item.label} className="rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-xs tracking-[0.14em] text-muted-foreground">{item.label}</p>
              <p className="mt-1.5 text-sm leading-7 text-foreground/84">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块2：历史语境与功能定位</h3>
        <div className="mt-4 space-y-3">
          <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
            <p className="text-sm font-medium text-foreground/84">功能定位</p>
            <p className="mt-2 text-sm leading-8 text-muted-foreground">{entry.detail.functionDescription}</p>
          </div>
          <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
            <p className="text-sm font-medium text-foreground/84">时代背景</p>
            <p className="mt-2 text-sm leading-8 text-muted-foreground">{entry.detail.eraContext}</p>
          </div>
          <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
            <p className="text-sm font-medium text-foreground/84">建造背景</p>
            <p className="mt-2 text-sm leading-8 text-muted-foreground">{entry.detail.constructionBackground}</p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">{buildModule3Title(entry)}</h3>
        <div className="mt-4 grid gap-3">
          <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
            <p className="text-sm font-medium text-foreground/84">空间模式</p>
            <p className="mt-2 text-sm leading-8 text-muted-foreground">{entry.detail.spatialPattern}</p>
          </div>
          <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
            <p className="text-sm font-medium text-foreground/84">空间解读结论</p>
            <div className="mt-2 space-y-2">
              {spatialConclusions.map(item => (
                <p key={item} className="text-sm leading-8 text-muted-foreground">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块4：结构与技术</h3>
        <div className="mt-4 space-y-3">
          <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
            <p className="text-sm font-medium text-foreground/84">结构与材料体系</p>
            <p className="mt-2 text-sm leading-8 text-muted-foreground">{entry.detail.structureMaterial}</p>
          </div>
          {entry.detail.featureHighlights.slice(0, 2).map(item => (
            <div key={item} className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-sm leading-8 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块5：材料、装饰与视觉特征</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
            <p className="text-sm font-medium text-foreground/84">视觉识别特征</p>
            <div className="mt-2 space-y-1.5">
              {entry.detail.featureHighlights.slice(0, 3).map(item => (
                <p key={item} className="text-sm leading-8 text-muted-foreground">{item}</p>
              ))}
            </div>
          </div>
          <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
            <p className="text-sm font-medium text-foreground/84">核心识别词</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.keywords.slice(0, 12).map(keyword => (
                <span key={keyword} className="rounded-full border border-[rgba(129,90,53,0.12)] bg-white/85 px-3 py-1.5 text-xs text-foreground/76">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">{buildModule6Title(entry)}</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {cultureCards.map(item => (
            <div key={item.title} className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-sm font-medium text-foreground/84">{item.title}</p>
              <p className="mt-2 text-sm leading-8 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块7：演变、保护与当代认知</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-4">
            <p className="text-sm font-medium text-foreground/84">关键年代节点</p>
            <div className="mt-3 space-y-2.5">
              {entry.detail.chronology.map(item => (
                <div
                  key={`${item.date}-${item.event}`}
                  className="grid grid-cols-[108px_1fr] gap-3 rounded-[12px] border border-[rgba(129,90,53,0.08)] bg-white/86 px-3 py-2.5"
                >
                  <p className="text-sm font-semibold text-[hsl(28,36%,34%)]">{item.date}</p>
                  <p className="text-sm leading-7 text-muted-foreground">{item.event}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-sm font-medium text-foreground/84">历史价值</p>
              <p className="mt-2 text-sm leading-8 text-muted-foreground">{entry.detail.historicalValue}</p>
            </div>
            <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-sm font-medium text-foreground/84">当代意义</p>
              <p className="mt-2 text-sm leading-8 text-muted-foreground">{entry.detail.currentStatus}</p>
            </div>
            <div className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-4">
              <p className="text-sm font-medium text-foreground/84">参考来源</p>
              <div className="mt-2 space-y-2">
                {entry.sources.map(source => (
                  <a
                    key={`${source.label}-${source.url}`}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-[10px] border border-[rgba(129,90,53,0.08)] bg-white/86 px-3 py-2 text-sm text-foreground/80 hover:border-[rgba(129,90,53,0.22)]"
                  >
                    <span className="truncate">{source.label}</span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-[hsl(28,30%,46%)]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default StandardKnowledgeDeepDive;

