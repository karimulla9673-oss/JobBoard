import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import JobDetails from './pages/JobDetails';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>

            {/* Main Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Correct Dynamic Route */}
            <Route path="/jobs/:id/:slug" element={<JobDetails />} />

            {/* Catch-all route (always last) */}
            <Route path="*" element={<Home />} />

          </Routes>
        </main>

        <Footer />

        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
