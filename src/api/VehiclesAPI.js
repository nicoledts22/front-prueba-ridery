import api from '../lib/axios'

export default {
    async listVehicles({ type, brand, model, year }) {
        const params = { sort: 'updatedAt' }; // Orden por updatedAt (por defecto ascendente)

        // Agregar otros parámetros si existen
        if (type) params.type = type;
        if (brand) params.brand = brand;
        if (model) params.model = model;
        if (year) params.year = year;

        return await api.get('/vehicles', { params });
    },
    async createVehicle(data) {
        return await api.post('/vehicles', data)
    },
    async retrieveVehicle(id) {
        return await api.get(`/vehicles/${id}`)
    },
    async updateVehicle(id, data) {
        return await api.patch(`/vehicles/${id}`, data)
    },
    async destroyVehicle(id) {
        return await api.delete(`/vehicles/${id}`)
    }

}

