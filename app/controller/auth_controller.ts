import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'

function validarPassword(pwd: string) {
  // Máximo 8, al menos 1 mayúscula, 1 minúscula y 1 número
  if (pwd.length > 8) return false
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,8}$/
  return re.test(pwd)
}

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    try {
      const { idusuario, nombre, email, password, rol } = request.only(['idusuario','nombre','email','password','rol'])
      if (!validarPassword(password)) {
        return response.badRequest({ message: 'Contraseña inválida: máx 8, 1 mayúscula, 1 minúscula y 1 número' })
      }
      const exists = await User.findBy('email', email)
      if (exists) return response.badRequest({ message: 'Email ya registrado' })
      const user = await User.create({ id: idusuario, fullName: nombre, email, password, rol })
      const token = Buffer.from(`${email}:${password}`).toString('base64')
      return response.created({ user: { idusuario: user.id, nombre: user.fullName, email: user.email, rol: user.rol }, token })
    } catch (error) {
      return response.internalServerError({ message: 'Error en registro', error: String(error) })
    }
  }

  public async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email','password'])
      const user = await User.findBy('email', email)
      if (!user) return response.unauthorized({ message: 'Credenciales inválidas' })
      // Comparación directa (sin hash persistente)
      if (user.password !== password) return response.unauthorized({ message: 'Credenciales inválidas' })
      const token = Buffer.from(`${email}:${password}`).toString('base64')
      return response.ok({ user: { idusuario: user.id, nombre: user.fullName, email: user.email, rol: user.rol }, token })
    } catch (error) {
      return response.internalServerError({ message: 'Error en login', error: String(error) })
    }
  }

  public async logout({ response }: HttpContext) {
    try {
      // Con Basic token, el logout es responsabilidad del cliente (descartar token)
      return response.ok({ message: 'Sesión cerrada' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al cerrar sesión', error: String(error) })
    }
  }

  public async update({ request, response, params }: HttpContext) {
    try {
      const { nombre, password, rol } = request.only(['nombre','password','rol'])
      const user = await User.findBy('idusuario', params.id)
      if (!user) return response.notFound({ message: 'Usuario no encontrado' })
      if (password !== undefined) {
        if (!validarPassword(password)) {
          return response.badRequest({ message: 'Contraseña inválida: máx 8, 1 mayúscula, 1 minúscula y 1 número' })
        }
        user.password = password
      }
      if (nombre !== undefined) user.fullName = nombre
      if (rol !== undefined) user.rol = rol
      await user.save()
      return response.ok({ idusuario: user.id, nombre: user.fullName, email: user.email, rol: user.rol })
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar usuario', error: String(error) })
    }
  }
}

