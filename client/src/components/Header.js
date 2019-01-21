import React from 'react';
import * as logo from './../images/rzp-logo.svg';

function Header() {
  return (
    <header className="center">
      <img src={'/images/../images/rzp-logo.svg'} alt="razorpay" className="rzp-logo"/>
      IFSC Checker
    </header>
  );  
}

export default Header;