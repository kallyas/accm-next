import { EventsManager } from "@/components/admin/events-manager";

export default function AdminEventsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
      <EventsManager />
    </div>
  );
}
