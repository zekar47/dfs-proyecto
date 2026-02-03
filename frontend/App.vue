<script setup>
import Calendar from './Calendar.vue'
</script>

<template>
  <div id="app">
    <header>
      <h1>Escuela de Música AARDEM</h1>
      <p>Sistema de asignación de horarios para clases de instrumentos</p>
    </header>

    <main>
      <Calendar />
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
</style>
