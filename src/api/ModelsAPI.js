import api from '../lib/axios'

export default {
    async listModels(brand) {
        const params = { sort: 'name' };
        if (brand) {
            params.brand = brand;
        }
        return await api.get('/models', { params });
    },
    async createModel(data) {
        return await api.post('/models', data)
    },
    async retrieveModel(id) {
        return await api.get(`/models/${id}`)
    },
    async updateModel(id, data) {
        return await api.patch(`/models/${id}`, data)
    },
    async destroyModel(id) {
        return await api.delete(`/models/${id}`)
    },

}
