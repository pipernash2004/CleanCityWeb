import { useState } from "react";
import ReportCard from "@/components/ReportCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import wasteImage from "@assets/generated_images/Waste_dumping_report_example_b439383d.png";
import waterImage from "@assets/generated_images/Water_leak_report_example_b22dadea.png";
import potholeImage from "@assets/generated_images/Road_pothole_report_example_80ba27ee.png";

type Category = "all" | "waste" | "water" | "road";
type Status = "all" | "pending" | "in-progress" | "resolved";

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category>("all");
  const [statusFilter, setStatusFilter] = useState<Status>("all");

  const allReports = [
    {
      id: "1",
      title: "Illegal Waste Dumping on 5th Avenue",
      description: "Large amounts of trash and plastic bags dumped on the street corner. This has been ongoing for several weeks and creating health hazards.",
      category: "waste" as const,
      status: "pending" as const,
      location: "5th Avenue & Main Street, Harare",
      imageUrl: wasteImage,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "Water Pipe Burst Near Community Center",
      description: "Major water leak from broken pipe causing flooding on the road. Water is being wasted and the road is becoming damaged.",
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
    {
      id: "4",
      title: "Broken Street Light on Park Road",
      description: "Street light has been non-functional for two months, creating safety concerns at night.",
      category: "road" as const,
      status: "pending" as const,
      location: "Park Road, Harare",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      title: "Overflowing Garbage Bins",
      description: "Public bins overflowing for over a week, attracting pests and creating unsanitary conditions.",
      category: "waste" as const,
      status: "in-progress" as const,
      location: "Central Market, Bulawayo",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "6",
      title: "Leaking Fire Hydrant",
      description: "Fire hydrant continuously leaking water, wasting resources and creating slippery conditions.",
      category: "water" as const,
      status: "resolved" as const,
      location: "Market Street, Harare",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
  ];

  const filteredReports = allReports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Community Reports</h1>
          <p className="text-muted-foreground">
            Browse and track all reported issues in your community
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Category)}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-category-filter">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="waste">Waste</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="road">Road</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status)}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} {...report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No reports found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
