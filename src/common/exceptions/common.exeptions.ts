import { HttpException, HttpStatus } from '@nestjs/common';

export class MissingFieldException<T> extends Error {
  public object: T;

  constructor(data: T) {
    super();
    this.object = data;
    this.throwException();
  }

  mapFields() {
    const missingFields: string[] = [];

    for (const key in this.object) {
      if (!this.object.hasOwnProperty(key)) {
        missingFields.push(key);
      } else if (this.object[key] === undefined) {
        missingFields.push(key);
      }
    }

    return missingFields.join(', ');
  }

  throwException() {
    throw new HttpException(
      {
        reason: 'MissingFieldException',
        message: `Campo obrigatório '${this.mapFields()}' ausente.`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
