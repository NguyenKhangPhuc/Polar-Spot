import { Database } from "./database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"] & {
  poster_path?: string | null;
};

export type EventInsert = Database["public"]["Tables"]["events"]["Insert"] & {
  poster_path?: string | null;
};