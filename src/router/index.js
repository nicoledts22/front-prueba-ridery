import { createRouter, createWebHistory } from 'vue-router';
import AuthAPI from '../api/AuthAPI'
import AppLayout from '@/layouts/AppLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Rutas de autenticación
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/registro',
      name: 'Registro',
      component: () => import('../views/auth/RegistroView.vue')
    },
    {
      path: '/olvido-contrasena',
      name: 'OlvidoContrasena',
      component: () => import('../views/auth/OlvidoContrasenaView.vue')
    },

    // Rutas protegidas
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'registrados',
          name: 'VehiculosRegistrados',
          component: () => import('../views/vehicles/VehiculosRegistradosView.vue')
        },
        {
          path: 'marcas',
          name: 'Marcas',
          component: () => import('../views/vehicles/MarcasView.vue')
        },
        {
          path: 'modelos',
          name: 'Modelos',
          component: () => import('../views/vehicles/ModelosView.vue')
        },
        {
          path: 'usuarios',
          name: 'GestionUsuarios',
          component: () => import('../views/users/GestionUsuariosView.vue')
        },
        {
          path: 'mi-cuenta',
          name: 'MiCuenta',
          component: () => import('../views/users/MiCuentaView.vue')
        },
        {
          path: 'mi-contrasena',
          name: 'MiContrasena',
          component: () => import('../views/users/MiCuentaView.vue')
        },
        {
          path: 'registrar-vehiculo',
          name: 'RegistrarVehiculo',
          component: () => import('../views/vehicles/RegistrarVehiculoView.vue')
        },
        {
          path: 'registrar-marca',
          name: 'RegistrarMarca',
          component: () => import('../views/vehicles/RegistrarMarcaView.vue')
        },
        {
          path: 'registrar-modelo',
          name: 'RegistrarModelo',
          component: () => import('../views/vehicles/RegistrarModeloView.vue')
        },
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth);
  if (requiresAuth) {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});


router.beforeEach(async (to, from, next) => {
  const requiresAdmin = to.matched.some(url => url.meta.requiresAdmin)
  if (requiresAdmin) {
    try {
      await AuthAPI.admin()
      next()
    } catch (error) {
      next({ name: 'Login' })
    }
  } else {
    next()
  }

})


export default router;

