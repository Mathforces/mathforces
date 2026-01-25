export const contestProblemDefaultValues = {
  id: 0,
  name: "",
  num_submissions: 0,
  num_correct_submissions: 0,
  points: 0,
  likes: 0,
  comments_num: 0,
} as const;
export type contestProblem = {
  [k in keyof typeof contestProblemDefaultValues]: (typeof contestProblemDefaultValues)[k];
};
export interface FullProblem {
  id: number;
  name: string;
  num_submissions: number;
  num_correct_submissions: number;
  points: number;
  likes: number;
  comments_num: number;
  tags: string[];
  description_latex: string;
  description_html: string;
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

export interface UserProfile{
  id: string;
  created_at: Date;
  updated_at: Date;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  image: string;
  bio: string;
}
