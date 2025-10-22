Auth
POST /auth/register
json
// request
{ "idusuario": 1, "nombre": "Admin", "email": "admin@demo.com", "password": "Abcdef1", "rol": "administrador" }
// response 201
{ "user": { "idusuario": 1, "nombre": "Admin", "email": "admin@demo.com", "rol": "administrador" }, "token": "<base64>" }
POST /auth/login
json
// request
{ "email": "admin@demo.com", "password": "Abcdef1" }
// response 200
{ "user": { "idusuario": 1, "nombre": "Admin", "email": "admin@demo.com", "rol": "administrador" }, "token": "<base64>" }
POST /auth/logout
json
// response 200
{ "message": "Sesión cerrada" }
PUT /auth/:id
json
// request
{ "nombre": "Nuevo Nombre", "password": "Abcdef1", "rol": "cliente" }
// response 200
{ "idusuario": 1, "nombre": "Nuevo Nombre", "email": "admin@demo.com", "rol": "cliente" }
Departamentos
GET /departamentos
POST /departamentos
json
{ "iddepartamento": 5, "nombre_departamento": "Cundinamarca" }
GET /departamentos/:id
PUT /departamentos/:id
json
{ "nombre_departamento": "Antioquia" }
DELETE /departamentos/:id
Respuestas: objetos 
Departamento
 con municipios cuando aplica.

Municipios
GET /municipios
POST /municipios
json
{ "idmunicipio": 11001, "nombre_municipio": "Bogotá", "departamento_iddepartamento": 5 }
GET /municipios/:id
PUT /municipios/:id
json
{ "nombre_municipio": "Medellín", "departamento_iddepartamento": 5 }
DELETE /municipios/:id
Géneros musicales
GET /generos-musicales
POST /generos-musicales
json
{ "idgenero_musical": 1, "nombre_genero": "Rock" }
GET /generos-musicales/:id
PUT /generos-musicales/:id
json
{ "nombre_genero": "Pop" }
DELETE /generos-musicales/:id
Métodos de pago
GET /metodos-pago
POST /metodos-pago
json
{ "idmetodo_pago": 1, "nombre": "Tarjeta" }
GET /metodos-pago/:id
PUT /metodos-pago/:id
json
{ "nombre": "PSE" }
DELETE /metodos-pago/:id
Artistas
GET /artistas
POST /artistas
json
{
  "idartista": 10,
  "nombre": "Shakira",
  "ciudad": "Barranquilla",
  "estado": "activo",
  "artistacol": null,
  "genero_musical_idgenero_musical": 1
}
GET /artistas/:id
PUT /artistas/:id
json
{ "nombre": "Shakira", "estado": "inactivo", "genero_musical_idgenero_musical": 2 }
DELETE /artistas/:id
PATCH /artistas/:id/desactivar
json
// response 200
{ "message": "Artista desactivado", "artista": { ... } }
POST /artistas/asignar-evento
json
{ "artista_idartista": 10, "eventos_ideventos": 100, "fecha_inicio": "2025-10-22", "fecha_fin": "2025-10-23" }
Eventos
GET /eventos?departamento_id=5&municipio_id=11001&fecha=2025-10-22
Devuelve eventos filtrados por:
departamento_id (vía join con municipio)
municipio_id
fecha dentro de [fecha_inicio, fecha_fin] (cadenas en DB)
POST /eventos
json
{
  "ideventos": 100,
  "nombre_evento": "Concierto",
  "descripcion": "Gran show",
  "fecha_inicio": "2025-10-22",
  "fecha_fin": "2025-10-23",
  "estado": "activo",
  "total_asientos": 500,
  "municipio_idmunicipio": 11001,
  "artistas": [10, 11]
}
GET /eventos/:id
PUT /eventos/:id
json
{ "nombre_evento": "Concierto 2", "artistas": [10] }
PATCH /eventos/:id/desactivar
json
{ "message": "Evento desactivado", "evento": { ... } }
Asientos
GET /asientos?evento_id=100
POST /asientos
json
{
  "idlocalidad_evento": 1,
  "codigo_asiento": "VIP-A",
  "nombre_localidad": "VIP",
  "valor_asiento": 100000,
  "estado": "disponible",
  "numero_asientos": 50,
  "eventos_ideventos": 100
}
GET /asientos/:id
PUT /asientos/:id
json
{ "valor_asiento": 120000, "estado": "disponible" }
DELETE /asientos/:id
GET /eventos/:eventoId/asientos/layout
json
// response 200 (ejemplo)
[
  {
    "localidad": "VIP",
    "valor_asiento": 100000,
    "puestos": [
      { "index": 1, "estado": "en_uso" },
      { "index": 2, "estado": "disponible" }
    ]
  },
  {
    "localidad": "General",
    "valor_asiento": 50000,
    "puestos": [ { "index": 1, "estado": "disponible" } ]
  }
]
Compras
GET /compras?usuario_id=1
POST /compras
json
{
  "idcomprar": 500,
  "valor_total": "300000",
  "metodo_pago_idmetodo_pago": 1,
  "usuario_idusuario": 1
}
GET /compras/:id
PUT /compras/:id
json
{ "valor_total": "250000", "metodo_pago_idmetodo_pago": 2 }
DELETE /compras/:id
Boletas
GET /boletas?compra_id=500&asiento_id=1
POST /boletas
json
{ "idboleta": 700, "valor_total": 100000, "compra_idcomprar": 500, "asiento_idlocalidad_evento": 1 }
GET /boletas/:id
PUT /boletas/:id
json
{ "valor_total": 120000 }
DELETE /boletas/:id