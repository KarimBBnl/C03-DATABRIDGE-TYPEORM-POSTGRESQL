# Ejercicio 09 · Event Radar

Filtra eventos con `GET /eventos?ciudad=Zaragoza`; el reto combina `ciudad` y `categoria` en una misma consulta. Controller obtiene ambos parámetros con `@Query` y Service aplica las condiciones mediante `where` de TypeORM.

