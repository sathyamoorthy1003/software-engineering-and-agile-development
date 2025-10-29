import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogOut, TrendingUp, Users, AlertCircle, BarChart3, Filter, X } from "lucide-react";
import { dummyComplaints, type Complaint, type User } from "@/data/dummyData";

const HeadDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === "head") {
        setCurrentUser(user);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }

    const storedComplaints = localStorage.getItem("complaints");
    if (storedComplaints) {
      setComplaints(JSON.parse(storedComplaints));
    } else {
      setComplaints(dummyComplaints);
    }
  }, [navigate]);

  // Apply filters
  useEffect(() => {
    let filtered = [...complaints];

    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }
    if (priorityFilter !== "all") {
      filtered = filtered.filter(c => c.priority === priorityFilter);
    }
    if (staffFilter !== "all") {
      filtered = filtered.filter(c => c.assignedTo === staffFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredComplaints(filtered);
  }, [complaints, statusFilter, categoryFilter, priorityFilter, staffFilter, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setStaffFilter("all");
    setSearchQuery("");
  };

  if (!currentUser) return null;

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
    highPriority: complaints.filter(c => c.priority === "High").length,
  };

  const uniqueStaff = Array.from(new Set(complaints.filter(c => c.assignedTo).map(c => c.assignedTo)));
  const uniqueCategories = Array.from(new Set(complaints.map(c => c.category)));

  const categoryStats = complaints.reduce((acc, complaint) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const displayComplaints = [...filteredComplaints]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-status-pending text-white";
      case "In Progress":
        return "bg-status-in-progress text-white";
      case "Resolved":
        return "bg-status-resolved text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Head Dashboard</h1>
            <p className="text-sm text-muted-foreground">{currentUser.name} • CMS Head</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-primary-foreground/80">Total Complaints</CardDescription>
                <BarChart3 className="h-5 w-5" />
              </div>
              <CardTitle className="text-4xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Pending</CardDescription>
                <AlertCircle className="h-5 w-5 text-status-pending" />
              </div>
              <CardTitle className="text-3xl text-status-pending">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>In Progress</CardDescription>
                <TrendingUp className="h-5 w-5 text-status-in-progress" />
              </div>
              <CardTitle className="text-3xl text-status-in-progress">{stats.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Resolved</CardDescription>
                <Users className="h-5 w-5 text-status-resolved" />
              </div>
              <CardTitle className="text-3xl text-status-resolved">{stats.resolved}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-destructive text-destructive-foreground">
            <CardHeader className="pb-3">
              <CardDescription className="text-destructive-foreground/80">High Priority</CardDescription>
              <CardTitle className="text-3xl">{stats.highPriority}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
              <CardDescription>Most complained about areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Overview of complaint statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="bg-status-pending h-2 rounded-full"
                        style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">
                      {((stats.pending / stats.total) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">In Progress</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="bg-status-in-progress h-2 rounded-full"
                        style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">
                      {((stats.inProgress / stats.total) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Resolved</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="bg-status-resolved h-2 rounded-full"
                        style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">
                      {((stats.resolved / stats.total) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Complaints</CardTitle>
                <CardDescription>Filter and search complaints</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Search
                  </label>
                  <Input
                    placeholder="Search complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Assigned Staff</label>
                  <Select value={staffFilter} onValueChange={setStaffFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Staff</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {uniqueStaff.map((staff) => (
                        <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Summary */}
              <div className="text-sm text-muted-foreground">
                Showing {filteredComplaints.length} of {complaints.length} complaints
              </div>

              {/* Complaints List */}
              <div className="space-y-4">
                {displayComplaints.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No complaints found matching the filters
                  </div>
                ) : (
                  displayComplaints.map((complaint) => (
                    <div key={complaint.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{complaint.title}</h4>
                          <Badge variant="outline" className="text-xs">{complaint.id}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">{complaint.category}</Badge>
                          <Badge variant="outline" className="text-xs">
                            Priority: {complaint.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            By: {complaint.submittedBy}
                          </Badge>
                          {complaint.assignedTo && (
                            <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                              Handled by: {complaint.assignedTo}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(complaint.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HeadDashboard;
