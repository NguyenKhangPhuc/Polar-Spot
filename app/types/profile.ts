import { Database } from "./database.types"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  created_at?: string | null;
}

export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"] & {
  created_at?: string | null;
}