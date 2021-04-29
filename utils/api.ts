import { User, Friend, List } from "../types";

function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

// User

export function fetchTwitterRequestToken(): Promise<{ requestToken: string }> {
  return fetch(`/api/twitter-login?site_url=${window.location.origin}`)
    .then(handleErrors)
    .then((response) => response.json());
}

export function fetchUser(): Promise<User> {
  return fetch(`/api/user`)
    .then(handleErrors)
    .then((response) => response.json());
}

export function logOut() {
  return fetch(`/api/logout`).then(handleErrors);
}

// Following

export function fetchFriends(userId: string): Promise<Friend[]> {
  return fetch(`/api/friends?user_id=${userId}`)
    .then(handleErrors)
    .then((response) => response.json());
}

// Lists

export function fetchLists(): Promise<List[]> {
  return fetch(`/api/list`)
    .then(handleErrors)
    .then((response) => response.json());
}

export function createList(list: {
  name: string;
  description: string;
  mode: "private" | "public";
}) {
  return fetch(`/api/list/create`, {
    method: "post",
    body: JSON.stringify(list),
  })
    .then(handleErrors)
    .then((response) => response.json());
}

export function deleteList(listId: string) {
  return fetch(`/api/list/${listId}`, {
    method: "delete",
  }).then(handleErrors);
}

// List members

export function fetchListMembers(listId: string): Promise<Friend[]> {
  return fetch(`/api/list/${listId}/get-members`)
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
  return fetch(`/api/list/${listId}/add-members`, {
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
  return fetch(`/api/list/${listId}/remove-member`, {
    method: "post",
    body: JSON.stringify({
      user_id: userId,
    }),
  }).then(handleErrors);
}
