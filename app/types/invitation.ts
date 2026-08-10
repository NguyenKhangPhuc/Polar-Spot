import { Database } from "./database.types"

export type Invitation = Database["public"]["Tables"]["invitations"]["Row"]

export type InvitationInsert = Database["public"]["Tables"]["invitations"]["Insert"]