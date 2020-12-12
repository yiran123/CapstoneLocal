import React, { useState } from 'react';
import ReactSwipe from 'react-swipe';
import styled from 'styled-components'
import { Breadcrumbs, Link, Button } from '@material-ui/core';
import treebg from '../../static/icons/treebg.svg';
import clouds from '../../static/icons/clouds.svg';

import './Swiper.css'

const BreadcrumbLink = styled(Link)`
  &.MuiLink-root{
  color: #000;
  }
`;

const ReadMoreButton = styled(Button)`
  color: white;
  
  &.MuiButton-containedPrimary{
    height: 40px;
  min-width: 128px;
  box-sizing: border-box;
  margin-left: 30px;
    background-color: #1589EE;
    &:hover{
      background-color: #1589EE;
      }
  }
`;

function Swiper () {
  const [curSlide, setCurSlide] = useState(0)
  let reactSwipeEl;


  return (
    <div className="Swiper">
      {/* continuous auto: 3000, */}
      <ReactSwipe
        className="carousel"
        swipeOptions={{ continuous: true }}
        ref={el => (reactSwipeEl = el)}
      >
        <div className="Swiper-item page-one">
    
          <img className="page-one-bg" src={treebg} alt="treebg" />
          <div className="page-one-content">
            <p className="page-one-title">Welcome to the Investor Portal</p>
            <p className="page-one-desc">Each enterprise outlines specific project priorities funded by green bonds. Learn more here about project objectives by enterprise and spending details.</p>
          </div>
        </div>
        <div className="Swiper-item page-two">
      
          <img className="page-two-bg" src={clouds} alt="clouds" />
          <div className="page-two-content">
            <p className="page-two-title">Climate-based Impact Reporting
            </p>
            <p className="page-two-desc">Based on the ICMA Harmonized Framework, our tool attempts to standardize green bond issuer disclosure methods across utility enterprises. </p>
          </div>
        </div>
      </ReactSwipe>
      <div className="swipe-btns">
        <i className={`point ${curSlide === 0 && 'active'}`} onClick={() => { reactSwipeEl.slide(0); setCurSlide(0) }} />
        <i className={`point ${curSlide === 1 && 'active'}`} onClick={() => { reactSwipeEl.slide(1); setCurSlide(1) }} />
      </div>

    </div >
  );
}

export default Swiper;