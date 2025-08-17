import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'; // Add this import
import store from './store/configureStore'; // Add this import
import { AuthProvider } from './context/AuthContext.jsx';
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
    <Provider store={store}> {/* Add Redux Provider */}
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/search" element={<UserSearchPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<SignupForm />} />
            <Route path="/verify-email" element={<EmailVerification />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard/:userId"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute>
                  <ProfileUpdate />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/swap-requests"
              element={
                <PrivateRoute>
                  <RequestsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/active-requests"
              element={
                <PrivateRoute>
                  <SessionsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/profile/show/:userId"
              element={
                <PrivateRoute>
                  <UserProfileView />
                </PrivateRoute>
              }
            />
            <Route path="/meeting/:sessionId/:slotIndex"
              element={
              <PrivateRoute>
                <MeetingRoom />
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