import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { WorkerMessageHandler } from 'pdfjs-dist/build/pdf.worker.min.mjs';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  RefreshCw,
  AlertTriangle,
  FileText,
} from 'lucide-react';

// 샌드박스 및 Vite 개발 서버에서 동적 모듈(?import) 워커 로드 차단 문제를 원천 방지하기 위해
// 번들된 WorkerMessageHandler를 메인 스레드 globalThis.pdfjsWorker에 직접 등록합니다.
if (typeof globalThis !== 'undefined') {
  (globalThis as any).pdfjsWorker = { WorkerMessageHandler };
}
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs-worker/pdf.worker.min.mjs';

interface CanvasPdfViewerProps {
  streamUrl: string;
  title?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const CanvasPdfViewer: React.FC<CanvasPdfViewerProps> = ({
  streamUrl,
  title = '리포트 원문',
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [byteSize, setByteSize] = useState<number>(0);
  const [scale, setScale] = useState<number>(isFullscreen ? 1.35 : 1.15);
  const [loading, setLoading] = useState<boolean>(true);
  const [renderingPages, setRenderingPages] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState<number>(0);

  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const renderTasksRef = useRef<any[]>([]);

  useEffect(() => {
    setScale((prev) => {
      if (isFullscreen && prev < 1.25) return 1.35;
      if (!isFullscreen && prev === 1.35) return 1.15;
      return prev;
    });
  }, [isFullscreen]);

  // 1) Fetch PDF binary & parse document via bundled PDF.js worker
  useEffect(() => {
    if (!streamUrl) return;
    let cancelled = false;
    const abortController = new AbortController();
    let activeLoadingTask: any = null;
    let loadedDocument: any = null;

    setLoading(true);
    setErrorMsg(null);
    setPdfDoc(null);
    setNumPages(0);
    setByteSize(0);

    (async () => {
      try {
        const res = await fetch(streamUrl, {
          method: 'GET',
          credentials: 'include',
          signal: abortController.signal,
        });
        if (!res.ok) {
          throw new Error(`원문 스트림 응답 오류 (HTTP ${res.status})`);
        }
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        const bytes = new Uint8Array(buffer);
        if (
          bytes.length < 5 ||
          String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) !== '%PDF'
        ) {
          throw new Error('유효한 PDF 문서 포맷이 아닙니다.');
        }

        setByteSize(bytes.byteLength);
        activeLoadingTask = pdfjsLib.getDocument({
          data: bytes,
          cMapUrl: '/pdfjs-cmaps/',
          cMapPacked: true,
          standardFontDataUrl: '/pdfjs-fonts/',
        });

        const doc = await activeLoadingTask.promise;
        if (cancelled) {
          doc.destroy?.();
          return;
        }

        loadedDocument = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages || 1);
        setLoading(false);
      } catch (err: any) {
        if (cancelled || err?.name === 'AbortError') return;
        console.error('CanvasPdfViewer load error:', err);
        setErrorMsg(
          err?.message || 'PDF 원문 문서를 불러오는 중 일시적인 오류가 발생했습니다.'
        );
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      abortController.abort();
      try {
        activeLoadingTask?.destroy?.();
      } catch {}
      try {
        loadedDocument?.destroy?.();
      } catch {}
    };
  }, [streamUrl, reloadTick]);

  // 2) Render each PDF page onto high-DPI <canvas> elements
  useEffect(() => {
    if (!pdfDoc || numPages <= 0) return;
    let cancelled = false;

    // Cancel any previous in-flight render tasks
    for (const task of renderTasksRef.current) {
      try {
        task?.cancel?.();
      } catch {}
    }
    renderTasksRef.current = [];

    setRenderingPages(true);

    (async () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      try {
        for (let pageNo = 1; pageNo <= numPages; pageNo++) {
          if (cancelled) return;
          const page = await pdfDoc.getPage(pageNo);
          if (cancelled) return;

          let canvas = canvasRefs.current.get(pageNo);
          if (!canvas) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
            canvas = canvasRefs.current.get(pageNo);
          }
          if (!canvas) continue;

          const viewport = page.getViewport({ scale });
          const outputWidth = Math.floor(viewport.width * dpr);
          const outputHeight = Math.floor(viewport.height * dpr);

          if (canvas.width !== outputWidth) canvas.width = outputWidth;
          if (canvas.height !== outputHeight) canvas.height = outputHeight;
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;

          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) continue;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, outputWidth, outputHeight);

          const renderTask = page.render({
            canvas,
            canvasContext: ctx,
            viewport,
            transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
          });
          renderTasksRef.current.push(renderTask);
          await renderTask.promise;
        }
      } catch (err: any) {
        if (!cancelled && err?.name !== 'RenderingCancelledException') {
          console.warn('PDF page render warning:', err);
        }
      } finally {
        if (!cancelled) {
          setRenderingPages(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      for (const task of renderTasksRef.current) {
        try {
          task?.cancel?.();
        } catch {}
      }
      renderTasksRef.current = [];
    };
  }, [pdfDoc, numPages, scale]);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(0.75, Math.round((prev - 0.15) * 100) / 100));
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(2.2, Math.round((prev + 0.15) * 100) / 100));
  }, []);

  const handleZoomReset = useCallback(() => {
    setScale(isFullscreen ? 1.35 : 1.15);
  }, [isFullscreen]);

  const setCanvasRef = useCallback(
    (pageNo: number, el: HTMLCanvasElement | null) => {
      if (el) {
        canvasRefs.current.set(pageNo, el);
      } else {
        canvasRefs.current.delete(pageNo);
      }
    },
    []
  );

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
      {/* 상단 캔버스 뷰어 컨트롤 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-mono tabular-nums">
          <FileText size={13} className="text-emerald-400 shrink-0" />
          <span className="font-sans font-semibold text-slate-200 truncate max-w-[220px] sm:max-w-[320px]">
            {title}
          </span>
          {numPages > 0 && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-300 font-semibold whitespace-nowrap">
                총 {numPages}페이지
              </span>
            </>
          )}
          {byteSize > 0 && (
            <>
              <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-slate-400 hidden sm:inline whitespace-nowrap">
                {(byteSize / 1024).toFixed(0)} KB
              </span>
            </>
          )}
          {renderingPages && !loading && (
            <span className="text-[11px] text-indigo-300 font-sans whitespace-nowrap">
              고해상도 렌더링 중...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={loading || scale <= 0.75}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 transition cursor-pointer shrink-0"
            title="축소"
          >
            <ZoomOut size={14} />
          </button>

          <span className="min-w-[52px] text-center font-mono tabular-nums font-bold text-slate-200 text-xs select-none">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={loading || scale >= 2.2}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 transition cursor-pointer shrink-0"
            title="확대"
          >
            <ZoomIn size={14} />
          </button>

          <button
            type="button"
            onClick={handleZoomReset}
            disabled={loading}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            title="기본 배율 복귀"
          >
            <RotateCcw size={12} />
            <span>기본 배율</span>
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/30 text-[11px] font-bold transition flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              title={isFullscreen ? '기본 모달 크기로 복귀' : '모달 전체화면으로 확대'}
            >
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              <span>{isFullscreen ? '기본 크기' : '전체화면 확대'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 실제 PDF 페이지 캔버스 렌더링 뷰포트 */}
      <div
        className={`relative w-full overflow-auto bg-slate-950 p-4 sm:p-6 flex flex-col items-center gap-5 ${
          isFullscreen ? 'h-[calc(94vh-210px)] min-h-[520px]' : 'h-[58vh] min-h-[430px]'
        }`}
      >
        {loading ? (
          <div className="my-auto flex flex-col items-center justify-center gap-3 py-16 text-slate-300 text-xs">
            <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">
              {title} 정규 PDF 원문 데이터를 캔버스로 렌더링하는 중입니다...
            </span>
          </div>
        ) : errorMsg ? (
          <div className="my-auto flex flex-col items-center justify-center gap-3 py-14 px-6 text-center max-w-md">
            <AlertTriangle size={28} className="text-amber-400" />
            <p className="text-sm font-bold text-slate-200">
              원문 문서를 화면에 표시하지 못했습니다.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
            <button
              type="button"
              onClick={() => setReloadTick((t) => t + 1)}
              className="mt-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>다시 불러오기</span>
            </button>
          </div>
        ) : (
          Array.from({ length: numPages }, (_, idx) => {
            const pageNo = idx + 1;
            return (
              <div
                key={`pdf-page-${pageNo}`}
                className="flex flex-col items-center gap-1.5 shrink-0"
              >
                <div className="shadow-2xl rounded-sm overflow-hidden border border-slate-700 bg-white">
                  <canvas
                    ref={(el) => setCanvasRef(pageNo, el)}
                    className="block bg-white max-w-none"
                  />
                </div>
                {numPages > 1 && (
                  <span className="text-[11px] font-mono tabular-nums text-slate-500">
                    {pageNo} / {numPages} 페이지
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
