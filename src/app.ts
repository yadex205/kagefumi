import "@kagefumi/ui";

import "./components/kf-kagefumi";
import type { KfKagefumiElement } from "./components/kf-kagefumi";

import sampleIsf01Source from "./sample-isf-01.fs?raw";

document.addEventListener("DOMContentLoaded", async () => {
  const kagefumiEl = document.querySelector<KfKagefumiElement>("kf-kagefumi");
  if (!kagefumiEl) {
    return;
  }

  kagefumiEl.isfSource = sampleIsf01Source;
});
