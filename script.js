// Función para validar conflictos en una celda del calendario
function hasConflict(day, time) {
  const cell = document.getElementById(`${day}-${time}`);
  if (cell && cell.innerText.trim() !== "") {
    document.getElementById("message").innerText = " Conflicto: Ya existe una clase en ese horario.";
    return true;
  }
  return false;
}

// Función para agregar una clase al calendario (render en la celda)
function addClassToCalendar(day, time, instrumento, maestro, salon) {
  const cell = document.getElementById(`${day}-${time}`);
  if (cell) {
    cell.innerHTML = `${instrumento}<br>${maestro}<br>Salón ${salon}`;
    document.getElementById("message").innerText = " Clase agregada correctamente.";
  }
}

// Evento para formulario manual
document.getElementById("addClassForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const day = document.getElementById("day").value;
  const time = document.getElementById("time").value.trim();
  const instrument = document.getElementById("instrument").value.trim();
  const teacher = document.getElementById("teacher").value.trim();
  const room = document.getElementById("room").value.trim();

  if (!hasConflict(day, time)) {
    addClassToCalendar(day, time, instrument, teacher, room);
    document.getElementById("addClassForm").reset();
  }
});

// Configuración de días
const weekdays = ["Lunes","Martes","Miércoles","Jueves","Viernes"];

// Generar bloques de lunes a viernes
function generateWeekdayBlocks() {
  const start = new Date(0,0,0,14,30); // 2:30 PM
  const tbody = document.querySelector("#calendar tbody");

  for (let i=0; i<7; i++) {
    const time = new Date(start.getTime() + i*45*60000);
    const hh = time.getHours().toString().padStart(2,"0");
    const mm = time.getMinutes().toString().padStart(2,"0");
    const slot = `${hh}:${mm}`;

    const row = document.createElement("tr");
    row.innerHTML = `<td>${slot}</td>` + weekdays.map(d=>`<td id="${d}-${slot}"></td>`).join("") + "<td></td>";
    tbody.appendChild(row);
  }
}

// Generar bloques del sábado
function generateSaturdayBlocks() {
  const start = new Date(0,0,0,10,0); // 10:00 AM
  const tbody = document.querySelector("#calendar tbody");

  for (let i=0; i<8; i++) {
    const time = new Date(start.getTime() + i*45*60000);
    const hh = time.getHours().toString().padStart(2,"0");
    const mm = time.getMinutes().toString().padStart(2,"0");
    const slot = `${hh}:${mm}`;

    const row = document.createElement("tr");
    row.innerHTML = `<td>${slot}</td>` + weekdays.map(()=>"<td></td>").join("") + `<td id="Sábado-${slot}"></td>`;
    tbody.appendChild(row);
  }
}

// Generar calendario al cargar
generateWeekdayBlocks();
generateSaturdayBlocks();

// Evento para clases disponibles (click → agregar al calendario)
document.querySelectorAll("#availableClasses li").forEach(item => {
  item.addEventListener("click", () => {
    const { day, time, instrument, teacher, room } = item.dataset;

    if (!hasConflict(day, time)) {
      addClassToCalendar(day, time, instrument, teacher, room);
      item.remove(); // quitar de la lista para evitar duplicados
    }
  });
});
