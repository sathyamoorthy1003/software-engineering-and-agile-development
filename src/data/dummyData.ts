export type ComplaintStatus = "Pending" | "In Progress" | "Resolved";
export type ComplaintCategory = 
  | "Academic Issues"
  | "Infrastructure"
  | "Hostel Facilities"
  | "Library Services"
  | "Cafeteria"
  | "Administrative"
  | "Harassment"
  | "Technical Support"
  | "Others";

export type UserRole = "student" | "faculty" | "staff" | "head";

export interface Complaint {
  id: string;
  title: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  priority: "Low" | "Medium" | "High";
  submittedBy: string;
  submittedByRole: "student" | "faculty";
  submittedAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

// Dummy users for login
export const dummyUsers: User[] = [
  { id: "1", name: "John Smith", email: "student@university.edu", role: "student", department: "Computer Science" },
  { id: "2", name: "Dr. Sarah Johnson", email: "faculty@university.edu", role: "faculty", department: "Mathematics" },
  { id: "3", name: "Mike Wilson", email: "staff@cms.edu", role: "staff", department: "CMS Operations" },
  { id: "4", name: "Admin Head", email: "head@cms.edu", role: "head", department: "CMS Management" },
];

// Dummy complaints data
export const dummyComplaints: Complaint[] = [
  {
    id: "C001",
    title: "Library AC Not Working",
    category: "Library Services",
    description: "The air conditioning system in the main library reading hall has not been working for the past 3 days. It's very uncomfortable to study.",
    status: "In Progress",
    priority: "High",
    submittedBy: "John Smith",
    submittedByRole: "student",
    submittedAt: "2025-01-15T09:30:00",
    updatedAt: "2025-01-16T14:20:00",
    assignedTo: "Mike Wilson"
  },
  {
    id: "C002",
    title: "Outdated Course Materials",
    category: "Academic Issues",
    description: "The syllabus for Data Structures course contains outdated references and examples. Need updated curriculum.",
    status: "Pending",
    priority: "Medium",
    submittedBy: "Emily Davis",
    submittedByRole: "student",
    submittedAt: "2025-01-16T11:15:00",
    updatedAt: "2025-01-16T11:15:00"
  },
  {
    id: "C003",
    title: "Broken Projector in Room 204",
    category: "Infrastructure",
    description: "The projector in classroom 204 has been malfunctioning. Affecting daily lectures.",
    status: "Resolved",
    priority: "High",
    submittedBy: "Dr. Sarah Johnson",
    submittedByRole: "faculty",
    submittedAt: "2025-01-14T08:45:00",
    updatedAt: "2025-01-15T16:30:00",
    assignedTo: "Mike Wilson"
  },
  {
    id: "C004",
    title: "Cafeteria Food Quality",
    category: "Cafeteria",
    description: "Recent decline in food quality and hygiene standards in the main cafeteria. Multiple students have reported issues.",
    status: "In Progress",
    priority: "High",
    submittedBy: "Alex Johnson",
    submittedByRole: "student",
    submittedAt: "2025-01-15T13:20:00",
    updatedAt: "2025-01-16T10:00:00",
    assignedTo: "Mike Wilson"
  },
  {
    id: "C005",
    title: "Hostel WiFi Connection Issues",
    category: "Hostel Facilities",
    description: "WiFi connectivity in hostel block B has been very poor for the last week. Students unable to attend online classes.",
    status: "Pending",
    priority: "High",
    submittedBy: "Priya Sharma",
    submittedByRole: "student",
    submittedAt: "2025-01-16T07:30:00",
    updatedAt: "2025-01-16T07:30:00"
  },
  {
    id: "C006",
    title: "Delayed Exam Results",
    category: "Administrative",
    description: "Mid-semester exam results have not been published even after 3 weeks. Students are anxious about their performance.",
    status: "In Progress",
    priority: "Medium",
    submittedBy: "Robert Chen",
    submittedByRole: "student",
    submittedAt: "2025-01-15T16:45:00",
    updatedAt: "2025-01-16T09:15:00"
  },
  {
    id: "C007",
    title: "Lab Equipment Shortage",
    category: "Infrastructure",
    description: "Chemistry lab lacks sufficient equipment for all students. Need more microscopes and lab coats.",
    status: "Pending",
    priority: "Medium",
    submittedBy: "Dr. Michael Brown",
    submittedByRole: "faculty",
    submittedAt: "2025-01-16T10:00:00",
    updatedAt: "2025-01-16T10:00:00"
  },
  {
    id: "C008",
    title: "Library Book Renewal System",
    category: "Library Services",
    description: "The online book renewal system is not working properly. Getting error messages constantly.",
    status: "Resolved",
    priority: "Low",
    submittedBy: "Lisa Anderson",
    submittedByRole: "student",
    submittedAt: "2025-01-13T14:20:00",
    updatedAt: "2025-01-14T11:45:00"
  },
  {
    id: "C009",
    title: "Parking Space Issues",
    category: "Infrastructure",
    description: "Insufficient parking space for faculty members. Cars being towed unnecessarily.",
    status: "In Progress",
    priority: "Medium",
    submittedBy: "Dr. James Wilson",
    submittedByRole: "faculty",
    submittedAt: "2025-01-15T08:00:00",
    updatedAt: "2025-01-16T08:30:00"
  },
  {
    id: "C010",
    title: "Sports Equipment Maintenance",
    category: "Infrastructure",
    description: "Basketball court needs maintenance. Several basketballs are deflated and hoops are damaged.",
    status: "Pending",
    priority: "Low",
    submittedBy: "David Martinez",
    submittedByRole: "student",
    submittedAt: "2025-01-16T15:30:00",
    updatedAt: "2025-01-16T15:30:00"
  }
];

export const complaintCategories: ComplaintCategory[] = [
  "Academic Issues",
  "Infrastructure",
  "Hostel Facilities",
  "Library Services",
  "Cafeteria",
  "Administrative",
  "Harassment",
  "Technical Support",
  "Others"
];
