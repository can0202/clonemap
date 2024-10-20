import {fetchCategoryAll, onProvinces} from 'pages/api/category';
import {onProvincesId} from 'pages/api/vland';
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
  const {city, slug} = params;
  const cityId = city?.match(/-t(\d+)/)[1];
  const cityName = city?.replace(/-t\d+$/, '');

  console.log('city', city);

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const urlServer = `${protocol}://${req.headers.host}`;

  const resAllConfig = await fetchCategoryAll();
  const provinces = await onProvinces();
  const listProvinces = await onProvincesId(cityId);
  const provinceData =
    listProvinces?.data?.id === cityId ? listProvinces?.data : null;
  const districts = provinceData?.districts || null;
  let wards = null;

  const subTypes = resAllConfig?.data?.categories?.realEstateTypeCat || null;
  const types = resAllConfig?.data?.categories?.postTypeFilterCat || null;
  const prices =
    resAllConfig?.data?.categories?.realEstatePriceFilterCat || null;
  const bedrooms = [
    {value: '0', label: '0'},
    {value: '1', label: '1'},
    {value: '2', label: '2'},
    {value: '3', label: '3'},
    {value: '4', label: '4'},
    {value: '5', label: '5+'},
  ];
  const areas = [
    {value: '30-50', label: '30m - 50m²'},
    {value: '50-80', label: '50 - 80m²'},
    {value: '80-100', label: '80 - 100m²'},
    {value: '100-150', label: '100 - 150m²'},
    {value: '150-200', label: '150 - 200m²'},
    {value: '200-500', label: '200 - 500m²'},
  ];

  function generateUrl(
    typeCode,
    subTypeCode = null,
    provinceCode = null,
    districtCode = null,
    wardCode = null,
    priceCode = null,
    areaCode = null,
    bedroomCode = null,
  ) {
    let url = '';
    let secondaryUrl = '/';
    let priceUrl = '';
    let areaUrl = '';
    let roomUrl = '';

    if (subTypeCode) {
      const subType = subTypes.find(
        (s) => s.code === subTypeCode && s.parent === typeCode,
      );
      if (subType) {
        url = `/${subType.fields.slug}`;
      }
    }
    // Thêm thông tin tỉnh/thành phố vào URL nếu có
    if (provinceCode) {
      const province = provinces.find((p) => p.code === provinceCode);
      if (province) {
        url += `-tai-${province.slug}-t${province.code}`;
      }
    }

    // Thêm thông tin quận/huyện vào URL nếu có
    if (districtCode) {
      const district = districts.find((d) => d.code === districtCode);
      wards = district?.wards;
      if (district) {
        url += `-tai-${district.slug}-t${cityId}`;
      }
    }

    if (wardCode) {
      const ward = wards.find((w) => w.code === wardCode);
      if (ward) {
        url += `-tai-${ward.slug}-t${cityId}`;
      }
    }

    // Thêm giá vào URL nếu có
    if (priceCode) {
      const price = prices.find(
        (p) =>
          p.code === priceCode && (p.parent === typeCode || p.parent === ''),
      );
      if (price) {
        priceUrl += `${formatPriceSlug(price.metadata)}`;
      }
    }

    // Thêm diện tích vào URL nếu có
    if (areaCode) {
      const area = areas.find((a) => a.value === areaCode);
      if (area) {
        areaUrl += `${formatAreaSlug(area.value)}`;
      }
    }

    // Thêm số phòng ngủ vào URL nếu có
    if (bedroomCode) {
      const bedroom = bedrooms.find((b) => b.value === bedroomCode);
      if (bedroom) {
        roomUrl += `${formatBedroomSlug(bedroom.value)}`;
      }
    }

    const combinedUrlParts = [priceUrl, areaUrl, roomUrl].filter(Boolean); // Loại bỏ phần rỗng
    secondaryUrl += combinedUrlParts?.join('-');

    url += `${secondaryUrl}`;

    return `${urlServer}${url}`;
  }

  function formatPriceSlug(metadata) {
    if (metadata === '-1') return 'gia-lien-he';
    const [min, max] = metadata.split('-').map(Number);
    // Định dạng giá trị
    const formatPrice = (price) => {
      if (price >= 1000000000) {
        return `${(price / 1000000000).toFixed(1).replace(/\.0$/, '')}-ty`;
      } else if (price >= 1000000) {
        return `${(price / 1000000).toFixed(1).replace(/\.0$/, '')}-trieu`;
      } else {
        return `${price}`; // Trường hợp giá trị nhỏ hơn triệu đồng
      }
    };
    if (min === 0) return `gia-duoi-${formatPrice(max)}`;
    return `gia-tu-${formatPrice(min)}-den-${formatPrice(max)}`;
  }

  function formatAreaSlug(value) {
    const [min, max] = value.split('-').map(Number);
    if (min === 0) return `dt-duoi-${max}m2`;
    return `dt-tu-${min}m2-den-${max}m2`;
  }

  function formatBedroomSlug(value) {
    return `${value}pn`;
  }

  function generateAllUrls(type, subType, province) {
    const urls = [];
    // URLs với loại chính và loại con
    if (subType?.parent === type?.code) {
      // URLs với loại chính, loại con và tỉnh/thành phố
      if (province) {
        const locWithSubTypeAndProvince = generateUrl(
          type?.code,
          subType?.code,
          province?.code,
          null,
          null,
          null,
          null,
          null,
        );
        urls?.push(createUrlObject(locWithSubTypeAndProvince));

        // URLs với loại chính, loại con, tỉnh/thành phố và giá
        prices?.forEach((price) => {
          if (price.parent === type.code || price.parent === '') {
            const locWithSubTypeProvinceAndPrice = generateUrl(
              type.code,
              subType.code,
              province.code,
              null,
              null,
              price.code,
              null,
              null,
            );
            urls.push(createUrlObject(locWithSubTypeProvinceAndPrice));
          }
        });
        // URLs với loại chính, loại con, tỉnh/thành phố , giá và diện tích
        areas?.forEach((area) => {
          const locWithArea = generateUrl(
            type?.code,
            subType?.code,
            province?.code,
            null,
            null,
            null,
            area?.value,
            null,
          );
          urls?.push(createUrlObject(locWithArea));
        });

        // URLs với loại chính, loại con, tỉnh/thành phố , giá và phòng ngủ
        bedrooms?.forEach((bedroom) => {
          const locWithAreaAndBedroom = generateUrl(
            type?.code,
            subType?.code,
            province?.code,
            null,
            null,
            null,
            null,
            bedroom?.value,
          );
          urls?.push(createUrlObject(locWithAreaAndBedroom));
        });

        // URLs với loại chính, loại con, tỉnh/thành phố, giá, diện tích và số phòng ngủ
        prices?.forEach((price) => {
          if (price?.parent === type?.code || price?.parent === '') {
            areas?.forEach((area) => {
              bedrooms?.forEach((bedroom) => {
                const locWithProvincePriceAreaAndBedroom = generateUrl(
                  type?.code,
                  subType?.code,
                  province?.code,
                  null,
                  null,
                  price?.code,
                  area?.value,
                  bedroom?.value,
                );
                urls.push(createUrlObject(locWithProvincePriceAreaAndBedroom));
              });
            });
          }
        });
      }
      if (districts) {
        const promises = districts?.map((district) => {
          return new Promise((resolve, reject) => {
            try {
              // URL với loại chính, loại con, và quận/huyện
              const locWithSubTypeDistrict = generateUrl(
                type.code,
                subType.code,
                null,
                district.code,
                null,
                null,
                null,
                null,
              );
              urls?.push(createUrlObject(locWithSubTypeDistrict));

              // URLs với loại chính, loại con, quận/huyện và giá
              prices?.forEach((price) => {
                if (price.parent === type?.code || price?.parent === '') {
                  const locWithSubTypeProvinceAndPrice = generateUrl(
                    type?.code,
                    subType?.code,
                    null,
                    district?.code,
                    null,
                    price?.code,
                    null,
                    null,
                  );
                  urls?.push(createUrlObject(locWithSubTypeProvinceAndPrice));
                }
              });

              // URLs với loại chính, loại con, quận/huyện và diện tích
              areas?.forEach((area) => {
                const locWithArea = generateUrl(
                  type?.code,
                  subType?.code,
                  null,
                  district?.code,
                  null,
                  null,
                  area?.value,
                  null,
                );
                urls?.push(createUrlObject(locWithArea));
              });

              // URLs với loại chính, loại con, quận/huyện và phòng ngủ
              bedrooms?.forEach((bedroom) => {
                const locWithAreaAndBedroom = generateUrl(
                  type?.code,
                  subType?.code,
                  null,
                  district?.code,
                  null,
                  null,
                  null,
                  bedroom?.value,
                );
                urls?.push(createUrlObject(locWithAreaAndBedroom));
              });

              // URLs với loại chính, loại con, quận/huyện, giá, diện tích và số phòng ngủ
              prices?.forEach((price) => {
                if (price?.parent === type?.code || price?.parent === '') {
                  areas?.forEach((area) => {
                    bedrooms?.forEach((bedroom) => {
                      const locWithProvincePriceAreaAndBedroom = generateUrl(
                        type?.code,
                        subType?.code,
                        null,
                        district?.code,
                        null,
                        price?.code,
                        area?.value,
                        bedroom?.value,
                      );
                      urls?.push(
                        createUrlObject(locWithProvincePriceAreaAndBedroom),
                      );
                    });
                  });
                }
              });

              // Hoàn thành Promise này sau khi tất cả các URLs đã được tạo
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });

        Promise.all(promises)
          .then(() => {
            console.log('All URLs generated successfully');
          })
          .catch((error) => {
            console.error('Error generating URLs:', error);
          });
      }

      if (wards) {
        const promises = wards?.map((ward) => {
          return new Promise((resolve, reject) => {
            try {
              const locWithSubTypeWard = generateUrl(
                type?.code,
                subType?.code,
                null,
                null,
                ward?.code,
                null,
                null,
                null,
              );
              urls?.push(createUrlObject(locWithSubTypeWard));

              // URLs với loại chính, loại con, tỉnh/thành phố và giá
              prices?.forEach((price) => {
                if (price?.parent === type?.code || price?.parent === '') {
                  const locWithSubTypeProvinceAndPrice = generateUrl(
                    type?.code,
                    subType?.code,
                    null,
                    null,
                    ward?.code,
                    price?.code,
                    null,
                    null,
                  );
                  urls?.push(createUrlObject(locWithSubTypeProvinceAndPrice));
                }
              });
              // URLs với loại chính, loại con, tỉnh/thành phố , giá và diện tích
              areas?.forEach((area) => {
                const locWithArea = generateUrl(
                  type?.code,
                  subType?.code,
                  null,
                  null,
                  ward?.code,
                  null,
                  area?.value,
                  null,
                );
                urls?.push(createUrlObject(locWithArea));
              });

              // URLs với loại chính, loại con, tỉnh/thành phố , giá và phòng ngủ
              bedrooms?.forEach((bedroom) => {
                const locWithAreaAndBedroom = generateUrl(
                  type?.code,
                  subType?.code,
                  null,
                  null,
                  ward?.code,
                  null,
                  null,
                  bedroom?.value,
                );
                urls?.push(createUrlObject(locWithAreaAndBedroom));
              });

              // URLs với loại chính, loại con, tỉnh/thành phố, giá, diện tích và số phòng ngủ
              prices?.forEach((price) => {
                if (price?.parent === type?.code || price?.parent === '') {
                  areas?.forEach((area) => {
                    bedrooms?.forEach((bedroom) => {
                      const locWithProvincePriceAreaAndBedroom = generateUrl(
                        type?.code,
                        subType?.code,
                        null,
                        null,
                        ward?.code,
                        price?.code,
                        area?.value,
                        bedroom?.value,
                      );
                      urls?.push(
                        createUrlObject(locWithProvincePriceAreaAndBedroom),
                      );
                    });
                  });
                }
              });
              // Hoàn thành Promise này sau khi tất cả các URLs đã được tạo
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });

        Promise.all(promises)
          .then(() => {
            console.log('All URLs generated successfully');
          })
          .catch((error) => {
            console.error('Error generating URLs:', error);
          });
      }

      // URLs với loại chính, loại con và giá
      // prices.forEach((price) => {
      //   if (price.parent === type.code || price.parent === '') {
      //     const locWithSubTypeAndPrice = generateUrl(
      //       type.code,
      //       subType.code,
      //       null,
      //       price.code,
      //       null,
      //       null,
      //     );
      //     urls.push(createUrlObject(locWithSubTypeAndPrice));
      //   }
      // });
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
  const type = types.find((item) => item?.code === subType?.parent);
  const province = provinces.find((item) => item?.slug === cityName);
  const urls = generateAllUrls(type, subType, province);

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

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
