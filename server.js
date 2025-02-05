var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.query.targetUrl
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        if(targetURL.indexOf('.visitalexandrina.') > -1){
          console.log('The request is from events api...')
          targetURL = "https://www.visitalexandrina.com/events?format=feed&type=rss"
        }
        
        if(targetURL.indexOf('api.willyweather.com.au') > -1){
            console.log('The request is from willyweather api...')
            targetURL = targetURL + "?forecasts=weather&days=1"
            console.log(targetURL)
        }
        
        
        request({ url: targetURL, method: req.method, json: req.body},
            function (error, response, body) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
                //console.log(body);
            }).pipe(res);
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
