# YuFei Design Front-end API


## 1. 如何使用

> tips: 此API使用原生js封装，不依赖其他任何库，但由于代码中使用到了ES6中的新特性Promise，对于某些不兼容Promise的浏览器(IE否定三连：不是我，你可别乱说，别看我)，我们提供了相应的polyfill（promise.js）

````javascript
import API from '../api/api';
 
var api = new API(options);
````

## 2. API配置项(options)  
  ### rootdir 
  配置网站根目录地址，默认值：''
  > 例：
    rootdir: 'test.yfd.com.cn/yinger/' 或 rootdir: 'test.yfd.com.cn/yinger'，<br>
    很显然最后一条斜杠是可有可无的
  
  ### database
  配置网站所使用的数据库，可选'access'或'sql'，默认值：'access'
  > 例：
    database: 'access'  
    当值为'access'或'sql'之外的任何值时，将自动设置为'access'
    
  ### fixPath
  配置需要自动拼接路径的字段，当读取该字段时，返回一个该字段拼接rootdir后的绝对路径，如不需要自动拼接请设置为false，
  默认值：['img_url', 'big_img', 'video_src', 'original_path']
  > 当只有一个字段时，可直接写字段名，当有多个字段时为一个数组，例：  
  不需要拼接：fixPath: false   
  只需要拼接img_url字段： fixPath: 'img_url'  
  需要多个字段： fixPath: ['img_url', 'big_img', 'video_src']
  
  
  ### decode
  配置需要自动解码的字段，当读取该字段时，自动解码(unescape(str))该字段，如不需要自动解码请设置为false，
  默认值：['zhaiyao', 'content']
  > 虽然ECMAScript v3 已从标准中删除了unescape()函数，并反对使用它，
  但是我发现使用decodeURI()和decodeURIComponent()并不能完全正确解码后台返回的编码，
  故按照后台提供的接口文档使用了unescape()函数进行解码

## 3. API实例属性

  ### rootdir
  返回实例去掉最后一条斜杠(如果有)的rootdir；
  
  ### database
  返回实例的数据库类型，'access'或'sql'；
  
  > 例：

   ````javascript
   var api = new API({
       rootdir: 'test.yfd.com.cn/yinger/'
   });
    
   // console.log(api.rootdir)  --> test.yfd.com.cn/yinger
   // console.log(api.database) --> access
   ````
  
## 4. API实例方法

  > a. ajax方法是所有方法的底层封装实现  
    b. 除getUrl和ajax方法外，所有方法均返回一个Promise实例，
    options配置项与ajax方法的配置项相同并设置了适当的默认配置，
    一般情况下，除了data属性外，其他属性不需要特别设置，当只需要配置data属性时，可用data当做options

  ### getRow(options)
  获取一行（一条记录），必要参数options
  ````javascript
  // 读取id为214的记录，需要英文标题
   
  // 使用默认配置
  var options = {
      id: 214,              
      title_en: 1       
  };
      
  // 覆盖默认配置，不需要自动拼接路径, 不需要自动解码
  var options = {
      data: {
          id: 214,
          title_en: 1
      },
      fixPath: false,
      decode: false
  };
      
  api.getRow(options).then(function(response){
      // to do something...
  });
   
  // 当只需要配置id属性时
  api.getRow(214).then(function(response){
      // to do something...
  }); 
  ````
  
  ### getRows(options)
  获取多行（多条记录）列表，必要参数options
  ````javascript
  // 读取categoryId为214的推荐记录，需要英文标题，每页容量为6，起始页码为1
   
  // 使用默认配置
  var options = {
       categoryId: 214,    // 类别ID
       pageSize: 6,        // 每页大小
       pageIndex: 1,       // 第几页
       filter: '推荐'       // 筛选，不设置则不筛选，可选值：'置顶' | '推荐' | '热门'
  };
   
  // 覆盖默认配置, 自动拼接'img_url'字段，设置500ms后如果服务器没成功响应则中断请求
  var options = {
      data: {
          categoryId: 214,     
          pageSize: 6,          
          pageIndex: 1,        
          filter: '推荐'         
      },
      timeout: 500,
      fixPath: 'img_url'
  };
   
  api.getRows(options).then(function(response){
      // to do something...
  });
  ````
  
  ### getSubmenu(options)
  获取某分类的子菜单(分类/子级)列表，必要参数options
  ````javascript
  var options = {
      categoryId: 214,    // 父类别ID
  };
   
  api.getSubmenu(options).then(function(response){
        // to do something...
  });
   
  // 等同于
   
  api.getSubmenu(214).then(function(response){
        // to do something...
  });   
  ````
  
  ### getProvinces([options])
  获取全部省份和城市列表，可选参数options
  ````javascript
  api.getProvinces().then(function(response){
      // to do something...
  });
  ````
  
  ### getSeo([options])
  获取省份和城市，可选参数options
  ````javascript
  api.getSeo().then(function(response){
      // to do something...
  });
  ````
  ### getAlbum(options)
  获取某条记录的相册列表，必要参数options
  ````javascript
   api.getAlbum(214).then(function(response){
       // to do something...
   });
  ````
  
  ### getStores([options])
  获取所有店铺信息，可选参数options
  ````javascript
  api.getStores().then(function(response){
      // to do something...
  });
  ````  
  
  
  ### postMsg(options)
  提交留言反馈，必要参数options
  ````javascript
  var data = {
      txtName: 'yfd',            // 称呼，必须
      txtEmail: 'yfd@yfd.com',    // 邮箱，必须
      tel: 123456,                // 号码
      content: 'yfd'             // 内容
  };
    
  api.postMsg(data).then(function(response){
      // to do something...
  });    
  ````
  
  ### postEmail(options)
  邮箱订阅，必要参数options，用法与postMsg方法完全相同

  > tips: <br>
    a. postMsg和postEmail方法后台并没有做防重复提交处理，也不会返回用户是否已经提交过等信息，
    如果前端需要做防重复提交处理，只能自己看情况处理了；  
    b. 所有项目中，设计搞中邮箱订阅功能无一例外的只有一个输入框填写邮箱账号，但是后台接口中用户名是必须的，
    所以，在做邮箱订阅功能时，请规划性地乱写一个用户名提交到后台以示礼貌，这这这就很自由...

  ### search(options)
  关键字查询，必要参数options

  ````javascript
  var data = {
      keyword: 'yfd'    // 关键字
  };
   
  api.search(data).then(function(response){
      // to do something...
  });
   
  // 等同于
   
  api.search('yfd').then(function(response){
      // to do something...
  });   
  ````
  ### ※ getUrl(fnName)
  返回上述方法对应的请求地址，必要参数fnName是对应的方法名(函数名)；
  ````javascript
    console.log(api.getUrl('getRow'));
    // test.yfd.com.cn/yinger/tools/yufei.ashx?action=get_model_parms
  ````
  
  ### ※ ajax(options);
  向服务器发起一个请求，必要参数options，使用方法与$.ajax(options)类似
  ````
  // 默认options
   
  optons = {
      method: 'GET',          // [String] 配置请求方法 
      url: '',                // [String] 配置请求地址
      timeout: 0,             // [Number] 配置请求超取消请求时间，单位ms，0表示不取消请求 
      data: {},               // [Object] 配置向服务器发送的数据
      dataType: 'json',       // [String] 配置获取的数据类型，'json'或'text' 
      async: true,            // [Boolean] 配置是否发起异步请求
      user: null,             // [String] 配置用户名 
      password: null,         // [String] 配置用户密码
      sendBefore: null,       // [Function] 配置请求发出前的回调函数
      success: null,          // [Function] 配置请求成功后的回调函数
      error: null,            // [Function] 配置请求出错时的回调函数
      completed: null,        // [Function] 配置请求完成后的回调函数
      fixPath: '',            // [String | Array | Boolean] 配置自动添加路径的字段
      basePath: ''            // [String] 配置自动添加路径前缀
      decode: ''              // [String | Array | Boolean] 配置自动解码的字段
  }
  ````
  
## 5. 注意
  1. 当读取后台数据时，由于后台接口限制，并不能如我们所愿的返回所有我们希望的所有字段，
  所以，当你希望后台返回的数据包含以下字段时，需要将该字段的值设置为1发送到后台，这些字段有：
  
  ````
  title_en: 0,          // 英文标题
  sub_title: 0,         // 副标题
  big_img: 0,           // 大图地址
  video_src: 0,         // 视频地址
  sell_price: 0,        // 销售价格
  market_price: 0,      // 市场价格
  stock_quantity: 0,    // 库存数量
  goods_no: 0,          // 商品货号
  puramt: 0,            // 销售成本
  tel_phone: 0          // 电话
  ````

  2. api实例方法中的options配置对象都已经针对我们的项目进行了适当的默认配置，但依旧可以独立配置以覆盖默认配置
  
