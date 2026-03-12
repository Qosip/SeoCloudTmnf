import { Head } from 'vite-react-ssg';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
}

export default function SEO({ title, description, canonicalPath }: SEOProps) {
  const location = useLocation();
  // We use VITE_SITE_URL if defined (useful for local SEO scans), otherwise fallback to the production domain.
  const domain = import.meta.env.VITE_SITE_URL || 'https://www.trackhost.gg';
  const url = domain + (canonicalPath || location.pathname);

  // Truncate title logic (60 chars max usually)
  const fullTitle = `${title} | TrackHost`;
  const finalTitle = fullTitle.length > 60 ? title.substring(0, 56) + '...' : fullTitle;

  // Truncate description logic (155 max)
  const finalDesc = description.length > 155 ? description.substring(0, 152) + '...' : description;

  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TrackHost" />
      <meta property="og:image" content={`${domain}/assets/og-image.png`} />
    </Head>
  );
}
