import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Academics } from "./pages/Academics";
import { Admissions } from "./pages/Admissions";
import { News } from "./pages/News";
import { NewsDetail } from "./pages/NewsDetail";
import { Gallery } from "./pages/Gallery";
import { Faculty } from "./pages/Faculty";
import { Contact } from "./pages/Contact";
import { Chatbot } from "./components/Chatbot";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/academics" component={Academics} />
      <Route path="/admissions" component={Admissions} />
      <Route path="/news" component={News} />
      <Route path="/news/:id" component={NewsDetail} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/faculty" component={Faculty} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <Chatbot />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
