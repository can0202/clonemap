import React, {useEffect} from 'react';
const AdsBanner = (props) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <>
      <ins
        className='adsbygoogle adbanner-customize'
        data-ad-client='ca-pub-7694863597455832'
        {...props}
      ></ins>
    </>
  );
};

export default AdsBanner;
