const fs = require('fs');
const html = fs.readFileSync('excel_viewer_resp.html', 'utf-8');
const wsMatches = html.match(/wss?:\/\/[^"'\s<>]+/gi) || [];
console.log('WebSocket URLs:', Array.from(new Set(wsMatches)));

const rtcMatches = html.match(/"Rtc[^"]*":"[^"]*"/gi) || [];
console.log('Rtc matches:', rtcMatches);

const postOpen = JSON.parse(fs.readFileSync('m_excelWebRenderer_ewaCtl_m_ewa_m_postOpenWorkbookContextJson.json', 'utf-8'));
console.log('RtcEndpointUrl in postOpen:', postOpen.RtcEndpointUrl);
console.log('RtcBootToken in postOpen:', postOpen.RtcBootToken ? postOpen.RtcBootToken.slice(0, 50) : null);
