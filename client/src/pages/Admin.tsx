import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, TrendingUp, CheckCircle, Search, Eye } from "lucide-react";

type Status = "pending" | "in-progress" | "resolved";

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const reports = [
    {
      id: "1",
      title: "Illegal Waste Dumping on 5th Avenue",
      category: "waste",
      status: "pending" as Status,
      location: "5th Avenue & Main Street, Harare",
      createdAt: "2 days ago",
    },
    {
      id: "2",
      title: "Water Pipe Burst Near Community Center",
      category: "water",
      status: "in-progress" as Status,
      location: "Community Center Road, Bulawayo",
      createdAt: "5 days ago",
    },
    {
      id: "3",
      title: "Large Pothole on Highway Exit",
      category: "road",
      status: "resolved" as Status,
      location: "Highway 2 Exit 12",
      createdAt: "10 days ago",
    },
    {
      id: "4",
      title: "Broken Street Light on Park Road",
      category: "road",
      status: "pending" as Status,
      location: "Park Road, Harare",
      createdAt: "15 days ago",
    },
    {
      id: "5",
      title: "Overflowing Garbage Bins",
      category: "waste",
      status: "in-progress" as Status,
      location: "Central Market, Bulawayo",
      createdAt: "7 days ago",
    },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (reportId: string, newStatus: Status) => {
    console.log(`Updating report ${reportId} to status: ${newStatus}`);
  };

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
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => (
                  <tr
                    key={report.id}
                    className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                    data-testid={`row-report-${report.id}`}
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
                        onValueChange={(value) => handleStatusChange(report.id, value as Status)}
                      >
                        <SelectTrigger className="w-40" data-testid={`select-status-${report.id}`}>
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
                      {report.createdAt}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`button-view-${report.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
