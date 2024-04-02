import type { Meta, StoryObj } from "@storybook/web-components";
import { fn } from "@storybook/test";

import "../src/ka-knob";

const meta: Meta = {
  title: "Control/Knob",
  component: "ka-knob",
};

export default meta;

export const Basic: StoryObj = {
  args: {
    min: 0.0,
    max: 1.0,
    value: 0.1,
    onchange: fn(),
  },
};
