import React, {useEffect} from 'react';
import {Fancybox as NativeFancybox} from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import {useRef} from 'react';

function Fancybox(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // eslint-disable-next-line react/prop-types
    const delegate = props.delegate || '[data-fancybox]';
    // eslint-disable-next-line react/prop-types
    const options = props.options || {};

    NativeFancybox.bind(container, delegate, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });

  // eslint-disable-next-line react/prop-types
  return <div ref={containerRef}>{props.children}</div>;
}

export default Fancybox;
