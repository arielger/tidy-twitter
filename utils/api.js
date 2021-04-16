import { API_URL } from "./env-variables";

// @TODO: Add error handling

export const fetchUser = () => {
  return fetch(`${API_URL}/user`).then((response) => response.json());
};

export const fetchFriends = () => {
  return fetch(`${API_URL}/friends`).then((response) => response.json());
};

export const fetchLists = () => {
  return fetch(`${API_URL}/list`).then((response) => response.json());
};

export const fetchListMembers = (listId) => {
  return fetch(`${API_URL}/list/${listId}/get-members`).then((response) =>
    response.json()
  );
};

export const addListMembers = ({ listId, usersIds }) => {
  return fetch(`${API_URL}/list/${listId}/add-members`, {
    method: "post",
    body: JSON.stringify({
      user_id: usersIds.join(","),
    }),
  }).then((response) => response.json());
};
