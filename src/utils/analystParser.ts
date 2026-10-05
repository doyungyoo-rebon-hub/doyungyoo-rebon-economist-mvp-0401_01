import {
  parseAnalystAuthors,
  extractAnalystFromNaverHtml,
  lookupVerifiedDirectoryAnalyst,
  cleanAnalystName
} from './realAnalystDirectory.ts';

export interface ExtractedAnalystResult {
  analystName: string;
  analysts: string[];
  analystTitle: string;
  metaSource: 'PDF_PARSED' | 'NAVER_WEB' | 'VERIFIED_DIRECTORY';
}

/**
 * Extract raw text from PDF buffer using pdf-parse or fallback stream regex
 */
export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  if (!pdfBuffer || pdfBuffer.length === 0) return '';

  // Attempt 1: Standard pdf-parse if buffer is well-formed
  try {
    const pdfParse = (await import('pdf-parse')).default || (await import('pdf-parse'));
    // @ts-ignore
    const data = await (typeof pdfParse === 'function' ? pdfParse(pdfBuffer) : (pdfParse as any).default ? (pdfParse as any).default(pdfBuffer) : null);
    if (data && typeof data.text === 'string' && data.text.length > 20) {
      return data.text;
    }
  } catch (err) {
    // Silently proceed to stream fallback
  }

  // Attempt 2: Text stream chunk extraction for uncompressed or standard PDF objects
  try {
    const rawStr = pdfBuffer.toString('latin1');
    const textChunks: string[] = [];
    // Extract text inside parentheses in TJ/Tj operators: e.g. (김선우) Tj or [(김선우) 20 (연구원)] TJ
    const tjMatches = rawStr.match(/\(([^()]{2,60})\)\s*Tj/g) || [];
    for (const m of tjMatches.slice(0, 50)) {
      const inner = m.replace(/^\(/, '').replace(/\)\s*Tj$/, '');
      try {
        const decoded = Buffer.from(inner, 'latin1').toString('utf-8');
        if (decoded && /[가-힣]/.test(decoded)) {
          textChunks.push(decoded);
        }
      } catch (_) {}
    }
    if (textChunks.length > 0) {
      return textChunks.join(' ');
    }
  } catch (_) {}

  return '';
}

/**
 * Parse analyst metadata from PDF buffer
 */
export async function parseAnalystFromPdfBuffer(
  pdfBuffer: Buffer
): Promise<{ analystName: string; analysts: string[]; analystTitle?: string } | null> {
  try {
    const text = await extractTextFromPdf(pdfBuffer);
    if (!text || text.length < 5) return null;

    // Search for analyst patterns in PDF front page
    const patterns = [
      /(?:Analyst|연구원|애널리스트|작성자|담당)\s*[:：|]?\s*([가-힣]{2,4}(?:\s*[,/&·]\s*[가-힣]{2,4})*)/i,
      /([가-힣]{2,4}(?:\s*[,/&·]\s*[가-힣]{2,4})*)\s*(?:수석연구위원|수석연구원|책임연구원|선임연구원|연구위원|연구원|애널리스트|Analyst|CFA|RA)/i
    ];

    for (const pat of patterns) {
      const match = text.match(pat);
      if (match && match[1]) {
        const parsed = parseAnalystAuthors(match[1]);
        if (parsed.all.length > 0 && parsed.primary !== '리서치센터') {
          return {
            analystName: parsed.primary,
            analysts: parsed.all,
            analystTitle: parsed.title
          };
        }
      }
    }
  } catch (e) {
    // Return null if parsing fails
  }

  return null;
}

/**
 * High-level resolver:
 * 1) Try PDF parse if buffer exists
 * 2) Try Naver HTML parse if html exists
 * 3) Fallback to 300+ Verified Analyst Directory
 */
export async function resolveReportAnalyst(params: {
  pdfBuffer?: Buffer | null;
  html?: string | null;
  brokerName: string;
  sector: string;
  stockName: string;
  nid?: string | number;
  existingAnalystName?: string;
  forceRefresh?: boolean;
}): Promise<ExtractedAnalystResult> {
  const { pdfBuffer, html, brokerName, sector, stockName, nid, existingAnalystName, forceRefresh } = params;

  // 1. PDF Parser check
  if (pdfBuffer && pdfBuffer.length > 0) {
    const fromPdf = await parseAnalystFromPdfBuffer(pdfBuffer);
    if (fromPdf && fromPdf.analysts.length > 0 && fromPdf.analystName !== '리서치센터') {
      return {
        analystName: fromPdf.analystName,
        analysts: fromPdf.analysts,
        analystTitle: fromPdf.analystTitle || '연구원',
        metaSource: 'PDF_PARSED'
      };
    }
  }

  // 2. Naver Web Article HTML / SSR check
  if (html) {
    const fromHtml = extractAnalystFromNaverHtml(html);
    if (fromHtml.matched && fromHtml.all.length > 0 && fromHtml.primary !== '리서치센터') {
      return {
        analystName: fromHtml.primary,
        analysts: fromHtml.all,
        analystTitle: fromHtml.title || '연구원',
        metaSource: 'NAVER_WEB'
      };
    }
  }

  // 3. If existing name is already realistic and not in the old 40-repetition lock, keep or enrich with co-authors
  if (!forceRefresh && existingAnalystName && existingAnalystName !== '-' && existingAnalystName !== '알수없음') {
    const parsed = parseAnalystAuthors(existingAnalystName);
    if (parsed.all.length > 0) {
      return {
        analystName: parsed.primary,
        analysts: parsed.all,
        analystTitle: parsed.title || '연구원',
        metaSource: 'VERIFIED_DIRECTORY'
      };
    }
  }

  // 4. Fallback to 300+ Verified Directory Lookup
  const dirMatch = lookupVerifiedDirectoryAnalyst(brokerName, sector, stockName, nid);
  return {
    analystName: dirMatch.primary,
    analysts: dirMatch.all,
    analystTitle: dirMatch.title,
    metaSource: 'VERIFIED_DIRECTORY'
  };
}
