# Ejercicio 05 · Travel Book

Edita viajes con `PATCH /viajes/:id`. El DTO admite cambios parciales; el Service carga el viaje, combina los cambios con `repository.merge()` y los persiste con `save()`. El reto permite editar tanto el estado como la fecha.
