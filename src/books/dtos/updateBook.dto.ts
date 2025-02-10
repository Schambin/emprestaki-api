import { IsString, IsOptional } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Author must be a string' })
  author?: string;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category?: string;
}