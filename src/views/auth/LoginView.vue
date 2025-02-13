<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useFormValidations } from '../../composables/useFormValidations';
import AuthLayout from '../../components/authForm.vue';
import AuthAPI from '../../api/AuthAPI';

const route = useRoute();
const router = useRouter();

// Datos del formulario
const email = ref('');
const password = ref('');
const loading = ref(false);

// Estado de toque
const emailTouched = ref(false);
const passwordTouched = ref(false);

// Usar el composable para validaciones
const { emailValidation, isFormValid } = useFormValidations({
  email,
  emailTouched,
  password,
  passwordTouched,
  view: route.name,
});

// Métodos para navegación
const goToRegistro = () => {
  router.push({ name: 'Registro' });
};

const goToOlvidoContrasena = () => {
  router.push({ name: 'OlvidoContrasena' });
};

// Método de login
const login = async () => {
  if (!isFormValid.value) return;

  loading.value = true;

  try {
    const { data: { token } } = await AuthAPI.login({ email: email.value, password: password.value });

    localStorage.setItem('AUTH_TOKEN', token);

    const redirectPath = route.query.redirect || { name: 'VehiculosRegistrados' };
    router.push(redirectPath);
  } catch (error) {
    alert(error.response?.data?.msg || 'Error en el login');
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <AuthLayout>
    <template #action>
      <v-btn text @click="goToRegistro">Regístrate</v-btn>
    </template>

    <template #content>
      <v-card-title class="text-h5 font-weight-bold text-center">Bienvenido</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
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
            required
            class="mb-2"
            @blur="passwordTouched = true"
          ></v-text-field>

          <v-btn
            :loading="loading"
            block
            size="large"
            class="mt-4 login-button"
            type="submit"
            :disabled="!isFormValid"
          >
            ACCEDER
          </v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <a href="#" class="forgot-password" @click.prevent="goToOlvidoContrasena">¿Olvidaste la contraseña?</a>
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
