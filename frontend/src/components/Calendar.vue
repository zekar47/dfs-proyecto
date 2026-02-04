<template>
  <div class="container">
    <!-- Calendario -->
    <div class="card calendario">
      <h2>Calendario Semanal</h2>
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Lunes a viernes -->
          <tr v-for="slot in weekdaySlots" :key="slot">
            <td>{{ slot }}</td>
            <td v-for="day in days.slice(0,5)" 
                :key="day" 
                :id="`${day}-${slot}`"
                @click="openOptions(day, slot)">
              {{ calendar[`${day}-${slot}`] || "" }}
            </td>
            <td></td>
          </tr>
          <!-- Sábado -->
          <tr v-for="slot in saturdaySlots" :key="slot">
            <td>{{ slot }}</td>
            <td v-for="day in days.slice(0,5)" :key="day"></td>
            <td :id="`Sábado-${slot}`" @click="openOptions('Sábado', slot)">
              {{ calendar[`Sábado-${slot}`] || "" }}
            </td>
          </tr>
        </tbody>
      </table>
      <p>{{ message }}</p>
    </div>

    <!-- Panel lateral -->
    <div class="card asignadas">
      <h2>Clases asignadas</h2>
      <ul>
        <li v-for="(info, key) in calendar" :key="key">
          {{ key }} → {{ info }}
        </li>
      </ul>
    </div>

    <!-- Clases disponibles -->
    <div class="card clases">
      <h2>Clases disponibles</h2>
      <ul>
        <li v-for="clase in availableClasses" :key="clase.id" @click="addClass(clase)">
          {{ clase.dia }} {{ clase.hora }} - {{ clase.instrumento }} ({{ clase.maestro }}, Salón {{ clase.salon }})
        </li>
      </ul>
    </div>

    <!-- Modal de opciones -->
    <div v-if="showOptions" class="modal">
      <div class="modal-content">
        <h3>Opciones para {{ selectedSlot }}</h3>
        <div v-if="calendar[selectedSlot]">
          <p>Clase actual: {{ calendar[selectedSlot] }}</p>
          <button @click="removeClass">Eliminar clase</button>
        </div>
        <div v-else>
          <p>No hay clase asignada.</p>
          <button @click="addDummyClass">Agregar clase</button>
        </div>
        <button @click="closeOptions">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const days = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
const calendar = reactive({})
const message = ref("")
const showOptions = ref(false)
const selectedSlot = ref("")

const availableClasses = ref([
  { id: 1, dia: "Martes", hora: "14:30", instrumento: "Flauta", maestro: "Prof. Sánchez", salon: "104" },
  { id: 2, dia: "Viernes", hora: "16:00", instrumento: "Piano", maestro: "Prof. García", salon: "102" }
])

// Horarios
const weekdaySlots = computed(() => {
  const slots = []
  let start = new Date(0,0,0,14,30)
  for (let i=0; i<7; i++) {
    const time = new Date(start.getTime() + i*45*60000)
    slots.push(time.toTimeString().slice(0,5))
  }
  return slots
})
const saturdaySlots = computed(() => {
  const slots = []
  let start = new Date(0,0,0,10,0)
  for (let i=0; i<8; i++) {
    const time = new Date(start.getTime() + i*45*60000)
    slots.push(time.toTimeString().slice(0,5))
  }
  return slots
})

// Funciones
function openOptions(day, slot) {
  selectedSlot.value = `${day}-${slot}`
  showOptions.value = true
}
function closeOptions() {
  showOptions.value = false
}
function removeClass() {
  delete calendar[selectedSlot.value]
  message.value = "❌ Clase eliminada."
  closeOptions()
}
function addDummyClass() {
  calendar[selectedSlot.value] = "Nueva clase\nProfesor X\nSalón Y"
  message.value = "✅ Clase agregada."
  closeOptions()
}
function hasConflict(dia, hora) {
  return !!calendar[`${dia}-${hora}`]
}
function addClass(clase) {
  if (hasConflict(clase.dia, clase.hora)) {
    message.value = "⚠️ Conflicto: Ya existe una clase en ese horario."
    return
  }
  calendar[`${clase.dia}-${clase.hora}`] = `${clase.instrumento}\n${clase.maestro}\nSalón ${clase.salon}`
  message.value = "✅ Clase agregada correctamente."
  availableClasses.value = availableClasses.value.filter(c => c.id !== clase.id)
}
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  flex: 1 1 300px;
}
.calendario {
  flex: 2 1 600px;
}
.asignadas {
  flex: 1 1 300px;
  background: #f9f9f9;
}
.clases {
  flex: 1 1 300px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}
th {
  background: #2c3e50;
  color: #fff;
}
td {
  background: #ecf0f1;
}
td:empty {
  background: #fff;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: #ecf0f1;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}
li:hover {
  background: #3498db;
  color: #fff;
}
/* Modal */
.modal {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}
button {
  margin: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #3498db;
  color: #fff;
}
</style>
