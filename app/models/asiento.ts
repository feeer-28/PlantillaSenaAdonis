import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Evento from './evento.js'

export default class Asiento extends BaseModel {
  public static table = 'asiento'

  @column({ isPrimary: true, columnName: 'idlocalidad_evento' })
  declare id: number

  @column()
  declare codigo_asiento: string

  @column()
  declare nombre_localidad: string

  @column()
  declare valor_asiento: number
  
  @column()
  declare estado: string

  @column()
  declare numero_asientos: number

  @column({ columnName: 'eventos_ideventos' })
  declare eventoId: number

  @belongsTo(() => Evento, { foreignKey: 'eventoId' })
  declare evento: BelongsTo<typeof Evento>
}