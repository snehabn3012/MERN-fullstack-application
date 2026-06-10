import { API } from '../utils/config'

export const signUpAPI = (user) => {
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            console.log('err:', err);
        });
}

export const signInAPI = (user) => {
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            console.log('err:', err);
        });
}

export const authenticate = (data, next) => {
    if (typeof window !== 'undefined') {
        // Store only non-sensitive user info — the token lives in the httpOnly cookie
        localStorage.setItem('jwt', JSON.stringify({ user: data.user }));
        next();
    }
}

export const signout = (next) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        next();

        return fetch(`${API}/signout`, {
            method: 'GET',
        })
            .then((response) => {
                console.log("response", response);
            })
            .catch((err) => {
                console.log('err:', err);
            });
    }
}
export const isAuthenticated = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    const item = localStorage.getItem('jwt');
    if (item) {
        return JSON.parse(item)
    } else {
        return false;
    }
}