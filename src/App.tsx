import React, { useEffect, useState } from 'react';
import Button from './components/button';
import Card from './components/card';
import './build_bak/main.window';                         // 挂载到window上的模块
import * as varModule from './build_bak/main.var';        // 挂载默认导出的模块(var 没有暴露出任何模块，相当于自执行函数)
import * as umdModule from './build_bak/main.umd';        // 挂载umd模块
const cmjModule = require('./build_bak/main.commonjs2');  // 挂载commonjs模块
const promiseAmdModule = import('./build_bak/main.amd');  // 异步加载amd模块, 可能需要依赖systtemjs，@types/systemjs 库

function App() {
  const [amdModule, setAmdModule] = useState<any|undefined>(undefined);
  useEffect(() => {
    console.dir(varModule);
    console.dir(umdModule);
    console.dir(cmjModule);
    promiseAmdModule.then((module: any) => {
      setAmdModule(module);
      console.dir(module);
    });
  }, []);
 

  return (
    <div className="App">
      <header className="App-header">
        <p>1.{(window as any).zanghui}</p>
        <p>2.{(varModule as any).zanghui ||  'undefined'}</p>
        <p>3.{(umdModule as any).zanghui }</p>
        <p>4.{(cmjModule as any).zanghui }</p>
        <p>5.{amdModule?.zanghui || 'undefined'}</p>
      </header>
      <Button>antd Button</Button>
      <Card />
    </div>
  );
}

export default App;
