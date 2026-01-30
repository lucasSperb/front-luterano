import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          isAuthenticated()
            ? <Dashboard />
            : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
}
