import { ExploreWorkspacePage } from "@/pages/Explore/ExplorePage";

export default function EventsPage() {
  return (
    <ExploreWorkspacePage
      forcedTab="events"
      title="Etkinlikler"
      description="Kampüsteki etkinlikleri takip et, kayıt ol ve yaklaşan organizasyonları tek yerden gör."
    />
  );
}
