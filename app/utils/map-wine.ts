import { Wine } from '../types/wine';

export function mapWineRow(row: Record<string, unknown>): Wine {
  return {
    id: row.Id?.toString(),
    title: row.Title as string,
    name: row.Title as string,
    vintage: row.Vintage as number,
    country: row.Country as string,
    county: row.County as string,
    designation: row.Designation as string,
    points: row.Points as number,
    price: row.Price as number,
    province: row.Province as string,
    variety: row.Variety as string,
    winery: row.Winery as string,
    image_url: row.image_url as string,
  };
}
