import type { Metadata } from 'next';
import { TEMPLATES } from '@/lib/studio';

type Params = Promise<{ id: string }>;

const decode = (id: string) => { try { return decodeURIComponent(id); } catch { return id; } };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const id = decode((await params).id); const t = TEMPLATES.find((x) => x.id === id);
  return { title: t ? 'Editing ' + t.name + ' · ' + t.sub : 'Editor' };
}

/** Editor route — rendered by the studio layout. */
export default function StudioEditPage() { return null; }
