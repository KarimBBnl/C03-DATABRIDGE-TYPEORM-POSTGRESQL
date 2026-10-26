# Ejercicio 08 · My Playlists

Modela `Playlist`–`Cancion` con `OneToMany` y `ManyToOne`; la clave foránea está en la canción. `GET /playlists/:id` devuelve la playlist y sus canciones. El reto añade canciones con `POST /playlists/:id/canciones`