# Propuesta para webserver 

Para poder mostrar los datos el servidor necesita tener constáncia de todos los dipositivos que hay conectados en un momento determinado y ver su estado, el registro de los dispositivos se hará via webserver y los datos se guardarán en una base de datos, todo esto gestionado por el servidor.
```
+---------------------+                 +----------------------+                   +-----------------------+
|                     |  petición HTTP  |                      |  Crear/actualizar |                       |
|                     |                 |                      |                   |                       |
|  Dispositivos       +---------------> |                      +-----------------> |    Base de datos      |
|                     |                 |     Web server       |                   |                       |
|                     |                 |                      | <-----------------+                       |
|                     |                 |                      |                   |                       |
+---------------------+                 +----------+-----------+   Coger           +------------+----------+
                                                   |                                            |
                                                   v Controlar y manejar                        |
                                                                                                |
                                        +----------------------+                                |
                                        |                      |                                |
                                        |                      |            Visualizar          |
                                        |                      |                                |
                                        |   Página web         | <------------------------------+
                                        |                      |
                                        |                      |
                                        +----------------------+

```

Para enviar los datos de los dispositivos, unos datos que aún se han de concretar, y poderlos mostrarlos en pantallas, deberéis enviarlos a un web server de la siguiente url:

```
http://ip:8080/api/v1
```

Las peticiones tienen que tener el siguiente formato:
- Content-Type: application/json
- Body en raw format

Ejemplos:

1. Para registrar un nuevo dispositivo deberá ser (la información del dispositivo es de ejemplo):
```
POST http://ip:8080/api/v1/devices
```

``` json
{
  "id": 1,
  "name": "Device 1",
  "owner": "Elon Musk"
}
```

2. Para enviar la localización del dispositivo 1 (los datos son de ejemplo):
```
POST http://ip:8080/api/v1/devices/1/locations
```

``` json
{
  "latitude": 21.6346457,
  "longitude": 3.757483
}
```
