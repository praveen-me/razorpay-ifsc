import React, { lazy, Suspense } from 'react';
import Header from './components/Header';

import './scss/app.scss';
import Loader from './components/Loader';

const Main = lazy(() => import(/* webpackChunkName: 'Main' */'./components/Main'));

function App(){
  return (
    <div className="App">
      <Header />
      <Suspense fallback={<Loader />}>
        <Main />
      </Suspense>
    </div>
  );
}

export default App;
