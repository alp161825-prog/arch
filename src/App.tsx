import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "./components/site/SiteLayoutV6.tsx";
import HomeLandingPage from "./components/site/HomeLandingPage.tsx";
import AtlasDashboardPage from "./pages/site/AtlasDashboardPageV2.tsx";
import TopicResidentialPage from "./pages/site/TopicResidentialPage.tsx";
import TopicGovernmentPage from "./pages/site/TopicGovernmentPage.tsx";
import TopicPalacePage from "./pages/site/TopicPalacePage.tsx";
import TopicBridgePage from "./pages/site/TopicBridgePage.tsx";
import AiAssistantPage from "./pages/site/AiAssistantPage.tsx";
import ExploreTimelinePageV2 from "./pages/site/ExploreTimelinePageV2.tsx";
import ExploreRegionsPageV2 from "./pages/site/ExploreRegionsPageV2.tsx";
import ExploreComparePageV2 from "./pages/site/ExploreComparePageV2.tsx";
import KnowledgeBasePage from "./pages/site/KnowledgeBasePage.tsx";
import KnowledgeDetailPage from "./pages/site/KnowledgeDetailPage.tsx";
import ProvinceAnalysisPage from "./pages/site/ProvinceAnalysisPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomeLandingPage />} />
            <Route path="/atlas" element={<AtlasDashboardPage />} />
            <Route path="/topics/residential" element={<TopicResidentialPage />} />
            <Route path="/topics/government" element={<TopicGovernmentPage />} />
            <Route path="/topics/palace" element={<TopicPalacePage />} />
            <Route path="/topics/bridge" element={<TopicBridgePage />} />
            <Route path="/ai-assistant" element={<AiAssistantPage />} />
            <Route path="/explore/timeline" element={<ExploreTimelinePageV2 />} />
            <Route path="/explore/regions" element={<ExploreRegionsPageV2 />} />
            <Route path="/explore/compare" element={<ExploreComparePageV2 />} />
            <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="/knowledge-base/:entryId" element={<KnowledgeDetailPage />} />
            <Route path="/explore/province/:provinceCode" element={<ProvinceAnalysisPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
