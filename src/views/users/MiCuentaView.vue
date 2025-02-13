<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UsersAPI from "@/api/UsersAPI"; // Asegúrate de tener esta API configurada

const route = useRoute();
const router = useRouter();
const valid = ref(false);
const userData = ref({
  name: '',
  lastname: '',
  email: '',
  passwordCurrent: '', // Contraseña actual
  password: '', // Nueva contraseña
  passwordConfirm: '' // Confirmación de nueva contraseña
});

const isPasswordChange = computed(() => route.path.includes('mi-contrasena')); // Si estamos en la ruta 'mi-contrasena', cambiar solo la contraseña
const formTitle = computed(() => (isPasswordChange.value ? 'Actualizar Contraseña' : 'Actualizar Perfil'));

// Cargar datos del usuario
onMounted(async () => {
  if (!isPasswordChange.value) {
    await fetchUserData();
  }
});

// Función para cargar los datos del usuario
const fetchUserData = async () => {
  try {
    // Aquí debes obtener los datos del usuario desde la sesión
    const response = await UsersAPI.retrieveUser(); // Debes implementar esta ruta
    const data = response.data;
    userData.value = {
      name: data.name,
      lastname: data.lastname,
      email: data.email
    };
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
  }
};

// Función para enviar los datos del formulario
const submitForm = async () => {
  try {
    const payload = isPasswordChange.value
      ? {
          passwordCurrent: userData.value.passwordCurrent, // Pasar la contraseña actual
          password: userData.value.password, // Nueva contraseña
          passwordConfirm: userData.value.passwordConfirm // Confirmación de contraseña
        }
      : {
          name: userData.value.name,
          lastname: userData.value.lastname,
          email: userData.value.email
        };

    if (isPasswordChange.value) {
      await UsersAPI.updateMyPassword(payload);
    } else {
      await UsersAPI.updateMe(payload);
    }

    router.push({ path: '/mi-cuenta' });
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
  }
};

// Volver a la página anterior
const goBack = () => {
  router.push({ path: '/mi-cuenta' });
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

            <v-card-subtitle v-if="!isPasswordChange">
              <v-text-field
                v-model="userData.name"
                label="Nombre"
                required
              ></v-text-field>
            </v-card-subtitle>

            <v-card-subtitle v-if="!isPasswordChange">
              <v-text-field
                v-model="userData.lastname"
                label="Apellido"
                required
              ></v-text-field>
            </v-card-subtitle>

            <v-card-subtitle v-if="!isPasswordChange">
              <v-text-field
                v-model="userData.email"
                label="Correo Electrónico"
                required
              ></v-text-field>
            </v-card-subtitle>

            <v-card-subtitle v-if="isPasswordChange">
              <v-text-field
                v-model="userData.passwordCurrent"
                label="Contraseña Actual"
                type="password"
                required
              ></v-text-field>
            </v-card-subtitle>

            <v-card-subtitle v-if="isPasswordChange">
              <v-text-field
                v-model="userData.password"
                label="Nueva Contraseña"
                type="password"
                required
              ></v-text-field>
            </v-card-subtitle>

            <v-card-subtitle v-if="isPasswordChange">
              <v-text-field
                v-model="userData.passwordConfirm"
                label="Confirmar Contraseña"
                type="password"
                required
              ></v-text-field>
            </v-card-subtitle>

            <v-card-actions class="d-flex justify-space-between">
              <v-btn
                class="btn-update"
                :disabled="!valid"
                @click="submitForm"
              >
                {{ isPasswordChange ? 'Actualizar Contraseña' : 'Actualizar Perfil' }}
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
