import Navbar from './components/Navbar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Resume from './pages/Resume';
import Contact from './components/Contact';
import './App.css';
import Layout from './components/Layout';
import Profile from './components/Profile';
import SignIn from './pages/Auth/SignIn';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/LandingPage';
import UserProfile from './pages/UserProfile';
import Templates from './pages/Templates';
import Education from './components/Education';
import Projects from './components/Project';
import Experience from './components/Experience';
import ExtraDetails from './components/ExtraDetails';
import ResumeLayout from './components/ResumeLayout';
import ErrorPage from './pages/ErrorPage';
// ✅ ADD THIS IMPORT
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo
      light: 'rgba(99, 102, 241, 0.15)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981', // Emerald
      light: 'rgba(16, 185, 129, 0.15)',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: 'rgba(16, 185, 129, 0.15)',
    },
    warning: {
      main: '#f59e0b',
      light: 'rgba(245, 158, 11, 0.15)',
    },
    info: {
      main: '#3b82f6',
      light: 'rgba(59, 130, 246, 0.15)',
    },
    error: {
      main: '#ef4444',
      light: 'rgba(239, 68, 68, 0.15)',
    },
    background: {
      default: '#0b0f19',
      paper: '#111827',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(17, 24, 39, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.22)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 16px rgba(99, 102, 241, 0.08)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'rgba(99, 102, 241, 0.42)',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.45), 0 0 24px rgba(99, 102, 241, 0.18)',
          }
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
      },
    },
  },
});

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <Navbar />
              <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/sign-in' element={<SignIn />} />
              <Route element={<Layout />}>
                <Route path='/user-profile' element={<UserProfile />} />
                <Route path='/templates' element={<Templates />} />
                
                <Route element={<ResumeLayout />}>
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/education' element={<Education />} />
                  <Route path='/projects' element={<Projects />} />
                  <Route path='/experience' element={<Experience />} />
                  <Route path='/extraDetails' element={<ExtraDetails />} />
                  {/* ✅ CHANGE THIS LINE from <div /> to your component */}
                  <Route path='/resume-analysis' element={<ResumeAnalysisPage />} />
                </Route>
                <Route path='/resume/:template' element={<Resume />} />
                <Route path='/contact-us' element={<Contact />} />
                <Route path='*' element={<ErrorPage />} />
              </Route>
            </Routes>
            </BrowserRouter>
            <ToastContainer />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
