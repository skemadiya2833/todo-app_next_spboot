import { UserDetails } from "./user-details";

export interface LoginResponse {
  user: UserDetails;
  token: string;
}
