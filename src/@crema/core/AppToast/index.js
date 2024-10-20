import {useEffect} from 'react';
import {notification} from 'antd';
import {EToastType} from './interface';
import {useDispatch, useSelector} from 'react-redux';
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiInformationFill,
} from 'react-icons/ri';
import {useIntl} from 'react-intl';
import {CLEAN_APP_STATE} from 'shared/constants/ActionTypes';

const AppToast = () => {
  const {messages} = useIntl();
  const dispatch = useDispatch();
  const {toastProps} = useSelector(({app}) => app);
  useEffect(() => {
    if (toastProps) {
      if (Object.keys(toastProps).length > 0) {
        switch (toastProps.type) {
          case EToastType.SUCCESS:
            notification.success({
              message: <>{messages['common.notification']}</>,
              description: toastProps.description ? toastProps.description : '',
              icon: <RiCheckboxCircleFill />,
              className: 'bg-success',
            });
            dispatch({type: CLEAN_APP_STATE});
            break;
          case EToastType.INFO:
            notification.info({
              message: <>{messages['common.notification']}</>,
              description: toastProps.description ? toastProps.description : '',
              icon: <RiInformationFill />,
              className: 'bg-info',
            });
            dispatch({type: CLEAN_APP_STATE});
            break;
          case EToastType.ERROR:
            notification.error({
              message: <>{messages['common.notification']}</>,
              description: toastProps.description ? toastProps.description : '',
              icon: <RiErrorWarningFill />,
              className: 'bg-error',
            });
            dispatch({type: CLEAN_APP_STATE});
            break;

          default:
            dispatch({type: CLEAN_APP_STATE});
            break;
        }
      }
    }
  }, [toastProps]);

  return <></>;
};
export default AppToast;
