import type { HttpContext } from '@adonisjs/core/http'
import Departamento from '../models/departamento.js'

export default class DepartamentoController {
  public async index({ response }: HttpContext) {
    try {
      const data = await Departamento.query().preload('municipios')
      return response.ok(data)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar departamentos', error: String(error) })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const { iddepartamento, nombre_departamento } = request.only(['iddepartamento', 'nombre_departamento'])
      const created = await Departamento.create({ id: iddepartamento, nombre: nombre_departamento })
      return response.created(created)
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear departamento', error: String(error) })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const dep = await Departamento.query().where('iddepartamento', params.id).preload('municipios').first()
      if (!dep) return response.notFound({ message: 'Departamento no encontrado' })
      return response.ok(dep)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener departamento', error: String(error) })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const dep = await Departamento.findBy('iddepartamento', params.id)
      if (!dep) return response.notFound({ message: 'Departamento no encontrado' })
      const { nombre_departamento } = request.only(['nombre_departamento'])
      if (nombre_departamento !== undefined) dep.nombre = nombre_departamento
      await dep.save()
      return response.ok(dep)
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar departamento', error: String(error) })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const dep = await Departamento.findBy('iddepartamento', params.id)
      if (!dep) return response.notFound({ message: 'Departamento no encontrado' })
      await dep.delete()
      return response.ok({ message: 'Departamento eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar departamento', error: String(error) })
    }
  }
}

