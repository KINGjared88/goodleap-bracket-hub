import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/hooks/use-app-data";
import { AppNav } from "@/components/AppNav";
import HomePage from "@/pages/HomePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import PlayersListPage from "@/pages/PlayersListPage";
import PlayerDetailPage from "@/pages/PlayerDetailPage";
import ContestantsPage from "@/pages/ContestantsPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import ExternalNewsPage from "@/pages/ExternalNewsPage";
import SetupGuidePage from "@/pages/SetupGuidePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DataProvider>
          <AppNav />
          <main className="container max-w-4xl py-6 pb-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/players" element={<PlayersListPage />} />
              <Route path="/players/:playerId" element={<PlayerDetailPage />} />
              <Route path="/contestants" element={<ContestantsPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/external-news" element={<ExternalNewsPage />} />
              <Route path="/setup-guide" element={<SetupGuidePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </DataProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
