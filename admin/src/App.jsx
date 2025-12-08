import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadJob from './pages/UploadJob';
import ManageJobs from './pages/ManageJobs';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './utils/auth';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} 
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/upload-job"
            element={
              <ProtectedRoute>
                <UploadJob />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manage-jobs"
            element={
              <ProtectedRoute>
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;