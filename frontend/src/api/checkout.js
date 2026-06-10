import { API } from '../utils/config';

// export const getBraintreeClientToken = (userId, token) => {
//     return fetch(`${API}/braintree/getToken/${userId}`, {
//         method: "GET",
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//         }
//     })
//         .then(response => {
//             return response.json();
//         })
//         .catch(err => console.log(err));
// };

// export const processPayment = (userId, token, paymentData) => {
//     return fetch(`${API}/payment/${userId}`, {
//         method: "POST",
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(paymentData)
//     })
//         .then(response => {
//             return response.json();
//         })
//         .catch(err => console.log(err));
// };

export const processPayment = (userId, _token, createOrderData) => {
    return fetch(`${API}/payment/create/${userId}`, {
        method: "POST",
        credentials: 'include',
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(createOrderData)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};