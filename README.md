# Tarea individual U2 · Biblioteca (PostgreSQL + MongoDB)

**Estudiante:** Frank Marco Alvarado Grefa · **N.º de lista:** 1 · **Caso:** Biblioteca
**Materia:** Desarrollo Web Avanzado · Unidad 2: Integración con bases NoSQL y APIs REST

API REST con Express que combina dos bases de datos:

- **PostgreSQL (Prisma 7):** `User` (login con JWT) y `Prestamo` (transaccional, 1:N con `User`, guarda `libroId` como `String?`).
- **MongoDB (Mongoose):** `Libro` (catálogo, con autores, géneros y ediciones) y `Resena` (registro que crece, con `prestamoId` y `userId` como `Number`).

El modelado completo (workload, decisión de base, ER híbrido, referencias y dato copiado) está en [`docs/Tarea_modelo_hibrido.md`](docs/Tarea_modelo_hibrido.md).

![ERD híbrido](docs/ERD_biblioteca_hibrida.png)

## Requisitos

- Node.js y npm
- Docker Desktop

## Cómo ejecutarlo

```bash
# 1. Variables de entorno (el .env no se sube a Git)
cp .env.example .env

# 2. Bases de datos: PostgreSQL, pgAdmin y MongoDB
docker compose up -d

# 3. Dependencias
npm install

# 4. Migraciones de Prisma
npx prisma migrate dev
npx prisma generate

# 5. Servidor
npm run dev
```

El servidor arranca solo si MongoDB conecta. API en `http://localhost:3000`.

> La migración de `Prestamo` incluye un índice único parcial en SQL
> (`CREATE UNIQUE INDEX ... ON "Prestamo" ("libroId") WHERE "fechaDevolucion" IS NULL`)
> para que un libro no tenga dos préstamos activos a la vez.

pgAdmin: `http://localhost:5050` · Compass: `mongodb://espe_user:espe_password@localhost:27017/espe_mongo?authSource=admin`

## Endpoints

| Método y ruta | Base(s) | Respuestas |
|---|---|---|
| `POST /api/libros` (JWT) | MongoDB | 201, 400, 401, 409 |
| `GET /api/libros?q=&fields=&sort=` | MongoDB | 200 |
| `GET /api/libros/:id` | MongoDB | 200, 400, 404 |
| `PUT /api/libros/:id` (JWT) | MongoDB | 200, 400, 401, 404 |
| `DELETE /api/libros/:id` (JWT) | Las dos | 204, 400, 401, 404, 409 (tiene préstamos) |
| `GET /api/libros/:id/resenas` | MongoDB | 200, 400, 404 |
| `POST /api/prestamos` (JWT) | Las dos | 201, 400, 401, 404, 409 |
| `PATCH /api/prestamos/:id/devolucion` (JWT) | PostgreSQL | 200, 401, 403, 404, 409 |
| `GET /api/prestamos/mios` (JWT) | Las dos | 200, 401 |
| `POST /api/resenas` (JWT) | Las dos | 201, 400, 401, 403, 404, 409 |

## Pruebas (Postman)

La colección está en [`postman/TareaU2_alvarado.postman_collection.json`](postman/TareaU2_alvarado.postman_collection.json).

1. Importarla en Postman.
2. En la pestaña **Variables** poner un `email` y `password` de un usuario registrado (`POST /api/auth/register`) y revisar `loginPath`.
3. Ejecutar **Run collection**. Se puede correr varias veces seguidas: cada corrida genera sus propios ISBN y datos.

Capturas de evidencia en la carpeta [`docs/`](docs/): Run collection, Compass y pgAdmin.
