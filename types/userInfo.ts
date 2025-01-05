import { Goal } from "./goal";

export type UserInfo = {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: string;
  goals: Goal[] | [];
  completedGoals: Goal[] | [];
  rewardPoints: number;
}
