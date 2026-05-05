import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpenText, ExternalLink, MapPinned, ScrollText } from "lucide-react";
import ForbiddenCityDeepDive from "@/components/site/ForbiddenCityDeepDive";
import StandardKnowledgeDeepDive from "@/components/site/StandardKnowledgeDeepDive";
import { getKnowledgeEntryById, getRelatedKnowledgeEntries } from "@/data/knowledgeBaseV2";
import { useKnowledgeEntries } from "@/hooks/useKnowledgeEntries";

const KnowledgeDetailPage = () => {
  const { entryId } = useParams();
  const { entries: knowledgeEntries } = useKnowledgeEntries();
  const entry = getKnowledgeEntryById(knowledgeEntries, entryId);

  if (!entry) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-6">
        <section className="rounded-[36px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-8 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
          <p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">KNOWLEDGE DETAIL</p>
          <h1 className="mt-3 text-3xl font-serif-cn font-bold">未找到对应建筑条目</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground">
            这个知识条目可能尚未接入知识库，或者当前链接已经失效。你可以先返回知识库重新检索。
          </p>
          <div className="mt-6">
            <Link
              to="/knowledge-base"
              className="inline-flex items-center gap-2 rounded-full bg-[hsl(21,54%,38%)] px-5 py-2.5 text-sm text-white shadow-[0_10px_18px_rgba(95,58,37,0.14)]"
            >
              返回知识库
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const relatedEntries = getRelatedKnowledgeEntries(knowledgeEntries, entry, 4);
  return (
    <div className="mx-auto max-w-[1480px] px-4 py-8 md:px-6 md:py-10">
      <section className="overflow-hidden rounded-[40px] border border-[rgba(129,90,53,0.18)] bg-[linear-gradient(180deg,rgba(255,251,243,0.98),rgba(240,229,208,0.96))] shadow-[0_24px_52px_rgba(120,83,49,0.12)]">
        <div className="grid gap-0 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="p-7 md:p-9">
            <Link
              to="/knowledge-base"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(129,90,53,0.12)] bg-white/82 px-4 py-2 text-sm text-foreground/76"
            >
              <ArrowLeft className="h-4 w-4" />
              返回知识库
            </Link>
            <p className="mt-6 text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">KNOWLEDGE DETAIL</p>
            <h1 className="mt-3 text-4xl font-serif-cn font-bold">{entry.name}</h1>            <p className="mt-3 text-sm tracking-[0.16em] text-muted-foreground">
              {entry.topicTitle} / {entry.dynasty} / {entry.location}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-foreground/78">{entry.summary}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {entry.keywords.slice(0, 10).map(keyword => (
                <span
                  key={keyword}
                  className="rounded-full border border-[rgba(129,90,53,0.12)] bg-white/82 px-3 py-1.5 text-xs text-foreground/76"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[ 
                { label: "建筑类型", value: entry.detail.typeLabel, icon: BookOpenText },
                { label: "所属朝代", value: entry.dynasty, icon: ScrollText },
                { label: "所在省份", value: entry.provinceName, icon: MapPinned },
              ].map(card => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/74 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs tracking-[0.18em] text-muted-foreground">{card.label}</p>
                      <Icon className="h-4 w-4 text-[hsl(28,28%,44%)]" />
                    </div>
                    <p className="mt-3 text-xl font-serif-cn font-semibold">{card.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden">
            <img src={entry.image} alt={entry.name} className="h-full min-h-[420px] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div>
          {entry.id === "forbidden-city" ? <ForbiddenCityDeepDive /> : <StandardKnowledgeDeepDive entry={entry} />}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/topics/${entry.topic}`}
              className="inline-flex items-center gap-2 rounded-full bg-[hsl(21,54%,38%)] px-4 py-2.5 text-sm text-white shadow-[0_10px_18px_rgba(95,58,37,0.14)]"
            >
              进入对应专题
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={`/explore/province/${entry.provinceCode}`}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(129,90,53,0.14)] bg-white/86 px-4 py-2.5 text-sm text-foreground/78"
            >
              查看省份分析
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <article className="rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
          <p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">TIMELINE & SOURCES</p>
          <h2 className="mt-2 text-2xl font-serif-cn font-bold">年代节点与参考来源</h2>
          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-white/82 p-4">
              <p className="text-sm font-medium text-foreground/84">年代节点</p>
              <div className="mt-3 space-y-2.5">
                {entry.detail.chronology.map(item => (
                  <div
                    key={`${item.date}-${item.event}`}
                    className="grid grid-cols-[110px_1fr] gap-3 rounded-[12px] border border-[rgba(129,90,53,0.08)] bg-[rgba(255,252,246,0.9)] px-3 py-2.5"
                  >
                    <p className="text-sm font-semibold text-[hsl(28,36%,34%)]">{item.date}</p>
                    <p className="text-sm leading-7 text-muted-foreground">{item.event}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-white/82 p-4">
              <p className="text-sm font-medium text-foreground/84">参考来源（可追溯）</p>
              <div className="mt-3 space-y-2.5">
                {entry.sources.map(source => (
                  <a
                    key={`${source.label}-${source.url}`}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[12px] border border-[rgba(129,90,53,0.08)] bg-[rgba(255,252,246,0.9)] px-3 py-2.5 transition-all hover:border-[rgba(129,90,53,0.24)] hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground/84">{source.label}</p>
                      <ExternalLink className="h-4 w-4 text-[hsl(28,30%,46%)]" />
                    </div>
                    <p className="mt-1 text-xs text-[hsl(28,24%,44%)]">{source.type}</p>
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">{source.note}</p>
                    <p className="mt-1 truncate text-xs text-[hsl(28,22%,46%)]">{source.url}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6">
        <article className="rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
          <p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">RELATED ENTRIES</p>
          <h2 className="mt-2 text-2xl font-serif-cn font-bold">相关建筑条目</h2>
          <div className="mt-5 grid gap-4">
            {relatedEntries.map(item => (
              <Link
                key={item.id}
                to={`/knowledge-base/${item.id}`}
                className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-4 transition-all hover:border-[rgba(129,90,53,0.24)] hover:shadow-[0_12px_20px_rgba(122,86,52,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-serif-cn font-bold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.topicTitle} / {item.dynasty} / {item.location}
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-foreground/72">{item.summary}</p>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default KnowledgeDetailPage;









