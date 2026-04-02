export function trimText(value: string) {
  return value.trim();
}

export function normalizeName(value: string) {
  return trimText(value).toLowerCase().replace(/\s+/g, " ");
}

export function slugify(value: string) {
  return normalizeName(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cleanUnit(value: string) {
  return trimText(value);
}
