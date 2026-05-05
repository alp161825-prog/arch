import TopicCompetitionShowcase from "@/components/site/TopicCompetitionShowcase";
import { getTopicCompetitionContent } from "@/data/topicCompetitionContent";

const TopicResidentialPage = () => <TopicCompetitionShowcase content={getTopicCompetitionContent("residential")} />;

export default TopicResidentialPage;
