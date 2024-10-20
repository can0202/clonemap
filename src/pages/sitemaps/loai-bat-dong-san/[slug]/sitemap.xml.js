import {onSitemap} from 'pages/api/sitemap';
export async function getServerSideProps({res, req, resolvedUrl}) {
  let urlResovled = resolvedUrl?.includes('?')
    ? resolvedUrl?.split('?')[0]
    : resolvedUrl;
  const resSitemap = await onSitemap(urlResovled);
  res.setHeader('Content-Type', 'application/xml');
  res.write(resSitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
