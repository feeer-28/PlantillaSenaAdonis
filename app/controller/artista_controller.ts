import type { HttpContext } from '@adonisjs/core/http'
import Artista from '../models/artista.js'
import GeneroMusical from '../models/genero_musical.js'
import Evento from '../models/evento.js'
import ArtistaHasEvento from '../models/artista_has_evento.js'

export default class ArtistaController {
  public async index({ response }: HttpContext) {
    try {
      const data = await Artista.query().preload('genero').preload('eventos')
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar artistas', error: String(error) })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const { idartista, nombre, ciudad, estado, artistacol, genero_musical_idgenero_musical } = request.only([
        'idartista','nombre','ciudad','estado','artistacol','genero_musical_idgenero_musical'
      ])
      const genero = await GeneroMusical.findBy('idgenero_musical', genero_musical_idgenero_musical)
      if (!genero) return response.badRequest({ message: 'Género musical no existe' })
      const created = await Artista.create({ id: idartista, nombre, ciudad, estado, artistacol, generoMusicalId: genero_musical_idgenero_musical })
      return response.created(created)
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear artista', error: String(error) })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const item = await Artista.query().where('idartista', params.id).preload('genero').preload('eventos').first()
      if (!item) return response.notFound({ message: 'Artista no encontrado' })
      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener artista', error: String(error) })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const item = await Artista.findBy('idartista', params.id)
      if (!item) return response.notFound({ message: 'Artista no encontrado' })
      const { nombre, ciudad, estado, artistacol, genero_musical_idgenero_musical } = request.only([
        'nombre','ciudad','estado','artistacol','genero_musical_idgenero_musical'
      ])
      if (genero_musical_idgenero_musical !== undefined) {
        const genero = await GeneroMusical.findBy('idgenero_musical', genero_musical_idgenero_musical)
        if (!genero) return response.badRequest({ message: 'Género musical no existe' })
        item.generoMusicalId = genero_musical_idgenero_musical
      }
      item.merge({ nombre, ciudad, estado, artistacol })
      await item.save()
      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar artista', error: String(error) })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const item = await Artista.findBy('idartista', params.id)
      if (!item) return response.notFound({ message: 'Artista no encontrado' })
      await item.delete()
      return response.ok({ message: 'Artista eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar artista', error: String(error) })
    }
  }

  public async desactivar({ params, response }: HttpContext) {
    try {
      const item = await Artista.findBy('idartista', params.id)
      if (!item) return response.notFound({ message: 'Artista no encontrado' })
      item.estado = 'inactivo'
      await item.save()
      return response.ok({ message: 'Artista desactivado', artista: item })
    } catch (error) {
      return response.internalServerError({ message: 'Error al desactivar artista', error: String(error) })
    }
  }

  // Asociar artista a evento guardando en pivote con fechas
  public async asignarEvento({ request, response }: HttpContext) {
    try {
      const { artista_idartista, eventos_ideventos, fecha_inicio, fecha_fin } = request.only([
        'artista_idartista','eventos_ideventos','fecha_inicio','fecha_fin'
      ])
      const artista = await Artista.findBy('idartista', artista_idartista)
      if (!artista) return response.badRequest({ message: 'Artista no existe' })
      const evento = await Evento.findBy('ideventos', eventos_ideventos)
      if (!evento) return response.badRequest({ message: 'Evento no existe' })
      const pivot = await ArtistaHasEvento.create({ artistaId: artista_idartista, eventoId: eventos_ideventos, fecha_inicio, fecha_fin })
      return response.created(pivot)
    } catch (error) {
      return response.internalServerError({ message: 'Error al asociar artista a evento', error: String(error) })
    }
  }
}

