import { request } from './api';

export function getProducts() {
  return request('/products');
}

export function getProductById(id) {
  return request(`/products/${id}`);
}

export function createProduct(payload) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id, payload) {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: 'DELETE',
  });
}
