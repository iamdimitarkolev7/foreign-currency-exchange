import { BadRequestException } from '@nestjs/common';

export class InvalidFxTypeException extends BadRequestException {

  constructor() {
    super('Please enter a valid exchange type!');
  }
}