import https from 'https';
import zlib from 'zlib';
import stream from 'stream';

export async function httpsGet(url: string): Promise<string> {
  // Copy the cookie value from the browser
  const cookie = 'device-characterization=false,false; _fbp=fb.1.1708763868241.1327063259; _ga=GA1.1.588429748.1708763866; _ga_Z1SEPKTH2P=GS1.1.1711036458.24.0.1711036459.59.0.0; _uetsid=54177e30e76511ee9fd3e93744c5a4e5; _uetvid=fcded250d2ef11eeb91f8d2b25ee6544; bm_sv=0E60E251A76F4E0B702F415F37C6E884~YAAQZRdlXw3RRl+OAQAAhGq4YRd57rbh+QjWoEHupxXg2COC5+cCexpwBEN5pc/SLyeVaDTd4MTu7osPvGAMZ3QeFl1bj55hEeomxuw75M+dXQOZzWK9uRf8/jnwnrBliWX43KxjXqQiO1AXNsO2ZdN9lO13Ck3T/X5rjB5Tb6Y8cMb2GkLQ5EFBIehrb1/7JOyKu3NjpsLfLIoEw+YAC+RZHxylSdtCQmSQFmHGnxF7bag6iU1DGYbzX5m0l5s0+Q==~1; edmunds=03f53c9b-be95-48af-9cc5-491c2667441e; edw=567166732450073200; entry_page=home_page; entry_url=www.edmunds.com%2F; entry_url_params=%7B%7D; session-id=567166732450073200; usprivacy=1YNN; visitor-id=03f53c9b-be95-48af-9cc5-491c2667441e; feature-flags=j%3A%7B%7D; lux_uid=171103645841628952; EdmundsYear="&zip=58067&dma=724:IP&city=Rutland&state=ND&userSet=false&lat=46.054802&lon=-97.502278"; ak_bmsc=F303E800E139A75B8D4AEFB0FEDF07A1~000000000000000000000000000000~YAAQZRdlX73QRl+OAQAARmS4YRcsCvTNE3SlLAeDoj0XFfazJb1wuuEtfFQoiZQw1j+oRucvECPvbmROZeQfhdljQyHf/XBKZauHoYkWVydHRee4pEC6C1HchUGrdEHq0z0gyPBohQsc1cD50PgQIDrvyd2LC+IKGdZ0kbGKSGXEBAzwvAQG9QgVYi5GJv/kA8FVwmxZxJ4b0Trm69IHbFAhPJSU1MikdN7D6/FrJsc+CEhFedjMhW3P1E3AfTS758vDkhL7p2nWfiXlOdJjQqw//7KuIBQT6vZotObCWn60ynRzHNI6tGBcF4ElQnMXbkLxVZraFZBjjL8JBYM0epylJRj9w/I5oUcPq0E778VBtJQdMvmkbw+JO6IacsKpA6CELcr1sPPbmTQ=; location=j%3A%7B%22zipCode%22%3A%2258067%22%2C%22type%22%3A%22Standard%22%2C%22areaCode%22%3A%22701%22%2C%22timeZone%22%3A%22Central%22%2C%22gmtOffset%22%3A-6%2C%22dst%22%3A%221%22%2C%22latitude%22%3A46.054802%2C%22longitude%22%3A-97.502278%2C%22salesTax%22%3A0.05%2C%22dma%22%3A%22724%22%2C%22dmaRank%22%3A114%2C%22stateCode%22%3A%22ND%22%2C%22city%22%3A%22Rutland%22%2C%22county%22%3A%22Sargent%22%2C%22inPilotDMA%22%3Atrue%2C%22state%22%3A%22North%20Dakota%22%2C%22ipDma%22%3A%22724%22%2C%22ipStateCode%22%3A%22ND%22%2C%22ipZipCode%22%3A%2258067%22%2C%22userIP%22%3A%22149.62.208.150%22%2C%22userSet%22%3Afalse%7D; cto_bundle=q8TBXF95ZVo4OTVoWTMyVjBrSHR6TWpBdnk5VUtFejR1eTRXSlNEREwwS1lWWmJXbWQlMkJkNzN1SDRKeldSMGNCR1VlSWdVT05wbW5WNTdhcnNBeERJUlFhNnF5QzhGdjBJYXpGR2pCS1RXJTJGaDNpRnQ4OWQ1Uk9xV3BEb2tNdEdaY1gzVWo; edm-ias-data=%7B%22fr%22%3A%22false%22%7D; content-targeting=BG,,SOFIA,,23.32,42.68,; g_state={"i_p":1711476525033,"i_l":3}; __eoi=ID=4b65e23dfdbd0040:T=1708763880:RT=1709650188:S=AA-AfjZ_1yIc8wO9rusmKAjabLyV; __gads=ID=9e0422b3b2101aed:T=1708763880:RT=1709650188:S=ALNI_MaYp-VCn_TQSwRUfNxpypOJNv_mCQ; __gpi=UID=00000d5fd65c243f:T=1708763880:RT=1709650188:S=ALNI_Mb3XQ0OA8IGAVegCynJ-KadJSaabA; _lc2_fpi=af8735f07514--01hqdcyfpr1pp47eqnd0s6jgyw; _pbjs_userid_consent_data=3524755945110770; _lr_env_src_ats=false; _td=212201e6-6832-41dc-b9e2-7136e8b1e0c4; __utma=201338437.588429748.1708763866.1708773170.1708773170.1; __utmv=201338437.|1=visitorId=03f53c9b-be95-48af-9cc5-491c2667441e=1; __utmz=201338437.1708773170.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _pubcid=6837ddcf-f29f-496a-9023-671afefc45a1; pbjs-unifiedid=%7B%22TDID_LOOKUP%22%3A%22FALSE%22%2C%22TDID_CREATED_AT%22%3A%222024-02-24T11%3A10%3A34%22%7D; _tt_enable_cookie=1; _ttp=Y21suLB1EPITIuJukbcoqIbNDjy';

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