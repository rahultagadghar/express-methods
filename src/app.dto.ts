import { IsString, IsNumber, IsDefined, IsNumberString } from "class-validator";

// Mock user input DTO

export class User {

    @IsString()
    @IsDefined()
    name: string;

    @IsNumberString()
    @IsDefined()
    total: number
}