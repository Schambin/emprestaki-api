import { IsInt, IsPositive } from 'class-validator';

export class CreateLoanDto {
    @IsInt()
    @IsPositive()
    bookId!: number; 
} 