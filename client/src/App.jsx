import React, { useState } from 'react';
import {Navbar, Welcome, Footer, Services, Transaction} from './components';

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <React.Fragment>
    <div className="min-h-screen">
      <div className='gradient-bg-welcome'>
        <Navbar/>
        <Welcome/>
      </div>
      <Services/>
      <Transaction/>
      <Footer/>
    </div>
    </React.Fragment>
  )
}

export default App
