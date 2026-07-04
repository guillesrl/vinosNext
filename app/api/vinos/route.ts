import { NextResponse } from 'next/server';
import { pool } from '../../utils/db';
import { queryWines } from '../../utils/wines-db';
import { mapWineRow } from '../../utils/map-wine';

export const dynamic = 'force-dynamic';

// GET /api/vinos?page=1&pageSize=20&search=...
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const pageSize = Math.min(200, Math.max(1, Number(url.searchParams.get('pageSize') || '20')));
    const search = url.searchParams.get('search') || undefined;

    const { rows, total } = await queryWines({
      search,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return NextResponse.json({ wines: rows.map(mapWineRow), total });
  } catch (e) {
    console.error('GET /api/vinos', e);
    return NextResponse.json({ error: 'Error al listar vinos' }, { status: 500 });
  }
}

// POST /api/vinos  (crear vino)
export async function POST(req: Request) {
  try {
    const b = await req.json();
    const res = await pool.query(
      `INSERT INTO vinos ("Id","Title","Vintage","Country","County","Designation","Points","Price","Province","Variety","Winery",image_url)
       VALUES ((SELECT COALESCE(MAX("Id"), -1) + 1 FROM vinos),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING "Id"`,
      [
        b.title ?? '',
        b.vintage ?? null,
        b.country ?? '',
        b.county ?? '',
        b.designation ?? '',
        b.points ?? null,
        b.price ?? null,
        b.province ?? '',
        b.variety ?? '',
        b.winery ?? '',
        b.image_url ?? null,
      ]
    );
    return NextResponse.json({ ok: true, id: res.rows[0].Id });
  } catch (e) {
    console.error('POST /api/vinos', e);
    return NextResponse.json({ error: 'Error al crear vino' }, { status: 500 });
  }
}
