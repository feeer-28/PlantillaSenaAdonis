import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Departamento from './departamento.js'
import Evento from './evento.js'

export default class Municipio extends BaseModel {
  public static table = 'municipio'
  @column({ isPrimary: true, columnName: 'idmunicipio' })
  declare id: number

  @column({ columnName: 'nombre_municipio' })
  declare nombre: string

  @column({ columnName: 'departamento_iddepartamento' })
  declare departamentoId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Departamento, { foreignKey: 'departamentoId' })
  declare departamento: BelongsTo<typeof Departamento>

  @hasMany(() => Evento, { foreignKey: 'municipioId' })
  declare eventos: HasMany<typeof Evento>
}