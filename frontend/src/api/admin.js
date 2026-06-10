import { API } from '../utils/config';
import { isAuthenticated } from "../auth";

export const createCategory = (userId, _token, category) => {
    return fetch(`${API}/category/create/${userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    }).then(r => r.json()).catch(err => console.log(err));
}

export const createProduct = (userId, _token, product) => {
    return fetch(`${API}/product/create/${userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        body: product
    }).then(r => r.json()).catch(err => console.log(err));
}

export const getCategories = () => {
    return fetch(`${API}/category/all`, {
        method: 'GET',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    }).then(r => r.json()).catch(err => console.log(err));
}

export const listOrders = () => {
    const { user } = isAuthenticated();
    return fetch(`${API}/order/list/${user._id}`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    }).then(r => r.json()).catch(err => console.log(err));
}

export const getStatusValues = () => {
    const { user } = isAuthenticated();
    return fetch(`${API}/order/status-values/${user._id}`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    }).then(r => r.json()).catch(err => console.log(err));
}

export const updateOrderStatus = (orderId, status) => {
    const { user } = isAuthenticated();
    return fetch(`${API}/order/${orderId}/status/${user._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, orderId })
    }).then(r => r.json()).catch(err => console.log(err));
}

export const getProducts = () => {
    return fetch(`${API}/products?limit=10`, { method: "GET" })
        .then(r => r.json()).catch(err => console.log(err));
};

export const deleteProduct = (productId) => {
    const { user } = isAuthenticated();
    return fetch(`${API}/product/${productId}/${user._id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: { Accept: "application/json", "Content-Type": "application/json" }
    }).then(r => r.json()).catch(err => console.log(err));
};

export const updateProduct = (productId, product) => {
    const { user } = isAuthenticated();
    return fetch(`${API}/product/${productId}/${user._id}`, {
        method: "PUT",
        credentials: 'include',
        headers: { Accept: "application/json" },
        body: product
    }).then(r => r.json()).catch(err => console.log(err));
};
