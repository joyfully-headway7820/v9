// Переводит «14.02.2021» в «2021-02-14» для колонки типа date
export function parseDate(text: string): string {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text.trim());

  if (!match)
    throw new Error(
      `Не удалось прочитать дату: «${text}», ожидается дд.мм.гггг`,
    );

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}
