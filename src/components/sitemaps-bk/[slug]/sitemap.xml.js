import {fetchCategoryAll} from 'pages/api/category';
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

const typeMap = {
  'bds-ban': 'mua-ban-nha-dat',
  'bds-cho-thue': 'cho-thue-nha-dat',
  'du-an': 'du-an-bat-dong-san',
  'm-a': 'm-a-bat-dong-san',
};

export async function getServerSideProps({res, req, params}) {
  const lastmod = getLastmodTime();
  const {slug} = params;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const urlServer = `${protocol}://${req.headers.host}`;
  const resAllConfig = await fetchCategoryAll();
  const subTypes = resAllConfig?.data?.categories?.realEstateTypeCat || null;
  const types = resAllConfig?.data?.categories?.postTypeFilterCat || null;

  function generateUrlTypeAndSubType(typeCode, subTypeCode = null) {
    const type = types?.find((t) => t?.code === typeCode);
    const basePath =
      typeMap[typeCode] || type?.name.toLowerCase().replace(/\s+/g, '-');
    let url = `/${basePath}`;

    // Thêm loại con (subType) vào URL nếu có
    if (subTypeCode) {
      const subType = subTypes?.find(
        (s) => s?.code === subTypeCode && s?.parent === typeCode,
      );
      if (subType) {
        url = `/${subType?.fields?.slug}`;
      }
    }

    return `${urlServer}${url}`;
  }

  function generateTypeAndSubTypeUrls() {
    const urls = [];
    types?.forEach((type) => {
      // URL với loại chính
      const baseLoc = generateUrlTypeAndSubType(type?.code);
      urls?.push(createUrlObject(baseLoc));

      // URLs với loại chính và loại con
      subTypes?.forEach((subType) => {
        if (subType?.parent === type?.code) {
          const locWithSubType = generateUrlTypeAndSubType(
            type?.code,
            subType?.code,
          );
          urls?.push(createUrlObject(locWithSubType));
        }
      });
    });

    return urls;
  }

  function generateUrlSubType(typeCode, subTypeCode = null) {
    let url = '';
    if (subTypeCode) {
      const subType = subTypes?.find(
        (s) => s?.code === subTypeCode && s?.parent === typeCode,
      );
      if (subType) {
        url = `/${subType?.fields?.slug}`;
      }
    }

    return `${urlServer}/sitemaps/loai-bat-dong-san${url}/sitemap.xml`;
  }

  function generateSubTypeUrls(type) {
    const urls = [];
    subTypes?.forEach((subType) => {
      if (subType?.parent === type?.code) {
        const locWithSubType = generateUrlSubType(type?.code, subType?.code);
        urls?.push(createUrlObject(locWithSubType));
      }
    });
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

  if (slug === 'danh-muc') {
    const urls = generateTypeAndSubTypeUrls();
    urls?.unshift({
      loc: `${urlServer}`,
      lastmod: lastmod,
      changefreq: 'daily',
      priority: 1,
    });
    // Tạo XML cho sitemap
    const sitemap = create({version: '1.0', encoding: 'UTF-8'})
      .ele('urlset', {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
      })
      .ele(
        urls.map((url) => ({
          url: {
            loc: url.loc,
            lastmod: url.lastmod,
            changefreq: url.changefreq,
            priority: url.priority,
          },
        })),
      )
      .end({prettyPrint: true});
    // Thiết lập header cho phản hồi XML
    res.setHeader('Content-Type', 'application/xml');
    res.write(sitemap);
    res.end();
  } else {
    const type = types?.find((item) => item?.fields?.slug === slug);
    const urls = generateSubTypeUrls(type);
    // Tạo XML cho sitemap
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
  }

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
