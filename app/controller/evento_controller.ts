import type { HttpContext } from '@adonisjs/core/http'
import Evento from '../models/evento.js'
import Municipio from '../models/municipio.js'
import Artista from '../models/artista.js'

export default class EventoController {
  public async index({ response, request }: HttpContext) {
    try {
      const { departamento_id, municipio_id, fecha } = request.qs()
      const q = Evento.query().preload('municipio').preload('artistas')

      if (municipio_id) {
        q.where('municipio_idmunicipio', Number(municipio_id))
      }
      if (departamento_id) {
        q.join('municipio', 'municipio.idmunicipio', 'eventos.municipio_idmunicipio')
          .where('municipio.departamento_iddepartamento', Number(departamento_id))
          .select('eventos.*')
      }
      if (fecha) {
        // Asumiendo fecha en formato 'YYYY-MM-DD' y columnas como string compatibles para BETWEEN
        q.whereRaw('(? BETWEEN fecha_inicio AND fecha_fin)', [String(fecha)])
      }
      const data = await q
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar eventos', error: String(error) })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const { ideventos, nombre_evento, descripcion, fecha_inicio, fecha_fin, estado, total_asientos, municipio_idmunicipio, artistas } = request.only([
        'ideventos','nombre_evento','descripcion','fecha_inicio','fecha_fin','estado','total_asientos','municipio_idmunicipio','artistas'
      ])

      const municipio = await Municipio.findBy('idmunicipio', municipio_idmunicipio)
      if (!municipio) return response.badRequest({ message: 'Municipio no existe' })

      const created = await Evento.create({
        id: ideventos,
        nombre_evento,
        descripcion,
        fecha_inicio,
        fecha_fin,
        estado,
        total_asientos,
        municipioId: municipio_idmunicipio,
      })

      if (Array.isArray(artistas) && artistas.length) {
        const artistasValidos = await Artista.query().whereIn('idartista', artistas)
        await created.related('artistas').attach(artistasValidos.map((a) => a.id))
      }

      return response.created(created)
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear evento', error: String(error) })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const item = await Evento.query().where('ideventos', params.id).preload('municipio').preload('artistas').first()
      if (!item) return response.notFound({ message: 'Evento no encontrado' })
      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener evento', error: String(error) })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const item = await Evento.findBy('ideventos', params.id)
      if (!item) return response.notFound({ message: 'Evento no encontrado' })
      const { nombre_evento, descripcion, fecha_inicio, fecha_fin, estado, total_asientos, municipio_idmunicipio, artistas } = request.only([
        'nombre_evento','descripcion','fecha_inicio','fecha_fin','estado','total_asientos','municipio_idmunicipio','artistas'
      ])

      if (municipio_idmunicipio !== undefined) {
        const muni = await Municipio.findBy('idmunicipio', municipio_idmunicipio)
        if (!muni) return response.badRequest({ message: 'Municipio no existe' })
        item.municipioId = municipio_idmunicipio
      }

      item.merge({ nombre_evento, descripcion, fecha_inicio, fecha_fin, estado, total_asientos })
      await item.save()

      if (Array.isArray(artistas)) {
        const artistasValidos = await Artista.query().whereIn('idartista', artistas)
        await item.related('artistas').sync(artistasValidos.map((a) => a.id))
      }

      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar evento', error: String(error) })
    }
  }

  public async desactivar({ params, response }: HttpContext) {
    try {
      const item = await Evento.findBy('ideventos', params.id)
      if (!item) return response.notFound({ message: 'Evento no encontrado' })
      item.estado = 'inactivo'
      await item.save()
      return response.ok({ message: 'Evento desactivado', evento: item })
    } catch (error) {
      return response.internalServerError({ message: 'Error al desactivar evento', error: String(error) })
    }
  }
}

