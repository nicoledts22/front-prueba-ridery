import api from '../lib/axios'

export default {
    async listUser() {
        return await api.get('/users')
    },
    async retrieveUser(id) {
        return await api.get(`/users/${id}`)
    },
    async updateUser(id, data) {
        return await api.patch(`/users/${id}`, data)
    },
    async destroyUser(id) {
        return await api.delete(`/users/${id}`)
    },
    async updateMe(data) {
        return await api.patch('/users/updateMe', data)
    },
    async updateMyPassword(data) {
        return await api.patch('/users/updateMyPassword', data)
    },
}


