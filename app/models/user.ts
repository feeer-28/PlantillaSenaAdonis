import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  public static table = 'usuario'
  public static createdAtColumn = undefined
  public static updatedAtColumn = undefined

  @column({ isPrimary: true, columnName: 'idusuario' })
  declare id: number

  @column({ columnName: 'nombre' })
  declare fullName: string | null

  @column({ columnName: 'rol' })
  declare rol : 'administrador' | 'cliente'

  @column({ columnName: 'email' })
  declare email: string

  @column({ serializeAs: null })
  declare password: string
}