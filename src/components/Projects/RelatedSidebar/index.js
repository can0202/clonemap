import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Skeleton, Button} from 'antd';
import ItemReProject from './Item';
import ModalLogin from 'components/ModalLogin';
import {useSelector} from 'react-redux';
import {getProjectRelated} from 'pages/api/projectRelated';
import {getReRelated} from 'pages/api/reRelated';
import IntlMessages from '@crema/utility/IntlMessages';

const RelatedSidebar = ({dataPost}) => {
  const [openModal, setOpenModal] = useState(false);
  const {accessToken} = useSelector(({auth}) => auth);
  const [dataParamProject, setDataParamProject] = useState({
    pageSize: 10,
    postId: dataPost?.id,
    isProjectOnly: true,
  });
  const [isReload, setIsReload] = useState(true);
  const [dataPostRePro, setDataPostRePro] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Call api Post Project
  useEffect(async () => {
    if (isReload) {
      const resuls =
        dataPost?.postType?.code == 'du-an'
          ? await getProjectRelated(dataParamProject, accessToken)
          : await getReRelated(dataParamProject, accessToken);
      const items = resuls?.data?.elements ?? [];
      const newRecommenEstate = [...dataPostRePro, ...items];
      setDataPostRePro(newRecommenEstate);
      setIsReload(false);
      setCurrentPage(currentPage + 1);
    }
  }, [isReload]);

  const onClickReadMore = () => {
    const newData = {
      ...dataParamProject,
      pageSize: 10,
      page: currentPage,
    };
    setDataParamProject(newData);
    setIsReload(true);
  };

  return (
    <>
      {dataPostRePro?.length > 0 ? (
        <div className='sidebar-contact top-project-sidebar mb-24'>
          <h3 className='bdl-main-color d-flex align-center justify-between'>
            <span>
              {dataPost?.postType?.code == 'du-an' ? 'Bất động sản' : 'Dự án'}{' '}
              lân cận
            </span>
          </h3>
          <div className={`top-project-sidebar-inner mt-16 `}>
            <div
              className={`top-project-sidebar-list ${
                dataPostRePro?.length < 5 ? 'hide' : ''
              }`}
            >
              {dataPostRePro?.map((item, index) => {
                return (
                  <>
                    {isReload ? (
                      <Skeleton key={index} paragraph={{rows: 3}} active />
                    ) : (
                      <ItemReProject
                        key={index}
                        item={item}
                        setOpenModal={setOpenModal}
                      />
                    )}
                  </>
                );
              })}
            </div>
          </div>
          <ModalLogin
            openModalLogin={openModal}
            setOpenModalLogin={setOpenModal}
            description={<IntlMessages id='common.notiLogin' />}
          />
          <div className='load-more'>
            <Button onClick={onClickReadMore}>
              <IntlMessages id='common.readMore' />
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default React.memo(RelatedSidebar);
RelatedSidebar.propTypes = {
  dataPost: PropTypes.any,
};
