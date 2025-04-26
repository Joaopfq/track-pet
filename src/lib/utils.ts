import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapEnumToString<T extends Record<string, string>>(enumValue: T[keyof T]): string {
  return enumValue as string;
}

export function mapStringToEnum<T extends Record<string, string>>(enumObj: T, value: string): T[keyof T] | undefined {
  return Object.values(enumObj).includes(value) ? (value as T[keyof T]) : undefined;
}