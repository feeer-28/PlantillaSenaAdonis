import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import GeneroMusical from './genero_musical.js'
import Evento from './evento.js'

export default class Artista extends BaseModel {
  public static table = 'artista'
  @column({ isPrimary: true, columnName: 'idartista' })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare ciudad: string

  @column()
  declare estado: string

  @column()
  declare artistacol: string | null

  @column({ columnName: 'genero_musical_idgenero_musical' })
  declare generoMusicalId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => GeneroMusical, { foreignKey: 'generoMusicalId' })
  declare genero: BelongsTo<typeof GeneroMusical>

  @manyToMany(() => Evento, {
    pivotTable: 'artista_has_eventos',
    localKey: 'id',
    pivotForeignKey: 'artista_idartista',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'eventos_ideventos',
    pivotColumns: ['fecha_inicio', 'fecha_fin'],
  })
  declare eventos: ManyToMany<typeof Evento>
}