import { readFile } from 'fs/promises';

// CSV, как его сохраняет Excel: разделитель «;», первая строка — заголовки
export async function readSheet(filePath: string): Promise<string[][]> {
  const text = (await readFile(filePath, 'utf8')).replace(/^\uFEFF/, '');
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .slice(1)
    .map((line) => line.split(';').map((cell) => cell.trim()));
}
