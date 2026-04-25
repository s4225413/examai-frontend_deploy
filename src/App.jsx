import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AvailableExams from './pages/AvailableExams';
import CreateExam from './pages/CreateExam';
import ExamInterface from './pages/ExamInterface';
import AIProctorScreen from './pages/AIProctorScreen';
import ExamSubmission from './pages/ExamSubmission';
import ExamInstructions from './pages/ExamInstructions';
import StudentProfile from './pages/StudentProfile';
import InstructorDashboard from './pages/InstructorDashboard';
import QuestionBank from './pages/QuestionBank';
import UserManagement from './pages/UserManagement';
import LiveMonitoring from './pages/LiveMonitoring';
import AdminDashboard from './pages/AdminDashboard';
import ResultPage from './pages/ResultPage';
import AILogs from './pages/AILogs';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';
import Contact from './pages/Contact';

import './App.css';

// Layout wrapper that shows sidebar for dashboard pages
function DashboardLayout({ children }) {
  return (
    <div className="page-wrapper">
      <Sidebar />
      {children}
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  // Pages that should NOT show navbar/footer
  const examPages = ['/exam/'];
  const isExamPage = examPages.some(p => location.pathname.startsWith(p));
  // Pages that should show sidebar
  const dashPages = ['/dashboard', '/exams', '/results', '/profile', '/instructor', '/create-exam', '/question-bank', '/monitoring', '/admin', '/users', '/ai-logs', '/proctor-screen'];
  const isDashPage = dashPages.some(p => location.pathname.startsWith(p));
  // Pages that show footer (public pages only)
  const showFooter = ['/', '/login', '/register', '/help', '/privacy', '/terms', '/about', '/contact'].includes(location.pathname);

  return (
    <>
      {!isExamPage && <Navbar />}
      {isDashPage ? (
        <DashboardLayout>
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute><AvailableExams /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/instructor" element={<ProtectedRoute roles={['instructor', 'admin']}><InstructorDashboard /></ProtectedRoute>} />
            <Route path="/create-exam" element={<ProtectedRoute roles={['instructor', 'admin']}><CreateExam /></ProtectedRoute>} />
            <Route path="/question-bank" element={<ProtectedRoute roles={['instructor', 'admin']}><QuestionBank /></ProtectedRoute>} />
            <Route path="/monitoring" element={<ProtectedRoute roles={['instructor', 'admin']}><LiveMonitoring /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/ai-logs" element={<ProtectedRoute roles={['admin', 'instructor']}><AILogs /></ProtectedRoute>} />
            <Route path="/proctor-screen" element={<ProtectedRoute><AIProctorScreen /></ProtectedRoute>} />
          </Routes>
        </DashboardLayout>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exam-instructions/:examId" element={<ProtectedRoute><ExamInstructions /></ProtectedRoute>} />
          <Route path="/exam/:examId" element={<ProtectedRoute><ExamInterface /></ProtectedRoute>} />
          <Route path="/exam-submission/:submissionId" element={<ProtectedRoute><ExamSubmission /></ProtectedRoute>} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      )}
      {showFooter && <Footer />}
      <Chatbot />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
