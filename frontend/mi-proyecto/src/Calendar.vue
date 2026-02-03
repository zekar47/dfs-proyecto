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
          <tr v-for="slot in weekdaySlots" :key="slot">
            <td>{{ slot }}</td>
            <td v-for="day in days" :key="day" :id="`${day}-${slot}`">
              {{ calendar[`${day}-${slot}`] || "" }}
            </td>
          </tr>
          <tr v-for="slot in saturdaySlots" :key="slot">
            <td>{{ slot }}</td>
            <td v-for="day in days.slice(0,5)" :key="day"></td>
            <td :id="`Sábado-${slot}`">{{ calendar[`Sábado-${slot}`] || "" }}</td>
          </tr>
        </tbody>
      </table>
      <p>{{ message }}</p>
    </div>

    <!-- Clases disponibles -->
    <div class="card clases">
      <h2>Clases disponibles</h2>
      <ul>
        <li v-for="clase in availableClasses" 
            :key="clase.id"
            @click="addClass(clase)">
          {{ clase.dia }} {{ clase.hora }} - {{ clase.instrumento }} ({{ clase.maestro }}, Salón {{ clase.salon }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calendar",
  data() {
    return {
      days: ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
      calendar: {}, // objeto reactivo para las celdas
      message: "",
      availableClasses: [
        // Aquí se llenará dinámicamente desde el backend
       
        
      ]
    };
  },
  computed: {
    weekdaySlots() {
      // Lunes a viernes: 14:30 a 19:45 en bloques de 45 min
      const slots = [];
      let start = new Date(0,0,0,14,30);
      for (let i=0; i<7; i++) {
        const time = new Date(start.getTime() + i*45*60000);
        slots.push(time.toTimeString().slice(0,5));
      }
      return slots;
    },
    saturdaySlots() {
      // Sábado: 10:00 a 16:00 en bloques de 45 min
      const slots = [];
      let start = new Date(0,0,0,10,0);
      for (let i=0; i<8; i++) {
        const time = new Date(start.getTime() + i*45*60000);
        slots.push(time.toTimeString().slice(0,5));
      }
      return slots;
    }
  },
  methods: {
    hasConflict(dia, hora) {
      return !!this.calendar[`${dia}-${hora}`];
    },
    addClass(clase) {
      if (this.hasConflict(clase.dia, clase.hora)) {
        this.message = "⚠️ Conflicto: Ya existe una clase en ese horario.";
        return;
      }
      this.calendar[`${clase.dia}-${clase.hora}`] = `${clase.instrumento}\n${clase.maestro}\nSalón ${clase.salon}`;
      this.message = "✅ Clase agregada correctamente.";
      // Eliminar de disponibles
      this.availableClasses = this.availableClasses.filter(c => c.id !== clase.id);
    }
  }
};
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
  flex: 1 1 600px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
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
</style>
