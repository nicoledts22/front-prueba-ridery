import api from '../lib/axios'

export default {
    async listVehicleTypes() {
        return await api.get('/vehicleTypes')
    },
    async retrieveVehicleType(id) {
        return await api.get(`/vehicleTypes/${id}`)
    }
}
