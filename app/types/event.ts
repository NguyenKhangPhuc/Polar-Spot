import { Database } from "./database.types"

export type Event = Database["public"]["Tables"]["events"]["Row"]

export type EventInsert = Database["public"]["Tables"]["events"]["Insert"]