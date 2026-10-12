import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CrearMedicoDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(120, { message: 'El nombre no puede superar 120 caracteres' })
  nombreCompleto: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'El teléfono debe ser texto' })
  @Matches(/^\d{7,15}$/, {
    message: 'El teléfono debe tener entre 7 y 15 dígitos',
  })
  telefono: string;

  @Type(() => Number)
  @IsInt({ message: 'La especialidad es obligatoria' })
  @Min(1, { message: 'La especialidad es obligatoria' })
  especialidadId: number;

  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser verdadero o falso' })
  activo?: boolean;
}
