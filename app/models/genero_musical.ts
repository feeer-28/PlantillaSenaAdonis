import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Artista from './artista.js'

export default class GeneroMusical extends BaseModel {
  public static table = 'genero_musical'
  @column({ isPrimary: true, columnName: 'idgenero_musical' })
  declare id: number
  
  @column({ columnName: 'nombre_genero' })
  declare nombre: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Artista, { foreignKey: 'generoMusicalId' })
  declare artistas: HasMany<typeof Artista>
}