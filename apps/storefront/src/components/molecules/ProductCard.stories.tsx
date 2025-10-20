// src/components/molecules/ProductCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import ProductCard from "./ProductCard";
import type { Product } from "../../lib/api";
import { MemoryRouter } from "react-router-dom"; // 👈 import this

const sampleProduct: Product = {
  _id: "1",
  name: "Sample Product",
  imageUrl: "https://via.placeholder.com/150",
  price: 19.99,
  stock: 5,
  tags: ["tag1", "tag2"],
};

const meta: Meta<typeof ProductCard> = {
  title: "Molecules/ProductCard",
  component: ProductCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    product: sampleProduct,
    onAddToCart: () => alert("Added to cart!"),
  },
};
