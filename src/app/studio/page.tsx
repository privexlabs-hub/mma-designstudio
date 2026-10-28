import type { Metadata } from 'next';
import { CATS, TEMPLATES } from '@/lib/studio';

export const metadata: Metadata = { title: 'Template library', description: TEMPLATES.length + ' Treats by MMA templates: ' + CATS.map(([, l]) => l.toLowerCase()).join(', ') + '.' };

/** Library route — rendered by the studio layout. */
export default function StudioLibraryPage() { return null; }
