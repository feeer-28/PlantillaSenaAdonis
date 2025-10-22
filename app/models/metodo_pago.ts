import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Compra from './compra.js'

export default class MetodoPago extends BaseModel {
  public static table = 'metodo_pago'
  @column({ isPrimary: true, columnName: 'idmetodo_pago' })
  declare id: number

  @column()
  declare nombre: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Compra, { foreignKey: 'metodoPagoId' })
  declare compras: HasMany<typeof Compra>
}