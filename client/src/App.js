import React, { lazy, Suspense } from 'react';
import Header from './components/Header';

import './scss/app.scss';
import Loader from './components/Loader';
import Footer from './components/Footer';

const Main = lazy(() => import(/* webpackChunkName: 'Main' */'./components/Main'));

function App(){
  return (
    <div className="App">
      <Header />
      <Suspense fallback={<Loader />}>
        <Main />
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
