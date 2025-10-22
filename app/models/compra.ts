import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import MetodoPago from './metodo_pago.js'
import User from './user.js'
import Boleta from './boleta.js'

export default class Compra extends BaseModel {
  public static table = 'compra'
  @column({ isPrimary: true, columnName: 'idcomprar' })
  declare id: number

  @column()
  declare valor_total: string
  
  @column({ columnName: 'usuario_idusuario' })
  declare usuarioId: number

  @column({ columnName: 'metodo_pago_idmetodo_pago' })
  declare metodoPagoId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => MetodoPago, { foreignKey: 'metodoPagoId' })
  declare metodoPago: BelongsTo<typeof MetodoPago>

  @belongsTo(() => User, { foreignKey: 'usuarioId' })
  declare usuario: BelongsTo<typeof User>

  @hasMany(() => Boleta, { foreignKey: 'compraId' })
  declare boletas: HasMany<typeof Boleta>
}