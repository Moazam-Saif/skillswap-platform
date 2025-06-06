import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
// import SignupForm from './components/SignupForm';
// import PrivateRoute from './components/PrivateRoute';
// import Dashboard from './components/Dashboard'; // Protected

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          {/* <Route path="/signup" element={<SignupForm />} /> */}
          {/* <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
