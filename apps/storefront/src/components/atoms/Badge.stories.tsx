import type { Meta, StoryObj } from "@storybook/react-vite";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "New",
  },
};

export const Sale: Story = {
  args: {
    children: "Sale",
  },
};

export const Limited: Story = {
  args: {
    children: "Limited",
  },
};
