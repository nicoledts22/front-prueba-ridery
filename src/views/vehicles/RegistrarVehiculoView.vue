<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VehiclesAPI from '@/api/VehiclesAPI';
import BrandsAPI from "@/api/BrandsAPI";
import ModelsAPI from "@/api/ModelsAPI";
import VehicleTypes from "@/api/VehicleTypesAPI";
import AuthAPI from "@/api/AuthAPI";

// Variables reactivas
const route = useRoute();
const router = useRouter();
const valid = ref(false);
const vehicleData = ref({
  type: '',
  brand: '',
  model: '',
  year: '',
  status: '',
  color: '',
  placa: ''
});
const vehicleTypes = ref([]);
const brands = ref([]);
const models = ref([]);

const filteredBrands = computed(() => {
  return brands.value.filter(brand => brand.vehicleType?._id === vehicleData.value.type);
});

const filteredModels = computed(() => {
  return models.value.filter(model => model.brand?._id === vehicleData.value.brand);
});

const isEdit = computed(() => !!route.query.id); // Si hay un 'id' en los queryparams, estamos editando

const formTitle = computed(() => (isEdit.value ? 'Actualizar vehículo' : 'Registrar vehículo'));

// Cargar datos para los selects
onMounted(async () => {
  await fetchVehicleTypes();
  if (isEdit.value) {
    await fetchVehicleData(route.query.id);
  }
});

// Watch para cargar marcas cuando se seleccione un tipo de vehículo
watch(() => vehicleData.value.type, async (newType) => {
  if (newType) {
    await fetchBrands(newType);
  }
});

// Watch para cargar modelos cuando se seleccione una marca
watch(() => vehicleData.value.brand, async (newBrand) => {
  if (newBrand) {
    await fetchModels(newBrand);
  }
});

// Función para cargar tipos de vehículos
const fetchVehicleTypes = async () => {
  try {
    const response = await VehicleTypes.listVehicleTypes();
    if (response.data && response.data.data) {
      vehicleTypes.value = response.data.data.map(item => ({
        title: item.name,
        value: item._id
      }));
      console.log("Tipos de vehículos cargados:", vehicleTypes.value);
    } else {
      vehicleTypes.value = [];
    }
  } catch (error) {
    console.error("Error al obtener tipos de vehículos:", error);
  }
};

// Función para cargar marcas asociadas a un tipo de vehículo
const fetchBrands = async (vehicleTypeId) => {
  try {
    console.log("Obteniendo marcas para vehicleType:", vehicleTypeId);
    const response = await BrandsAPI.listBrands(vehicleTypeId);
    console.log("Respuesta API Brands:", response.data);

    if (response.data && response.data.data) {
      brands.value = response.data.data.map(item => ({
        title: item.name,
        value: item._id,
        vehicleType: item.vehicleType
      }));
    } else {
      brands.value = [];
    }
  } catch (error) {
    console.error("Error al obtener marcas:", error);
  }
};

// Función para cargar modelos asociados a una marca
const fetchModels = async (brandId) => {
  try {
    const response = await ModelsAPI.listModels(brandId);
    if (response.data && response.data.data) {
      models.value = response.data.data.map(item => ({
        title: item.name,
        value: item._id,
        brand: item.brand
      }));
      console.log("Modelos cargados:", models.value);
    } else {
      models.value = [];
    }
  } catch (error) {
    console.error("Error al obtener modelos:", error);
  }
};

// Función para cargar los datos de un vehículo en caso de edición
const fetchVehicleData = async (id) => {
  try {
    const response = await VehiclesAPI.retrieveVehicle(id);
    const data = response.data.data;

    vehicleData.value = {
      ...data,
      type: data.type._id,
      brand: data.brand._id,
      model: data.model._id
    };

    await fetchBrands(vehicleData.value.type);
    await fetchModels(vehicleData.value.brand);

  } catch (error) {
    console.error("Error al obtener el vehículo:", error);
  }
};
// Enviar el formulario para registrar o actualizar
const submitForm = async () => {
  try {
    const response = await AuthAPI.authMe();
    const user = response.data;

    if (!user || !user.userId) {
      console.error("No se encontró el usuario autenticado.");
      return;
    }

    vehicleData.value.createdBy = isEdit.value ? vehicleData.value.createdBy : user.userId;
    vehicleData.value.updatedBy = user.userId;

    if (isEdit.value) {
      await VehiclesAPI.updateVehicle(route.query.id, vehicleData.value);
    } else {
      console.log("Enviando datos del vehículo:", vehicleData.value);
      await VehiclesAPI.createVehicle(vehicleData.value);
    }

    router.push({ path: '/registrados' });
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
  }
};

// Volver a la página anterior
const goBack = () => {
  router.push({ path: '/registrados' });
};

</script>

<template>
  <v-container fluid class="form-container">
    <v-row justify="center" align="center" class="full-height">
      <v-col cols="12" sm="10" md="8" lg="6" class="d-flex justify-center">
        <v-card class="form-card" elevation="10">
          <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
            <v-card-title>
              <h3>{{ formTitle }}</h3>
            </v-card-title>

            <v-card-subtitle>
              <v-select
                v-model="vehicleData.type"
                :items="vehicleTypes"
                label="Tipo de vehículo"
                item-title="title"
                item-value="value"
                required
                :disabled="isEdit"
              ></v-select>
            </v-card-subtitle>

            <v-card-subtitle>
              <v-select
                v-model="vehicleData.brand"
                :items="filteredBrands"
                label="Marca"
                item-title="title"
                item-value="value"
                required
                :disabled="isEdit || !vehicleData.type"
              ></v-select>
            </v-card-subtitle>

            <v-card-subtitle>
              <v-select
                v-model="vehicleData.model"
                :items="filteredModels"
                label="Modelo"
                item-title="title"
                item-value="value"
                required
                :disabled="isEdit || !vehicleData.brand"
              ></v-select>
            </v-card-subtitle>

            <v-card-subtitle>
              <v-text-field
                v-model="vehicleData.year"
                label="Año"
                type="number"
                required
              ></v-text-field>
            </v-card-subtitle>

            <v-card-subtitle>
              <v-select
                v-model="vehicleData.status"
                :items="['disponible', 'en servicio', 'en mantenimiento']"
                label="Estado"
                required
              ></v-select>
            </v-card-subtitle>

            <v-card-subtitle>
              <v-text-field
                v-model="vehicleData.color"
                label="Color"
                required
              ></v-text-field>
            </v-card-subtitle>

            <v-card-subtitle>
              <v-text-field
                v-model="vehicleData.placa"
                label="Placa"
                required
              ></v-text-field>
            </v-card-subtitle>

            <v-card-actions class="d-flex justify-space-between">
                <v-btn
                    class="btn-update"
                    :disabled="!valid"
                    @click="submitForm"
                >
                    {{ isEdit ? 'Actualizar' : 'Registrar' }}
                </v-btn>
                <v-btn
                    class="btn-cancel"
                    text
                    @click="goBack"
                >
                    Cancelar
                </v-btn>
                </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>



<style scoped>
/* Estilos para la vista */
.form-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Estilo de la tarjeta */
.form-card {
  padding: 20px;
  border-radius: 12px;
  background: rgba(34, 34, 34, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  min-width: 420px;
  margin: 0 auto;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  color: white;
}

/* Título de la tarjeta */
.form-card h3 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #4CAF50;
}

/* Estilo para el botón de actualizar */
.btn-update {
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  text-transform: uppercase;
  font-weight: bold;
  min-width: 120px;
}

/* Estilo para el botón de cancelar */
.btn-cancel {
  background-color: #9e9e9e;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  text-transform: uppercase;
  font-weight: bold;
  min-width: 120px;
}
</style>

