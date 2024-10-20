import {fetchCategoryAll, onProvinces} from 'pages/api/category';
import {create} from 'xmlbuilder2';

// Biến toàn cục để lưu trữ trạng thái `lastmod` và thời gian gen cuối cùng
let lastmodTime = null;
let lastGenTime = null; // Thời gian lần gen cuối cùng

// Hàm tính toán thời gian hiện tại so với lần gen cuối cùng
function shouldRegenerateSitemap() {
  if (!lastGenTime) {
    return true; // Chưa gen lần nào, cần gen
  }
  const now = new Date();
  const diff = now - lastGenTime; // Tính khoảng thời gian trôi qua từ lần gen cuối
  const hoursPassed = diff / (1000 * 60); // Chuyển đổi sang phút
  // const hoursPassed = diff / (1000 * 60 * 60); // Chuyển đổi sang giờ
  return hoursPassed >= 5; // Kiểm tra nếu đã trôi qua 24 giờ
}

// Hàm lấy hoặc gen mới `lastmod`
function getLastmodTime() {
  if (shouldRegenerateSitemap()) {
    lastmodTime = new Date().toISOString(); // Gen mới `lastmod`
    lastGenTime = new Date(); // Cập nhật thời gian gen cuối
  }
  return lastmodTime; // Trả về giá trị `lastmod`
}

export async function getServerSideProps({res, req, params}) {
  const lastmod = getLastmodTime();
  const {slug} = params;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const urlServer = `${protocol}://${req.headers.host}`;

  const resAllConfig = await fetchCategoryAll();
  const provinces = await onProvinces();
  const subTypes = resAllConfig?.data?.categories?.realEstateTypeCat || null;
  const types = resAllConfig?.data?.categories?.postTypeFilterCat || null;

  function generateUrl(typeCode, subTypeCode = null, provinceCode = null) {
    let url = '';

    if (subTypeCode) {
      const subType = subTypes?.find(
        (s) => s?.code === subTypeCode && s?.parent === typeCode,
      );
      if (provinceCode) {
        const province = provinces?.find((p) => p?.code === provinceCode);
        if (province) {
          url += `/${subType?.fields?.slug}/${province?.slug}-t${province?.code}`;
        }
      }
    }

    return `${urlServer}/sitemaps/loai-bat-dong-san${url}/sitemap.xml`;
  }

  function generateAllUrls(type, subType) {
    const urls = [];
    // URLs với loại chính và loại con
    if (subType?.parent === type?.code) {
      // URLs với loại chính, loại con và tỉnh/thành phố
      provinces?.forEach((province) => {
        const locWithSubTypeAndProvince = generateUrl(
          type?.code,
          subType?.code,
          province?.code,
        );
        urls?.push(createUrlObject(locWithSubTypeAndProvince));
      });
    }
    return urls;
  }
  function createUrlObject(loc) {
    return {
      loc,
      lastmod,
      changefreq: 'daily',
      priority: '0.9',
    };
  }

  const subType = subTypes?.find((item) => item?.fields?.slug === slug);
  const type = types?.find((item) => item?.code === subType?.parent);
  const urls = generateAllUrls(type, subType);
  const sitemap = create({version: '1.0', encoding: 'UTF-8'})
    .ele('sitemapindex', {
      xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
    })
    .ele(
      urls.map((url) => ({
        sitemap: {
          loc: url.loc,
          lastmod: url.lastmod,
        },
      })),
    )
    .end({prettyPrint: true});

  // Thiết lập header cho phản hồi XML
  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
