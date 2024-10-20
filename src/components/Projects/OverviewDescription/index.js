import React, {useState, useEffect} from 'react';
import {Col, Collapse, Row, Skeleton} from 'antd';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';

const OverviewDescription = (props) => {
  const {Panel} = Collapse;
  const {dataPost} = props;
  const [renderDesc, setRenderDesc] = useState('');
  const [active, setActive] = useState(false);
  const onToggle = () => {
    setActive(!active);
  };

  // convert render oembed tag url
  const renderHtmlText = () => {
    const oembedRegex = /<oembed[^>]*>/g;
    if (oembedRegex) {
      const oembedMatch = dataPost?.description?.match(oembedRegex);
      if (oembedMatch) {
        const oembedUrl = oembedMatch[0]?.match(/url="([^"]*)"/)[1];
        const split_oembedUrl = oembedUrl?.split('&');
        const split_slug = split_oembedUrl[0]?.split('watch?v=');
        const split_main = split_slug[0] + 'embed/' + split_slug[1];
        const iframeElement = `<iframe src="${split_main}" width="560" height="400" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        setRenderDesc(
          dataPost?.description
            ?.replace(oembedRegex, iframeElement)
            .replace(/\r<br>/g, '<p></p>')
            .replace(/\n/g, '<p></p>')
            .replace(/\r\n\r\n/g, '<p></p>')
            .replace(/\r\n/g, '<p></p>'),
        );
      } else {
        setRenderDesc(
          dataPost?.description
            ?.replace(/\r<br>/g, '<p></p>')
            .replace(/\n/g, '<p></p>')
            .replace(/\r\n\r\n/g, '<p></p>')
            .replace(/\r\n/g, '<p></p>'),
        );
      }
    }
  };

  useEffect(() => {
    renderHtmlText();
  }, [dataPost]);

  useEffect(() => {
    const images = document.querySelectorAll('.overview-content img');
    images.forEach((item, index) => {
      if (!item.hasAttribute('alt')) {
        item.setAttribute('alt', `Hình ảnh ${index + 1}`); // Thêm thuộc tính alt với giá trị mặc định
      }
      item.addEventListener('click', handleZomeImage);
    });
    function handleZomeImage(e) {
      const image = e.target.getAttribute('src');
      const template = `<div class='lightbox'>
        <button class='lightbox-close'>X</button>
        <div class='lightbox-content'>
          <img src=${image} alt='' class='lightbox-image'/>
        </div>
      </div>`;
      document.body.insertAdjacentHTML('beforeend', template);

      // Thêm sk close
      document
        .querySelector('.lightbox-close')
        .addEventListener('click', handleCloseLightBox);
    }

    function handleCloseLightBox() {
      const lightbox = document.querySelector('.lightbox');
      if (lightbox) {
        lightbox.remove();
      }
    }

    return () => {
      images.forEach((item) =>
        item.removeEventListener('click', handleZomeImage),
      );
    };
  }, []);
  return (
    <div id='tab-desc'>
      <div className={`overview-content ${active ? 'active' : ''}`}>
        <Row gutter={[0, 16]}>
          <Col xs={24}>
            <h3 className='title-section'>
              <IntlMessages id='common.descInformation' />
            </h3>
          </Col>
          <Col xs={24}>
            <div
              className='description'
              dangerouslySetInnerHTML={{
                __html: renderDesc ? renderDesc : dataPost?.description,
              }}
            ></div>

            {dataPost?.description?.length > 180 ? (
              <div
                className={`overview-content-action position-absolute overview-more `}
              >
                <div className='re__gradient'>&nbsp;</div>
                <div className='overview_more' onClick={onToggle}>
                  <span className='mr-8'>
                    {active ? (
                      <IntlMessages id='common.collapse' />
                    ) : (
                      <IntlMessages id='common.extend' />
                    )}
                  </span>
                </div>
              </div>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OverviewDescription;
OverviewDescription.propTypes = {
  dataPost: PropTypes.any,
  loading: PropTypes.any,
  changeStyle: PropTypes.any,
};
