import { Database } from "./database.types"

export type Group = Database["public"]["Tables"]["groups"]["Row"]

export type GroupInsert = Database["public"]["Tables"]["groups"]["Insert"]