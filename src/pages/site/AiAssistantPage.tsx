import CompetitionAiAssistant from "@/components/site/CompetitionAiAssistant";

const globalContextText = [
  "主题范围：中国古代建筑知识体系",
  "覆盖内容：民居、官署、皇宫、桥梁四大类型",
  "时间范围：先秦、秦汉、魏晋南北朝、隋唐、宋元、明清",
  "空间范围：结合全国主屏地图、地域分布页与省份分析页观察建筑差异",
  "知识角度：建筑是什么、如何演进、为何形成、结构如何理解、代表案例有哪些",
  "典型案例：北京故宫、大明宫、二里头宫殿区、赵州桥、卢沟桥、福建土楼、北京四合院、南阳府衙等",
  "可回答问题：中国古代建筑类型差异、同类建筑对比、建筑史理解、结构特点、地域特征、参观建议与知识梳理",
].join("\n");

const AiAssistantPage = () => {
  return (
    <div className="mx-auto max-w-[1540px] px-4 py-8 md:px-6 md:py-10">
      <section className="overflow-hidden rounded-[40px] border border-[rgba(129,90,53,0.18)] bg-[linear-gradient(180deg,rgba(255,251,243,0.98),rgba(240,229,208,0.96))] shadow-[0_24px_52px_rgba(120,83,49,0.12)]">
        <div className="relative px-6 py-8 md:px-8 md:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(214,174,111,0.22),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(157,102,54,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]" />
          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm tracking-[0.24em] text-[hsl(28,28%,48%)]">AI STUDIO</p>
              <h1 className="mt-2 text-4xl font-serif-cn font-bold">中国古代建筑问答</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/72 px-4 py-4 backdrop-blur-sm">
                <p className="text-xs tracking-[0.18em] text-muted-foreground">可自由提问</p>
                <p className="mt-2 text-lg font-serif-cn font-semibold">古建知识问答</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/72 px-4 py-4 backdrop-blur-sm">
                <p className="text-xs tracking-[0.18em] text-muted-foreground">可辅助理解</p>
                <p className="mt-2 text-lg font-serif-cn font-semibold">时间与结构解析</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/72 px-4 py-4 backdrop-blur-sm">
                <p className="text-xs tracking-[0.18em] text-muted-foreground">可案例对比</p>
                <p className="mt-2 text-lg font-serif-cn font-semibold">跨类型比较</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.84)] p-2 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
        <CompetitionAiAssistant
          title="中国古代建筑问答"
          subtitle=""
          accent="#8f5b33"
          contextTitle="主题信息"
          contextSummary=""
          contextBullets={[]}
          contextText={globalContextText}
          badge="全局模式"
        />
      </section>
    </div>
  );
};

export default AiAssistantPage;



