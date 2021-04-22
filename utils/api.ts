import { API_URL } from "./env-variables";

import { User, Friend, List } from "../types";

function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function fetchTwitterRequestToken(): Promise<{ requestToken: string }> {
  return fetch(`${API_URL}/twitter-login`)
    .then(handleErrors)
    .then((response) => response.json());
}

export function fetchUser(): Promise<User> {
  return fetch(`${API_URL}/user`)
    .then(handleErrors)
    .then((response) => response.json());
}

export function fetchFriends(): Promise<Friend[]> {
  return fetch(`${API_URL}/friends`)
    .then(handleErrors)
    .then((response) => response.json());
}

// Lists

export function fetchLists(): Promise<List[]> {
  return fetch(`${API_URL}/list`)
    .then(handleErrors)
    .then((response) => response.json());
}

export function createList(list: {
  name: string;
  description: string;
  isPrivate: boolean;
}) {
  const transformToApi = ({ isPrivate, ...list }: { isPrivate: boolean }) => ({
    ...list,
    mode: isPrivate ? "private" : "public",
  });

  return fetch(`${API_URL}/list/create`, {
    method: "post",
    body: JSON.stringify(transformToApi(list)),
  })
    .then(handleErrors)
    .then((response) => response.json());
}

// List members

export function fetchListMembers(listId: string): Promise<Friend[]> {
  return fetch(`${API_URL}/list/${listId}/get-members`)
    .then(handleErrors)
    .then((response) => response.json());
}

export function addListMembers({
  listId,
  usersIds,
}: {
  listId: string;
  usersIds: string[];
}) {
  return fetch(`${API_URL}/list/${listId}/add-members`, {
    method: "post",
    body: JSON.stringify({
      user_id: usersIds.join(","),
    }),
  }).then(handleErrors);
}

export function removeListMember({
  listId,
  userId,
}: {
  listId: string;
  userId: string;
}) {
  return fetch(`${API_URL}/list/${listId}/remove-member`, {
    method: "post",
    body: JSON.stringify({
      user_id: userId,
    }),
  }).then(handleErrors);
}
