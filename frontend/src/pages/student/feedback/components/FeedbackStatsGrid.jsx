import { FileText, MessageSquareText, RefreshCcw } from "lucide-react";

import FeedbackStatCard from "./FeedbackStatCard";
function FeedbackStatsGrid({ stats }) {
  return (
    <section className="feedback-stats-grid" aria-label="Feedback summary">
      <FeedbackStatCard icon={MessageSquareText} label="Total Feedback" value={stats.total} />
      <FeedbackStatCard icon={FileText} label="Reviewed Projects" value={stats.reviewed} />
      <FeedbackStatCard icon={RefreshCcw} label="Needs Revision" value={stats.needsRevision} />
    </section>
  );
}

export default FeedbackStatsGrid;
