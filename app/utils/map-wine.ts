import { Wine } from '../types/wine';

const num = (v: unknown): number | undefined =>
  v === null || v === undefined || v === '' ? undefined : Number(v);

export function mapWineRow(row: Record<string, unknown>): Wine {
  return {
    id: row.Id?.toString(),
    title: row.Title as string,
    name: row.Title as string,
    vintage: num(row.Vintage),
    country: row.Country as string,
    county: row.County as string,
    designation: row.Designation as string,
    points: num(row.Points),
    price: num(row.Price),
    province: row.Province as string,
    variety: row.Variety as string,
    winery: row.Winery as string,
    image_url: row.image_url as string,
  };
}
