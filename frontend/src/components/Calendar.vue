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
          <!-- Sábado primero -->
          <tr v-for="slot in saturdaySlots" :key="slot">
            <td>{{ slot }}</td>
            <td v-for="day in days.slice(0,5)" :key="day"></td>
            <td :id="`Sábado-${slot}`" @click="openOptions('Sábado', slot)">
              {{ calendar[`Sábado-${slot}`]?.texto || "" }}
            </td>
          </tr>

          <!-- Lunes a viernes después -->
          <tr v-for="slot in weekdaySlots" :key="slot">
            <td>{{ slot }}</td>
            <td v-for="day in days.slice(0,5)" 
                :key="day" 
                :id="`${day}-${slot}`"
                @click="openOptions(day, slot)">
              {{ calendar[`${day}-${slot}`]?.texto || "" }}
            </td>
            <td></td>
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

    <!-- Modal de opciones -->
    <div v-if="showOptions" class="modal">
      <div class="modal-content">
        <h3>Opciones para {{ selectedSlot }}</h3>

        <div v-if="calendar[selectedSlot]">
          <p>Clase actual: {{ calendar[selectedSlot].texto }}</p>
          <button class="btn-danger" @click="removeClass">Eliminar clase</button>
        </div>
        <div v-else>
          <p>No hay clase asignada.</p>

          <!-- Dropdowns -->
          <label>Maestro:</label>
          <select v-model="selectedMaestro">
            <option disabled value="">-- elegir --</option>
            <option v-for="m in maestros" :key="m.id" :value="m.id">
              {{ m.nombre }} ({{ m.especialidad }})
            </option>
          </select>

          <label>Alumno:</label>
          <select v-model="selectedAlumno">
            <option disabled value="">-- elegir --</option>
            <option v-for="a in alumnos" :key="a.id" :value="a.id">
              {{ a.nombre }}
            </option>
          </select>

          <label>Instrumento:</label>
          <select v-model="selectedClase">
            <option disabled value="">-- elegir --</option>
            <option v-for="c in clases" :key="c.id" :value="c.id">
              {{ c.nombre }}
            </option>
          </select>

          <button @click="confirmarClase">Agregar clase</button>
        </div>
        <button @click="closeOptions">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'

// Props que vienen del App.vue
const props = defineProps({
  horarios: Array,
  maestros: Array,
  alumnos: Array,
  clases: Array,
})

const emit = defineEmits(["agregar-clase","eliminar-clase"])

const days = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
const calendar = reactive({})
const message = ref("")
const showOptions = ref(false)
const selectedSlot = ref("")

// Campos seleccionados
const selectedMaestro = ref("")
const selectedAlumno = ref("")
const selectedClase = ref("")
const selectedSalon = ref("")

// Horarios de sábado: 10:00 → 13:45
const saturdaySlots = computed(() => {
  const slots = []
  let start = new Date(0,0,0,10,0)
  for (let i=0; i<6; i++) { // 10:00, 10:45, 11:30, 12:15, 13:00, 13:45
    const time = new Date(start.getTime() + i*45*60000)
    slots.push(time.toTimeString().slice(0,5))
  }
  return slots
})

// Horarios de lunes a viernes: 14:30 → 19:00
const weekdaySlots = computed(() => {
  const slots = []
  let start = new Date(0,0,0,14,30)
  for (let i=0; i<7; i++) { // 14:30, 15:15, 16:00, 16:45, 17:30, 18:15, 19:00
    const time = new Date(start.getTime() + i*45*60000)
    slots.push(time.toTimeString().slice(0,5))
  }
  return slots
})

// Sincronizar el calendario con los datos de la API
watch(() => props.horarios, (nuevosHorarios) => {
  // Limpiamos el objeto reactivo sin perder la referencia
  Object.keys(calendar).forEach(key => delete calendar[key])

  nuevosHorarios.forEach(h => {
    const horaLimpia = h.hora_inicio.slice(0, 5)
    const key = `${h.dia_semana}-${horaLimpia}`
    
    // Buscamos nombres para mostrar en la celda
    const maestro = props.maestros.find(m => m.id === h.profesor_id)
    const clase = props.clases.find(c => c.id === h.clase_id)

    // Guardamos el objeto completo (incluyendo el ID de la DB)
    calendar[key] = {
      id: h.id, 
      texto: `${clase?.nombre || 'Clase'} - ${maestro?.nombre || 'Prof'}`
    }
  })
}, { immediate: true, deep: true })

// Funciones
function openOptions(day, slot) {
  selectedSlot.value = `${day}-${slot}`
  showOptions.value = true
}
function closeOptions() {
  showOptions.value = false
}

function removeClass() {
  const claseAsignada = calendar[selectedSlot.value]
  if (claseAsignada && claseAsignada.id) {
    // Enviamos el ID real de la base de datos al padre
    emit("eliminar-clase", claseAsignada.id)
    closeOptions()
  }
}

function confirmarClase() {
  if (!selectedMaestro.value || !selectedAlumno.value || !selectedClase.value) {
    message.value = "⚠️ Debes seleccionar todos los campos.";
    return;
  }

  // Extraemos día y hora del slot seleccionado
  const [dia, hora] = selectedSlot.value.split("-");

  // Calculamos hora_fin (45 min después)
  const [h, m] = hora.split(':').map(Number);
  const fin = new Date(0, 0, 0, h, m + 45).toTimeString().slice(0, 5);

  const objetoParaAPI = {
    dia_semana: dia,
    hora_inicio: hora,
    hora_fin: fin,
    profesor_id: selectedMaestro.value, // Cambiado de maestro_id
    alumno_id: selectedAlumno.value,
    clase_id: selectedClase.value
  };

  emit("agregar-clase", objetoParaAPI);
  closeOptions();
}

async function agregarClase(nuevaClase) {
  try {
    const res = await fetch("http://localhost:3000/horarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaClase)
    });

    const data = await res.json();

    if (!res.ok) {
      // Si la API devuelve 400 o 409, lanzamos el error
      alert("Error: " + (data.error || "No se pudo guardar"));
      return;
    }

    // Si todo salió bien, actualizamos la lista local
    horarios.value.push(data);
    alert("✅ Clase guardada en la base de datos");
  } catch (error) {
    console.error("Error de red:", error);
    alert("No se pudo conectar con el servidor.");
  }
}

async function eliminarClase(id) {
  try {
    const res = await fetch(`http://localhost:3000/horarios/${id}`, {
      method: "DELETE"
    })

    if (res.ok) {
      // Filtramos el array local para que Vue reaccione y borre la celda
      horarios.value = horarios.value.filter(h => h.id !== id)
      console.log(`Horario ${id} eliminado correctamente`)
    } else {
      alert("No se pudo eliminar de la base de datos")
    }
  } catch (error) {
    console.error("Error al eliminar:", error)
  }
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
  background: #3498;
  color : #fff;
}

.btn-danger:hover {
  background: #800;
  color: #fff;
}
</style>
