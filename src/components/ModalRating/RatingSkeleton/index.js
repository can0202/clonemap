import React from 'react';

const RatingSkeleton = () => {
  return (
    <>
      {[...Array(4)].map((x, i) => (
        <div key={i} className='item'>
          <div className='item-info d-flex align-center justify-between'>
            <div className='item-info-left d-flex align-center'>
              <div className='img skeleton'>
                <div style={{height: '100%', width: '100%'}}></div>
              </div>
              <div
                className='author-info'
                style={{height: '100%', width: '300px'}}
              >
                <p
                  className='d-flex align-center skeleton'
                  style={{height: '12px', width: '100%'}}
                ></p>
                <p
                  className='d-flex align-center skeleton'
                  style={{height: '12px', width: '100%', marginTop: '6px'}}
                ></p>
              </div>
            </div>
            <div className='item-info-right skeleton' style={{width: '10%'}}>
              <p style={{height: '15px', width: '100%'}}></p>
            </div>
          </div>
          <div className='item-content'>
            <h3
              className='skeleton'
              style={{width: '100%', height: '12px'}}
            ></h3>
            <p className='skeleton' style={{width: '100%', height: '12px'}}></p>
          </div>
        </div>
      ))}
    </>
  );
};

export default RatingSkeleton;
