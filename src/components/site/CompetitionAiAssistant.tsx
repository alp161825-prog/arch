import { Fragment, useEffect, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Copy, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { requestDeepSeekChat, type DeepSeekMessage } from "@/lib/ai/deepseek";

type AssistantMode = "free" | "interpret" | "timeline" | "structure" | "compare";

type Props = {
  title: string;
  subtitle: string;
  accent: string;
  contextTitle: string;
  contextSummary: string;
  contextBullets: string[];
  contextText: string;
  initialQuestion?: string;
  badge?: string;
  onAnswerGenerated?: (payload: { question: string; answer: string; mode: AssistantMode }) => void;
};

const modeMeta: Record<AssistantMode, { label: string; hint: string }> = {
  free: {
    label: "自由问答",
    hint: "围绕中国古代建筑、案例、历史背景和参观理解自由提问",
  },
  interpret: {
    label: "页面解读",
    hint: "把当前页面最重要的信息解释清楚",
  },
  timeline: {
    label: "时间脉络",
    hint: "突出建筑类型的演变阶段与前后变化",
  },
  structure: {
    label: "结构解析",
    hint: "解释空间组织、构造特点和观看重点",
  },
  compare: {
    label: "局部对比",
    hint: "比较当前案例与同主题对象的差异",
  },
};

const normalizeError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  if (/Failed to fetch/i.test(message)) {
    return "问答接口不可达。若为本地开发，请先启动 `npm run proxy`；若为线上环境，请确认已部署 `/api/deepseek/chat`。";
  }

  if (/404/.test(message)) {
    return "未找到问答接口 `/api/deepseek/chat`，请确认 Vercel 已部署最新代码。";
  }

  if (/500/.test(message)) {
    return "问答接口已连接，但服务端配置异常。请检查 `DEEPSEEK_API_KEY` 等环境变量。";
  }

  return message;
};

const renderInlineMarkdown = (text: string): ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`strong-${index}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`code-${index}`}
          className="rounded-md bg-[rgba(129,90,53,0.1)] px-1.5 py-0.5 text-[0.92em] text-[hsl(25,40%,30%)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <Fragment key={`text-${index}`}>{part}</Fragment>;
  });
};

const renderMarkdownDocument = (content: string) => {
  const lines = content.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let orderedBuffer: string[] = [];

  const flushLists = () => {
    if (bulletBuffer.length) {
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="list-disc space-y-2 pl-6 text-foreground/84">
          {bulletBuffer.map((item, index) => (
            <li key={`ul-item-${index}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>,
      );
      bulletBuffer = [];
    }

    if (orderedBuffer.length) {
      nodes.push(
        <ol key={`ol-${nodes.length}`} className="list-decimal space-y-2 pl-6 text-foreground/84">
          {orderedBuffer.map((item, index) => (
            <li key={`ol-item-${index}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>,
      );
      orderedBuffer = [];
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      flushLists();
      return;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      if (orderedBuffer.length) flushLists();
      bulletBuffer.push(bulletMatch[1]);
      return;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      if (bulletBuffer.length) flushLists();
      orderedBuffer.push(orderedMatch[1]);
      return;
    }

    flushLists();

    if (/^---+$/.test(line)) {
      nodes.push(<hr key={`hr-${index}`} className="my-5 border-[rgba(129,90,53,0.12)]" />);
      return;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      const headingClass =
        level === 1
          ? "text-2xl font-serif-cn font-bold leading-tight text-foreground"
          : level === 2
            ? "text-xl font-serif-cn font-semibold leading-tight text-foreground"
            : "text-lg font-medium leading-tight text-foreground/92";

      nodes.push(
        <div key={`heading-${index}`} className="pt-2">
          <h3 className={headingClass}>{renderInlineMarkdown(headingText)}</h3>
        </div>,
      );
      return;
    }

    if (line.startsWith(">")) {
      nodes.push(
        <blockquote
          key={`quote-${index}`}
          className="border-l-4 border-[rgba(129,90,53,0.22)] bg-[rgba(129,90,53,0.06)] px-4 py-3 text-foreground/78"
        >
          {renderInlineMarkdown(line.replace(/^>\s?/, ""))}
        </blockquote>,
      );
      return;
    }

    nodes.push(
      <p key={`p-${index}`} className="leading-8 text-foreground/84">
        {renderInlineMarkdown(line)}
      </p>,
    );
  });

  flushLists();

  return <div className="space-y-4">{nodes}</div>;
};

const CompetitionAiAssistant = ({
  title,
  subtitle,
  accent,
  contextTitle,
  contextSummary,
  contextBullets,
  contextText,
  initialQuestion = "",
  badge = "智能问答",
  onAnswerGenerated,
}: Props) => {
  const [mode, setMode] = useState<AssistantMode>("free");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<DeepSeekMessage[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setQuestion("");
    setAnswer("");
    setError("");
    setHistory([]);
    setExpanded(false);
  }, [contextTitle]);

  useEffect(() => {
    if (!initialQuestion) return;
    setQuestion(initialQuestion);
    setAnswer("");
    setError("");
    setExpanded(false);
  }, [initialQuestion]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const helperText = modeMeta[mode];
  const displayAnswer =
    mode === "free"
      ? [...history].reverse().find(item => item.role === "assistant")?.content ?? answer
      : answer;
  const needsCollapse = mode !== "free" && displayAnswer.trim().length > 700;

  const submit = async () => {
    if (!question.trim()) {
      setError("请先输入一个具体问题。");
      return;
    }

    setLoading(true);
    setError("");

    const userQuestion = question.trim();
    if (mode !== "free") {
      setAnswer("");
      setExpanded(false);
    }

    try {
      const messages =
        mode === "free"
          ? [
              ...history.slice(-8),
              {
                role: "user" as const,
                content: userQuestion,
              },
            ]
          : [
              {
                role: "user" as const,
                content: [
                  `当前模式：${helperText.label}`,
                  `当前场景：${title}`,
                  `上下文标题：${contextTitle}`,
                  contextSummary ? `上下文摘要：${contextSummary}` : "",
                  "当前已知信息：",
                  contextText,
                  `用户问题：${userQuestion}`,
                ]
                  .filter(Boolean)
                  .join("\n\n"),
              },
            ];

      const response = await requestDeepSeekChat({
        temperature: 0.35,
        messages,
      });

      if (mode === "free") {
        setHistory(previous => [
          ...previous,
          { role: "user", content: userQuestion },
          { role: "assistant", content: response.content },
        ]);
        setAnswer(response.content);
        setQuestion("");
      } else {
        setAnswer(response.content);
      }
      onAnswerGenerated?.({ question: userQuestion, answer: response.content, mode });
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  const resolveSuggestedMode = (prompt: string): AssistantMode => {
    if (/对比|区别|差异/.test(prompt)) return "compare";
    if (/时间|演进|朝代|脉络/.test(prompt)) return "timeline";
    if (/结构|受力|中轴|剖面|空间/.test(prompt)) return "structure";
    if (/总结|学习卡片|梳理/.test(prompt)) return "interpret";
    return "free";
  };

  const copyAnswer = async () => {
    if (!displayAnswer.trim() || !navigator.clipboard?.writeText) return;
    await navigator.clipboard.writeText(displayAnswer);
    setCopied(true);
  };

  return (
    <section className="rounded-[34px] border border-[rgba(129,90,53,0.18)] bg-[linear-gradient(180deg,rgba(255,251,243,0.98),rgba(243,234,217,0.96))] p-6 shadow-[0_24px_50px_rgba(120,83,49,0.12)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm tracking-[0.24em] text-[hsl(28,28%,48%)]">Q&A ASSISTANT</p>
          <h2 className="mt-2 text-3xl font-serif-cn font-bold">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/72">{subtitle}</p>
        </div>
        <div
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
          style={{ borderColor: `${accent}22`, backgroundColor: `${accent}10`, color: accent }}
        >
          <Sparkles className="h-4 w-4" />
          {badge}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-4">
          <div className="rounded-[26px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-5">
            <p className="text-sm font-medium text-foreground/78">{contextTitle}</p>
            {contextSummary ? <p className="mt-3 text-sm leading-7 text-foreground/72">{contextSummary}</p> : null}
            {contextBullets.length ? (
              <div className={contextSummary ? "mt-4 flex flex-wrap gap-3" : "mt-3 flex flex-wrap gap-3"}>
                {contextBullets.map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      setQuestion(item);
                      setMode(resolveSuggestedMode(item));
                    }}
                    className="rounded-full border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,247,0.92)] px-4 py-3 text-left text-sm text-foreground/82 transition-all hover:border-[rgba(129,90,53,0.22)] hover:bg-[rgba(129,90,53,0.08)]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-[26px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-5">
            <p className="text-sm font-medium text-foreground/78">对话模式</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(Object.entries(modeMeta) as Array<[AssistantMode, (typeof modeMeta)[AssistantMode]]>).map(([key, item]) => {
                const active = key === mode;
                return (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`rounded-[18px] border px-4 py-3 text-left transition-all ${
                      active
                        ? "text-white shadow-[0_10px_20px_rgba(95,58,37,0.14)]"
                        : "border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,247,0.9)] text-foreground/80"
                    }`}
                    style={active ? { backgroundColor: accent, borderColor: accent } : undefined}
                  >
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className={`mt-1 text-xs ${active ? "text-white/82" : "text-muted-foreground"}`}>
                      {item.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-[rgba(129,90,53,0.12)] bg-white/76 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground/78">提问</p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{helperText.hint}</p>
            </div>
            <div className="rounded-full border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,247,0.92)] px-3 py-1.5 text-xs text-foreground/72">
              {helperText.label}
            </div>
          </div>

          <textarea
            value={question}
            onChange={event => setQuestion(event.target.value)}
            className="mt-4 min-h-[148px] w-full rounded-[22px] border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,248,0.96)] px-4 py-4 text-sm leading-7 outline-none transition-all focus:border-[rgba(129,90,53,0.3)]"
            placeholder={
              mode === "free"
                ? "例如：故宫和大明宫有什么区别？赵州桥为什么重要？中国古代民居有哪些典型类型？"
                : "请输入问题。"
            }
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={submit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-white shadow-[0_12px_20px_rgba(95,58,37,0.14)] transition-all hover:translate-y-[-1px] disabled:opacity-70"
              style={{ backgroundColor: accent }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {mode === "free" ? "发送问题" : "生成解读"}
            </button>
            <button
              onClick={copyAnswer}
              disabled={!displayAnswer.trim()}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(129,90,53,0.14)] bg-white/84 px-4 py-3 text-sm text-foreground/76 transition-all disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              {copied ? "已复制" : "复制结果"}
            </button>
            {mode === "free" ? (
              <button
                onClick={() => {
                  setHistory([]);
                  setAnswer("");
                  setError("");
                  setQuestion("");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(129,90,53,0.14)] bg-white/84 px-4 py-3 text-sm text-foreground/76 transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                清空对话
              </button>
            ) : null}
          </div>

          {error ? (
            <div className="mt-4 rounded-[20px] border border-[rgba(173,84,60,0.18)] bg-[rgba(173,84,60,0.08)] px-4 py-3 text-sm leading-7 text-[hsl(10,55%,36%)]">
              {error}
            </div>
          ) : null}

          <div className="mt-5 overflow-hidden rounded-[26px] border border-[rgba(129,90,53,0.14)] bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(245,236,220,0.96))]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(129,90,53,0.1)] px-5 py-4">
              <div>
                <p className="text-sm font-medium text-foreground/82">
                  {mode === "free" ? "对话记录" : "输出内容"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {mode === "free"
                    ? "适合多轮追问，内容会保留在下方记录中。"
                    : "较长的结果会自动折叠，避免页面被整段文本拉得过长。"}
                </p>
              </div>
              {needsCollapse ? (
                <button
                  onClick={() => setExpanded(previous => !previous)}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(129,90,53,0.12)] bg-white/90 px-4 py-2 text-xs text-foreground/76 transition-all"
                >
                  {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {expanded ? "收起全文" : "展开全文"}
                </button>
              ) : null}
            </div>
            {mode === "free" ? (
              <div className="max-h-[520px] space-y-4 overflow-y-auto px-5 py-5">
                {history.length ? (
                  history.map((item, index) => (
                    <div
                      key={`${item.role}-${index}`}
                      className={`max-w-[92%] rounded-[22px] px-4 py-3 text-sm shadow-[0_8px_18px_rgba(95,58,37,0.06)] ${
                        item.role === "user"
                          ? "ml-auto border border-[rgba(129,90,53,0.12)] bg-white text-foreground/86"
                          : "border border-[rgba(129,90,53,0.1)] bg-[rgba(248,241,229,0.96)] text-foreground/84"
                      }`}
                    >
                      <p className="mb-2 text-xs tracking-[0.18em] text-[hsl(28,22%,46%)]">
                        {item.role === "user" ? "你" : "助手"}
                      </p>
                      <div>{renderMarkdownDocument(item.content)}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-[rgba(129,90,53,0.16)] bg-white/70 px-5 py-8 text-sm leading-7 text-muted-foreground">
                    这里会显示多轮问答记录。你可以围绕古代建筑继续提问。
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <div
                  className={`px-5 py-5 text-sm ${expanded ? "max-h-none" : "max-h-[360px] overflow-y-auto"}`}
                >
                  {answer ? (
                    renderMarkdownDocument(answer)
                  ) : (
                    <p className="leading-8 text-foreground/84">
                      这里会显示基于当前上下文生成的解读内容。
                    </p>
                  )}
                </div>
                {needsCollapse && !expanded ? (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-[linear-gradient(180deg,rgba(245,236,220,0),rgba(245,236,220,0.92),rgba(245,236,220,1))]" />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionAiAssistant;
