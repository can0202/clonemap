import React, {useState, useEffect} from 'react';
import {Modal} from 'antd';
import PropTypes from 'prop-types';

import {fetchRating} from 'pages/api/rating';
import ModalMember from 'components/ModalMember';
import RatingOwner from './RatingOwner';
import RatingUser from './RatingUser';
import RatingPanigation from './RatingPanigation';
import RatingModal from './RatingModal';
import RatingAuthor from './RatingAuthor';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

const ModalRating = ({
  dataPost,
  setOpenModalRating,
  openModalRating,
  accessToken,
  isAuthenticated,
  profile,
  openModal,
  setOpenModal,
}) => {
  const {messages} = useIntl();
  const [dataRate, setDataRate] = useState(null);
  const [dataParams, setDataParams] = useState({
    type: dataPost?.author?.ratingTargetType,
    targetId: dataPost?.author?.ratingTargetId,
    page: 1,
    pageSize: 10,
    refId: dataPost?.id,
    refType: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [openRating, setOpenRating] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const fetchAPI = async () => {
    const results = await fetchRating(dataParams, accessToken);
    const items = results?.data ?? [];
    if (results?.code == '200') {
      setDataRate(items);
    }
  };
  useEffect(() => {
    if (isLoading) {
      fetchAPI();
      setIsLoading(false);
    }
  }, [isLoading]);

  const currencyFormat = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <>
      <Modal
        title={<IntlMessages id='common.reviewAndRating' />}
        className='modal-ratings text-center'
        centered
        width={1000}
        open={openModalRating}
        onOk={() => setOpenModalRating(false)}
        onCancel={() => setOpenModalRating(false)}
        footer={null}
      >
        <div className='rating'>
          <div className='rating-author'>
            <RatingAuthor
              profile={profile}
              dataRate={dataRate}
              setOpenRating={setOpenRating}
              isAuthenticated={isAuthenticated}
              openModal={openModal}
              setOpenModal={setOpenModal}
              setOpenProfile={setOpenProfile}
            />
          </div>
          <div className='rating-list'>
            <div className='rating-list-total'>
              <h3>
                {`${
                  dataRate?.ratings.total
                    ? currencyFormat(dataRate?.ratings.total)
                    : 0
                } ${messages['common.totalRating']}`}
              </h3>
            </div>
            <RatingOwner dataRate={dataRate} />
            <RatingUser dataRate={dataRate} isLoading={isLoading} />
            <RatingPanigation
              dataRate={dataRate}
              dataParams={dataParams}
              setDataParams={setDataParams}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
      </Modal>

      {/* Modal Rating */}
      <RatingModal
        dataPost={dataPost}
        openRating={openRating}
        setOpenRating={setOpenRating}
        accessToken={accessToken}
        isAuthenticated={isAuthenticated}
        setIsLoading={setIsLoading}
      />
      {/* Modal Member */}
      <ModalMember
        setOpenProfile={setOpenProfile}
        openProfile={openProfile}
        profile={profile}
      />
    </>
  );
};

export default ModalRating;
ModalRating.propTypes = {
  openModalRating: PropTypes.any,
  setOpenModalRating: PropTypes.any,
  dataPost: PropTypes.any,
  profile: PropTypes.any,
  isAuthenticated: PropTypes.any,
  accessToken: PropTypes.any,
  setOpenModal: PropTypes.any,
  openModal: PropTypes.any,
};
