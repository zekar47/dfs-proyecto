class Tarea {
  constructor(nombre) {
    this.nombre = nombre;
    this.completa = false;
  }

  toggleCompleta() {
    this.completa = !this.completa;
  }

  editar(nuevoNombre) {
    this.nombre = nuevoNombre;
  }
}

class GestorDeTareas {
  constructor() {
    this.tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    this.lista = document.getElementById('lista-tareas');
    this.input = document.getElementById('nueva-tarea');
    this.botonAgregar = document.getElementById('agregar-tarea');

    this.botonAgregar.addEventListener('click', () => this.agregarTarea());
    this.render();
  }

  agregarTarea() {
    const nombre = this.input.value.trim();
    if (!nombre) {
      alert('Por favor escribe una tarea.');
      return;
    }

    this.tareas.push(new Tarea(nombre));
    this.input.value = '';
    this.actualizarStorage();
    this.render();
  }

  editarTarea(index) {
    const nuevoNombre = prompt('Editar tarea:', this.tareas[index].nombre);
    if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
      this.tareas[index].editar(nuevoNombre.trim());
      this.actualizarStorage();
      this.render();
    }
  }

  eliminarTarea(index) {
    this.tareas.splice(index, 1);
    this.actualizarStorage();
    this.render();
  }

  toggleCompleta(index) {
    this.tareas[index].toggleCompleta();
    this.actualizarStorage();
    this.render();
  }

  actualizarStorage() {
    localStorage.setItem('tareas', JSON.stringify(this.tareas));
  }

  render() {
    this.lista.innerHTML = '';
    this.tareas.forEach((tarea, index) => {
      const li = document.createElement('li');
      li.className = tarea.completa ? 'completa' : '';

      li.innerHTML = `
        <span onclick="gestor.toggleCompleta(${index})">${tarea.nombre}</span>
        <div>
          <button onclick="gestor.editarTarea(${index})">Editar</button>
          <button onclick="gestor.eliminarTarea(${index})">Eliminar</button>
        </div>
      `;

      this.lista.appendChild(li);
    });
  }
}

const gestor = new GestorDeTareas();
