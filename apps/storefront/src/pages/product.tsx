/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/product.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "../components/templates/MainLayout";
import { getProductById, getProducts, type Product } from "../lib/api";
import { useCartStore } from "../lib/store";
import ProductCard from "../components/molecules/ProductCard";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const p = await getProductById(id);
        setProduct(p);

        // Fetch all products to find related ones
        const allProductsResponse = await getProducts({ limit: 1000 });
        const relatedProducts = allProductsResponse.products.filter(
          (prod: { _id: string; tags: any[] }) =>
            prod._id !== p._id &&
            prod.tags.some((tag: string) => p.tags.includes(tag))
        );
        setRelated(relatedProducts);
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <MainLayout>
        <p className="p-6">Loading product...</p>
      </MainLayout>
    );

  if (error || !product)
    return (
      <MainLayout>
        <p className="p-6 text-red-600">{error || "Product not found"}</p>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Product Info */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full md:w-1/2 aspect-[4/3] object-cover rounded-lg shadow"
          />

          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-blue-600 font-bold text-xl mb-2">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-500 mb-4">Stock: {product.stock}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() =>
                addItem({
                  id: product._id,
                  title: product.name,
                  price: product.price,
                  qty: 1,
                })
              }
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {related.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onAddToCart={() =>
                    addItem({
                      id: prod._id,
                      title: prod.name,
                      price: prod.price,
                      qty: 1,
                    })
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
