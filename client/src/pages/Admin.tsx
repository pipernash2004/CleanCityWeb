import { useState, useEffect } from "react";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, TrendingUp, CheckCircle, Search, Eye } from "lucide-react";
import { reportsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";

type Status = "pending" | "in-progress" | "resolved";

interface Report {
  _id: string;
  title: string;
  category: string;
  status: Status;
  location: string;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [dataLoading, setDataLoading] = useState(true);
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Wait for auth context to finish loading before checking permissions
    if (authLoading) return;
    
    if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "You must be an administrator to access this page",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    fetchData();
  }, [authLoading, isAdmin, statusFilter, searchQuery]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [reportsResponse, statsResponse] = await Promise.all([
        reportsAPI.getAll({
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: searchQuery || undefined,
        }),
        reportsAPI.getStats(),
      ]);

      setReports(reportsResponse.data.reports);
      setStats(statsResponse.data.stats);
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: Status) => {
    try {
      await reportsAPI.update(reportId, { status: newStatus });
      toast({
        title: "Status updated",
        description: "Report status has been updated successfully",
      });
      fetchData();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  // Show nothing while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // This will only be hit if auth loaded and user is not admin (already redirected in useEffect)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track all community reports
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Reports"
            value={stats.total}
            icon={FileText}
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={TrendingUp}
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-admin-search"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | "all")}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-admin-status-filter">
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

        {dataLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Title</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">Category</th>
                    <th className="text-left p-4 font-semibold hidden lg:table-cell">Location</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr
                      key={report._id}
                      className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                      data-testid={`row-report-${report._id}`}
                    >
                      <td className="p-4">
                        <div className="font-medium">{report.title}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{report.category}</div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="capitalize">{report.category}</span>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                        {report.location}
                      </td>
                      <td className="p-4">
                        <Select
                          value={report.status}
                          onValueChange={(value) => handleStatusChange(report._id, value as Status)}
                        >
                          <SelectTrigger className="w-40" data-testid={`select-status-${report._id}`}>
                            <SelectValue>
                              <StatusBadge status={report.status} />
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
