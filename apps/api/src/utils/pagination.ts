export function getPaginationMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export function parsePaginationArgs(query: any) {
  const page = Math.max(1, parseInt(query?.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query?.limit as string) || 20));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
