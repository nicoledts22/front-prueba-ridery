import api from '../lib/axios'

export default {
    async signup(data) {
        return await api.post('/users/signup', data)
    },
    async login(data) {
        return await api.post('/users/login', data)
    },
    async logout(data) {
        return await api.post('/users/logout', data)
    },
    async isLoggedIn() {
        return await api.get('/users/isLogged', { withCredentials: true })
    },
    async authMe() {
        return await api.get('/users/authMe')
    },
    async forgotPassword(data) {
        return await api.post('/users/forgotPassword', data)
    },
    async resetPassword(token, data) {
        return await api.patch(`/users/resetPassword/${token}`, data)
    },
}

