<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  show: Boolean,
  title: String,
  fields: Array,
  formData: Object,
  errors: Object,
  loading: Boolean,
  isEditing: Boolean,
});

const localFormData = ref({ ...props.formData });

// Actualizar localFormData cuando formData cambie
watch(() => props.formData, (newData) => {
  localFormData.value = { ...newData };
}, { deep: true });

const emit = defineEmits(['update:show', 'submit']);
const localErrors = ref({ ...props.errors });
const form = ref(null);

// Verifica si el formulario es válido
const isFormValid = computed(() => {
  return Object.values(localErrors.value).every((err) => err.length === 0);
});

// Cerrar el modal
const closeModal = () => {
  emit('update:show', false);
};

// Emitir el evento de envío
const handleSubmit = () => {
  if (!isFormValid.value) return;
  emit('submit');
};

// Marca el campo como tocado
const touchField = (field) => {
  localErrors.value[field] = localErrors.value[field] || [];
};
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="emit('update:show', $event)" persistent max-width="500px">
    <v-card class="modal-card">
      <!-- Botón de cierre -->
      <v-btn icon class="close-button" @click="closeModal">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="text-h5 font-weight-bold text-center">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="handleSubmit">
          <template v-for="field in fields" :key="field.model">
            <v-text-field
              v-model="localFormData.value[field.model]"
              :label="field.label"
              :type="field.type"
              :error-messages="errors[field.model]"
              required
              class="mb-2"
              @blur="touchField(field.model)"
            ></v-text-field>

            <v-select
              v-if="field.type === 'select'"
              v-model="localFormData.value[field.model]"
              :label="field.label"
              :items="field.items"
              item-title="label"
              item-value="value"
              variant="outlined"
              :error-messages="errors[field.model]"
              required
              class="mb-2"
              @blur="touchField(field.model)"
            ></v-select>
          </template>

          <v-btn
            block
            size="large"
            class="mt-4 submit-button"
            type="submit"
            :loading="loading"
            :disabled="!isFormValid"
          >
            {{ isEditing ? 'Actualizar' : 'Registrar' }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.modal-card {
  padding: 20px;
  border-radius: 12px;
  background: rgba(34, 34, 34, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: white;
  position: relative;
}

.submit-button {
  font-weight: bold;
  background-color: #4CAF50;
  color: white;
  border-radius: 8px;
}

.submit-button:hover {
  background-color: #45a049;
}

.v-btn:disabled {
  background-color: #66BB6A;
  cursor: not-allowed;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
}
</style>



