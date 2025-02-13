<script>
import ListTable from '@/components/ListTable.vue'
import UsersAPI from '@/api/UsersAPI'

export default {
  name: 'App',
  components: { ListTable },
  data() {
    return {
      tableHeaders: [
        { text: 'Nombre', value: 'name' },
        { text: 'Apellido', value: 'lastname' },
        { text: 'Email', value: 'email' },
        { text: 'Rol', value: 'role' },
        { text: ' ', value: 'active', sortable: false },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      tableData: []
    };
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await UsersAPI.listUser();
        this.tableData = response.data.data.map(user => ({
          id: user._id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          active: user.role === 'admin'
        }));
      } catch (error) {
        console.error('Error obteniendo los usuarios:', error);
      }
    },
    async toggleUserRole(user) {
      try {
        const newRole = user.active ? 'user' : 'admin';
        await UsersAPI.updateUser(user.id, { role: newRole });

        user.role = newRole;
        user.active = newRole === 'admin';

        // Fuerza la reactividad de Vue para que actualice la tabla
        this.tableData = [...this.tableData];
      } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
      }
    },
    async deleteUser(user) {
      try {
        // Llamada a la API para eliminar el usuario
        await UsersAPI.destroyUser(user.id);

        // Actualizar la lista de usuarios para reflejar la eliminación
        this.tableData = this.tableData.filter(u => u.id !== user.id);
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    }
  }
};
</script>

<template>
  <v-app>
    <v-container>
      <ListTable
        :items="tableData"
        :headers="tableHeaders"
        :showSwitch="true"
        :showActions="true"
        title="Lista de Usuarios"
        @toggle-active="toggleUserRole"
        @delete-item="deleteUser"
      />
    </v-container>
  </v-app>
</template>





