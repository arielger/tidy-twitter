import { API_URL } from "./env-variables";

import { User, Friend, List } from "../types";

// @TODO: Add error handling for all requesters

export function fetchTwitterRequestToken(): Promise<string> {
  return fetch(`${API_URL}/twitter-login`).then((response) => response.json());
}

export function fetchUser(): Promise<User> {
  return fetch(`${API_URL}/user`).then((response) => response.json());
}

export function fetchFriends(): Promise<Friend[]> {
  return fetch(`${API_URL}/friends`).then((response) => response.json());
}

export function fetchLists(): Promise<List[]> {
  return fetch(`${API_URL}/list`).then((response) => response.json());
}

export function fetchListMembers(listId: string): Promise<Friend[]> {
  return fetch(`${API_URL}/list/${listId}/get-members`).then((response) =>
    response.json()
  );
}

export const addListMembers = ({
  listId,
  usersIds,
}: {
  listId: string;
  usersIds: number[];
}) => {
  return fetch(`${API_URL}/list/${listId}/add-members`, {
    method: "post",
    body: JSON.stringify({
      user_id: usersIds.join(","),
    }),
  }).then((response) => response.json());
};
