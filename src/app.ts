import "@kagefumi/ui";

import "./components/kf-kagefumi";
import type { KfKagefumiElement } from "./components/kf-kagefumi";

import sampleIsf01Source from "./sample-isf-01.fs?raw";
import sampleIsf02Source from "./sample-isf-02.fs?raw";

document.addEventListener("DOMContentLoaded", async () => {
  const kagefumiEl = document.querySelector<KfKagefumiElement>("kf-kagefumi");

  await kagefumiEl?.addIsfSource("sample-isf.fs 2", sampleIsf02Source);
  await kagefumiEl?.addIsfSource("sample-isf.fs 1", sampleIsf01Source);
});
