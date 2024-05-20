import https from 'https';
import zlib from 'zlib';
import stream from 'stream';

export async function httpsGet(url: string): Promise<string> {
  // Copy the cookie value from the browser
  const cookie = '_fbp=fb.1.1715792910884.1912406259; bm_sv=34A57A5EC715672BB68B2D1CA19509E4~YAAQPBdlX6tnQU2PAQAAhDI6fRcU68XIJVBSmjLEKeXKxBt+kHHuZTUsylM2nvk1YxICKauIc7gMQiiMW6ikIzDodlHxphDomUqiJsl+ZKagpxvF+oFZiktrN6CYF6YGXOgdS5mk4mMYAad5S/hBk+ILMZjbnvnKaW7YYIYm5xGYxmSRo+jZPcAnOXC/7WrnbvyXxmltC4thkUu69fZS2ZwHKg5giHNg7YaFky7lDuPSERfJaDWPAi83/0EDdIeq0w==~1; device-characterization=false,false; _ga=GA1.1.2095927576.1715792911; _ga_Z1SEPKTH2P=GS1.1.1715792910.1.0.1715792916.54.0.0; _uetsid=c1256a6012dd11ef98f8151c9e760b89; _uetvid=c1256c4012dd11ef8416dd60552a906a; edmunds=03f53c9b-be95-48af-9cc5-491c2667441e; edw=191949672299539040; entry_page=home_page; entry_url=www.edmunds.com%2F; entry_url_params=%7B%7D; session-id=191949672299539040; usprivacy=1YNN; visitor-id=03f53c9b-be95-48af-9cc5-491c2667441e; feature-flags=j%3A%7B%7D; lux_uid=171579291035168069; g_state={"i_p":1715800115529,"i_l":1}; _tt_enable_cookie=1; _ttp=2TMZwRqQtWXupFD-Pi3v6kqzFKo; cto_bundle=EKN0CV9hRzFVWlR4JTJGZ201cjJ0bjF2WnpPUFAlMkJDMlRVVXElMkY4U0k0ZyUyRktPWEptTzhvdzM2aURWdDd3TFYzTmxQZ01qbk83VjZtbCUyRnZZdkpSYjhGVlpNcEI5NmtReHRkJTJGZ2Vqd3dlU2wlMkI0S3d2YnRxcnE1TTc5aVdUTSUyQk9MY1RHRVc0TGk; ak_bmsc=A92C4C38E9592ECEA57E283AD9A3FFFA~000000000000000000000000000000~YAAQPBdlX6ZhQU2PAQAAsho6fRclGgDXSgTMDkUqXJZcT7gLvfQxaOkxt3l8JG5K42pSKXPGsf75c5Pyj2j2jCWHTgbIFI1bJzoB5TtW7VrhuDktSAf3BHYdZOknT7nN+Fv3oEHDOyAEwRTPGAS6gwFTcw4BOcuzNaxRPPaGNSHr5KOhRbGRSSWSjWDnR5+FM+KrJGEebBI6pSk1VfcefUQzrB9LVa7d3t2oLynG/e23IxILn3alALU5Nd0YOUBbeKUS2oncZw9e3PtdwND2+Ei/KRR7kPGmgxpWgfthYN3JFrDUaihBwen1JYIOTD0mxyQGyhDU+Ub8rLQihoCLta4AWg2RuONcHMX4uyEslR/KgjFO5/YX4DYnMYzvh55/ggFf3fcik0aehGTtb/cCMxkjr6eDPXdxxwCFcDlgGdOA0rDZf2nBYW29EqQ9Movz/mJFUGMGG+qrT4q+oGw=; edm-ias-data=%7B%22fr%22%3A%22false%22%7D; EdmundsYear="&zip=58067&dma=724:IP&city=Rutland&state=ND&userSet=false&lat=46.054802&lon=-97.502278"; location=j%3A%7B%22zipCode%22%3A%2258067%22%2C%22type%22%3A%22Standard%22%2C%22areaCode%22%3A%22701%22%2C%22timeZone%22%3A%22Central%22%2C%22gmtOffset%22%3A-6%2C%22dst%22%3A%221%22%2C%22latitude%22%3A46.054802%2C%22longitude%22%3A-97.502278%2C%22salesTax%22%3A0.05%2C%22dma%22%3A%22724%22%2C%22dmaRank%22%3A114%2C%22stateCode%22%3A%22ND%22%2C%22city%22%3A%22Rutland%22%2C%22county%22%3A%22Sargent%22%2C%22inPilotDMA%22%3Atrue%2C%22state%22%3A%22North%20Dakota%22%2C%22ipDma%22%3A%22724%22%2C%22ipStateCode%22%3A%22ND%22%2C%22ipZipCode%22%3A%2258067%22%2C%22userIP%22%3A%22149.62.208.253%22%2C%22userSet%22%3Afalse%7D; content-targeting=BG,,SOFIA,,23.32,42.68,; _mkto_trk_http=id:461-NMJ-598&token:_mch-edmunds.com-1712144515671-81060; vf_edmunds_LN8RE-vA=%7B%22pv%22%3A2%2C%22secondarySessionID%22%3A%229fdaae30-7a87-45d0-918c-f33d5ba70ea1%22%2C%22sessionID%22%3A%2216a02d7a-18c1-46cb-92ca-4c8adcc574b6%22%2C%22uuid%22%3A%22a4709f21-2ead-4ddb-a26e-56495e0d3715%22%7D';

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