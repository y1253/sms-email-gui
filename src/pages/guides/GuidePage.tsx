import { useParams } from 'react-router-dom';
import { GUIDES } from '@/seo/routes';
import GuideLayout from './GuideLayout';
import { GUIDE_COMPONENTS } from './registry';
import NotFound from '../NotFound';

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = GUIDES.find((g) => g.slug === slug);
  const Body = slug ? GUIDE_COMPONENTS[slug] : undefined;

  if (!guide || !Body) return <NotFound />;

  return (
    <GuideLayout guide={guide}>
      <Body />
    </GuideLayout>
  );
}
