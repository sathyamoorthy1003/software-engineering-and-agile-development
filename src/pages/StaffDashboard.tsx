import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { dummyComplaints, type Complaint, type ComplaintStatus, type User } from "@/data/dummyData";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === "staff") {
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
      localStorage.setItem("complaints", JSON.stringify(dummyComplaints));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const updateComplaintStatus = (complaintId: string, newStatus: ComplaintStatus) => {
    const updatedComplaints = complaints.map(complaint =>
      complaint.id === complaintId
        ? { ...complaint, status: newStatus, updatedAt: new Date().toISOString() }
        : complaint
    );
    setComplaints(updatedComplaints);
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
    toast.success("Complaint status updated");
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case "Pending":
        return <AlertCircle className="h-4 w-4" />;
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case "Pending":
        return "bg-status-pending text-white";
      case "In Progress":
        return "bg-status-in-progress text-white";
      case "Resolved":
        return "bg-status-resolved text-white";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive text-destructive-foreground";
      case "Medium":
        return "bg-status-in-progress text-white";
      case "Low":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  if (!currentUser) return null;

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff Dashboard</h1>
            <p className="text-sm text-muted-foreground">{currentUser.name} • CMS Staff</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Complaints</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-status-pending">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl text-status-in-progress">{stats.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resolved</CardDescription>
              <CardTitle className="text-3xl text-status-resolved">{stats.resolved}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Complaints</CardTitle>
            <CardDescription>Manage and update complaint status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Card key={complaint.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{complaint.title}</h3>
                          <Badge variant="outline">{complaint.id}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{complaint.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{complaint.category}</Badge>
                          <Badge className={getPriorityColor(complaint.priority)}>
                            {complaint.priority} Priority
                          </Badge>
                          <Badge variant="outline">
                            {complaint.submittedBy} ({complaint.submittedByRole})
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(complaint.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(complaint.status)}
                          <Badge className={getStatusColor(complaint.status)}>
                            {complaint.status}
                          </Badge>
                        </div>
                        <Select
                          value={complaint.status}
                          onValueChange={(value) => updateComplaintStatus(complaint.id, value as ComplaintStatus)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StaffDashboard;
