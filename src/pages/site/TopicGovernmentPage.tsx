import TopicCompetitionShowcase from "@/components/site/TopicCompetitionShowcase";
import { getTopicCompetitionContent } from "@/data/topicCompetitionContent";

const TopicGovernmentPage = () => <TopicCompetitionShowcase content={getTopicCompetitionContent("government")} />;

export default TopicGovernmentPage;
