import { request } from './api';

export function getOrders() {
  return request('/orders');
}

export function getOrderById(id) {
  return request(`/orders/${id}`);
}

export function createOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateOrder(id, payload) {
  return request(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteOrder(id) {
  return request(`/orders/${id}`, {
    method: 'DELETE',
  });
}
