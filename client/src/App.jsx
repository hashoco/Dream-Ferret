import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Header from './component/Header';
import Hero from './component/Hero';
import SnsFloatingBar from './component/SnsFloatingBar';
import KidsSection from './component/KidsSection';
import FerretCare from './component/FerretCare';
import FerretGallery from './component/FerretGallery';
import Footer from './component/Footer';
import OAuthCallback from './pages/OAuthCallback';
import RegisterPage from './pages/RegisterPage';
import FerretInfo from './pages/FerretInfo';
import { AuthProvider } from './context/AuthContext';
import AboutFerretPage from './pages/AboutFerretPage';
import McpPage from './component/McpChat';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Hero />
                <SnsFloatingBar />
                <KidsSection />
                <FerretCare />
                <FerretGallery />
              </MainLayout>
            }
          />

          <Route
            path="/ferretInfo"
            element={
              <MainLayout>
                <FerretInfo />
              </MainLayout>
            }
          />
          <Route
            path="/aboutFerret"
            element={
              <MainLayout>
                <AboutFerretPage />
              </MainLayout>
            }
          />


          <Route
            path="/registerPage"
            element={
              <MainLayout>
                <RegisterPage />
              </MainLayout>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route
            path="/mcp"
            element={
              <MainLayout>
                <McpPage />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;