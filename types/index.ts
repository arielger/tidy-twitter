export type Friend = {
  id: number;
  name: string;
  screen_name: string;
  description: string;
  url: string;
  followers_count: number;
  friends_count: number;
  statuses_count: number;
  profile_image_url: string;
};

export type List = {
  id: string;
  name: string;
  uri: string;
  mode: "public" | "private";
  member_count: number;
  created_at: string;
};

export type User = {
  id: number;
  name: string;
  screen_name: string;
  description: string;
  profile_image_url: string;
};
