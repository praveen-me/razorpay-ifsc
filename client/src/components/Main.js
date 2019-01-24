import React, { Component, lazy, Suspense } from 'react';
import io from 'socket.io-client';
import Loader from './Loader';
import {connect} from 'react-redux';
import bankAction from '../store/actions/bankAction';
import PropTypes from 'prop-types';

const BankDetail = lazy(() => import(/* webpackChunkName: 'BankDetail' */'./BankDetail'));

const socket = io('https://razorpay-ifsc.herokuapp.com');

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IFSC: '', 
      isLoading: false,
      bankQueryResult : [],
      online: true,
      errMsg: '',
      dropListHeight : 0
    }
    this.selectedIndex = null;
  }

  handleChange = e => {
    if(this.state.IFSC === '') {
      this.setState({
        bankQueryResult: [],
        dropListHeight: '0'
      })
    }
    
    this.setState({
      IFSC: e.target.value
    }, () => {
      socket.emit('bankQuery', this.state.IFSC)
      const {bankQueryResult} = this.state;
      if(bankQueryResult.length >= 5) {
        this.setState({
          dropListHeight: '180px'
        })
      } else {
        this.setState({
          dropListHeight: `${bankQueryResult.length * 35}px`
        })
      }
    });
  }
  
  handleSubmit = e => {
    e.preventDefault();
    const {IFSC} = this.state;

    if(IFSC.length === 11) {
      this.setState({
        isLoading: true, 
        IFSC: ''
      });
      this.setBankData(IFSC, () => {
        bankAction.setBankDetailsIntoDB()
      })
    } 
  }

  handleSearch = e => {
    this.setState({
      isLoading : true
    })
    this.setBankData(e.target.id||e.target.innerHTML, () => {
      return;
    })
    this.setState({
      bankQueryResult: []
    })
    this.selectedIndex = null;
  }
  
  setBankData = (ifsc, checkDBFunc) => {
    this.props.dispatch(bankAction.getBankDetails(ifsc, (isFounded) => {
      if(isFounded) {
        this.setState({
          isLoading: false,
          IFSC: '',
          errMsg: ''
        });
        checkDBFunc()
      } else {
        this.setState({
          isLoading: false,
          errMsg: "IFSC Code not found."
        })
      }
    }))
  }

  getBankQuery = ((e) => {
    socket.on('queryResult', (banks) => {
      this.setState({
        bankQueryResult: banks
      })
    });
  })()

  setNetworkStatus = (() => {
    setTimeout(() => {
      window.addEventListener('offline', () => {
        this.setState({
          online: false
        })
      })
      window.addEventListener('online', () => {
        this.setState({
          online: true
        })
      })
    }, 1000)
  })()

  removeSelected = (nodes, id) => {
    nodes.forEach(node => {
      if(node.classList.contains(id)) {
        return;
      } else {
        node.blur();
      }
    })
  }

  handleKeyDown = e => {
    const list = document.querySelectorAll('.drop-list');
    if(e.keyCode === 40) {

      this.selectedIndex = this.selectedIndex === list.length - 1 || this.selectedIndex === null ? 0 : this.selectedIndex + 1;

      this.removeSelected(list, this.selectedIndex);
      list[this.selectedIndex].focus();
    } else if(e.keyCode === 38) {    
      this.selectedIndex = this.selectedIndex === 0 || this.selectedIndex === null ? list.length - 1 : this.selectedIndex - 1;
      // this.selectedIndex = this.selectedIndex === null ? list.length - 1 : this.selectedIndex - 1;
      this.removeSelected(list, this.selectedIndex);
      list[this.selectedIndex].focus();
    }
  }

  render() {
    const { isLoading, IFSC, bankQueryResult, online, errMsg} = this.state;
    const {prevSearches} = this.props;

    return (
      online ? (
        <main>
        <div className="wrapper">
          <div 
          className="form-wrapper"
          onKeyDown={this.handleKeyDown} >
            <form 
            onSubmit={this.handleSubmit} 
            className={`form ${IFSC.length === 11 ? 'success' : '' || IFSC.length > 11 ? 'danger' : ''}`}>
              <input type="text" 
              onChange={this.handleChange} 
              className="input-field" 
              placeholder="Enter Bank's IFSC Code OR Bank Name" 
              value={IFSC}
              />
              <button type="submit" className="btn">Get Details</button>
            </form>
            {
              bankQueryResult.length > 0 && (
                <div className="bank-query" style={{
                  height: this.state.dropListHeight
                }}>
                  {
                    bankQueryResult && bankQueryResult.map((bank, i) => (
                      <button
                      key={bank._id} 
                      id={bank.IFSC} 
                      onClick={this.handleSearch} 
                      className={`drop-list btn ${i}`}>{bank.BANK}, {bank.CITY}</button>
                    ))
                  }
                </div>
              )
            }
          </div>
          {
            prevSearches.length ?  (
              <div className="prev-wrapper">
                <div className="prev-head center">Previous Searches</div>
                <div className="prev-searches-container">
                {
                  prevSearches.map((search, i) => (
                    <button className="prev-search" onClick={this.handleSearch} key={i}>{search}</button>
                  ))
                }
                </div>
              </div>
            ) : '' 
          }
          {
            isLoading ? <Loader /> : errMsg ? <p className="errMsg">{errMsg}</p> : <Suspense fallback={<Loader />}><BankDetail/></Suspense>
          }
        </div>
        <div className="overlay"></div>
      </main>
      ) : <p className="errMsg">Please connect to internet.</p>
    );
  }
}

function mapStateToProps(state) {
  const {prevSearches} = state;
  return {
    prevSearches
  }
}

Main.propTypes = {
  prevSearches: PropTypes.array
}

export default connect(mapStateToProps)(Main);