import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AuthPromptProvider } from "./context/AuthPromptContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { MiniPlayerProvider } from "./context/MiniPlayerContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import MiniPlayer from "./components/MiniPlayer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import ClassesPage from "./pages/ClassesPage.jsx";
import VideosPage from "./pages/VideosPage.jsx";
import WatchHistoryPage from "./pages/WatchHistoryPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import ContinueWatchingPage from "./pages/ContinueWatchingPage.jsx";
import ClassPage from "./pages/ClassPage.jsx";
import SubjectPage from "./pages/SubjectPage.jsx";
import CollegePage from "./pages/CollegePage.jsx";
import ChapterPage from "./pages/ChapterPage.jsx";
import VideoPage from "./pages/VideoPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import NotesPage from "./pages/NotesPage.jsx";
import UserPlaylistsPage from "./pages/UserPlaylistsPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <AuthPromptProvider>
          <MiniPlayerProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/videos" element={<VideosPage />} />
              {/* Protected routes - require login */}
              <Route
                path="/history"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <WatchHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/continue-watching"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <ContinueWatchingPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/class/:classId" element={<ClassPage />} />
              <Route path="/college" element={<CollegePage />} />
              <Route path="/subject/:subjectId" element={<SubjectPage />} />
              <Route path="/chapter/:chapterId" element={<ChapterPage />} />
              <Route path="/video/:videoId" element={<VideoPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <NotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/playlists"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <UserPlaylistsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              {/* Admin route - protected, requires admin role */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MiniPlayer />
          </MiniPlayerProvider>
        </AuthPromptProvider>
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
