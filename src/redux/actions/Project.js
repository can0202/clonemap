import {
  IS_CHANGE_SUB_TYPE,
  RESET_IS_CHANGE_SUB_TYPE,
} from 'shared/constants/ActionTypes';

export const onChangeSubType = ({isChangeSubType, subType}) => {
  return (dispatch) => {
    dispatch({type: IS_CHANGE_SUB_TYPE, payload: {isChangeSubType, subType}});
  };
};

export const onResetSubType = () => {
  return (dispatch) => {
    dispatch({type: RESET_IS_CHANGE_SUB_TYPE});
  };
};
