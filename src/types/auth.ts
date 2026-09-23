export type TargetScore = "450+" | "650+" | "800+" | "900+";

export type AvatarIcon = "seed" | "owl" | "crown" | "rocket" | "star";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: AvatarIcon;
  targetScore: TargetScore;
  createdAt: string;
  streak: number;
  xp: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  targetScore?: TargetScore;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: AvatarIcon;
  targetScore?: TargetScore;
}
