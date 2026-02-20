import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth/';

const register = (username, email, password) => {
    return axios.post(API_URL + 'signup', {
        username,
        email,
        password
    });
};

const login = (identifier, password, publicKey) => {
    return axios.post(API_URL + 'login', {
        identifier,
        password,
        publicKey
    });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser
};

export default AuthService;
