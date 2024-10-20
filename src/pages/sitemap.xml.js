import {onSitemap} from './api/sitemap';

export async function getServerSideProps({res, req, resolvedUrl}) {
  try {
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
  } catch (error) {
    return {
      props: {error: true},
    };
  }
}

export default function Sitemap() {
  return null;
}
