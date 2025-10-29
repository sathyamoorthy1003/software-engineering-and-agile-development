import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { GraduationCap, Users, Shield } from "lucide-react";
import { dummyUsers } from "@/data/dummyData";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (role: string) => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    const user = dummyUsers.find(u => u.email === email && u.role === role);
    
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      
      switch (role) {
        case "student":
        case "faculty":
          navigate("/submit-complaint");
          break;
        case "staff":
          navigate("/staff-dashboard");
          break;
        case "head":
          navigate("/head-dashboard");
          break;
      }
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Student CMS</CardTitle>
          <CardDescription className="text-center">
            Complaint Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="university" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="university" className="text-xs">
                <GraduationCap className="h-4 w-4 mr-1" />
                University
              </TabsTrigger>
              <TabsTrigger value="staff" className="text-xs">
                <Users className="h-4 w-4 mr-1" />
                Staff
              </TabsTrigger>
              <TabsTrigger value="head" className="text-xs">
                <Shield className="h-4 w-4 mr-1" />
                Head
              </TabsTrigger>
            </TabsList>

            <TabsContent value="university" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="uni-email">Email</Label>
                <Input
                  id="uni-email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uni-password">Password</Label>
                <Input
                  id="uni-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleLogin(email.includes("faculty") ? "faculty" : "student")}
              >
                Login as {email.includes("faculty") ? "Faculty" : "Student"}
              </Button>
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>Demo credentials:</p>
                <p>Student: student@university.edu</p>
                <p>Faculty: faculty@university.edu</p>
              </div>
            </TabsContent>

            <TabsContent value="staff" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="staff-email">Email</Label>
                <Input
                  id="staff-email"
                  type="email"
                  placeholder="staff@cms.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-password">Password</Label>
                <Input
                  id="staff-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleLogin("staff")}
              >
                Login as Staff
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                <p>Demo: staff@cms.edu</p>
              </div>
            </TabsContent>

            <TabsContent value="head" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="head-email">Email</Label>
                <Input
                  id="head-email"
                  type="email"
                  placeholder="head@cms.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="head-password">Password</Label>
                <Input
                  id="head-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleLogin("head")}
              >
                Login as Head
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                <p>Demo: head@cms.edu</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
