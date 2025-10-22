import type { HttpContext } from '@adonisjs/core/http'
import MetodoPago from '../models/metodo_pago.js'

export default class MetodoPagoController {
  public async index({ response }: HttpContext) {
    try {
      const data = await MetodoPago.all()
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar métodos de pago', error: String(error) })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const { idmetodo_pago, nombre } = request.only(['idmetodo_pago', 'nombre'])
      const created = await MetodoPago.create({ id: idmetodo_pago, nombre })
      return response.created(created)
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear método de pago', error: String(error) })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const item = await MetodoPago.findBy('idmetodo_pago', params.id)
      if (!item) return response.notFound({ message: 'Método de pago no encontrado' })
      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener método de pago', error: String(error) })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const item = await MetodoPago.findBy('idmetodo_pago', params.id)
      if (!item) return response.notFound({ message: 'Método de pago no encontrado' })
      const { nombre } = request.only(['nombre'])
      if (nombre !== undefined) item.nombre = nombre
      await item.save()
      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar método de pago', error: String(error) })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const item = await MetodoPago.findBy('idmetodo_pago', params.id)
      if (!item) return response.notFound({ message: 'Método de pago no encontrado' })
      await item.delete()
      return response.ok({ message: 'Método de pago eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar método de pago', error: String(error) })
    }
  }
}

