import https from 'https';
import zlib from 'zlib';
import stream from 'stream';

export async function httpsGet(url: string): Promise<string> {
  // Copy the cookie value from the browser
  const cookie = '_fbp=fb.1.1712265559924.1359238423; _ga=GA1.1.1428108866.1712265553; _ga_Z1SEPKTH2P=GS1.1.1712303838.3.0.1712303842.56.0.0; _uetsid=fea19150f2c811ee9352e7e56f264bb7; _uetvid=fea192c0f2c811ee95e311c2fee9fb64; bm_sv=BD51FBC84D9024DB56FC7437A02D3E46~YAAQixTfrXKxFJqOAQAA4CNDrRdehirXWvXcj5YEAOO3BGUcPzk7x9kEx8BzKM6DIeBmKyS49HLeGxHFo+nbVujTyFR9Xb9eg0pNtOYaRxax98RThxRkvyXB5ZS6FZ7y/I/0XsJm/AoDteCp3Ck+4yjQGVkZoAw9CWqpz0bOQtnt98PMVonKKtUMg5Q214kTqyBhsAuQh/drfmv03qh/ptYMC6F1QxCBslvhb3dTwpdYowacVucdtp3dn58lxI9sdA==~1; edmunds=03f53c9b-be95-48af-9cc5-491c2667441e; edw=608879139190220400; entry_page=home_page; entry_url=www.edmunds.com%2F; entry_url_params=%7B%7D; session-id=608879139190220400; usprivacy=1YNN; visitor-id=03f53c9b-be95-48af-9cc5-491c2667441e; device-characterization=false,false; feature-flags=j%3A%7B%7D; lux_uid=171230383824554080; _tt_enable_cookie=1; _ttp=U9YysGcnr9au2moYDgfDWdhnUXP; cto_bundle=6j1lu19tYURNcFF0V3lZY3Z3QjVidk52VVVBUEJzSDN4JTJGbmR0Y25XNmt3Tzhjb2lGeFZyOVE0anRyTFFabjRzVWRBV0NZc1NDb1ByUm55ajdEQU1pYTBSa2x1QjVabnRpRmdvVTZsOGRBZmUxcE9XdXhzNHpzMUZoYll6ZklTR3BBJTJCcE8; EdmundsYear="&zip=58067&dma=724:IP&city=Rutland&state=ND&userSet=false&lat=46.054802&lon=-97.502278"; ak_bmsc=134650DFDB3D875EA893C561C726135B~000000000000000000000000000000~YAAQixTfrU6xFJqOAQAANRNDrRcQX3LY8O5s2Ix9Qf2H5dDLt9fSwFB2NQreeiBaC5+P+xP7F81i36UH8uEF8ZnrWLVvHUYeB1i+t7DqYNpW+3wyBs6CEC13OptWmlCRmvAhnij14UafI8Cll7mgO+3klqXQYWd42XawFdHhCZm80jhyr7Ul3UPbSvOZ2f8tkj3VeCm03Al0sDaRqJ2EEO15LjnyNkO373sViVNdMxUpsDRREkU1ru896UDchOBVsMv0e9IvZbW79M0XroOwhLs5fTQBqhOg8nQlBB4uQBPjbDlnlZstCA3DZL2kHWjNhz0Z91K/fQ61R4axq/h9wK5eYp2EB9rqn6HHA597NJ0m9bZmVIGvofI/eHd0VZUOf3Ik7gi0R5s=; location=j%3A%7B%22zipCode%22%3A%2258067%22%2C%22type%22%3A%22Standard%22%2C%22areaCode%22%3A%22701%22%2C%22timeZone%22%3A%22Central%22%2C%22gmtOffset%22%3A-6%2C%22dst%22%3A%221%22%2C%22latitude%22%3A46.054802%2C%22longitude%22%3A-97.502278%2C%22salesTax%22%3A0.05%2C%22dma%22%3A%22724%22%2C%22dmaRank%22%3A114%2C%22stateCode%22%3A%22ND%22%2C%22city%22%3A%22Rutland%22%2C%22county%22%3A%22Sargent%22%2C%22inPilotDMA%22%3Atrue%2C%22state%22%3A%22North%20Dakota%22%2C%22ipDma%22%3A%22724%22%2C%22ipStateCode%22%3A%22ND%22%2C%22ipZipCode%22%3A%2258067%22%2C%22userIP%22%3A%22149.62.208.181%22%2C%22userSet%22%3Afalse%7D; g_state={"i_p":1712272763050,"i_l":1}; edm-ias-data=%7B%22fr%22%3A%22true%22%7D; content-targeting=BG,,SOFIA,,23.32,42.68,; _mkto_trk=id:461-NMJ-598&token:_mch-edmunds.com-1712144515671-81060; _mkto_trk_http=id:461-NMJ-598&token:_mch-edmunds.com-1712144515671-81060; vf_edmunds_LN8RE=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTM5NjMwMTcsImlhdCI6MTcxMTM3MTAxNywic2lkIjoiM2I2MDk2NmFlYWE2MTFlZWI3YjdmYTE2M2U3OWE2Y2EiLCJzdWIiOjgzMTU2M30.5txNe3EMUsO1NLT9WTYB8FBRoDen3J2VMonqHdD87PA; vf_edmunds_LN8RE-vA=%7B%22pv%22%3A2%2C%22secondarySessionID%22%3A%229fdaae30-7a87-45d0-918c-f33d5ba70ea1%22%2C%22sessionID%22%3A%2216a02d7a-18c1-46cb-92ca-4c8adcc574b6%22%2C%22uuid%22%3A%22a4709f21-2ead-4ddb-a26e-56495e0d3715%22%7D';

  const headers: https.RequestOptions['headers'] = {
    'Cookie': cookie,
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-GB,en;q=0.9',
    'Connection': 'keep-alive',
    'Host': 'www.edmunds.com',
    'If-Modified-Since': 'Mon, 11 Mar 2024 17:09:57 GMT',
    'newrelic': 'eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjMwODYwNjUiLCJhcCI6IjQ1NTk0OTUyNSIsImlkIjoiOTNmMDQwMzQ3ZjkyOGNmMSIsInRyIjoiYjgyNmI3Y2E2NDliOGY0NTQ2NzNmNGJiMGRjNzc4OTQiLCJ0aSI6MTcxMDkyNDQwMTgyMX19',
    'Referer': 'https://www.edmunds.com/car-reviews/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'traceparent': '00-b826b7ca649b8f454673f4bb0dc77894-93f040347f928cf1-01',
    'tracestate': '3086065@nr=0-1-3086065-455949525-93f040347f928cf1----1710924401821',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
    'x-artifact-id': 'venom',
    'x-artifact-version': '2.0.5744',
    'x-client-action-name': 'car_reviews_index.makes.models',
    'x-deadline': '1710924402521',
    'x-edw-page-cat': 'car_reviews_index',
    'x-edw-page-name': 'car_reviews_index',
    'x-referer': 'https://www.edmunds.com/car-reviews/',
    'x-trace-id': 'Root=1-65faa26b-0721b6ac61ce306774e96242',
    'x-trace-seq': '2'
  };

  const options: https.RequestOptions = {
    headers: headers,
  };

  return new Promise((resolve, reject) => {
    https.get(url, options, (response) => {
      const chunks: Buffer[] = [];
      let decompressor: stream.Transform;

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

      decompressor.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      decompressor.on('end', () => {
        const data: string = Buffer.concat(chunks).toString();
        resolve(data);
      });

      decompressor.on('error', (error: Error) => {
        reject(error);
      });

      response.on('error', (error: Error) => {
        reject(error);
      });
    }).on('error', (error: Error) => {
      reject(error);
    });
  });
}