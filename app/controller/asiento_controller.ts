import type { HttpContext } from '@adonisjs/core/http'
import Asiento from '../models/asiento.js'
import Evento from '../models/evento.js'
import Boleta from '../models/boleta.js'

export default class AsientoController {
  public async index({ response, request }: HttpContext) {
    try {
      const { evento_id } = request.qs()
      const query = Asiento.query()
      if (evento_id) query.where('eventos_ideventos', Number(evento_id))
      const data = await query
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar asientos', error: String(error) })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const { idlocalidad_evento, codigo_asiento, nombre_localidad, valor_asiento, estado, numero_asientos, eventos_ideventos } = request.only([
        'idlocalidad_evento','codigo_asiento','nombre_localidad','valor_asiento','estado','numero_asientos','eventos_ideventos'
      ])

      const evento = await Evento.findBy('ideventos', eventos_ideventos)
      if (!evento) return response.badRequest({ message: 'Evento no existe' })

      // Validar capacidad total: suma(numero_asientos por evento) <= evento.total_asientos
      const current = await Asiento.query().where('eventos_ideventos', eventos_ideventos)
      const currentSum = current.reduce((acc, a) => acc + a.numero_asientos, 0)
      if (currentSum + Number(numero_asientos) > Number(evento.total_asientos)) {
        return response.badRequest({ message: 'Capacidad supera el total de asientos del evento' })
      }

      const created = await Asiento.create({
        id: idlocalidad_evento,
        codigo_asiento,
        nombre_localidad,
        valor_asiento,
        estado,
        numero_asientos,
        eventoId: eventos_ideventos,
      })
      return response.created(created)
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear asiento', error: String(error) })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const a = await Asiento.findBy('idlocalidad_evento', params.id)
      if (!a) return response.notFound({ message: 'Asiento no encontrado' })
      return response.ok(a)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener asiento', error: String(error) })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const a = await Asiento.findBy('idlocalidad_evento', params.id)
      if (!a) return response.notFound({ message: 'Asiento no encontrado' })
      const payload = request.only(['codigo_asiento','nombre_localidad','valor_asiento','estado','numero_asientos'])
      a.merge(payload)
      await a.save()
      return response.ok(a)
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar asiento', error: String(error) })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const a = await Asiento.findBy('idlocalidad_evento', params.id)
      if (!a) return response.notFound({ message: 'Asiento no encontrado' })
      await a.delete()
      return response.ok({ message: 'Asiento eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar asiento', error: String(error) })
    }
  }

  // Layout: devuelve arreglo por localidad con cantidad de puestos (vertical) y estado ocupado según boletas
  public async layoutByEvento({ params, response }: HttpContext) {
    try {
      const eventoId = Number(params.eventoId)
      const evento = await Evento.findBy('ideventos', eventoId)
      if (!evento) return response.notFound({ message: 'Evento no encontrado' })

      const localidades = await Asiento.query().where('eventos_ideventos', eventoId)
      const result = [] as Array<{ localidad: string; valor_asiento: number; puestos: Array<{ index: number; estado: 'disponible'|'en_uso' }> }>

      for (const loc of localidades) {
        const vendidos = await Boleta.query().where('asiento_idlocalidad_evento', loc.id)
        const ocupados = vendidos.length
        const puestos = Array.from({ length: loc.numero_asientos }, (_, i) => {
          const estado = (i < ocupados ? 'en_uso' : 'disponible') as 'en_uso' | 'disponible'
          return { index: i + 1, estado }
        })
        result.push({ localidad: loc.nombre_localidad, valor_asiento: loc.valor_asiento, puestos })
      }

      // Arreglo hacia abajo: ya está como lista simple por localidad y sus puestos en orden vertical
      return response.ok(result)
    } catch (error) {
      return response.internalServerError({ message: 'Error al generar layout', error: String(error) })
    }
  }
}

