# C03 · DataBridge: TypeORM con NestJS

Repositorio de ejercicios independientes de NestJS, TypeORM, PostgreSQL y React Native con Expo.

## Ejercicios

Cada carpeta `EJERCICIO-XX` contiene su propio `backend`, `frontend` y README con instrucciones:

1. Game Vault — persistencia y `GET /videojuegos`.
2. CineBox — colecciones, orden y favoritas.
3. Pet Profile — consulta individual por ID.
4. Food Spots — creación con `POST` y DTO.
5. Travel Book — edición parcial con `PATCH`.
6. My Library — eliminación y estado de lectura.
7. Sneaker Vault — CRUD y control de stock.
8. My Playlists — relación entre playlists y canciones.
9. Event Radar — filtros mediante Query Params.
10. Wander — CRUD de destinos y prioridad/estado de visita.

## Arranque

1. Instala y ejecuta PostgreSQL. Crea la base `databridge_eXX` indicada en el README del ejercicio que vayas a usar.
2. En una terminal, entra en `EJERCICIO-XX/backend`, ejecuta `npm install` si hace falta y después `npm run start:dev`.
3. En otra terminal, entra en `EJERCICIO-XX/frontend`, ejecuta `npm install` si hace falta y después `npm start`.

Solo puede ejecutarse un backend a la vez: todos usan el puerto 3000. La configuración local de ejemplo utiliza `localhost:5432`, el usuario `postgres` y la contraseña `postgres`; ajusta `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` si tu entorno es distinto. No uses estas credenciales de ejemplo en producción.

Para abrir la app desde un móvil físico, sustituye `localhost` por la IPv4 del ordenador en el `API_URL` del `App.tsx` de ese ejercicio y conecta ambos dispositivos a la misma red.
