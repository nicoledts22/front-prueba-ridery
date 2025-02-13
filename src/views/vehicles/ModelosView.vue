<script>
import ListTable from '@/components/ListTable.vue';
import ModelAPI from '@/api/ModelsAPI';

export default {
  name: 'ModelsView',
  components: { ListTable },
  data() {
    return {
      tableHeaders: [
        { text: 'Nombre', value: 'name' },
        { text: 'Marca', value: 'brand' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      tableData: []
    };
  },
  async mounted() {
    await this.fetchModels();
  },
  methods: {
    async fetchModels() {
      try {
        const response = await ModelAPI.listModels();
        this.tableData = response.data.data.map(model => ({
          id: model._id,
          name: model.name,
          brand: model.brand.name
        }));
      } catch (error) {
        console.error('Error obteniendo los modelos:', error);
      }
    },
    async deleteModel(model) {
      try {
        await ModelAPI.destroyModel(model.id);
        this.tableData = this.tableData.filter(m => m.id !== model.id);
      } catch (error) {
        console.error('Error al eliminar el modelo:', error);
      }
    },
    goToRegister() {
      this.$router.push({ path: "/registrar-modelo" });
    },
    goToEdit(model) {
      this.$router.push({ path: "/registrar-modelo", query: { id: model.id } });
    },
  }
};
</script>

<template>
  <v-app>
    <v-container>
        <div class="header-container">
            <h1 class="title">Lista de Modelos</h1>
            <v-btn color="green" dark @click="goToRegister">
            <v-icon left>mdi-plus</v-icon>
            Agregar Modelo
            </v-btn>
        </div>
        <ListTable
            :items="tableData"
            :headers="tableHeaders"
            :showActions="true"
            title="Lista de Modelos"
            @delete-item="deleteModel"
            @edit-item="goToEdit"
        />
    </v-container>
  </v-app>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}
</style>
