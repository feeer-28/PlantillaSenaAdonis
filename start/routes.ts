/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import router from '@adonisjs/core/services/router'

// Controllers (usar .js porque el runtime transpila a JS)
import DepartamentoController from '../app/controller/departamento_controller.js'
import MunicipioController from '../app/controller/municipio_controller.js'
import GeneroMusicalController from '../app/controller/genero_musical_controller.js'
import MetodoPagoController from '../app/controller/metodo_pago_controller.js'
import ArtistaController from '../app/controller/artista_controller.js'
import EventoController from '../app/controller/evento_controller.js'
import AsientoController from '../app/controller/asiento_controller.js'
import CompraController from '../app/controller/compra_controller.js'
import BoletaController from '../app/controller/boleta_controller.js'
import AuthController from '../app/controller/auth_controller.js'

// Salud
router.get('/', async () => {
  return { hello: 'world' }
})

// Departamento
router
  .group(() => {
    router.get('/', [DepartamentoController, 'index'])
    router.post('/', [DepartamentoController, 'store'])
    router.get('/:id', [DepartamentoController, 'show'])
    router.put('/:id', [DepartamentoController, 'update'])
    router.delete('/:id', [DepartamentoController, 'destroy'])
  })
  .prefix('/departamentos')

// Municipio
router
  .group(() => {
    router.get('/', [MunicipioController, 'index'])
    router.post('/', [MunicipioController, 'store'])
    router.get('/:id', [MunicipioController, 'show'])
    router.put('/:id', [MunicipioController, 'update'])
    router.delete('/:id', [MunicipioController, 'destroy'])
  })
  .prefix('/municipios')

// Género musical
router
  .group(() => {
    router.get('/', [GeneroMusicalController, 'index'])
    router.post('/', [GeneroMusicalController, 'store'])
    router.get('/:id', [GeneroMusicalController, 'show'])
    router.put('/:id', [GeneroMusicalController, 'update'])
    router.delete('/:id', [GeneroMusicalController, 'destroy'])
  })
  .prefix('/generos-musicales')

// Método de pago
router
  .group(() => {
    router.get('/', [MetodoPagoController, 'index'])
    router.post('/', [MetodoPagoController, 'store'])
    router.get('/:id', [MetodoPagoController, 'show'])
    router.put('/:id', [MetodoPagoController, 'update'])
    router.delete('/:id', [MetodoPagoController, 'destroy'])
  })
  .prefix('/metodos-pago')

// Artista
router
  .group(() => {
    router.get('/', [ArtistaController, 'index'])
    router.post('/', [ArtistaController, 'store'])
    router.get('/:id', [ArtistaController, 'show'])
    router.put('/:id', [ArtistaController, 'update'])
    router.delete('/:id', [ArtistaController, 'destroy'])
    router.patch('/:id/desactivar', [ArtistaController, 'desactivar'])
    router.post('/asignar-evento', [ArtistaController, 'asignarEvento'])
  })
  .prefix('/artistas')

// Evento
router
  .group(() => {
    // Filtros por query: ?departamento_id=&municipio_id=&fecha=
    router.get('/', [EventoController, 'index'])
    router.post('/', [EventoController, 'store'])
    router.get('/:id', [EventoController, 'show'])
    router.put('/:id', [EventoController, 'update'])
    router.patch('/:id/desactivar', [EventoController, 'desactivar'])
  })
  .prefix('/eventos')

// Asiento
router
  .group(() => {
    // Query opcional: ?evento_id=
    router.get('/', [AsientoController, 'index'])
    router.post('/', [AsientoController, 'store'])
    router.get('/:id', [AsientoController, 'show'])
    router.put('/:id', [AsientoController, 'update'])
    router.delete('/:id', [AsientoController, 'destroy'])
  })
  .prefix('/asientos')

// Layout de asientos por evento (arreglo vertical por localidad)
router.get('/eventos/:eventoId/asientos/layout', [AsientoController, 'layoutByEvento'])

// Compra
router
  .group(() => {
    // Query opcional: ?usuario_id=
    router.get('/', [CompraController, 'index'])
    router.post('/', [CompraController, 'store'])
    router.get('/:id', [CompraController, 'show'])
    router.put('/:id', [CompraController, 'update'])
    router.delete('/:id', [CompraController, 'destroy'])
  })
  .prefix('/compras')

// Boleta
router
  .group(() => {
    // Query opcional: ?compra_id=&asiento_id=
    router.get('/', [BoletaController, 'index'])
    router.post('/', [BoletaController, 'store'])
    router.get('/:id', [BoletaController, 'show'])
    router.put('/:id', [BoletaController, 'update'])
    router.delete('/:id', [BoletaController, 'destroy'])
  })
  .prefix('/boletas')

// Auth (token básico Base64(email:password))
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout'])
    router.put('/:id', [AuthController, 'update'])
  })
  .prefix('/auth')