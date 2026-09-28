const https = require('https');
const http = require('http');
const fs = require('fs');

const initialUrl = "https://my.microsoftpersonalcontent.com/personal/3c0a0bff7739f51b/_layouts/15/download.aspx?UniqueId=ae171b0f-d759-4b10-adb1-5f2c508d42d4&Translate=false&auth_code=" + encodeURIComponent("v1e.eyJzaXRlaWQiOiI4MjkxZDg4YS0yMzkwLTQ5MjMtYTgxYS1jNGM2YzUyNjhhYjEiLCJhcHBfZGlzcGxheW5hbWUiOiJQb3dlclBvaW50T25saW5lIiwiYXBwaWQiOiJlMDNhMTNlZS05NzMwLTRjYWUtODUyNS00NzU1OWM4Y2YxOGEiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvb25lZHJpdmUubGl2ZS5jb21AOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkIiwiZXhwIjoiMTc5MDkyNTY2OSJ9.qisjBRTI-2esPNGtmRq35-OOtPSepkAq5gLCzAUFcfgb9ri8IQZjTjPv4YXCx77R_upnFLddOKUv-RRdN3o8UFDb-_HSjm-_gnDDfzZ38Q1P3pTp-UIQ_OA3JMI02dEN3iFvQqZp9d1ZSK5K02qlwfpuccTk06wD_I-NhpMDYDH661_b7aZbPULBlXSZy5xmk0beTSeHwgKYKkchfF9AuHHul_iXZMcS1RqQ1m_FZhfI5PgUvGRDaLP7kYYdZq5nWZmp8w_sQ1blDKXD6XbQqbLpd3JpcZXKTcYNgOjFwuBsyuBAAFhrG3iRG2Jm36eGhC9VsLtAi9uae9e8J451t8fRqCFsSJcIXSm3-QbnM8pNFN_vcOULEBcATtuM4T5J-McGQcoxyRuxhzHbipxDsgdb5TshYCs1BER6mUTsKz331B4dk90tHHG3wTMbv5tP7U662v-0h7LidSosiw5p1VGgOH7br50VpHryqfPA5L8n96E9qIOKddPIJgnkcHbQPyPI4ZZpKZ-zGf6Tn3PF4Sl6-NrMW2gsZT1FKYEKxZU6xco0pha9lKK4qzf7RP6QT3qZBeJJSJHcuH-nHvysdYolkOBEwGCFjLonzAp_Cmym66tzZz6pLHat4Ik6DTQIKC1oknplZwuekzZweKpiGHYSZhbIMigJf83ARpC7iRB8embM2KFAon5KvqgL311zwAZzyxFgCGsKvlQk7til4ksX0jO7lDi-Lcfu4SJ1zcs4rt42coIQhwlvxZXccYVPSEGQXMeDR6DDi1asJCwdwCT5Q6t-PXOFPF_S4HRpUx_CWhJ_xVfQaXScKdguD6jWLegdQvoCPz1rUnZHJd3W5-DiAoXmlVH_R811_GTO0EM.tyaGXwbyiYAbuMyzarg5q4ZPXkr9ts0I-j1yYU1XsYY");

const cookieJar = {};

function getCookieString() {
  return Object.entries(cookieJar).map(([k, v]) => `${k}=${v}`).join('; ');
}

function updateCookies(setCookieHeader) {
  if (!setCookieHeader) return;
  const list = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  list.forEach(str => {
    const parts = str.split(';')[0].split('=');
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    cookieJar[key] = val;
  });
}

function fetchUrl(targetUrl, maxRedirects = 10) {
  if (maxRedirects <= 0) {
    console.error('Too many redirects');
    return;
  }
  console.log(`[GET] ${targetUrl}`);
  const u = new URL(targetUrl);
  const client = u.protocol === 'https:' ? https : http;

  const req = client.get(u, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Cookie': getCookieString(),
      'Referer': 'https://onedrive.live.com/'
    }
  }, res => {
    console.log(`Status: ${res.statusCode}, Content-Type: ${res.headers['content-type']}, Content-Length: ${res.headers['content-length']}`);
    updateCookies(res.headers['set-cookie']);

    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      let next = res.headers.location;
      if (!next.startsWith('http')) {
        next = new URL(next, targetUrl).href;
      }
      res.resume();
      fetchUrl(next, maxRedirects - 1);
    } else if (res.statusCode === 200) {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        console.log(`Successfully received 200 OK! Total bytes: ${buf.length}`);
        fs.writeFileSync('excel_final.xlsx', buf);
        console.log('Saved to excel_final.xlsx');
      });
    } else {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => console.log('Non-200 Response body:', b.slice(0, 300)));
    }
  });

  req.on('error', err => console.error('Req error:', err.message));
}

fetchUrl(initialUrl);
