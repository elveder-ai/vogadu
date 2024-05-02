import https from 'https';

export function sendHttpsRequest<T>(options: https.RequestOptions, data: T | undefined = undefined) {
  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let chunks: any[] = [];

      response.on('data', (chunk) => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        const result = Buffer.concat(chunks).toString();

        if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
          return reject(new Error(`HTTP status code: ${response.statusCode}, Error message: ${result}`));
        }

        resolve(result);
      });
    });

    request.on('error', (error) => {
      reject(error);
    });


    if (data != undefined) {
      const dataJson = JSON.stringify(data);
      request.write(dataJson);
    }
    
    request.end();
  });
}