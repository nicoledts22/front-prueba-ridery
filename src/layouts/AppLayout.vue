<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthAPI from "@/api/AuthAPI";

const router = useRouter();
const drawer = ref(true);
const activeMenu = ref(null);
const activeSubmenu = ref(null);
const activeMenuTitle = ref("");

const menuItems = ref([
  {
    title: 'Vehículos',
    icon: 'mdi-car-multiple',
    items: [
      { title: 'Registrados', route: '/registrados' },
      { title: 'Marcas', route: '/marcas' },
      { title: 'Modelos', route: '/modelos' }
    ]
  },
  {
    title: 'Usuarios',
    icon: 'mdi-account-group',
    items: [
      { title: 'Gestión', route: '/usuarios' },
      { title: 'Mi Cuenta', route: '/mi-cuenta' },
      { title: 'Mi Contraseña', route: '/mi-contrasena' }
    ]
  }
]);

// Actualiza el submenú y redirige a la ruta correspondiente
const setActiveSubmenu = (menuIndex, submenuTitle) => {
  activeSubmenu.value = submenuTitle;
  activeMenuTitle.value = menuItems.value[menuIndex].title;

  const selectedItem = menuItems.value[menuIndex].items.find(item => item.title === submenuTitle);
  if (selectedItem && selectedItem.route) {
    router.push(selectedItem.route);
  }
};

// Computed para cambiar el título dinámicamente
const dynamicTitle = computed(() => {
  if (drawer.value) {
    return "";
  }
  if (activeMenuTitle.value && activeSubmenu.value) {
    return `${activeMenuTitle.value} - ${activeSubmenu.value}`;
  }
  return "Menú";
});

// Función para cerrar sesión
const logout = () => {
  console.log("Cerrando sesión...");
  alert("Sesión cerrada");
};
</script>

<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer v-model="drawer" app class="sidebar">
      <!-- Encabezado con icono centrado arriba -->
      <v-list-item class="header">
        <div class="header-content">
          <v-icon class="header-icon">mdi-car</v-icon>
          <v-list-item-title class="header-title">SERVICIO RIDE HANDLING</v-list-item-title>
        </div>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Menú dinámico con Expansion Panels -->
      <v-expansion-panels v-model="activeMenu" class="menu-panels" accordion>
        <v-expansion-panel
          v-for="(menu, index) in menuItems"
          :key="index"
          class="menu-panel"
        >
          <v-expansion-panel-title class="menu-title">
            <v-icon class="menu-icon" :class="{ 'active-icon': activeMenu === index }">{{ menu.icon }}</v-icon>
            <span :class="{ 'active-text': activeMenu === index }">{{ menu.title }}</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="menu-dropdown">
            <v-list dense>
              <v-list-item
                v-for="(item, subIndex) in menu.items"
                :key="subIndex"
                class="submenu-item"
                :class="{ 'active-submenu': activeSubmenu === item.title }"
                @click="setActiveSubmenu(index, item.title)"
                link
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>

    <!-- Barra superior -->
     <v-app-bar app class="transparent-app-bar">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="toolbar-title">{{ dynamicTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Botón de Cerrar Sesión -->
      <v-btn icon @click="logout">
        <v-icon color="black">mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Contenido dinámico -->
    <v-main>
      <v-container>
        <router-view></router-view> <!-- Carga la vista actual -->
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Estilos del sidebar */
.sidebar {
  background: #222;
  color: white;
}

/* Encabezado con icono centrado encima del texto */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
}

/* Contenedor en columna para icono y texto */
.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

/* Estilo del icono */
.header-icon {
  font-size: 40px;
  color: #4CAF50;
}

/* Estilo del título */
.header-title {
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  text-align: center;
}

/* Estilos del menú */
.menu-panels {
  background: #222;
}

/* Menú en dropdown */
.menu-panel {
  background: #222 !important;
  color: white;
  border: none;
}

.menu-title {
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
}

/* Íconos de menú */
.menu-icon {
  margin-right: 8px;
  color: white;
}

/* Solo el ícono y el texto del menú activo se vuelven verdes */
.active-icon {
  color: #4CAF50 !important;
}

.active-text {
  color: #4CAF50 !important;
}

/* Submenús */
.menu-dropdown {
  background: #222 !important;
  padding-left: 20px;
}

.submenu-item {
  color: white;
  font-weight: normal;
}

/* Resaltar solo el submenú activo */
.active-submenu {
  background: #333 !important;
  color: #4CAF50 !important;
}

/* Estilos de la barra superior */
.toolbar-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50%;
}

@media (max-width: 600px) {
  .toolbar-title {
    font-size: 14px;
    max-width: 40%;
  }
}

.transparent-app-bar {
  background: transparent !important;
  box-shadow: none !important;
  border-bottom: none !important;
  z-index: 1;
}

.transparent-app-bar .v-icon {
  color: #222 !important;
}

.transparent-app-bar .toolbar-title {
  color: #222 !important;
}
</style>

