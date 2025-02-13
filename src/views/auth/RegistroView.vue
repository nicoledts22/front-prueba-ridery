<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useFormValidations } from '../../composables/useFormValidations';
import AuthLayout from '@/components/authForm.vue';
import AuthAPI from '../../api/AuthAPI';

const route = useRoute();
const router = useRouter();

// Datos del formulario
const name = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const loading = ref(false);

// Estado de toque
const nameTouched = ref(false);
const lastnameTouched = ref(false);
const emailTouched = ref(false);
const passwordTouched = ref(false);
const passwordConfirmTouched = ref(false);

// Usamos el composable para validaciones
const { nameValidation, lastnameValidation, emailValidation, passwordValidation, passwordConfirmValidation, isFormValid } = useFormValidations({
  name, lastname, email, password, passwordConfirm,
  nameTouched, lastnameTouched, emailTouched, passwordTouched, passwordConfirmTouched,
  view: route.name,
});

// Métodos para navegación
const goToLogin = () => {
  router.push({ name: 'Login' });
};

// Método de registro
const register = async () => {
  if (!isFormValid.value) return;
  loading.value = true;

  try {
    const response = await AuthAPI.signup({
      name: name.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value
    });

    console.log('Registro exitoso:', response);

    const token = response.data?.token;
    if (!token) {
      throw new Error('No se recibió el token');
    }

    localStorage.setItem('AUTH_TOKEN', token);
    console.log('Token guardado en localStorage:', localStorage.getItem('AUTH_TOKEN'));

    router.push({ name: 'VehiculosRegistrados' });
  } catch (error) {
    console.error('Error en el registro:', error.response?.data || error.message);
    alert(error.response?.data?.msg || 'Error en el registro');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AuthLayout>
    <template #content>
      <v-card-title class="text-h5 font-weight-bold text-center">Registro de Usuario</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field
            v-model="name"
            label="Nombre"
            variant="outlined"
            :error-messages="nameValidation"
            required
            class="mb-2"
            @blur="nameTouched = true"
          ></v-text-field>

          <v-text-field
            v-model="lastname"
            label="Apellido"
            variant="outlined"
            :error-messages="lastnameValidation"
            required
            class="mb-2"
            @blur="lastnameTouched = true"
          ></v-text-field>

          <v-text-field
            v-model="email"
            label="Correo Electrónico"
            type="email"
            variant="outlined"
            :error-messages="emailValidation"
            required
            class="mb-2"
            @blur="emailTouched = true"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            variant="outlined"
            :error-messages="passwordValidation"
            required
            class="mb-2"
            @blur="passwordTouched = true"
          ></v-text-field>

          <v-text-field
            v-model="passwordConfirm"
            label="Confirmar Contraseña"
            type="password"
            variant="outlined"
            :error-messages="passwordConfirmValidation"
            required
            class="mb-2"
            @blur="passwordConfirmTouched = true"
          ></v-text-field>

          <v-btn
            :loading="loading"
            block
            size="large"
            class="mt-4 login-button"
            type="submit"
            :disabled="!isFormValid"
          >
            REGISTRARSE
          </v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <a href="#" class="forgot-password" @click.prevent="goToLogin">¿Ya tienes cuenta? Inicia sesión</a>
      </v-card-actions>
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

.forgot-password {
  font-size: 14px;
  color: #4CAF50;
  text-decoration: none;
}
.forgot-password:hover {
  text-decoration: underline;
}
</style>





