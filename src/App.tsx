import React from 'react';
import Button from './components/button';
import './build_bak/main.window';
import * as varModule from './build_bak/main.var';
import * as umdModule from './build_bak/main.umd';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>{(window as any).zanghui}</p>
        <p>{(varModule as any).zanghui || 'undefined'}</p>
        <p>{(umdModule as any).zanghui || 'undefined'}</p>
      </header>
      <Button>antd Button</Button>
    </div>
  );
}

export default App;
