import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Compra from './compra.js'
import Asiento from './asiento.js'

export default class Boleta extends BaseModel {
  public static table = 'boleta'
  @column({ isPrimary: true, columnName: 'idboleta' })
  declare id: number

  @column()
  declare valor_total: number

  @column({ columnName: 'asiento_idlocalidad_evento' })
  declare asientoId: number

  @column({ columnName: 'compra_idcomprar' })
  declare compraId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Compra, { foreignKey: 'compraId' })
  declare compra: BelongsTo<typeof Compra>

  @belongsTo(() => Asiento, { foreignKey: 'asientoId' })
  declare asiento: BelongsTo<typeof Asiento>
}