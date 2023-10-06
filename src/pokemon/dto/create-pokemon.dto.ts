import { IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreatePokemonDto {
    @IsString()
    name: string;
    @IsPositive()
    @Min(1)
    @IsNumber()
    no: number;
}
