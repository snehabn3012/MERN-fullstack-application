import { API } from '../utils/config';

export const createOrder = (userId, _token, createOrderData) => {
    return fetch(`${API}/order/create/${userId}`, {
        method: "POST",
        credentials: 'include',
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ order: createOrderData })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};