const https = require('https');
const zlib = require('zlib');
const stream = require('stream');

async function httpsGet(url) {
  // Copy the cookie value from the browser
  const cookie = 'device-characterization=false,false; _fbp=fb.1.1708763868241.1327063259; _ga=GA1.1.588429748.1708763866; _ga_Z1SEPKTH2P=GS1.1.1710191230.14.0.1710191233.57.0.0; _uetsid=e11deb20dfd711eeb801d36b70222b36; _uetvid=fcded250d2ef11eeb91f8d2b25ee6544; bm_sv=ECA7F5884405E1284DEA5C98C1B7A9C5~YAAQzhdlX2Yy8yuOAQAAPUpXLxcrdcz5cLQ3SREcCgl8LvzveB0chEOTHROgPXnmq2GsxyAfFMxjEZanX+quP+ipeA3e8uxZ4WVrLx2oaOAykGUjtDpXWCCo+Yzz0nvbxq46twOOVwSo5aFYkGQDUFrz/p2uFBmB3QVEizmAtQ+JqypBLy9qS+Vi5KtdlzNp49LvAwxbQ7QtquoY0kRHORMV39437sKJ9Rgfo8Bvx0GiQf+++WsHFvqQYBtd9q5Svg==~1; edmunds=03f53c9b-be95-48af-9cc5-491c2667441e; edw=397568215256759230; entry_page=home_page; entry_url=www.edmunds.com%2F; entry_url_params=%7B%7D; session-id=397568215256759230; usprivacy=1YNN; visitor-id=03f53c9b-be95-48af-9cc5-491c2667441e; feature-flags=j%3A%7B%7D; lux_uid=171019123059368680; cto_bundle=-nw9Ql95ZVo4OTVoWTMyVjBrSHR6TWpBdnkzNjJhOEd5TlJsVnlJbkRuRzdsZGZzRzhSeDBRaVdxSkhGQTVwaFUlMkJpUWJjMzdLTDF5bDRiMjJDbXlseFBJeEclMkIzRTk2U2VrS2tVY2hmbmc4a3d2JTJCOGQ3S01tNWVaN2s4YmNyaDRtYnBzbw; edm-ias-data=%7B%22fr%22%3A%22false%22%7D; EdmundsYear="&zip=58067&dma=724:IP&city=Rutland&state=ND&userSet=false&lat=46.054802&lon=-97.502278"; ak_bmsc=B3A11B5E54327641B3B394C909B6F769~000000000000000000000000000000~YAAQzhdlXy0y8yuOAQAAQj1XLxce4abGkQE45v7I8vBTgCqd2dlMLjevXoN0Jlj09hQzgcearaqbgA++WagA1srDK9mX/k5+88AMBfk5z2whvJm8XotWcth2UlIhoi6ueiZiYWxq7Ahd2Dww+crPBKEX8Uo1VCo07RsBjjnOuJ/UVW9/EdnLaoB11JAaEds6dM3l2gBoM+GbPmKLLU9D2YO6QbH3cdWVLI0hkF+nB4IpH2dQC4a8cL4/1DPimrVguj10aP2haKU5gLwbAWIBf7Qf9ox1k8x09UyIQvbaPlSZp9QB0vVJSgGPus4wp5t7I/xTNsaihYMkXA91ZFjFQ5aZTU11gy6dHvFjtl7UrYnYzY+1wqg6KN0U5JSpRM6HjBdsVV6p+oYVow==; location=j%3A%7B%22zipCode%22%3A%2258067%22%2C%22type%22%3A%22Standard%22%2C%22areaCode%22%3A%22701%22%2C%22timeZone%22%3A%22Central%22%2C%22gmtOffset%22%3A-6%2C%22dst%22%3A%221%22%2C%22latitude%22%3A46.054802%2C%22longitude%22%3A-97.502278%2C%22salesTax%22%3A0.05%2C%22dma%22%3A%22724%22%2C%22dmaRank%22%3A114%2C%22stateCode%22%3A%22ND%22%2C%22city%22%3A%22Rutland%22%2C%22county%22%3A%22Sargent%22%2C%22inPilotDMA%22%3Atrue%2C%22state%22%3A%22North%20Dakota%22%2C%22ipDma%22%3A%22724%22%2C%22ipStateCode%22%3A%22ND%22%2C%22ipZipCode%22%3A%2258067%22%2C%22userIP%22%3A%22149.62.208.42%22%2C%22userSet%22%3Afalse%7D; content-targeting=BG,,SOFIA,,23.32,42.68,; __eoi=ID=4b65e23dfdbd0040:T=1708763880:RT=1709650188:S=AA-AfjZ_1yIc8wO9rusmKAjabLyV; __gads=ID=9e0422b3b2101aed:T=1708763880:RT=1709650188:S=ALNI_MaYp-VCn_TQSwRUfNxpypOJNv_mCQ; __gpi=UID=00000d5fd65c243f:T=1708763880:RT=1709650188:S=ALNI_Mb3XQ0OA8IGAVegCynJ-KadJSaabA; _lc2_fpi=af8735f07514--01hqdcyfpr1pp47eqnd0s6jgyw; _pbjs_userid_consent_data=3524755945110770; _lr_env_src_ats=false; _td=212201e6-6832-41dc-b9e2-7136e8b1e0c4; g_state={"i_p":1709037448197,"i_l":2}; __utma=201338437.588429748.1708763866.1708773170.1708773170.1; __utmv=201338437.|1=visitorId=03f53c9b-be95-48af-9cc5-491c2667441e=1; __utmz=201338437.1708773170.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _pubcid=6837ddcf-f29f-496a-9023-671afefc45a1; pbjs-unifiedid=%7B%22TDID_LOOKUP%22%3A%22FALSE%22%2C%22TDID_CREATED_AT%22%3A%222024-02-24T11%3A10%3A34%22%7D; _tt_enable_cookie=1; _ttp=Y21suLB1EPITIuJukbcoqIbNDjy';

  const headers = {
    'Referer': 'https://www.edmunds.com/car-reviews/',
    'Cookie': cookie,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Site': 'same-origin',
    'Connection': 'keep-alive',
    'Accept-Language': 'en-GB,en;q=0.9',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Sec-Fetch-Mode': 'cors',
    'x-artifact-version': '2.0.5620',
    'x-artifact-id': 'venom',
    'x-trace-id': 'Root=1-65dc8671-630ff2dd05d30ec27e1276ed',
    'x-client-action-name': 'model_core_consumer_reviews.consumerReviews',
    'x-edw-page-name': 'model_core_consumer_reviews',
    'x-trace-seq': '2',
    'newrelic': 'eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjMwODYwNjUiLCJhcCI6IjQ1NTk0OTUyNSIsImlkIjoiNGQyZjI4ZmFhZmJhNmM5NCIsInRyIjoiMGI0NTdhOTVmNjRlOWM2NGFhNTBkZDhhYmQzNDU1YTAiLCJ0aSI6MTcwODk1MTE4OTA5M319',
    'x-edw-page-cat': 'model_core',
    'tracestate': '3086065@nr=0-1-3086065-455949525-4d2f28faafba6c94----1708951189093',
    'x-referer': 'https://www.edmunds.com/car-reviews/',
    'traceparent': '00-0b457a95f64e9c64aa50dd8abd3455a0-4d2f28faafba6c94-01'
  };

  const options = {
    headers: headers
  };

  return new Promise((resolve, reject) => {
    https.get(url, options, (response) => {
      let chunks = [];
      let decompressor;

      const encoding = response.headers['content-encoding'];

      if (encoding === 'gzip') {
        decompressor = zlib.createGunzip();
      } else if (encoding === 'deflate') {
        decompressor = zlib.createInflate();
      } else {
        // Handle non-compressed data or unsupported encodings
        decompressor = new stream.PassThrough();
      }

      response.pipe(decompressor);

      decompressor.on('data', (chunk) => {
        chunks.push(chunk);
      });

      decompressor.on('end', () => {
        const data = Buffer.concat(chunks).toString();
        resolve(data);
      });

      decompressor.on('error', (error) => {
        reject(error);
      });

      response.on('error', (error) => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = { httpsGet }