import { request } from './api';

export function getUsers() {
  return request('/users');
}

export function getUserById(id) {
  return request(`/users/${id}`);
}

export function createUser(payload) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateUser(id, payload) {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteUser(id) {
  return request(`/users/${id}`, {
    method: 'DELETE',
  });
}
