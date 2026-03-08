// User roles
export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'accountant';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  phone?: string;
  schoolId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profileId?: string | null;
  classId?: string | null;
  parentId?: string | null;
  classIds?: string[];
  childIds?: string[];
}

// School interface
export interface School {
  id: string;
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  timezone: string;
  currency: string;
  academicYear: string;
  termDates: {
    term1: { start: string; end: string };
    term2: { start: string; end: string };
    term3: { start: string; end: string };
  };
  createdAt: string;
}

// Student interface
export interface Student extends User {
  studentId: string;
  classId: string;
  parentIds: string[];
  admissionDate: string;
  bloodGroup?: string;
  medicalConditions?: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Teacher interface
export interface Teacher extends User {
  employeeId: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  experience: number;
  salary?: number;
  joiningDate: string;
}

// Parent interface
export interface Parent extends User {
  children: string[]; // Student IDs
  occupation?: string;
}

// Class interface
export interface Class {
  id: string;
  name: string;
  grade: number;
  section: string;
  teacherId: string; // Class teacher
  subjects: string[];
  studentIds: string[];
  capacity: number;
  room?: string;
  schoolId: string;
}

// Subject interface
export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacherIds: string[];
  classIds: string[];
  credits: number;
  schoolId: string;
}

// Attendance interface
export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string; // Teacher ID
  notes?: string;
  createdAt: string;
}

// Grade interface
export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  assessmentType: 'quiz' | 'test' | 'assignment' | 'exam' | 'project';
  assessmentName: string;
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  date: string;
  teacherId: string;
  comments?: string;
}

// Fee interface
export interface Fee {
  id: string;
  studentId: string;
  type: 'tuition' | 'transport' | 'library' | 'lab' | 'sports' | 'other';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;
  paidDate?: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'online';
  description: string;
  academicYear: string;
  term: string;
}

// Notice interface
export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event' | 'holiday' | 'exam';
  targetRoles: UserRole[];
  targetClasses?: string[];
  attachments?: string[];
  publishedBy: string;
  publishedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface Notification {
  id?: string;
  _id?: string;
  title: string;
  message: string;
  type: 'notice' | 'system' | 'payment' | 'report';
  isRead: boolean;
  relatedNotice?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// Timetable interface
export interface TimetableSlot {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  room?: string;
}

// Dashboard stats interfaces
export interface AdminDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
  outstandingFees: number;
  recentNotices: Notice[];
}

export interface TeacherDashboardStats {
  todayClasses: TimetableSlot[];
  pendingGrading: number;
  attendanceToMark: number;
  recentMessages: number;
}

export interface StudentDashboardStats {
  todayClasses: TimetableSlot[];
  upcomingExams: number;
  attendanceRate: number;
  recentGrades: Grade[];
}

export interface ParentDashboardStats {
  children: Student[];
  attendanceSummary: { [studentId: string]: number };
  pendingFees: Fee[];
  recentNotices: Notice[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  errors?: unknown;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  schoolId?: string;
}

export interface SchoolSignupForm {
  schoolName: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  password: string;
  confirmPassword: string;
  schoolAddress: string;
  schoolPhone: string;
  timezone: string;
  currency: string;
}

export interface StudentForm {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  address: string;
  classId: string;
  parentIds: string[];
  bloodGroup?: string;
  medicalConditions?: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface TeacherForm {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  address: string;
  subjects: string[];
  qualification: string;
  experience: number;
  joiningDate: string;
}
