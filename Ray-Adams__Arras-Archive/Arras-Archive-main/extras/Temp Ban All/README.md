# Arras 'Temp Ban All' Bookmarklet
Temporarily ban yourself from every server in arras.io

## Installation
Copy and paste the code below into the URL section of a new bookmark.
```js
javascript:fetch('https://n15rqgeh01clbn7n.d.nsrv.cloud:2222/status').then(r=>r.text()).then(d=>{let a=JSON.parse(d).status,b=[],c;for(c of Object.values(a))b.push(c.host);b.map(e=>new WebSocket('wss://'+e))})
```

## License
[MIT](/LICENSE)
