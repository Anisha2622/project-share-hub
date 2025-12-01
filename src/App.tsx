import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HRLogin from "./pages/HRLogin";
import HRRegister from "./pages/HRRegister";
import HRDashboard from "./pages/HRDashboard";
import CandidateLogin from "./pages/CandidateLogin";
import CandidateRegister from "./pages/CandidateRegister";
import CandidateDashboard from "./pages/CandidateDashboard";
import JobDetails from "./pages/JobDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hr/login" element={<HRLogin />} />
          <Route path="/hr/register" element={<HRRegister />} />
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/candidate/login" element={<CandidateLogin />} />
          <Route path="/candidate/register" element={<CandidateRegister />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/jobs/:id" element={<JobDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
