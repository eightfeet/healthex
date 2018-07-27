# Request.js

基于wx.request封装的请求组件。

## Usages

```javascript
import request from './utils/request';

// GET /api/user?id=1
request
  .get('/api/user', {
    headers: { // 自定义请求头
      Cookies: 'JSESSIONID=session_id'
    },
    params: { // 查询参数
      id: 1,
    },
  })
  .then(rs => {
    console.log(rs);
  })
  .catch(err => {
    console.log(err);
  });

// POST /api/user?id=1
// body: {username:"admin",password:"123456"}
request
  .post('/api/user',
    { // POST数据对象
      username: 'admin',
      password: '123456',
    },
    {
      type: 'json', // 提交类型
      headers: { // 自定义请求头
        Cookies: 'JSESSIONID=session_id'
      },
      params: { // 查询参数
        id: 1,
      },
  })
  .then(rs => {
    console.log(rs);
  })
  .catch(err => {
    console.log(err);
  });
```

## APIs

`request.get(url: string, [options: Options]): Promise<any>`

`request.delete(url: string, [options: Options]): Promise<any>`

`request.post(url: string, [payload: any], [options: Options]): Promise<any>`

`request.put(url: string, [payload: any], [options: Options]): Promise<any>`

`Options`:
  - baseUrl: 'http://www.exmaple.com/api/'
  - type: 'form' || 'json'
  - headers: {}
  - params: {}
  - timeout: number,

## Middleware

```javascript
request.use(async (ctx, next) => {
  // Change ctx before request
  // ...
  const result = await next();
  // Do something after request
  // ...
  return result;
})
```
