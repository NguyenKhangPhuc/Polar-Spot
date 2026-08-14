import { getAllEvents } from "@/app/actions/events";
import EventsClient from "./components/EventsClient";

/**
 * PURPOSE:
 * Server Component for the Events Explorer portal at 'app/events/page.tsx'.
 * Fetches all events from the database using getAllEvents server action and renders the client component.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/events/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

export default async function Page() {
  /**
   * BEHAVIORAL MECHANISM:
   * Fetches events via getAllEvents server action on the server.
   * Renders the modular EventsClient component directly matching groups-management page architecture.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - JSX.Element: Rendered page container with EventsClient.
   */
  const { data: eventsData } = await getAllEvents();

  return <EventsClient events={eventsData || []} />;
}
