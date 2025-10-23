import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import ReportCard from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { FileText, Eye, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import wasteImage from "@assets/generated_images/Waste_dumping_report_example_b439383d.png";
import waterImage from "@assets/generated_images/Water_leak_report_example_b22dadea.png";
import potholeImage from "@assets/generated_images/Road_pothole_report_example_80ba27ee.png";

export default function Home() {
  const recentReports = [
    {
      id: "1",
      title: "Illegal Waste Dumping on 5th Avenue",
      description: "Large amounts of trash and plastic bags dumped on the street corner. This has been ongoing for several weeks.",
      category: "waste" as const,
      status: "pending" as const,
      location: "5th Avenue & Main Street, Harare",
      imageUrl: wasteImage,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "Water Pipe Burst Near Community Center",
      description: "Major water leak from broken pipe causing flooding. Water is being wasted and the road is becoming damaged.",
      category: "water" as const,
      status: "in-progress" as const,
      location: "Community Center Road, Bulawayo",
      imageUrl: waterImage,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "Large Pothole on Highway Exit",
      description: "Deep pothole causing vehicle damage and traffic delays. Multiple cars have reported tire damage.",
      category: "road" as const,
      status: "resolved" as const,
      location: "Highway 2 Exit 12",
      imageUrl: potholeImage,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <div>
      <Hero />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to make a difference in your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Recent Reports</h2>
              <p className="text-muted-foreground">
                Latest issues reported by community members
              </p>
            </div>
            <Link href="/reports">
              <Button variant="outline" className="gap-2" data-testid="button-view-all">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.map((report) => (
              <ReportCard key={report.id} {...report} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of citizens working together to improve our communities.
            Report an issue today and track its progress to resolution.
          </p>
          <Link href="/submit">
            <Button size="lg" data-testid="button-get-started">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
