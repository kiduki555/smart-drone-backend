/**
 * Swagger 관련 유틸리티 함수들
 */

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

/**
 * Swagger API 속성 데코레이터를 생성하는 유틸리티 함수들
 */

export function ApiStringProperty(description: string, required = true, example?: string) {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      type: "string",
      description,
      required,
      example,
    })(target, propertyKey);
    IsString()(target, propertyKey);
  };
}

export function ApiNumberProperty(description: string, required = true, example?: number) {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      type: "number",
      description,
      required,
      example,
    })(target, propertyKey);
    IsNumber()(target, propertyKey);
  };
}

export function ApiBooleanProperty(description: string, required = true, example?: boolean) {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      type: "boolean",
      description,
      required,
      example,
    })(target, propertyKey);
    IsBoolean()(target, propertyKey);
  };
}

export function ApiDateProperty(description: string, required = true, example?: Date) {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      type: "string",
      format: "date-time",
      description,
      required,
      example,
    })(target, propertyKey);
    IsDate()(target, propertyKey);
  };
}

export function ApiEnumProperty<T extends object>(enumType: T, description: string, required = true, example?: T[keyof T]) {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      enum: Object.values(enumType),
      description,
      required,
      example,
    })(target, propertyKey);
    IsEnum(enumType)(target, propertyKey);
  };
}

export function ApiArrayProperty<T>(itemType: new () => T, description: string, required = true, example?: T[]) {
  return function (target: any, propertyKey: string) {
    ApiProperty({
      type: [itemType],
      description,
      required,
      example,
    })(target, propertyKey);
    IsArray()(target, propertyKey);
    ValidateNested({ each: true })(target, propertyKey);
    Type(() => itemType)(target, propertyKey);
  };
}

export function ApiOptionalProperty() {
  return function (target: any, propertyKey: string) {
    IsOptional()(target, propertyKey);
  };
}
