import { API } from '../utils/config';
import { isAuthenticated } from "../auth";

export const getUser = () => {
    const { user } = isAuthenticated();
    return fetch(`${API}/user/${user._id}`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    }).then(r => r.json()).catch(err => console.log(err));
}

export const update = (userData) => {
    const { user } = isAuthenticated();
    return fetch(`${API}/user/${user._id}`, {
        method: "PUT",
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }).then(r => r.json()).catch(err => console.log(err));
};

export const updateUser = (user, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.user = user;
            localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }
};

export const getPurchaseHistory = () => {
    const { user } = isAuthenticated();
    return fetch(`${API}/orders/by/user/${user._id}`, {
        method: "GET",
        credentials: 'include',
        headers: { Accept: "application/json", "Content-Type": "application/json" }
    }).then(r => r.json()).catch(err => console.log(err));
};
