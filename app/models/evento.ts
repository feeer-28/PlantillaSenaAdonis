import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Municipio from './municipio.js'
import Artista from './artista.js'

export default class Evento extends BaseModel {
  public static table = 'eventos'
  @column({ isPrimary: true, columnName: 'ideventos' })
  declare id: number

  @column({ columnName: 'nombre_evento' })
  declare nombre_evento: string

  @column()
  declare descripcion: string

  @column({ columnName: 'fecha_inicio' })
  declare fecha_inicio: string

  @column({ columnName: 'fecha_fin' })
  declare fecha_fin: string

  @column()
  declare estado: 'activo' | 'inactivo'

  @column({ columnName: 'total_asientos' })
  declare total_asientos: number

  @column({ columnName: 'municipio_idmunicipio' })
  declare municipioId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Municipio, { foreignKey: 'municipioId' })
  declare municipio: BelongsTo<typeof Municipio>

  @manyToMany(() => Artista, {
    pivotTable: 'artista_has_eventos',
    localKey: 'id',
    pivotForeignKey: 'eventos_ideventos',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'artista_idartista',
    pivotColumns: ['fecha_inicio', 'fecha_fin'],
  })
  declare artistas: ManyToMany<typeof Artista>
}