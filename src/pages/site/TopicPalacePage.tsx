import TopicCompetitionShowcase from "@/components/site/TopicCompetitionShowcase";
import { getTopicCompetitionContent } from "@/data/topicCompetitionContent";

const TopicPalacePage = () => <TopicCompetitionShowcase content={getTopicCompetitionContent("palace")} />;

export default TopicPalacePage;
