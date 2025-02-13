<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useFormValidations } from '../../composables/useFormValidations';
import AuthLayout from '@/components/authForm.vue';
import AuthAPI from '@/api/AuthAPI';  // Asegúrate de importar el servicio de tu API

// Inicializa las variables de estado de los campos
const email = ref('');
const emailTouched = ref(false);
const loading = ref(false); // Para controlar el estado de carga
const errorMessage = ref(''); // Para manejar mensajes de error

const route = useRoute();
const router = useRouter();

// Usamos el composable para validaciones, pasando las variables correctamente inicializadas
const { emailValidation, isFormValid } = useFormValidations({
  email,
  emailTouched,
  view: route.name,
});

// Métodos de navegación
const goToLogin = () => {
  router.push({ name: 'Login' });
};

// Método para la recuperación de contraseña
const handleRecuperarContraseña = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    // Llama a la API para recuperar la contraseña
    await AuthAPI.forgotPassword({ email: email.value });

    // Redirige a la página de login con un mensaje de éxito
    router.push({ name: 'Login' });
    alert('Te hemos enviado un correo para recuperar tu contraseña.');
  } catch (error) {
    // Manejo de errores si la solicitud falla
    errorMessage.value = 'Hubo un error al enviar el correo de recuperación. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false; // Restablece el estado de carga
  }
};
</script>

<template>
  <AuthLayout>
    <template #action>
      <v-btn text @click="goToLogin">Volver al Login</v-btn>
    </template>

    <template #content>
      <v-card-title class="text-h5 font-weight-bold text-center">Recuperar Contraseña</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleRecuperarContraseña">
          <v-text-field
            v-model="email"
            label="Correo Electrónico"
            type="email"
            variant="outlined"
            :error-messages="emailValidation"
            required
            @blur="emailTouched = true"
          ></v-text-field>

          <!-- Muestra el mensaje de error si existe -->
          <v-alert v-if="errorMessage" type="error" dismissible>
            {{ errorMessage }}
          </v-alert>

          <v-btn
            :loading="loading"
            block
            size="large"
            class="mt-4 login-button"
            type="submit"
            :disabled="!isFormValid || loading"
          >
            Enviar Correo de Recuperación
          </v-btn>
        </v-form>
      </v-card-text>
    </template>
  </AuthLayout>
</template>

<style scoped>
.login-button {
  font-weight: bold;
  background-color: #4CAF50;
  color: white;
}

.login-button:hover {
  background-color: #45a049;
}

.v-btn:disabled {
  background-color: #66BB6A;
  cursor: not-allowed;
}
</style>

