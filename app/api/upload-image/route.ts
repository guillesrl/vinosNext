import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('Upload route called');
  console.log('- URL configured:', !!supabaseUrl);
  console.log('- Service role configured:', !!serviceRoleKey);

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const formData = await request.formData();
  const file = formData.get('file') as File;
  console.log('File received:', file?.name, file?.type, file?.size);

  if (!file) {
    return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabase.storage
    .from('wine-images')
    .upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', JSON.stringify(error, null, 2));
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from('wine-images')
    .getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
