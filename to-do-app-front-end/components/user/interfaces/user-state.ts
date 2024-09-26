import { UserDetails } from "./user-details";

export interface UserState {
  userDetails: UserDetails | null;
  jwtToken: string | null;
}
