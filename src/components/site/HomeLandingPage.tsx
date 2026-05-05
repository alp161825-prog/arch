import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { siteHero } from "@/data/siteContentV2";

const HomeLandingPage = () => {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <section
        className="relative overflow-hidden rounded-[40px] border border-[rgba(124,82,52,0.18)] shadow-[0_28px_80px_rgba(88,58,38,0.18)]"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(24,16,12,0.58), rgba(92,56,32,0.22)), url(${siteHero.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,231,192,0.12),transparent_30%),linear-gradient(180deg,rgba(16,10,8,0.12),rgba(16,10,8,0.26))]" />
        <div className="relative flex min-h-[calc(100vh-3rem)] items-center justify-center px-6 py-10 md:px-10">
          <div className="text-center">
            <p className="text-sm tracking-[0.42em] text-[hsl(43,80%,62%)] md:text-base">AI + 信息可视化设计</p>
            <h1 className="mt-6 text-5xl font-serif-cn font-bold leading-[1.08] text-[hsl(36,28%,94%)] md:text-7xl">
              中国古代建筑成就
            </h1>
            <p className="mt-4 text-2xl font-serif-cn text-[hsl(36,22%,90%)] md:text-4xl">各朝代建筑演变的交互可视化</p>
            <p className="mt-3 text-sm tracking-[0.18em] text-[hsl(36,18%,82%)] md:text-base">从夏商到明清，跨越四千年的营造智慧</p>
            <div className="mt-10">
              <Link
                to="/atlas"
                className="inline-flex items-center gap-2 rounded-[14px] bg-[hsl(45,88%,56%)] px-9 py-4 text-base font-medium text-[hsl(28,24%,18%)] shadow-[0_14px_28px_rgba(147,104,42,0.32)] transition-all hover:translate-y-[-1px]"
              >
                开始探索
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeLandingPage;
