import "./components/kagefumi-viewer";
import type { KagefumiViewer } from "./components/kagefumi-viewer";

import sampleIsf01Source from "./sample-isf-01.fs?raw";
import sampleIsf02Source from "./sample-isf-02.fs?raw";

document.addEventListener("DOMContentLoaded", async () => {
  const kagefumiViewerEl = document.querySelector<KagefumiViewer>("kagefumi-viewer");

  await kagefumiViewerEl?.addIsfSource("sample-isf.fs 1", sampleIsf01Source);
  await kagefumiViewerEl?.addIsfSource("sample-isf.fs 2", sampleIsf02Source);
});
