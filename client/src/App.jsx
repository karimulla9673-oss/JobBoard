import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
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
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id/:slug?" element={<JobDetails />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;