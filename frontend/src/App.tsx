import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PostRidePage from './pages/PostRidePage';
import MyRidesPage from './pages/MyRidesPage';
import EditRidePage from './pages/EditRidePage';
import SearchRidesPage from './pages/SearchRidesPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import TrackingPage from './pages/TrackingPage';
import ChatPage from './pages/ChatPage';
import ReceiptPage from './pages/ReceiptPage';
import EcoPage from './pages/EcoPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/bookings/:id" element={<BookingDetailPage />} />
              <Route path="/bookings/:id/tracking" element={<TrackingPage />} />
              <Route path="/bookings/:id/chat" element={<ChatPage />} />
              <Route path="/bookings/:id/receipt" element={<ReceiptPage />} />
              <Route path="/eco" element={<EcoPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['RIDER']} />}>
            <Route element={<Layout />}>
              <Route path="/rides" element={<MyRidesPage />} />
              <Route path="/rides/new" element={<PostRidePage />} />
              <Route path="/rides/:id/edit" element={<EditRidePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['COMMUTER']} />}>
            <Route element={<Layout />}>
              <Route path="/search" element={<SearchRidesPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route element={<Layout />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
