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
    await this.PokemonModel.deleteMany();
    const { data } = await this.axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=700")

    const pokemonToInsert: {name : string , no : number}[] = [];
 
    data.results.forEach(({ name, url }) => {
      const segment = url.split("/")
      const no: number = +segment[segment.length - 2]
      // await this.PokemonModel.create({ name, no });
      pokemonToInsert.push({ name, no })
    })
    await this.PokemonModel.insertMany(pokemonToInsert);
    return "Seed Executed successfully"
  }
  // async executeSeed() {
  //   await this.PokemonModel.deleteMany();
  //   const { data } = await this.axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=10")

  //   const insertPromiseArray: any = [];
 
  //   data.results.forEach(({ name, url }) => {
  //     const segment = url.split("/")
  //     const no: number = +segment[segment.length - 2]
  //     // await this.PokemonModel.create({ name, no });
  //     insertPromiseArray.push(
  //       this.PokemonModel.create({ name, no })
  //     )
  //   })
  //   await Promise.all(insertPromiseArray);
  //   return "Seed Executed successfully"
  // }
}
