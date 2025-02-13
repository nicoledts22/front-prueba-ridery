import api from '../lib/axios'

export default {
    async listBrands(vehicleType) {
        const params = { sort: 'name' }; // Orden por nombre
        if (vehicleType) {
            params.vehicleType = vehicleType;
        }
        return await api.get('/brands', { params });
    },
    async createBrand(data) {
        return await api.post('/brands', data)
    },
    async retrieveBrand(id) {
        return await api.get(`/brands/${id}`)
    },
    async updateBrand(id, data) {
        return await api.patch(`/brands/${id}`, data)
    },
    async destroyBrand(id) {
        return await api.delete(`/brands/${id}`)
    },

}
