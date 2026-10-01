import { useLocation } from "react-router";

const SITE_NAME = "AgroKeep";

// Flip to true when you launch. Until then every page is hidden from search engines.
const SITE_IS_LIVE = false;

const DEFAULT_DESCRIPTION =
  "Find and book verified crop storage hubs near your farm. Protect your harvest and track every booking in one place.";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  /** Use on private pages (bookings, auth) so search engines always skip them */
  noIndex?: boolean;
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  noIndex = false,
}: SeoProps) {
  const { pathname } = useLocation();

  const origin = window.location.origin;
  const url = `${origin}${pathname}`;
  const ogImage = image ?? `${origin}/og-image.png`;
  const blockIndexing = noIndex || !SITE_IS_LIVE;

  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Verified Crop Storage Near You`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {blockIndexing && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
