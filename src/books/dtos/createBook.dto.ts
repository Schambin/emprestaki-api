import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title is required' })
    title!: string;

    @IsString({ message: 'Author must be a string' })
    @IsNotEmpty({ message: 'Author is required' })
    author!: string;

    @IsString({ message: 'Category must be a string' })
    @IsNotEmpty({ message: 'Category is required' })
    category!: string;

    status!: string
}