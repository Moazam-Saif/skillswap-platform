import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/configureStore';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx'; // Add this import
import LandingPage from './components/LandingPage.jsx';
import LoginForm from './components/LoginForm.jsx';
import SignupForm from './components/SignupForm.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProfileUpdate from './components/ProfileUpdate.jsx';
import RequestsPage from './components/RequestsPage.jsx';
import SessionsPage from './components/SessionsPage.jsx';
import UserSearchPage from './components/SearchPage.jsx';
import UserProfileView from './components/ProfilePage.jsx';
import EmailVerification from './components/EmailVerification.jsx';
import MeetingRoom from './components/MeetingRoom';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes - NO FOOTER */}
            <Route path="/search" element={<UserSearchPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<SignupForm />} />
            <Route path="/verify-email" element={<EmailVerification />} />

            {/* Protected Routes - WITH FOOTER */}
            <Route
              path="/dashboard/:userId"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute>
                  <Layout>
                    <ProfileUpdate />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users/swap-requests"
              element={
                <PrivateRoute>
                  <Layout>
                    <RequestsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/active-requests"
              element={
                <PrivateRoute>
                  <Layout>
                    <SessionsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users/profile/show/:userId"
              element={
                <PrivateRoute>
                  <Layout>
                    <UserProfileView />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route 
              path="/meeting/:sessionId/:slotIndex"
              element={
                <PrivateRoute>
                  <Layout>
                    <MeetingRoom />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;