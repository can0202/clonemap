import React, {useEffect} from 'react';
import {Checkbox, Col, Form, Row, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';
import TooltipVarsMember from 'components/TooltipVarsMember';

const FormMember = ({dataSectionConfig, varsMemberText}) => {
  return (
    <Form.Item name='postByVARS' valuePropName='checked'>
      <Checkbox>
        <TooltipVarsMember
          titleVas={dataSectionConfig?.title}
          image={dataSectionConfig?.tickIcon}
          enable={varsMemberText?.enable}
          description={varsMemberText?.description}
        />
      </Checkbox>
    </Form.Item>
  );
};

export default FormMember;
FormMember.propTypes = {
  dataSectionConfig: PropTypes.any,
  varsMemberText: PropTypes.any,
};
