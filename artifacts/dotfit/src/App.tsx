import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

const Admin = lazy(() => import("@/pages/admin"));
const Guide = lazy(() => import("@/pages/guide"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#f8fbf3]">
      <div className="h-1 bg-primary/10">
        <div className="h-full w-1/3 bg-primary animate-pulse" />
      </div>
      <div className="container mx-auto px-4 md:px-6 py-10 space-y-4">
        <div className="h-8 w-44 rounded bg-primary/10 animate-pulse" />
        <div className="h-4 w-full max-w-3xl rounded bg-primary/10 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-56 rounded-2xl bg-white/70 animate-pulse" />
          <div className="h-56 rounded-2xl bg-white/70 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin">
        <Suspense fallback={<PageLoader />}>
          <Admin />
        </Suspense>
      </Route>
      <Route path="/guide">
        <Suspense fallback={<PageLoader />}>
          <Guide />
        </Suspense>
      </Route>
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
