# Ejercicio 03 · Pet Profile

Consulta una mascota concreta con `GET /mascotas/:id`. El Controller valida el parámetro con `ParseIntPipe`; el Service busca mediante `findOneBy()` y devuelve 404 si no existe. `nivelEnergia` se persiste en PostgreSQL y se muestra en la ficha.
