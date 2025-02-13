<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import VehiclesAPI from '@/api/VehiclesAPI';
import ModelsAPI from "@/api/ModelsAPI";
import BrandsAPI from "@/api/BrandsAPI";
import VehicleTypes from "@/api/VehicleTypesAPI";

// Define la variable de router
const router = useRouter();

const showFilters = ref(false);
const filters = ref({
  year: "",
  type: "",
  brand: "",
  model: "",
});

const vehicleTypes = ref([]);
const brands = ref([]);
const models = ref([]);
const vehicles = ref([]);

// Cargar datos al montar el componente
onMounted(async () => {
  await fetchVehicleTypes();
  await fetchBrands();
  await fetchModels();
  await fetchVehicles();
});

// Obtener tipos de vehículos
const fetchVehicleTypes = async () => {
  try {
    const response = await VehicleTypes.listVehicleTypes();
    vehicleTypes.value = response.data.data.map(type => ({
      title: type.name,
      value: type._id
    }));
  } catch (error) {
    console.error("Error al obtener tipos de vehículos:", error);
  }
};

// Obtener marcas
const fetchBrands = async () => {
  try {
    // Filtrar marcas por tipo de vehículo
    const response = await BrandsAPI.listBrands(filters.value.type);
    brands.value = response.data.data.map(brand => ({
      title: brand.name,
      value: brand._id,
      vehicleTypeId: brand.vehicleType._id
    }));
  } catch (error) {
    console.error("Error al obtener marcas:", error);
  }
};

// Obtener modelos
const fetchModels = async () => {
  try {
    // Filtrar modelos por marca
    const response = await ModelsAPI.listModels(filters.value.brand);
    models.value = response.data.data.map(model => ({
      title: model.name,
      value: model._id,
      brandId: model.brand._id
    }));
  } catch (error) {
    console.error("Error al obtener modelos:", error);
  }
};

// Obtener vehículos con filtros
const fetchVehicles = async () => {
  try {
    const params = {};

    // Agregar filtros si están definidos
    if (filters.value.year) params.year = filters.value.year;
    if (filters.value.type) params.type = filters.value.type;
    if (filters.value.brand) params.brand = filters.value.brand;
    if (filters.value.model) params.model = filters.value.model;

    // Realizar la llamada a la API con los filtros
    const response = await VehiclesAPI.listVehicles(params);

    vehicles.value = response.data.data;
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
  }
};


// Filtrar marcas según el tipo de vehículo seleccionado
const filteredBrands = computed(() => {
  return filters.value.type
    ? brands.value.filter(brand => brand.vehicleTypeId === filters.value.type)
    : brands.value;
});

// Filtrar modelos según la marca seleccionada
const filteredModels = computed(() => {
  return filters.value.brand
    ? models.value.filter(model => model.brandId === filters.value.brand)
    : [];
});

const resetFilters = () => {
  filters.value.year = "";
  filters.value.type = "";
  filters.value.brand = "";
  filters.value.model = "";
  fetchVehicles();
};

// Detectar si hay filtros aplicados
const isAnyFilterApplied = computed(() => Object.values(filters.value).some(val => val));

// Obtener icono según el tipo de vehículo
const getVehicleIcon = (type) => type === "moto" ? "mdi-motorbike" : "mdi-car";
const getStatusColor = (status) => status === "disponible" ? "text-green" : (status === "en servicio" ? "text-blue" : "text-orange");

watch([() => filters.value.type, () => filters.value.brand, () => filters.value.model, () => filters.value.year], () => {
  if (filters.value.type) {
    fetchBrands();
  }
  if (filters.value.brand) {
    fetchModels();
  }
  fetchVehicles();
}, { deep: true });

// Funciones para editar y eliminar vehículos
const editVehicle = (vehicle) => {
  router.push({ path: "/registrar-vehiculo", query: { id: vehicle._id } });
};

const deleteVehicle = async (vehicle) => {
  try {
    await VehiclesAPI.destroyVehicle(vehicle._id);

    vehicles.value = vehicles.value.filter(v => v._id !== vehicle._id);
    console.log("Vehículo eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar vehículo:", error);
  }
};

const goToRegister = () => {
  router.push({ path: "/registrar-vehiculo" });
};


</script>

<template>
  <v-container fluid>
    <v-row class="mb-1" justify="space-between">
      <!-- Botón de registro -->
      <v-btn color="green" @click="goToRegister">
        <v-icon left>mdi-car-outline</v-icon>
        Registrar Vehículo
      </v-btn>

      <!-- Botón de filtrar (derecha) -->
      <v-col cols="auto">
        <v-btn @click="showFilters = !showFilters" variant="outlined" class="filter-button">
          <v-icon left>mdi-filter</v-icon>
          Filtrar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtros (se muestran solo si showFilters es true) -->
    <v-expand-transition>
      <v-card v-if="showFilters" class="mb-4 pa-4 filter-card">
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field v-model="filters.year" label="Año" type="number" min="1950" :max="new Date().getFullYear()" outlined />
          </v-col>

          <v-col cols="12" md="3">
            <v-select v-model="filters.type" label="Tipo de vehículo" :items="vehicleTypes" outlined />
          </v-col>

          <v-col cols="12" md="3" v-if="filters.type">
            <v-select v-model="filters.brand" label="Marca" :items="filteredBrands" item-title="title" item-value="value" outlined />
          </v-col>

          <v-col cols="12" md="3" v-if="filters.brand">
            <v-select v-model="filters.model" label="Modelo" :items="filteredModels" item-title="title" item-value="value" outlined />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn
              :disabled="!isAnyFilterApplied"
              color="grey"
              class="ml-2 reset-button"
              @click="resetFilters"
              :class="{ 'active-reset': isAnyFilterApplied }"
            >
              Limpiar
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-expand-transition>

    <!-- Lista de vehículos -->
    <v-row>
      <v-col v-for="vehicle in vehicles" :key="vehicle._id" cols="12" md="6" lg="4">
        <v-card class="vehicle-card position-relative">
          <v-card-title>
            <v-icon>{{ getVehicleIcon(vehicle.type.name) }}</v-icon>
            {{ vehicle.brand.name }} - {{ vehicle.model.name }}
            <v-spacer></v-spacer>
            <!-- Menú desplegable con opciones -->
            <v-menu
              bottom
              right
              transition="scale-transition"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  class="config-btn"
                >
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="editVehicle(vehicle)">
                  <v-list-item-title>Editar</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteVehicle(vehicle)">
                  <v-list-item-title>Eliminar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-subtitle>{{ vehicle.year }} - {{ vehicle.color }}</v-card-subtitle>
          <v-card-text>
            <p>Placa: {{ vehicle.placa }}</p>
            <span :class="getStatusColor(vehicle.status)">
              {{ vehicle.status }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.filter-card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.filter-button {
  background-color: #f5f5f5;
  color: #4CAF50;
  border-radius: 8px;
  font-weight: bold;
}

.filter-button:hover {
  background-color: #e0e0e0;
}

/* Botón de limpiar */
.reset-button {
  border-radius: 8px;
  font-weight: bold;
  background-color: #222;
  color: white;
}

.reset-button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.reset-button:hover:not(:disabled) {
  background-color: #444;
}

/* Estilo cuando el botón de reset está activo */
.reset-button.active-reset {
  background-color: #222;
}

/* Cards de vehículos */
.vehicle-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
}

/* Estilo para el botón de configuración */
.config-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.config-btn:hover {
  background-color: rgba(255, 255, 255, 1);
}

.v-menu__content {
  z-index: 20 !important;
}

.custom-card {
  max-width: 500px;
  width: 100%;
}

</style>
