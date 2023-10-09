import { IsOptional, IsPositive, Min } from "class-validator"

export class PaginationsDto {
    @IsPositive()
    @IsOptional()
    @Min(1)
    limit?: number
    @IsOptional()
    @IsPositive()
    offset?: number
}