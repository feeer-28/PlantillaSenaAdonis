import type { HttpContext } from '@adonisjs/core/http'
import Boleta from '../models/boleta.js'
import Compra from '../models/compra.js'
import Asiento from '../models/asiento.js'

export default class BoletaController {
  public async index({ response, request }: HttpContext) {
    try {
      const { compra_id, asiento_id } = request.qs()
      const q = Boleta.query()
      if (compra_id) q.where('compra_idcomprar', Number(compra_id))
      if (asiento_id) q.where('asiento_idlocalidad_evento', Number(asiento_id))
      const data = await q
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar boletas', error: String(error) })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const { idboleta, valor_total, compra_idcomprar, asiento_idlocalidad_evento } = request.only([
        'idboleta','valor_total','compra_idcomprar','asiento_idlocalidad_evento'
      ])

      const compra = await Compra.findBy('idcomprar', compra_idcomprar)
      if (!compra) return response.badRequest({ message: 'Compra no existe' })
      const asiento = await Asiento.findBy('idlocalidad_evento', asiento_idlocalidad_evento)
      if (!asiento) return response.badRequest({ message: 'Localidad no existe' })

      // Validar capacidad: boletas emitidas en esta localidad < numero_asientos
      const emitidas = await Boleta.query().where('asiento_idlocalidad_evento', asiento_idlocalidad_evento)
      if (emitidas.length >= asiento.numero_asientos) {
        return response.badRequest({ message: 'No hay cupos disponibles en esta localidad' })
      }

      const created = await Boleta.create({ id: idboleta, valor_total, compraId: compra_idcomprar, asientoId: asiento_idlocalidad_evento })
      return response.created(created)
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear boleta', error: String(error) })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const item = await Boleta.findBy('idboleta', params.id)
      if (!item) return response.notFound({ message: 'Boleta no encontrada' })
      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener boleta', error: String(error) })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const item = await Boleta.findBy('idboleta', params.id)
      if (!item) return response.notFound({ message: 'Boleta no encontrada' })
      const { valor_total } = request.only(['valor_total'])
      if (valor_total !== undefined) item.valor_total = Number(valor_total)
      await item.save()
      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar boleta', error: String(error) })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const item = await Boleta.findBy('idboleta', params.id)
      if (!item) return response.notFound({ message: 'Boleta no encontrada' })
      await item.delete()
      return response.ok({ message: 'Boleta eliminada' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar boleta', error: String(error) })
    }
  }
}

