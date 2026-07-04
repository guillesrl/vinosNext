import { pool } from './db';
import { WineFilter } from '../types/wine';

type QueryOpts = WineFilter & { limit?: number; offset?: number };

const SORT_COLUMNS: Record<string, string> = {
  points: 'Points',
  price: 'Price',
  vintage: 'Vintage',
  title: 'Title',
};

// Consulta la tabla `vinos` en Neon con filtros, orden y paginación opcionales.
// Devuelve las filas crudas (columnas capitalizadas) y el total que cumple el filtro.
export async function queryWines(
  opts: QueryOpts = {}
): Promise<{ rows: Record<string, unknown>[]; total: number }> {
  const where: string[] = [];
  const params: unknown[] = [];
  const add = (v: unknown) => `$${params.push(v)}`;

  if (opts.search) {
    const like = `%${opts.search}%`;
    where.push(
      `("Title" ILIKE ${add(like)} OR "Winery" ILIKE ${add(like)} OR "Variety" ILIKE ${add(like)})`
    );
  }
  if (opts.minPrice !== undefined) where.push(`"Price" >= ${add(opts.minPrice)}`);
  if (opts.maxPrice !== undefined) where.push(`"Price" <= ${add(opts.maxPrice)}`);
  if (opts.minPoints !== undefined) where.push(`"Points" >= ${add(opts.minPoints)}`);
  if (opts.vintage !== undefined) where.push(`"Vintage" = ${add(opts.vintage)}`);

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const col = (opts.sortField && SORT_COLUMNS[opts.sortField]) || 'Id';
  const dir = opts.sortDirection === 'asc' ? 'ASC' : opts.sortField ? 'DESC' : 'ASC';
  const orderSql = `ORDER BY "${col}" ${dir}`;

  let limitSql = '';
  if (opts.limit !== undefined) {
    limitSql += ` LIMIT ${add(opts.limit)}`;
    if (opts.offset !== undefined) limitSql += ` OFFSET ${add(opts.offset)}`;
  }

  const sql = `SELECT *, COUNT(*) OVER() AS __total FROM vinos ${whereSql} ${orderSql}${limitSql}`;
  const res = await pool.query(sql, params);
  const total = res.rows.length ? Number(res.rows[0].__total) : 0;
  const rows = res.rows.map((r) => {
    const { __total, ...rest } = r;
    void __total;
    return rest as Record<string, unknown>;
  });
  return { rows, total };
}
