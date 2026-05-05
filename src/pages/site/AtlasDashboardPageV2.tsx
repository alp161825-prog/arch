import HomeDataScreenV11 from "@/components/site/HomeDataScreenV11";

const AtlasDashboardPageV2 = () => {
  return (
    <div
      className="relative h-full overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(247,241,230,0.35), rgba(236,225,205,0.52)), url('/backgrounds/atlas-main-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(255,255,255,0.18),transparent_36%)]" />
      <div className="relative mx-auto h-full max-w-7xl px-4 py-3 md:px-6 md:py-4">
        <HomeDataScreenV11 />
      </div>
    </div>
  );
};

export default AtlasDashboardPageV2;
