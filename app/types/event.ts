import { Database } from "./database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"] & {
  title?: string | null;
  poster_path?: string | null;
};

export type EventInsert = Database["public"]["Tables"]["events"]["Insert"] & {
  title?: string | null;
  poster_path?: string | null;
};