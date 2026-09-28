const fs = require('fs');
const html = fs.readFileSync('excel_viewer_resp.html', 'utf-8');

const id1 = 'm_excelWebRenderer_ewaCtl_m_ewa_m_postOpenWorkbookContextJson';
const id2 = 'm_excelWebRenderer_ewaCtl_m_workbookContextJson';

[id1, id2].forEach(id => {
  const re = new RegExp(`id="${id}"[^>]*value="([^"]*)"`, 'i');
  const m = html.match(re);
  if (m) {
    console.log(`Found value for ${id}, length:`, m[1].length);
    try {
      const decoded = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      fs.writeFileSync(`${id}.json`, decoded);
      console.log(`Saved ${id}.json`);
    } catch (e) {
      console.error(e);
    }
  } else {
    // check tag without value
    const reTag = new RegExp(`<[^>]+id="${id}"[^>]*>([\\s\\S]*?)<\\/[^>]+>`, 'i');
    const mTag = html.match(reTag);
    if (mTag) {
      console.log(`Found tag content for ${id}, length:`, mTag[1].length);
    } else {
      console.log(`Not found: ${id}`);
    }
  }
});
