import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Boards from './pages/Boards';
import BoardDetail from './pages/BoardDetail';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-lg text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/boards" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/boards" replace /> : <Register />}
      />
      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <Boards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/boards/:id"
        element={
          <ProtectedRoute>
            <BoardDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/boards" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
