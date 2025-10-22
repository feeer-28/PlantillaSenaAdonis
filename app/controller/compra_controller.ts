import type { HttpContext } from '@adonisjs/core/http'
import Compra from '../models/compra.js'
import MetodoPago from '../models/metodo_pago.js'
import User from '../models/user.js'

export default class CompraController {
  public async index({ response, request }: HttpContext) {
    try {
      const { usuario_id } = request.qs()
      const q = Compra.query().preload('metodoPago').preload('usuario').preload('boletas')
      if (usuario_id) q.where('usuario_idusuario', Number(usuario_id))
      const data = await q
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar compras', error: String(error) })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const { idcomprar, valor_total, metodo_pago_idmetodo_pago, usuario_idusuario } = request.only([
        'idcomprar','valor_total','metodo_pago_idmetodo_pago','usuario_idusuario'
      ])
      const metodo = await MetodoPago.findBy('idmetodo_pago', metodo_pago_idmetodo_pago)
      if (!metodo) return response.badRequest({ message: 'Método de pago no existe' })
      const usuario = await User.findBy('idusuario', usuario_idusuario)
      if (!usuario) return response.badRequest({ message: 'Usuario no existe' })

      const created = await Compra.create({ id: idcomprar, valor_total: String(valor_total), metodoPagoId: metodo_pago_idmetodo_pago, usuarioId: usuario_idusuario })
      return response.created(created)
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear compra', error: String(error) })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const item = await Compra.query().where('idcomprar', params.id).preload('metodoPago').preload('usuario').preload('boletas').first()
      if (!item) return response.notFound({ message: 'Compra no encontrada' })
      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener compra', error: String(error) })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const item = await Compra.findBy('idcomprar', params.id)
      if (!item) return response.notFound({ message: 'Compra no encontrada' })
      const { valor_total, metodo_pago_idmetodo_pago, usuario_idusuario } = request.only([
        'valor_total','metodo_pago_idmetodo_pago','usuario_idusuario'
      ])
      if (metodo_pago_idmetodo_pago !== undefined) {
        const metodo = await MetodoPago.findBy('idmetodo_pago', metodo_pago_idmetodo_pago)
        if (!metodo) return response.badRequest({ message: 'Método de pago no existe' })
        item.metodoPagoId = metodo_pago_idmetodo_pago
      }
      if (usuario_idusuario !== undefined) {
        const usuario = await User.findBy('idusuario', usuario_idusuario)
        if (!usuario) return response.badRequest({ message: 'Usuario no existe' })
        item.usuarioId = usuario_idusuario
      }
      if (valor_total !== undefined) item.valor_total = String(valor_total)
      await item.save()
      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar compra', error: String(error) })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const item = await Compra.findBy('idcomprar', params.id)
      if (!item) return response.notFound({ message: 'Compra no encontrada' })
      await item.delete()
      return response.ok({ message: 'Compra eliminada' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar compra', error: String(error) })
    }
  }
}

