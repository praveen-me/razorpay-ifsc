import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer>
        <p className="footer-text">
        I built this app using Razorpay's IFSC API for an interview with them. It's NOT built by folks at Razorpay. So if there are any glitches, responsibility is entirely mine and not theirs.
        </p>
      </footer>
    );
  }
}

export default Footer;