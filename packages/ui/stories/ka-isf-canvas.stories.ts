import type { Meta, StoryObj } from "@storybook/web-components";

import "../src/ka-isf-canvas";

const isfSource = `
void main(void) {
  gl_FragColor = vec4(mod(TIME, 2.0) / 2.0, 0.0, 0.0, 1.0);
}
`;

const meta: Meta = {
  title: "Rendering/ISF Canvas",
  component: "ka-isf-canvas",
};

export default meta;

export const Basic: StoryObj = {
  args: {
    width: "1280",
    height: "720",
  },
  play: ({ canvasElement }) => {
    const kaIsfCanvasEl = canvasElement.querySelector("ka-isf-canvas");
    if (!kaIsfCanvasEl) {
      return;
    }

    kaIsfCanvasEl.setIsfProgram(isfSource);
  },
};
