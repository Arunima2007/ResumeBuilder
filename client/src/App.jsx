import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/sign-in' element={<SignIn />} />
              <Route element={<Layout />}>
                <Route path='/user-profile' element={<UserProfile />} />
                <Route path='/templates' element={<Templates />} />
                
                {/* ✅ Resume Analysis is handled within ResumeLayout - remove this separate route */}
                {/* <Route path='/resume-analysis' element={<ResumeAnalysisPage />} /> */}
                
                <Route element={<ResumeLayout />}>
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/education' element={<Education />} />
                  <Route path='/projects' element={<Projects />} />
                  <Route path='/experience' element={<Experience />} />
                  <Route path='/extraDetails' element={<ExtraDetails />} />
                  {/* ✅ Add resume-analysis as a nested route inside ResumeLayout */}
                  <Route path='/resume-analysis' element={<div />} />
                </Route>
                <Route path='/resume/:template' element={<Resume />} />
                <Route path='/contact-us' element={<Contact />} />
                <Route path='*' element={<ErrorPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
