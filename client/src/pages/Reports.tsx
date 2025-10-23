import { useState, useEffect } from "react";
import ReportCard from "@/components/ReportCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { reportsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Category = "all" | "waste" | "water" | "road";
type Status = "all" | "pending" | "in-progress" | "resolved";

interface Report {
  _id: string;
  title: string;
  description: string;
  category: "waste" | "water" | "road";
  status: "pending" | "in-progress" | "resolved";
  location: string;
  imageUrl?: string;
  createdAt: string;
}

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category>("all");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, [categoryFilter, statusFilter, searchQuery]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (categoryFilter !== "all") params.category = categoryFilter;
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await reportsAPI.getAll(params);
      setReports(response.data.reports);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard
                key={report._id}
                id={report._id}
                title={report.title}
                description={report.description}
                category={report.category}
                status={report.status}
                location={report.location}
                imageUrl={report.imageUrl}
                createdAt={new Date(report.createdAt)}
              />
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
