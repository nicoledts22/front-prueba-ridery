<script>
export default {
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    headers: { type: Array, required: true },
    items: { type: Array, required: true },
    showSwitch: { type: Boolean, default: false },
    showActions: { type: Boolean, default: false },
  },
  methods: {
    onToggleActive(item) {
      this.$emit('toggle-active', item);
    },
    onEditItem(item) {
      this.$emit('edit-item', item);
    },
    onDeleteItem(item) {
      this.$emit('delete-item', item);
    },
  },
};
</script>

<template>
  <v-card class="custom-table">
    <v-card-title class="custom-title text-center">{{ title }}</v-card-title>
    <v-card-subtitle v-if="subtitle">{{ subtitle }}</v-card-subtitle>
    <v-data-table :headers="headers" :items="items" class="elevation-1">
      <!-- Personalizar Headers -->
      <template v-slot:headers>
        <tr>
          <th v-for="header in headers" :key="header.value" class="custom-header">
            {{ header.text }}
          </th>
        </tr>
      </template>

      <!-- Renderizar dinámicamente las celdas de la tabla -->
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="header in headers" :key="header.value">
            <!-- Mostrar el valor normal para todas las columnas, excepto "active" y "actions" -->
            <span v-if="header.value !== 'active' && header.value !== 'actions'">
              {{ item[header.value] }}
            </span>

            <!-- Switch para "Activo" -->
            <v-switch
              v-if="header.value === 'active'"
              v-model="item.active"
              color="green"
              dense
              @click.stop="onToggleActive(item)"
            ></v-switch>

            <!-- Botones de acciones -->
            <span v-if="header.value === 'actions'" class="action-buttons">
              <v-btn icon class="edit-btn" @click="onEditItem(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon class="delete-btn" @click="onDeleteItem(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </span>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>
.custom-table {
  background: rgba(34, 34, 34, 0.85);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.custom-title {
  color: white;
  padding: 16px;
  font-weight: bold;
}

.custom-header {
  background-color: #2c2c2c;
  color: white;
  padding: 12px;
  text-align: center;
}


.action-buttons {
  display: flex;
  gap: 10px;
}

.edit-btn {
  background-color: #4CAF50 !important;
  color: white !important;
}

.delete-btn {
  background-color: #d32f2f !important;
  color: white !important;
}

.v-switch {
  justify-content: center;
}
</style>










