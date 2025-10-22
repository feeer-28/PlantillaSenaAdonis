import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Municipio from './municipio.js'

export default class Departamento extends BaseModel {
  public static table = 'departamento'
  @column({ isPrimary: true, columnName: 'iddepartamento' })
  declare id: number

  @column({ columnName: 'nombre_departamento' })
  declare nombre: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Municipio, { foreignKey: 'departamentoId' })
  declare municipios: HasMany<typeof Municipio>
}