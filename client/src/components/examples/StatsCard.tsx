import StatsCard from "../StatsCard";
import { FileText, Clock, TrendingUp, CheckCircle } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
      <StatsCard
        title="Total Reports"
        value={156}
        icon={FileText}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Pending"
        value={23}
        icon={Clock}
        trend={{ value: 8, isPositive: false }}
      />
      <StatsCard
        title="In Progress"
        value={45}
        icon={TrendingUp}
        trend={{ value: 15, isPositive: true }}
      />
      <StatsCard
        title="Resolved"
        value={88}
        icon={CheckCircle}
        trend={{ value: 22, isPositive: true }}
      />
    </div>
  );
}
