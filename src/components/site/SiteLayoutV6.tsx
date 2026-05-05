import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "封面" },
  { to: "/atlas", label: "总览主屏" },
  { to: "/knowledge-base", label: "知识库" },
  { to: "/explore/timeline", label: "时间演进" },
  { to: "/explore/regions", label: "地域分布" },
  { to: "/explore/compare", label: "对比分析" },
  { to: "/ai-assistant", label: "AI助手" },
];

const navClass = (atlasMode: boolean) => ({ isActive }: { isActive: boolean }) =>
  atlasMode
    ? `rounded-full border px-4 py-2.5 text-sm transition-all ${
        isActive
          ? "border-[rgba(238,199,122,0.78)] bg-[linear-gradient(180deg,rgba(186,126,58,0.9),rgba(153,95,38,0.88))] text-[hsl(37,85%,93%)] shadow-[inset_0_1px_0_rgba(255,243,216,0.45),0_10px_24px_rgba(46,27,13,0.25)]"
          : "border-[rgba(255,227,185,0.15)] bg-[rgba(90,52,27,0.24)] text-[hsl(36,70%,90%)] hover:border-[rgba(255,227,185,0.26)] hover:bg-[rgba(121,69,34,0.32)]"
      }`
    : `rounded-full border px-4 py-2.5 text-sm transition-all ${
        isActive
          ? "border-[rgba(255,248,238,0.4)] bg-[linear-gradient(180deg,rgba(255,249,241,0.22),rgba(255,243,228,0.1))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_14px_30px_rgba(22,17,14,0.16)] ring-1 ring-[rgba(255,248,238,0.12)]"
          : "border-[rgba(255,248,238,0.08)] bg-[rgba(255,248,238,0.04)] text-white/84 hover:border-[rgba(255,248,238,0.16)] hover:bg-[rgba(255,248,238,0.12)] hover:shadow-[0_8px_18px_rgba(22,17,14,0.08)]"
      }`;

const SiteLayoutV6 = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isAtlas = location.pathname === "/atlas";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eadfce_0%,#f6f1e7_20%,#f4ede1_100%)] text-foreground">
      {!isLanding ? (
        <header
          className="sticky top-0 z-40 border-b border-[rgba(164,114,59,0.26)] bg-[linear-gradient(180deg,rgba(54,30,17,0.24),rgba(110,61,31,0.14))] text-white shadow-[0_12px_32px_rgba(74,44,30,0.14)] backdrop-blur"
          style={{
            backgroundImage:
              "linear-gradient(180deg,rgba(67,34,18,0.38),rgba(128,72,35,0.22)), url('/backgrounds/atlas-overview-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <Link
                to="/"
                className={`inline-flex self-start rounded-full px-5 py-3 text-lg font-serif-cn font-bold tracking-[0.08em] ${
                  isAtlas
                    ? "border border-[rgba(255,226,179,0.28)] bg-[rgba(98,55,27,0.3)] text-[hsl(39,84%,91%)]"
                    : "border border-[rgba(255,248,238,0.12)] bg-[rgba(255,248,238,0.06)] text-white"
                }`}
              >
                中国古代建筑演进图谱
              </Link>

              <nav className="flex flex-wrap gap-2 xl:max-w-[70%] xl:justify-end">
                {navLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className={navClass(isAtlas)}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </header>
      ) : null}

      <main className={`relative ${isAtlas ? "h-[calc(100dvh-156px)] overflow-hidden xl:h-[calc(100dvh-112px)]" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default SiteLayoutV6;
