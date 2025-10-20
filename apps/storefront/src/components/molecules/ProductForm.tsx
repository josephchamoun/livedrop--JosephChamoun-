import { useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

interface ProductFormProps {
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    tags: string[];
  }) => void;
  onClose: () => void;
}

export default function ProductForm({ onSubmit, onClose }: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate positive numbers
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);

    if (priceNum < 0 || stockNum < 0) {
      alert("Price and stock quantity must be non-negative");
      return;
    }

    onSubmit({
      name,
      description,
      price: priceNum,
      stock: stockNum,
      imageUrl,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-96 space-y-4 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-2">Add New Product</h2>
        <Input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
          required
        />
        <Input
          type="number"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          min="0"
          step="1"
          required
        />
        <Input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </Button>
          <Button type="submit">Add Product</Button>
        </div>
      </form>
    </div>
  );
}
