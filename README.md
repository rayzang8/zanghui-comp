
## 用create react app 加 typescript 模板创建一个自己的组件库

### 坑1. package.json 中需要补充的设置项有
main 告诉被依赖项目本库的入口文件

若是ts 项目，则types也不能少，它告诉被依赖项本库的d.ts，否则被依赖项目会报缺少类型定义文件，要求安装@types/等 

files 最好也写上，npm在发布时会只发布指定的目录，否则会把src等所有东西全发到npm仓库去



### 坑2. npm 发布失败，原因主要有以下几种
先到npm login 登录一下, 需要输入用户名，密码，邮箱
此时若有错误可能是 npm 源不对， 比如原先切到了淘宝的源https://registry.npm.taobao.org/  这时就得改回来，处理方法 npm config set registry https://registry.npmjs.org/ 

线上已经存在同名的包了，这种只需要修改项目名就ok了

邮箱没认证，这种需要打开https://registry.npmjs.org/  网站，登录后，打开到 Account, change email, 然后新的邮箱就能收到认证邮件了，点击邮件中的认证链接即可



### 坑3.  用tsc 生成d.ts文件
全局安装typescript , 用 npm install typescript -g （注意：不要装成node-typescript）网络不通的话需要切换源 npm config set registry https://registry.npm.taobao.org/ 

装好后为确保以后正常npm publish ,最好再切回默认源 https://registry.npmjs.org/ 

tsconfig.json 文件配置
 declaration  打出d.ts 文件
 outDir          输出目录
 noEmit       不输出（由其它，如babel 等处理后输出）

实际开发中还没有用到tsc命令行生成, 是自己写的d.ts 文件补充到打出的包中去




### 坑4. 发布为库  自建的组件库由 create react app 的typescript模块eject 而来, 默认打包是按照打出一个 APP的常规方式, 改成库需要以下改动
output 中的 filename 输出名中不需要插入类似[contenthash:8]的字符

output 中的chunkFilename 也不需要（暂时不考虑分块）

output 还需要增加 library （库名，和package.json的name一致）和 ibraryTarget（模块类型，一般umd够用），缺少它们时，使用App会无法引入库中的组件

import_test分支中src/build_bak 目录下存放的就是libraryTarget取不同值后打出的bundle, App.tsx用以测试不同模块系统打出的包如何被引入



### 坑5. 输出的组件中若带有antd组件, 则页面报Error: Minified React error  此错误是由多份react-dom 实例冲突造成的， 
解决办法是首先将react,react-dom, 移入peerDependencies和devDependencies使用安装时react,react-dom 不会装多份（可以用 npm ls react 查看依赖树, npm ls查看整棵依赖树）

然后再用webpack配置中的 external 选项，去掉打出包中包含的react,react-dom,配置方法：

```javascrit
externals: {
    react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
    },
    'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
    }
  },
```




## 剩除问题

### 1. 把自建库的所有依赖项从dependencies 中移到 devDependencies， 然后打出全量包（类似jqueyr.min.js或antd的dist目录下的antd.js），
让使用的App无须再装依赖库的依赖是否可行?

现已经证明可行！

### 2.关于坑3 中生成d.ts 文件， 若是输入包生成一个文件（比如jQuery 那样的那所有代码打出一个包jqueyr.min.js, 或者是antd的dist目录下的antd.js）
那么d.ts 文件要如何生成,类似的打出像antd里的 lib, es 目录下.js 和 d.ts在一起文件结构，要如何做。

还是用tsc, tsconfig.json中 "noEmit"设置为false,再设置一个"outDir"项，让ts翻译的结果生成到另一目录，package.json中的"types"可以指定d.ts文件的入口文件


### 3. 用webpack 如何编出ES Module的包
目前只能依靠一个插件 esm-webpack-plugin， 地址：https://github.com/purtuga/esm-webpack-plugin

但是作者也不能保证用它打出的esm的包能否被别的App引入后，再用webpack来做 treeshake

### 4. 本项目的import_test branch 实验了引入不同模块系统打出的库

