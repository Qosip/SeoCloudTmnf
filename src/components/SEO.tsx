import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
}

export default function SEO({ title, description, canonicalPath, noindex }: SEOProps) {
  const location = useLocation();
  const domain = 'https://www.trackhost.gg';
  const url = domain + (canonicalPath || location.pathname);
  const fullTitle = `${title} | TrackHost`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TrackHost" />
      <meta property="og:image" content={`${domain}/assets/og-image.png`} />
    </Helmet>
  );
}
