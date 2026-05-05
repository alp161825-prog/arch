import TopicCompetitionShowcase from "@/components/site/TopicCompetitionShowcase";
import { getTopicCompetitionContent } from "@/data/topicCompetitionContent";

const TopicBridgePage = () => <TopicCompetitionShowcase content={getTopicCompetitionContent("bridge")} />;

export default TopicBridgePage;
