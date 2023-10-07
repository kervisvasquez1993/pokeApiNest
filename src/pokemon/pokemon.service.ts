import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>) { }
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.PokemonModel.create(createPokemonDto)
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException("Error creating Pokemon, pokemon registrado")
      }
      console.log(error.MongoServerError)
      throw new InternalServerErrorException("checkout server log");

    }

  }

  async findAll() {
    const pokemones = await this.PokemonModel.find();
    return pokemones

  }

  async findOne(term: string) {
    let pokemon: Pokemon
    if (!isNaN(+term)) {
      pokemon = await this.PokemonModel.findOne({ no: term });

    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.PokemonModel.findById(term);
    }
    if (!pokemon) {
      pokemon = await this.PokemonModel.findOne({ name: term.toLocaleLowerCase() })
    }

    if (!pokemon) throw new NotFoundException(`Pokemon not found ${term}`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term)

    try {
      if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
      await pokemon.updateOne(updatePokemonDto)
      return { ...pokemon.toJSON(), ...updatePokemonDto } // sobreescribo informacion de pokemon

    } catch (error) {

      this.handleException(error)
    }

  }
  async remove(id: string) {
    const {deletedCount} = await this.PokemonModel.deleteOne({ _id: id })
    if(deletedCount === 0){
      throw new BadRequestException(`pokemon with id ${id} not found`) 
    }
    return "Pokemon con el id " + id + " eliminado de forma correcta"
    // try {
    //   const result  = await this.PokemonModel.findByIdAndDelete(id)
    //   return resultπ
    // } catch (error) {
    //     console.log(error)
    // }

    const pokemon = await this.findOne(id)
    await pokemon.deleteOne()
    return { mensaje: `Pokemon ${id} deleted` }
    return `This action removes a #${id} pokemon`;
  }

  private handleException(error: any) {
    console.log(error.code, "error")
    if (error.code === 11000) {
      throw new BadRequestException("Error al actualizar Registro, registro duplicado")
    }
    throw new InternalServerErrorException(" No puede actualizar este registro de pokemon- revisa los logs")
  }
}
