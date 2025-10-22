import type { HttpContext } from '@adonisjs/core/http'
import GeneroMusical from '../models/genero_musical.js'

export default class GeneroMusicalController {
  public async index({ response }: HttpContext) {
    try {
      const data = await GeneroMusical.query().preload('artistas')
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar géneros', error: String(error) })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const { idgenero_musical, nombre_genero } = request.only(['idgenero_musical', 'nombre_genero'])
      const created = await GeneroMusical.create({ id: idgenero_musical, nombre: nombre_genero })
      return response.created(created)
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear género', error: String(error) })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const genero = await GeneroMusical.query().where('idgenero_musical', params.id).preload('artistas').first()
      if (!genero) return response.notFound({ message: 'Género no encontrado' })
      return response.ok(genero)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener género', error: String(error) })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const genero = await GeneroMusical.findBy('idgenero_musical', params.id)
      if (!genero) return response.notFound({ message: 'Género no encontrado' })
      const { nombre_genero } = request.only(['nombre_genero'])
      if (nombre_genero !== undefined) genero.nombre = nombre_genero
      await genero.save()
      return response.ok(genero)
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar género', error: String(error) })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const genero = await GeneroMusical.findBy('idgenero_musical', params.id)
      if (!genero) return response.notFound({ message: 'Género no encontrado' })
      await genero.delete()
      return response.ok({ message: 'Género eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar género', error: String(error) })
    }
  }
}

