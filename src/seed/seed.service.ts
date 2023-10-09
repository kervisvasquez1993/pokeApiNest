import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>) { }
  private readonly axios: AxiosInstance = axios
  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=10")
    data.results.forEach(async ({ name, url }) => {
      const segment = url.split("/")
      const no: number = +segment[segment.length - 2]
      await this.PokemonModel.create({ name, no });
    })

    return "Seed Executed successfully"
  }
}
