import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Lores from "./pages/Lores.tsx";
import Owners from "./pages/Owners.tsx";
import NotFound from "./pages/NotFound.tsx";
import Nav from "./components/Nav.tsx";
import LorePage from "./pages/lore/LorePage.tsx";
import SignInPage from "./features/auth/pages/SignInPage.tsx";
import SignUpPage from "./features/auth/pages/SignUpPage.tsx";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage.tsx";
import {
  FORGOT_PASSWORD_PATH,
  SIGNIN_PATH,
  SIGNUP_PATH,
} from "./features/auth/model/authPaths.ts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lores" element={<Lores />} />
          <Route path="/owners" element={<Owners />} />
          <Route path="/lores/:id" element={<LorePage />} />
          <Route path={SIGNIN_PATH} element={<SignInPage />} />
          <Route path={SIGNUP_PATH} element={<SignUpPage />} />
          <Route path={FORGOT_PASSWORD_PATH} element={<ForgotPasswordPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
