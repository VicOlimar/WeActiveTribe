import { User } from '../../../../api/Users/Users';

export type WaitingWithUser = {
  id: number;
  canceled: boolean;
  date: string;
  reserved_at: string | null;
  reserve_id: string | null;
  lesson_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: User;
};
