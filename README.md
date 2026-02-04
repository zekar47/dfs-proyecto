## 🧩 1. Requisitos

Necesitas tener instalado:

* **Nix** con flakes habilitados
* Git

No necesitas instalar Node ni Postgres manualmente — Nix lo provee todo.
Es posible utilizar el proyecto sin `nix`, instalando postgres, node y las dependencias manualmente, pero se recomienda usar `nix` para mayor reproducibilidad y estabilidad.

--

## 📥 2. Clonar el repositorio

```bash
git clone https://github.com/zekar47/dfs-proyecto
cd dfs-proyecto
```

---

## 🧪 3. Entrar al entorno de desarrollo

Esto instala automáticamente Node, Postgres, pnpm, etc.

```bash
nix develop
```

Cada vez que vuelvas al proyecto, ejecuta este comando.

---

## 🗄 4. Iniciar base de datos local

El proyecto usa una base de datos Postgres local dentro de la carpeta del proyecto.

> ❗ Dentro del entorno de desarrollo, la carpeta `scripts/` se agrega al $PATH.
```bash
db-start
```

Este comando:

* Crea la base de datos si no existe
* Crea el usuario `app_user`
* Crea la DB `escuela_musica`
* Arranca el servidor

---

## 🌱 5. Crear tablas y datos iniciales

```bash
db-seed
```

Esto ejecuta el script SQL con todas las tablas y datos de prueba.

---

## 📦 6. Instalar dependencias del backend

```bash
cd backend
pnpm install
```

---

## ▶️ 7. Iniciar el servidor API

```bash
pnpm dev
```

Deberías ver:

```
🚀 API running on http://localhost:3000
```

---

# 🧪 8. Probar que todo funciona

### Test rápido

```bash
curl http://localhost:3000
```

Respuesta esperada:

```json
{ "status": "API running 🎵" }
```

---

# 9. Preparar el frontend
