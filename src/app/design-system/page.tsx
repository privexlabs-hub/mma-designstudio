import type { Metadata } from 'next';
import { PageShell, Section } from '@/components/PageShell';
import { ColourSection, LogoSection, ShapeSection, SpacingSection, TypeSection } from '@/features/design-system/Foundations';
import { ApplicationSection, CategorySection, IconSection, MotifSection, MotionSection, PhotoSection } from '@/features/design-system/BrandSections';
import { ComponentGallery } from '@/features/design-system/ComponentGallery';
import { BRAND } from '@/content/brand';

export const metadata: Metadata = { title: 'Design System', description: 'Treats by MMA design system: logo, colour, type, spacing, shape, motifs, icons, imagery, components, categories, applications and motion.' };

const TOC = [
  { id: 'logo', label: 'Logo & monogram' }, { id: 'colour', label: 'Colour' }, { id: 'type', label: 'Typography' }, { id: 'spacing', label: 'Spacing & grid' },
  { id: 'shape', label: 'Shape & elevation' }, { id: 'motifs', label: 'Motifs' }, { id: 'icons', label: 'Iconography' }, { id: 'photography', label: 'Photography' },
  { id: 'components', label: 'Components' }, { id: 'categories', label: 'Product categories' }, { id: 'applications', label: 'Packaging & social' }, { id: 'motion', label: 'Motion & a11y' },
];

export default function DesignSystemPage() {
  return (
    <PageShell eyebrow="Design system · 12 sections" title="Treats by MMA design system" lead={BRAND.creativeDirection} toc={TOC}>
      <LogoSection />
      <ColourSection />
      <TypeSection />
      <SpacingSection />
      <ShapeSection />
      <MotifSection />
      <IconSection />
      <PhotoSection />
      <Section id="components" num="09 · Components" title="Components" intro="21 components sized to an ordering site. Brand-specific additions (RibbonRule, IcingEdge, PhotoFrame, OptionCard, Price) encode the brand’s motifs and ordering needs. Import them from @/ds.">
        <ComponentGallery />
      </Section>
      <CategorySection />
      <ApplicationSection />
      <MotionSection />
    </PageShell>
  );
}
