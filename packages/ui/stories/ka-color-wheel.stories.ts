import type { Meta, StoryObj } from "@storybook/web-components";
import { fn } from "@storybook/test";

import "../src/ka-color-wheel";

const meta: Meta = {
  title: "Control/ColorWheel",
  component: "ka-color-wheel",
};

export default meta;

export const Basic: StoryObj = {
  args: {
    value: "#c0ffee",
    onchange: fn(),
  },
};
