import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {} // TODO> FIx ia thinking we are using nestjs