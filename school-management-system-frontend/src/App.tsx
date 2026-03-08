import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import AdminSignup from './pages/auth/AdminSignup';
import DashboardRouter from './components/dashboard/DashboardRouter';
import { NotificationsProvider } from './contexts/NotificationsContext';
import NotificationsPage from './pages/notifications/NotificationsPage';
import StudentsPage from './pages/management/StudentsPage';
import TeachersPage from './pages/management/TeachersPage';
import ClassesPage from './pages/management/ClassesPage';
import AttendancePage from './pages/management/AttendancePage';
import TimetablePage from './pages/management/TimetablePage';
import ExamsPage from './pages/management/ExamsPage';
import GradesPage from './pages/management/GradesPage';
import FeesPage from './pages/management/FeesPage';
import NoticesPage from './pages/management/NoticesPage';
import ReportsPage from './pages/management/ReportsPage';
import SettingsPage from './pages/management/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NotificationsProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<AdminSignup />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardRouter />} />

              {/* Admin Routes */}
              <Route path="students" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <StudentsPage />
                </ProtectedRoute>
              } />

              <Route path="teachers" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TeachersPage />
                </ProtectedRoute>
              } />

              <Route path="classes" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <ClassesPage />
                </ProtectedRoute>
              } />

              <Route path="timetable" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                  <TimetablePage />
                </ProtectedRoute>
              } />

              <Route path="attendance" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <AttendancePage />
                </ProtectedRoute>
              } />

              <Route path="exams" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                  <ExamsPage />
                </ProtectedRoute>
              } />

              <Route path="grades" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <GradesPage />
                </ProtectedRoute>
              } />

              <Route path="fees" element={
                <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                  <FeesPage />
                </ProtectedRoute>
              } />

              <Route path="notices" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                  <NoticesPage />
                </ProtectedRoute>
              } />

              <Route path="reports" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher', 'accountant']}>
                  <ReportsPage />
                </ProtectedRoute>
              } />

              <Route path="settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SettingsPage />
                </ProtectedRoute>
              } />

              <Route path="notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={
              <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">403</h1>
                  <p className="text-white/70 mb-4">You don't have permission to access this page.</p>
                  <button 
                    onClick={() => window.history.back()}
                    className="btn-primary px-6 py-2 rounded-lg"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </NotificationsProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
