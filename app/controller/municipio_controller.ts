import type { HttpContext } from '@adonisjs/core/http'
import Municipio from '../models/municipio.js'
import Departamento from '../models/departamento.js'

export default class MunicipioController {
  public async index({ response }: HttpContext) {
    try {
      const data = await Municipio.query().preload('departamento')
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar municipios', error: String(error) })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const { idmunicipio, nombre_municipio, departamento_iddepartamento } = request.only([
        'idmunicipio',
        'nombre_municipio',
        'departamento_iddepartamento',
      ])

      // Validar FK departamento existe
      const dep = await Departamento.findBy('iddepartamento', departamento_iddepartamento)
      if (!dep) return response.badRequest({ message: 'Departamento no existe' })

      const created = await Municipio.create({
        id: idmunicipio,
        nombre: nombre_municipio,
        departamentoId: departamento_iddepartamento,
      })
      return response.created(created)
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear municipio', error: String(error) })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const mun = await Municipio.query().where('idmunicipio', params.id).preload('departamento').first()
      if (!mun) return response.notFound({ message: 'Municipio no encontrado' })
      return response.ok(mun)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener municipio', error: String(error) })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const mun = await Municipio.findBy('idmunicipio', params.id)
      if (!mun) return response.notFound({ message: 'Municipio no encontrado' })

      const { nombre_municipio, departamento_iddepartamento } = request.only([
        'nombre_municipio',
        'departamento_iddepartamento',
      ])

      if (departamento_iddepartamento !== undefined) {
        const dep = await Departamento.findBy('iddepartamento', departamento_iddepartamento)
        if (!dep) return response.badRequest({ message: 'Departamento no existe' })
        mun.departamentoId = departamento_iddepartamento
      }
      if (nombre_municipio !== undefined) mun.nombre = nombre_municipio

      await mun.save()
      return response.ok(mun)
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar municipio', error: String(error) })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const mun = await Municipio.findBy('idmunicipio', params.id)
      if (!mun) return response.notFound({ message: 'Municipio no encontrado' })
      await mun.delete()
      return response.ok({ message: 'Municipio eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar municipio', error: String(error) })
    }
  }
}

