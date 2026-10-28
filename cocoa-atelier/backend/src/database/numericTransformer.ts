import type { ValueTransformer } from 'typeorm';

// PostgreSQL возвращает numeric строкой, поэтому приводим к числу
export const numericTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string | null) => (value === null ? null : Number(value)),
};
