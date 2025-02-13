<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModelsAPI from "@/api/ModelsAPI";
import BrandsAPI from "@/api/BrandsAPI";

const route = useRoute();
const router = useRouter();
const valid = ref(false);
const modelData = ref({
  name: '',
  brand: ''
});

const brands = ref([]);
const isEdit = computed(() => !!route.query.id); // Si hay un 'id' en los queryparams, estamos editando
const formTitle = computed(() => (isEdit.value ? 'Actualizar Modelo' : 'Registrar Modelo'));

// Cargar datos para los selects
onMounted(async () => {
  await fetchBrands();
  if (isEdit.value) {
    await fetchModelData(route.query.id);
  }
});

// Función para cargar marcas disponibles
const fetchBrands = async () => {
  try {
    const response = await BrandsAPI.listBrands();
    brands.value = response.data.data.map(item => ({
      title: item.name,
      value: item._id
    }));
  } catch (error) {
    console.error("Error al obtener marcas:", error);
  }
};

// Función para cargar los datos del modelo en caso de edición
const fetchModelData = async (id) => {
  try {
    const response = await ModelsAPI.retrieveModel(id);
    const data = response.data.data;
    modelData.value = {
      name: data.name,
      brand: data.brand._id
    };
  } catch (error) {
    console.error("Error al obtener el modelo:", error);
  }
};

// Enviar el formulario para registrar o actualizar el modelo
const submitForm = async () => {
  try {
    const payload = {
      name: modelData.value.name,
      brand: modelData.value.brand
    };

    if (isEdit.value) {
      await ModelsAPI.updateModel(route.query.id, payload);
    } else {
      await ModelsAPI.createModel(payload);
    }

    router.push({ path: '/modelos' });
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
  }
};

// Volver a la página anterior
const goBack = () => {
  router.push({ path: '/modelos' });
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
                v-model="modelData.brand"
                :items="brands"
                label="Marca"
                item-title="title"
                item-value="value"
                required
              ></v-select>
            </v-card-subtitle>

            <v-card-subtitle>
              <v-text-field
                v-model="modelData.name"
                label="Nombre del Modelo"
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
/* Estilos similares a los anteriores */
.form-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

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

.form-card h3 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #4CAF50;
}

.btn-update {
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  text-transform: uppercase;
  font-weight: bold;
  min-width: 120px;
}

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
