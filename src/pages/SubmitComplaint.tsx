import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, Send } from "lucide-react";
import { complaintCategories, type ComplaintCategory, type User } from "@/data/dummyData";

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ComplaintCategory | "">("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === "student" || user.role === "faculty") {
        setCurrentUser(user);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newComplaint = {
      id: `C${Date.now()}`,
      title,
      category,
      description,
      status: "Pending" as const,
      priority,
      submittedBy: currentUser?.name || "",
      submittedByRole: currentUser?.role as "student" | "faculty",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: location || undefined,
      contactNumber: contactNumber || undefined,
    };

    const existingComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    localStorage.setItem("complaints", JSON.stringify([newComplaint, ...existingComplaints]));

    toast.success("Complaint submitted successfully! You will be notified of any updates.");
    
    setTitle("");
    setCategory("");
    setDescription("");
    setPriority("Medium");
    setLocation("");
    setContactNumber("");
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Submit Complaint</h1>
            <p className="text-sm text-muted-foreground">
              {currentUser.name} • {currentUser.role === "faculty" ? "Faculty" : "Student"}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Complaint Submission Form</CardTitle>
            <CardDescription>
              Please provide complete details to help us address your concern efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={currentUser?.name || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={currentUser?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={currentUser?.role === "faculty" ? "Faculty" : "Student"}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number (Optional)</Label>
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Complaint Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Complaint Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Complaint Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief, descriptive title (e.g., 'Library AC Not Working')"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Provide a clear, concise title</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={(value) => setCategory(value as ComplaintCategory)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {complaintCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level *</Label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as "Low" | "Medium" | "High")}>
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low - Can wait</SelectItem>
                        <SelectItem value="Medium">Medium - Should be addressed soon</SelectItem>
                        <SelectItem value="High">High - Urgent attention needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location/Room Number (Optional)</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Room 204, Library 3rd Floor, Hostel Block B"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Specify the exact location where the issue occurs</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide comprehensive details:&#10;- What is the issue?&#10;- When did it start?&#10;- How does it affect you?&#10;- Any other relevant information"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    required
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    The more details you provide, the faster we can resolve your complaint
                  </p>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <p>By submitting this complaint, you acknowledge that:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All information provided is accurate and truthful</li>
                    <li>You will receive updates on your complaint status</li>
                    <li>The CMS team may contact you for additional information</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Complaint
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SubmitComplaint;
