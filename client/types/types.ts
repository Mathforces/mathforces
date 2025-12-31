export interface Problem {
  id: number;
  name: string;
  num_submissions: number;
  num_correct_submissions: number;
  points: number;
}
export interface Contest {
  id: string;
  name: string;
  description: string;
  like: number;
  difficulty: number;
  authors_ids: null | string;
  number_of_registered: string;
  topics: null | string;
  end_date: Date;
  start_date: Date;
  created_at: Date;
}
