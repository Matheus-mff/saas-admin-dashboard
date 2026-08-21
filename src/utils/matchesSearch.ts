export function matchesSearch(
  search: string,
  values: Array<string | number | null | undefined>
) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return values.some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(normalizedSearch)
  );
}
