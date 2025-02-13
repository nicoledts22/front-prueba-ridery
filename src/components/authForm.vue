<template>
  <v-container fluid class="login-container">
    <v-app-bar color="transparent" flat class="nav-bar">
      <v-toolbar-title class="title-left">SERVICIO DE RIDE HAILING</v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="action"></slot>
    </v-app-bar>

    <v-row justify="center" align="center" class="full-height">
      <v-col cols="12" sm="10" md="8" lg="6" class="d-flex justify-center">
        <v-card class="login-card" elevation="10">
          <slot name="content"></slot>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped>
/* Fondo en pantalla completa */
.login-container {
  min-height: 100vh;
  width: 100%;
  background: url('@/assets/login.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Estilo de la barra de navegación */
.nav-bar {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 20px;
  display: flex;
  align-items: center;
}

/* Estilo del título a la izquierda */
.title-left {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

/* Estilo de la tarjeta */
.login-card {
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
.login-card-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #4CAF50;
}

/* Botón */
.login-button {
  font-weight: bold;
  border-radius: 25px;
  background-color: #4CAF50;
  color: white;
  transition: background-color 0.3s ease;
}

/* Cuando el botón está habilitado y el mouse pasa por encima */
.login-button:hover:not(:disabled) {
  background-color: #45a049;
}

/* Cuando el botón está deshabilitado */
.login-button:disabled {
  background-color: #66BB6A;
  cursor: not-allowed;
}

.v-btn {
  font-weight: bold;
}
</style>
