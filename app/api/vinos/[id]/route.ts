import { NextResponse } from 'next/server';
import { pool } from '../../../utils/db';

export const dynamic = 'force-dynamic';

// PUT /api/vinos/:id  (actualizar vino)
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const b = await req.json();
    await pool.query(
      `UPDATE vinos SET
        "Title"=$1,"Vintage"=$2,"Country"=$3,"County"=$4,"Designation"=$5,
        "Points"=$6,"Price"=$7,"Province"=$8,"Variety"=$9,"Winery"=$10,image_url=$11
       WHERE "Id"=$12`,
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
        parseInt(id, 10),
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('PUT /api/vinos/[id]', e);
    return NextResponse.json({ error: 'Error al actualizar vino' }, { status: 500 });
  }
}

// DELETE /api/vinos/:id
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await pool.query('DELETE FROM vinos WHERE "Id"=$1', [parseInt(id, 10)]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/vinos/[id]', e);
    return NextResponse.json({ error: 'Error al eliminar vino' }, { status: 500 });
  }
}
