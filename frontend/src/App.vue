<script setup>
import { ref, onMounted } from "vue";

const horarios = ref([]);
const clases = ref([]);
const alumnos = ref([]);

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const horas = [
  "10:00:00", "10:45:00", "11:30:00", "12:15:00", "13:00:00", "13:45:00",
  "14:30:00", "15:15:00", "16:00:00", "16:45:00", "17:30:00", "18:15:00", "19:00:00"
];

onMounted(async () => {
  const [resHorarios, resClases, resAlumnos] = await Promise.all([
    fetch("http://localhost:3000/horarios"),
    fetch("http://localhost:3000/clases"),
    fetch("http://localhost:3000/alumnos")
  ]);

  horarios.value = await resHorarios.json();
  clases.value = await resClases.json();
  alumnos.value = await resAlumnos.json();
});

function obtenerClase(id) {
  return clases.value.find(c => c.id === id)?.nombre || `Clase ${id}`;
}

function obtenerAlumno(id) {
  return alumnos.value.find(a => a.id === id)?.nombre || `Alumno ${id}`;
}

function eventosFiltrados(dia, hora) {
  return horarios.value.filter(e => e.dia === dia && e.hora === hora);
}
</script>

<template>
  <div id="app">
    <header>
      <h1>Escuela de Música AARDEM</h1>
      <p>Sistema de asignación de horarios para clases de instrumentos</p>
    </header>

    <main>
      <h2>Calendario Semanal</h2>
      <table class="calendario">
        <thead>
          <tr>
            <th>Hora</th>
            <th v-for="dia in dias" :key="dia">{{ dia }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hora in horas" :key="hora">
            <td>{{ hora }}</td>
            <td v-for="dia in dias" :key="dia">
              <div v-for="evento in eventosFiltrados(dia, hora)" :key="evento.id" class="evento">
                {{ obtenerClase(evento.clase_id) }}<br />
                {{ obtenerAlumno(evento.alumno_id) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <section class="panel">
        <div>
          <h3>Clases asignadas</h3>
          <ul>
            <li v-for="h in horarios" :key="h.id">
              {{ obtenerClase(h.clase_id) }} - {{ obtenerAlumno(h.alumno_id) }} ({{ h.dia }} {{ h.hora }})
            </li>
          </ul>
        </div>

        <div>
          <h3>Clases disponibles</h3>
          <ul>
            <li v-for="clase in clases" :key="clase.id">
              {{ clase.nombre }} (Profesor ID: {{ clase.profesor_id }})
            </li>
          </ul>
        </div>
      </section>
    </main>

    <footer>
      <p>© 2026 Escuela de Música AARDEM</p>
    </footer>
  </div>
</template>

<style>
#app {
  font-family: "Fira Sans", Arial, sans-serif;
  margin: 0;
  background: #f4f4f4;
  color: #333;
}

header {
  background: #2c3e50;
  color: #fff;
  padding: 20px;
  text-align: center;
}

main {
  padding: 20px;
}

footer {
  background: #2c3e50;
  color: #fff;
  text-align: center;
  padding: 10px;
  margin-top: 20px;
}

.calendario {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.calendario th,
.calendario td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  vertical-align: top;
}
.evento {
  background: #e0f7fa;
  margin: 2px 0;
  padding: 4px;
  border-radius: 4px;
}

.panel {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
.panel div {
  width: 48%;
}
.panel h3 {
  margin-bottom: 10px;
}
.panel ul {
  list-style: none;
  padding: 0;
}
.panel li {
  background: #fff;
  margin-bottom: 6px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
