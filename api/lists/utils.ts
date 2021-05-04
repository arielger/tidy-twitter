import { List } from "../../types";

export type TwitterApiList = List & {
  id_str: string;
};

export const transformListFromApi = ({
  id_str,
  name,
  description,
  uri,
  mode,
  member_count,
  created_at,
}: TwitterApiList): List => ({
  id: id_str,
  name,
  description,
  uri,
  mode,
  member_count,
  created_at,
});
