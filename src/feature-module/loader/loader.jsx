import React, { useEffect, useState } from 'react';
import { Route,Routes, useLocation } from 'react-router-dom';

const Loader = (p) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const showLoader = () => {
    setLoading(true);
  };
  const hideLoader = () => {
    setLoading(false);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    showLoader();
    const timeoutId = setTimeout(() => {
      hideLoader();
    }, 1000);

    return () => {
      p.setLoading(false);
      clearTimeout(timeoutId);
    };
  }, []);
  return (
    <div>
      <div id="global-loader">
        <div className="whirly-loader"></div>
      </div>
    {loading && (
      <Routes>
        <Route path="/"/>
      </Routes>
    )}
  </div>
  );
};

export default Loader;
