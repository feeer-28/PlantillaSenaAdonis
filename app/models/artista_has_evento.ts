import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Artista from './artista.js'
import Evento from './evento.js'

export default class ArtistaHasEvento extends BaseModel {
  public static table = 'artista_has_eventos'

  @column({ columnName: 'artista_idartista' })
  declare artistaId: number

  @column({ columnName: 'eventos_ideventos' })
  declare eventoId: number

  @column()
  declare fecha_inicio: string

  @column()
  declare fecha_fin: string

  @belongsTo(() => Artista, { foreignKey: 'artistaId' })
  declare artista: BelongsTo<typeof Artista>

  @belongsTo(() => Evento, { foreignKey: 'eventoId' })
  declare evento: BelongsTo<typeof Evento>
}