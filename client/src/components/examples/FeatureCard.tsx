import FeatureCard from "../FeatureCard";
import { FileText, Eye, CheckCircle } from "lucide-react";

export default function FeatureCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      <FeatureCard
        icon={FileText}
        title="Report Issues"
        description="Easily report waste, water leaks, and road problems in your community with photos and descriptions."
      />
      <FeatureCard
        icon={Eye}
        title="Track Progress"
        description="Monitor the status of your reports and see updates as officials work to resolve issues."
      />
      <FeatureCard
        icon={CheckCircle}
        title="See Results"
        description="Watch your community improve as issues are resolved and tracked for transparency."
      />
    </div>
  );
}
