<script>
import ListTable from "@/components/ListTable.vue";
import BrandsAPI from "@/api/BrandsAPI";

export default {
  name: "BrandsView",
  components: { ListTable },
  data() {
    return {
      tableHeaders: [
        { text: "Nombre", value: "name" },
        { text: "Tipo de Vehículo", value: "vehicleType" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      tableData: [],
    };
  },
  async mounted() {
    await this.fetchBrands();
  },
  methods: {
    async fetchBrands() {
      try {
        const response = await BrandsAPI.listBrands();
        this.tableData = response.data.data.map((brand) => ({
          id: brand._id,
          name: brand.name,
          vehicleType: brand.vehicleType.name,
        }));
      } catch (error) {
        console.error("Error obteniendo las marcas:", error);
      }
    },
    async deleteBrand(brand) {
      try {
        await BrandsAPI.destroyBrand(brand.id);
        this.tableData = this.tableData.filter((b) => b.id !== brand.id);
      } catch (error) {
        console.error("Error al eliminar la marca:", error);
      }
    },
    goToRegister() {
      this.$router.push({ path: "/registrar-marca" });
    },
    goToEdit(brand) {
      this.$router.push({ path: "/registrar-marca", query: { id: brand.id } });
    },
  },
};
</script>

<template>
  <v-app>
    <v-container>
      <div class="header-container">
        <h1 class="title">Lista de Marcas</h1>
        <v-btn color="green" dark @click="goToRegister">
          <v-icon left>mdi-plus</v-icon>
          Agregar Marca
        </v-btn>
      </div>

      <ListTable
        :items="tableData"
        :headers="tableHeaders"
        :showActions="true"
        title="Lista de Marcas"
        @delete-item="deleteBrand"
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

