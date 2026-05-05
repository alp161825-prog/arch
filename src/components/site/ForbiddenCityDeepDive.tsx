const identity = [
  { label: "正式名称", value: "北京故宫（旧称：紫禁城）" },
  { label: "建筑类型", value: "宫殿建筑群（明清皇家宫城）" },
  { label: "建造年代", value: "1406年下诏营建，1420年基本建成" },
  { label: "位置", value: "北京市东城区，景山南侧，天安门以北" },
  { label: "营建主持", value: "明成祖朱棣；工部系统主持营建" },
  { label: "占地面积", value: "72.36万平方米（约101个标准足球场）" },
  { label: "现存状态", value: "完整保存，为故宫博物院所在地，世界文化遗产" },
];

const events = [
  { year: "1420", event: "紫禁城建成，次年明廷正式迁都北京" },
  { year: "1644", event: "明末战乱导致宫城局部火毁，清初重建与修复" },
  { year: "1900", event: "八国联军占领北京，宫城遭受冲击" },
  { year: "1925", event: "故宫博物院成立，宫城进入近现代博物馆体系" },
  { year: "1961", event: "列入第一批全国重点文物保护单位" },
  { year: "1987", event: "列入世界文化遗产名录" },
];

const zones = [
  { zone: "前朝（外朝）", buildings: "太和门、太和殿、中和殿、保和殿", feature: "大典与朝会核心，广场尺度最大" },
  { zone: "内廷（后寝）", buildings: "乾清门、乾清宫、交泰殿、坤宁宫、东西六宫", feature: "帝后起居与日常政务空间" },
  { zone: "外东路/外西路", buildings: "宁寿宫区、慈宁宫区、文华殿、武英殿", feature: "太后、太上皇与文化治理功能" },
];

const coreBuildings = [
  { name: "太和殿", width: "11间（约64m）", depth: "5间（约37m）", roof: "重檐庑殿顶", base: "8.13m（三层须弥座）" },
  { name: "中和殿", width: "3间（约25m）", depth: "3间（约22m）", roof: "单檐攒尖顶", base: "同台基体系" },
  { name: "保和殿", width: "9间（约55m）", depth: "5间（约32m）", roof: "重檐歇山顶", base: "同上" },
  { name: "乾清宫", width: "9间（约57m）", depth: "5间（约30m）", roof: "重檐庑殿顶", base: "3.45m（单层台基）" },
];


const moduleNarratives = [
  "抬梁式木构为主，柱网承重、墙体围护，核心大殿由梁架和斗栱完成分层传力。",
  "三大殿共用高台基，形成礼制展示与结构安全的双重基础。",
  "金砖地面、汉白玉栏杆、排水龙头等细部共同构成完整工程系统。",
];

const module6Points = [
  { title: "中轴与王权", desc: "午门至神武门构成核心御道，门禁与行走权限呈现等级秩序。" },
  { title: "数字等级", desc: "11间大殿、10个脊兽、81颗门钉，均是皇家等级的量化表达。" },
  { title: "前朝后寝", desc: "朝在前、寝在后，配合左祖右社，完整落实周礼都城理念。" },
  { title: "命名寓意", desc: "太和、保和、乾清、坤宁、交泰等命名共同构成政治话语系统。" },
];

const module7Notes = [
  "明清两代持续改建，现存总体面貌以清代中后期形制为主。",
  "文献依据涵盖《明实录》《清会典》《内务府档案》《样式雷图档》等。",
  "1987年列入世界遗产后持续开展年度修缮与预防性保护。",
  "当代已形成“博物馆展陈 + 学术研究 + 数字故宫”三位一体使用方式。",
];

const ForbiddenCityDeepDive = () => {
  return (
    <article className="rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
      <p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">BUILDING INTERPRETATION</p>
      <h2 className="mt-2 text-2xl font-serif-cn font-bold">建筑详细解读</h2>

      <section className="mt-6 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块1：身份档案</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {identity.map(item => (
            <div key={item.label} className="rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-xs tracking-[0.14em] text-muted-foreground">{item.label}</p>
              <p className="mt-1.5 text-sm leading-7 text-foreground/84">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块2：历史语境与功能定位</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-4">
              <p className="text-sm font-medium text-foreground/82">2.1 为什么建？</p>
              <p className="mt-2 text-sm leading-8 text-muted-foreground">明成祖为巩固北方防务并重构政治中心而迁都北京，紫禁城作为皇城核心，承担朝会、起居、内廷治理与国家礼仪准备功能。</p>
            </div>
            <div className="rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-4">
              <p className="text-sm font-medium text-foreground/82">2.2 在王朝/城市中的角色</p>
              <p className="mt-2 text-sm leading-8 text-muted-foreground">作为明清两代国家权力核心，故宫位于北京中轴中心段，严格体现“前朝后寝、左祖右社”的都城礼制结构。</p>
            </div>
          </div>
          <div className="rounded-[16px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] p-4">
            <p className="text-sm font-medium text-foreground/82">2.3 重要历史事件（时间线）</p>
            <div className="mt-3 space-y-2.5">
              {events.map(item => (
                <div key={item.year} className="grid grid-cols-[58px_1fr] gap-3 rounded-[12px] border border-[rgba(129,90,53,0.08)] bg-white/86 px-3 py-2.5">
                  <p className="text-sm font-semibold text-[hsl(28,36%,34%)]">{item.year}</p>
                  <p className="text-sm leading-7 text-muted-foreground">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块3：空间与布局</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { label: "南北长度", value: "961米" },
            { label: "东西宽度", value: "753米" },
            { label: "城墙/护城河", value: "高10米 / 宽52米" },
          ].map(item => (
            <div key={item.label} className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-xs tracking-[0.14em] text-muted-foreground">{item.label}</p>
              <p className="mt-1.5 text-base font-semibold text-foreground/84">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-x-auto rounded-[16px] border border-[rgba(129,90,53,0.12)] bg-white/86">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.8)] text-left">
                <th className="px-4 py-3 font-medium">区域</th>
                <th className="px-4 py-3 font-medium">主要建筑</th>
                <th className="px-4 py-3 font-medium">院落特征</th>
              </tr>
            </thead>
            <tbody>
              {zones.map(item => (
                <tr key={item.zone} className="border-b border-[rgba(129,90,53,0.08)] align-top">
                  <td className="px-4 py-3 font-medium text-foreground/84">{item.zone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.buildings}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.feature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 overflow-x-auto rounded-[16px] border border-[rgba(129,90,53,0.12)] bg-white/86">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.8)] text-left">
                <th className="px-4 py-3 font-medium">建筑</th>
                <th className="px-4 py-3 font-medium">面阔</th>
                <th className="px-4 py-3 font-medium">进深</th>
                <th className="px-4 py-3 font-medium">屋顶</th>
                <th className="px-4 py-3 font-medium">台基</th>
              </tr>
            </thead>
            <tbody>
              {coreBuildings.map(item => (
                <tr key={item.name} className="border-b border-[rgba(129,90,53,0.08)]">
                  <td className="px-4 py-3 font-medium text-foreground/84">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.width}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.depth}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.roof}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块4：结构与技术</h3>
        <div className="mt-4 space-y-3">
          {moduleNarratives.map(item => (
            <div key={item} className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-sm leading-8 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块5：材料、装饰与视觉特征</h3>
        <div className="mt-4 space-y-3">
          {[
            "材料体系：楠木/松木木构、城砖与汉白玉、皇家黄色琉璃瓦。",
            "太和殿重檐庑殿顶，正脊鸱吻与垂脊走兽共10个，为全国孤例。",
            "彩画等级以金龙和玺为核心，内廷兼有旋子与苏式彩画。",
            "标志构件包括金漆蟠龙柱、藻井、九行九列门钉与“正大光明”匾。",
          ].map(item => (
            <div key={item} className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-sm leading-8 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块6：文化象征与礼制秩序</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {module6Points.map(item => (
            <div key={item.title} className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-sm font-medium text-foreground/84">{item.title}</p>
              <p className="mt-2 text-sm leading-8 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-5">
        <h3 className="text-xl font-serif-cn font-bold">模块7：演变、保护与当代认知</h3>
        <div className="mt-4 space-y-3">
          {module7Notes.map(item => (
            <div key={item} className="rounded-[14px] border border-[rgba(129,90,53,0.1)] bg-[rgba(255,252,246,0.9)] px-4 py-3">
              <p className="text-sm leading-8 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};

export default ForbiddenCityDeepDive;


