import React, {useState, useEffect} from 'react';
import {
  Button,
  Col,
  Collapse,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Skeleton,
  Slider,
  Table,
} from 'antd';
import PropTypes from 'prop-types';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import {exportToExcel} from './exportToExcel';
import {currencyFormat} from '@crema/utility/NumberFormatter';
import AppCollapse from 'components/AppCollapse';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {SHOW_MESSAGE} from 'shared/constants/ActionTypes';
import {useDispatch} from 'react-redux';
ChartJS.register(ArcElement, Tooltip, Legend);

const Loan = (props) => {
  const {messages} = useIntl();
  const dispatch = useDispatch();
  const {dataPost, loading} = props;
  const {Panel} = Collapse;
  const [dataLoan, setDataLoan] = useState([]);
  const [dataLoanYear, setDataLoanYear] = useState([]);
  const [valueRadio, setValueRadio] = useState('cal-decrease');
  const [propertyValue, setPropertyValue] = useState(1000000000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [loanPercentage, setLoanPercentage] = useState(1000000000);
  const [interestRate, setInterestRate] = useState(30);
  const [isCalDecrease, setIsCalDecrease] = useState(false);
  const [prePaymentAmount, setPrePaymentAmount] = useState(''); // Vốn tự có
  const [paymentRemaining, setPaymentRemaining] = useState(''); // Gốc cần trả
  const [principalAmount, setPrincipalAmount] = useState(''); // lãi cần trả
  const [firstMonthPayment, setFirstMonthPayment] = useState(''); // Thanh toán tháng đầu
  const [yearFlag, setYearFlag] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModalByMonth = () => {
    setYearFlag(false);
    setIsModalOpen(true);
  };
  const showModalByYear = () => {
    setYearFlag(true);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [dataChart, setDataChart] = useState({
    labels: [
      messages['common.equityCapital'],
      messages['common.principalPaid'],
      messages['common.interestPaid'],
    ],
    datasets: [
      {
        label: '',
        data: [50, 50, 35],
        backgroundColor: ['#DEBD8B', '#A7CDF1', '#E79DD6'],
        borderWidth: 0,
      },
    ],
  });
  const optionsChart = {
    plugins: {
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: true,
    },
  };

  useEffect(() => {
    const priceMain = dataPost?.price;
    if (priceMain) {
      setPropertyValue(priceMain);
      setLoanPercentage(priceMain);
      setIsCalDecrease(true);
    }
  }, [dataPost]);

  const onPropertyValue = (e) => {
    setPropertyValue(e);
    setIsCalDecrease(true);
  };

  const onLoanTerm = (e) => {
    setLoanTerm(e);
    setIsCalDecrease(true);
  };

  const onLoanAmount = (e) => {
    if (e > propertyValue) {
      dispatch({
        type: SHOW_MESSAGE,
        payload: {
          type: 'error',
          description: messages['common.notiLoan'],
        },
      });
      setLoanPercentage(propertyValue);
    } else {
      setLoanPercentage(e);
    }

    setIsCalDecrease(true);
  };

  const onInterestRate = (e) => {
    setInterestRate(e);
    setIsCalDecrease(true);
  };
  const onChangeRadio = (e) => {
    setValueRadio(e.target.value);
  };
  useEffect(() => {
    if (isCalDecrease) {
      calDecrease();
      setIsCalDecrease(false);
    }
  }, [isCalDecrease]);

  useEffect(() => {
    if (valueRadio === 'cal-decrease') {
      calDecrease();
    } else {
      calDivide();
    }
  }, [valueRadio]);

  // Dư nợ giảm dần
  function calDecrease() {
    // const loanAmount = (propertyValue * loanPercentage) / 100; // số tiền vay
    const loanAmount = loanPercentage; // số tiền vay
    const monthlyInterestRate = interestRate / 100 / 12; // Lãi suất theo tháng
    const loanTermInMonths = loanTerm; // thoi han vay theo tháng
    let remainingBalance = loanAmount; // số tiền còn lại
    let principalPayable = loanAmount / loanTermInMonths; // gốc phải trả
    let paymentAmount = propertyValue - loanAmount; // Vốn tự có
    let principalAmount = 0; // Lãi cần trả
    // thoi han vay for loop
    let dataDecrease = [];
    let dataDecreaseYear = [];
    let laiphaitraYear = 0;
    let gocphaitraYear = 0;
    let sotienphaitraYear = 0;
    let sotienconlaiYear = 0;
    dataDecrease.push({
      key: 0,
      kyhan: 0,
      laiphaitra: '',
      gocphaitra: '',
      sotienphaitra: '',
      sotienconlai: currencyFormat(remainingBalance),
    });
    dataDecreaseYear.push({
      key: 0,
      kyhan: 0,
      laiphaitra: '',
      gocphaitra: '',
      sotienphaitra: '',
      sotienconlai: currencyFormat(remainingBalance),
    });
    for (let month = 0; month < loanTermInMonths; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate; // lãi phải trả = số tiền còn lại * lãi suất
      principalAmount = Math.round(principalAmount + interestPayment);
      let amountPayable = Math.round(principalPayable + interestPayment); // số tiền phải trả = gốc + lãi
      remainingBalance =
        remainingBalance - principalPayable >= 1000
          ? remainingBalance - principalPayable
          : 0;
      laiphaitraYear = interestPayment;
      gocphaitraYear = gocphaitraYear + principalPayable;
      sotienphaitraYear = amountPayable;
      sotienconlaiYear = remainingBalance;
      if ((month + 1) % 12 == 0) {
        dataDecreaseYear.push({
          key: (month + 1) / 12,
          kyhan: (month + 1) / 12,
          laiphaitra: currencyFormat(laiphaitraYear),
          gocphaitra: currencyFormat(gocphaitraYear),
          sotienphaitra: currencyFormat(sotienphaitraYear),
          sotienconlai: currencyFormat(sotienconlaiYear),
        });
        laiphaitraYear = 0;
        gocphaitraYear = 0;
        sotienphaitraYear = 0;
        sotienconlaiYear = 0;
      }
      dataDecrease.push({
        key: month + 1,
        kyhan: month + 1,
        laiphaitra: currencyFormat(interestPayment),
        gocphaitra: currencyFormat(principalPayable),
        sotienphaitra: currencyFormat(amountPayable),
        sotienconlai: currencyFormat(remainingBalance),
      });
    }
    setDataLoan(dataDecrease);
    setDataLoanYear(dataDecreaseYear);
    setPaymentRemaining(loanAmount); // Gốc cần trả
    setPrePaymentAmount(paymentAmount); // Vốn tự có
    setPrincipalAmount(principalAmount); // Vốn tự có
    setFirstMonthPayment(dataDecrease[0].amountPayable); // tháng đầu tiên
    setDataChart({
      labels: [
        messages['common.equityCapital'],
        messages['common.principalPaid'],
        messages['common.interestPaid'],
      ],
      datasets: [
        {
          label: '',
          data: [paymentAmount, loanAmount, principalAmount],
          backgroundColor: ['#DEBD8B', '#A7CDF1', '#E79DD6'],
          borderWidth: 0,
        },
      ],
    });
  }

  // Trả lãi chia đều
  function calDivide() {
    // const loanAmount = (propertyValue * loanPercentage) / 100; // số tiền vay
    const loanAmount = loanPercentage; // số tiền vay
    const monthlyInterestRate = interestRate / 100 / 12; // Lãi suất theo tháng hoặc năm
    const loanTermInMonths = loanTerm; // thoi han vay theo tháng hoặc năm
    let remainingBalance = loanAmount; // số tiền còn lại
    let principalPayable = loanAmount / loanTermInMonths; // gốc phải trả
    let interestPayment = loanAmount * monthlyInterestRate; // lãi phải trả = số tiền vay * lãi suất
    let paymentAmount = propertyValue - loanAmount; // Vốn tự có
    let principalAmount = 0; // Lãi cần trả
    // thoi han vay for loop
    let dataDivide = [];
    let dataDivideYear = [];
    let laiphaitraYear = 0;
    let gocphaitraYear = 0;
    let sotienphaitraYear = 0;
    let sotienconlaiYear = 0;
    dataDivide.push({
      key: 0,
      kyhan: 0,
      laiphaitra: '',
      gocphaitra: '',
      sotienphaitra: '',
      sotienconlai: currencyFormat(remainingBalance),
    });
    for (let month = 0; month < loanTermInMonths; month++) {
      principalAmount = Math.round(principalAmount + interestPayment);
      let amountPayable = Math.round(principalPayable + interestPayment); // số tiền phải trả = gốc + lãi
      remainingBalance =
        remainingBalance - principalPayable >= 1000
          ? remainingBalance - principalPayable
          : 0;
      laiphaitraYear = interestPayment + interestPayment;
      gocphaitraYear = gocphaitraYear + principalPayable;
      sotienphaitraYear = sotienphaitraYear + amountPayable;
      sotienconlaiYear = sotienconlaiYear + remainingBalance;
      if ((month + 1) % 12 == 0) {
        dataDivideYear.push({
          key: (month + 1) / 12,
          kyhan: (month + 1) / 12,
          laiphaitra: currencyFormat(laiphaitraYear),
          gocphaitra: currencyFormat(gocphaitraYear),
          sotienphaitra: currencyFormat(sotienphaitraYear),
          sotienconlai: currencyFormat(sotienconlaiYear),
        });
        laiphaitraYear = 0;
        gocphaitraYear = 0;
        sotienphaitraYear = 0;
        sotienconlaiYear = 0;
      }
      dataDivide.push({
        key: month + 1,
        kyhan: month + 1,
        laiphaitra: currencyFormat(interestPayment),
        gocphaitra: currencyFormat(principalPayable),
        sotienphaitra: currencyFormat(amountPayable),
        sotienconlai: currencyFormat(remainingBalance),
      });
    }
    setDataLoan(dataDivide);
    setDataLoanYear(dataDivideYear);
    setPaymentRemaining(loanAmount); // Gốc cần trả
    setPrePaymentAmount(paymentAmount); // Vốn tự có
    setPrincipalAmount(principalAmount); // Vốn tự có
    setFirstMonthPayment(dataDivide[0].amountPayable); // tháng đầu tiên

    setDataChart({
      labels: [
        messages['common.equityCapital'],
        messages['common.principalPaid'],
        messages['common.interestPaid'],
      ],
      datasets: [
        {
          label: '',
          data: [paymentAmount, loanAmount, principalAmount],
          backgroundColor: ['#DEBD8B', '#A7CDF1', '#E79DD6'],
          borderWidth: 0,
        },
      ],
    });
  }

  // data table modal
  const columnsTable = [
    {
      title: messages['common.period'],
      dataIndex: 'kyhan',
      key: 'kyhan',
    },
    {
      title: messages['common.interestPayable'],
      dataIndex: 'laiphaitra',
      key: 'laiphaitra',
    },
    {
      title: messages['common.principalPayable'],
      dataIndex: 'gocphaitra',
      key: 'gocphaitra',
    },
    {
      title: messages['common.moneyHavePay'],
      key: 'sotienphaitra',
      dataIndex: 'sotienphaitra',
    },
    {
      title: messages['common.remainingAmount'],
      key: 'sotienconlai',
      dataIndex: 'sotienconlai',
    },
  ];

  // Export Data Buton
  const textLoan =
    valueRadio === 'cal-decrease'
      ? messages['common.outstandingDecreases']
      : messages['common.payInterestEqually'];
  const infoLoan = {
    hinh_thuc: textLoan,
    thoi_han_vay: loanTerm + ' ' + messages['common.month'],
    lai_suat: interestRate + ' ' + messages['common.percentYear'],
  };
  const dataEx = yearFlag ? dataLoanYear : dataLoan;
  const exportData = () => {
    exportToExcel(
      dataEx,
      infoLoan,
      `chi_tiet_ke_hoach_tai_chinh_theo_${yearFlag ? 'nam' : 'thang'}`,
    );
  };

  // Handle Charactor Input Number
  const handleKeyCharactor = (evt) => {
    ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault();
  };
  return (
    <div id='tab-loan' className='section-tab'>
      {loading ? (
        <Skeleton paragraph={{rows: 6}} loading={loading} active />
      ) : (
        <AppCollapse
          title={
            <h3 className='title-section'>
              <IntlMessages id='common.loanEstimate' />
            </h3>
          }
          description={
            <>
              <Row className='loan' gutter={[18, 18]}>
                <Col xs={{span: 24}} lg={{span: 12}} className='left-box'>
                  <div className='input-control'>
                    <Radio.Group
                      onChange={onChangeRadio}
                      value={valueRadio}
                      className='calc-loan-radio d-flex justify-between'
                    >
                      <Radio value={'cal-decrease'}>
                        <IntlMessages id='common.outstandingDecreases' />
                      </Radio>
                      <Radio value={'cal-divide'}>
                        <IntlMessages id='common.payInterestEqually' />
                      </Radio>
                    </Radio.Group>
                  </div>
                  <div className='input-control'>
                    <Row className='align-center'>
                      <Col span={15} className='value-house-left'>
                        <h4>
                          <IntlMessages id='common.realEstateValue' />
                        </h4>
                      </Col>
                      <Col span={9} className='value-house-right'>
                        <InputNumber
                          className='input-number'
                          onKeyDown={handleKeyCharactor}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                          }
                          parser={(value) => value.replace(/\$\s?|(\.*)/g, '')}
                          min={1}
                          max={100000000000}
                          step={100}
                          value={propertyValue}
                          onChange={onPropertyValue}
                        />
                      </Col>
                      <Col span={24}>
                        <Slider
                          min={1}
                          max={100000000000}
                          step={1000000}
                          onChange={onPropertyValue}
                          value={propertyValue}
                          tooltip={{
                            open: false,
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className='input-control'>
                    <Row className='align-center'>
                      <Col span={15}>
                        <h4>
                          <IntlMessages id='common.loan' />
                        </h4>
                      </Col>
                      <Col span={9}>
                        <InputNumber
                          onKeyDown={handleKeyCharactor}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                          }
                          parser={(value) => value.replace(/\$\s?|(\.*)/g, '')}
                          // type='number'
                          // inputMode='numeric'
                          min={0}
                          // max={propertyValue}
                          step={100}
                          value={loanPercentage}
                          onChange={onLoanAmount}
                          // onBlur={onLoanAmountBlur}
                        />
                      </Col>
                      <Col span={24}>
                        <Slider
                          className='slide-loan'
                          min={0}
                          max={propertyValue}
                          onChange={onLoanAmount}
                          value={loanPercentage}
                          // step={1000}
                          tooltip={{
                            open: false,
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className='input-control'>
                    <Row className='align-center'>
                      <Col span={18}>
                        <h4>
                          <IntlMessages id='common.interestRate' />
                        </h4>
                      </Col>
                      <Col span={6}>
                        <InputNumber
                          type='number'
                          inputMode='numeric'
                          min={0}
                          max={50}
                          step={10}
                          value={interestRate}
                          onChange={onInterestRate}
                        />
                      </Col>
                      <Col span={24}>
                        <Slider
                          className='slide-loan'
                          min={1}
                          max={50}
                          step={0.01}
                          onChange={onInterestRate}
                          value={interestRate}
                          tooltip={{
                            open: false,
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className='input-control'>
                    <Row className='align-center'>
                      <Col span={18}>
                        <h4>
                          <IntlMessages id='common.loanPeriod' />
                        </h4>
                      </Col>
                      <Col span={6}>
                        <InputNumber
                          onKeyDown={handleKeyCharactor}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          type='number'
                          inputMode='numeric'
                          min={1}
                          max={360}
                          step={10}
                          value={loanTerm}
                          onChange={onLoanTerm}
                        />
                      </Col>
                      <Col span={24}>
                        <Slider
                          className='slide-loan'
                          min={1}
                          max={360}
                          onChange={onLoanTerm}
                          value={loanTerm}
                          tooltip={{
                            open: false,
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className='calc-loan-download d-flex justify-between'>
                    <Button type='default' onClick={showModalByMonth}>
                      <IntlMessages id='common.detailsByMonth' />
                    </Button>
                    <Button type='default' onClick={showModalByYear}>
                      <IntlMessages id='common.detailsByYear' />
                    </Button>
                  </div>
                </Col>
                <Col xs={{span: 24}} lg={{span: 12}} className='right-box'>
                  <Doughnut data={dataChart} options={optionsChart} />
                  <div className='labels-chart'>
                    <ul className='labels-chart-label'>
                      <li>
                        <div className='labels-chart-left d-flex align-center'>
                          <div className='cir-color cir-color-1'></div>
                          <div className='re__desc'>
                            <IntlMessages id='common.equityCapital' />:
                          </div>
                        </div>
                        <div className='labels-chart-right'>
                          <span id='prePaymentAmount'>
                            {currencyFormat(prePaymentAmount)}{' '}
                            {messages['common.vnd']}
                          </span>
                        </div>
                      </li>
                      <li>
                        <div className='labels-chart-left d-flex align-center'>
                          <div className='cir-color cir-color-2'></div>
                          <div className='re__desc'>
                            <IntlMessages id='common.principalPaid' />:
                          </div>
                        </div>
                        <div className='labels-chart-right'>
                          <span id='paymentRemaining'>
                            {currencyFormat(paymentRemaining)}{' '}
                            {messages['common.vnd']}
                          </span>
                        </div>
                      </li>
                      <li>
                        <div className='labels-chart-left d-flex align-center'>
                          <div className='cir-color cir-color-3'></div>
                          <div className='re__desc'>
                            <IntlMessages id='common.interestPaid' />:
                          </div>
                        </div>
                        <div className='labels-chart-right'>
                          <span id='principalAmount'>
                            {currencyFormat(principalAmount)}{' '}
                            {messages['common.vnd']}
                          </span>
                        </div>
                      </li>
                    </ul>
                    <div className='labels-chart-bottom'>
                      <div className='labels-chart-total d-flex align-center justify-between'>
                        <span className='re__desc'>
                          <IntlMessages id='common.firstMonthPayment' />
                        </span>
                        <span id='firstMonthPayment'>
                          {dataLoan[1]?.sotienphaitra} {messages['common.vnd']}
                        </span>
                      </div>
                      <div className='labels-chart-alert'>
                        <p>
                          <IntlMessages id='common.notiPayment' />
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <Modal
                className='modal-loan'
                title={
                  yearFlag
                    ? messages['common.yearlyPaymentDetails']
                    : messages['common.monthlyPaymentDetails']
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                centered
                footer={false}
              >
                <Table
                  className='table-loan'
                  columns={columnsTable}
                  dataSource={yearFlag ? dataLoanYear : dataLoan}
                  pagination={{pageSize: 13}}
                />
                <Button
                  type='default'
                  onClick={exportData}
                  className='btn-download-excel'
                >
                  <IntlMessages id='common.financialPlanDetails' />
                </Button>
              </Modal>
            </>
          }
        />
      )}
    </div>
  );
};

export default Loan;
Loan.propTypes = {
  dataPost: PropTypes.any,
  loading: PropTypes.any,
};
