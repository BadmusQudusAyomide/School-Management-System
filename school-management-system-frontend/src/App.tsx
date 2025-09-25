import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import DashboardRouter from './components/dashboard/DashboardRouter';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
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
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Students Management</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="teachers" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Teachers Management</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="classes" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Classes Management</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="timetable" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Timetable</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="attendance" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Attendance</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="grades" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Grades & Assessments</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="fees" element={
              <ProtectedRoute allowedRoles={['admin', 'accountant', 'parent']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Fees & Payments</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="notices" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Notices & Documents</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="reports" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'accountant']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Settings</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="notifications" element={
              <ProtectedRoute>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-white">Notifications</h2>
                  <p className="text-white/70 mt-2">Coming soon...</p>
                </div>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
