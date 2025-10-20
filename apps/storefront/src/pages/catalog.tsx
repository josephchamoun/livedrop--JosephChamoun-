/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getProducts, createProduct, type Product } from "../lib/api";
import { useCartStore } from "../lib/store";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import ProductCard from "../components/molecules/ProductCard";
import ProductForm from "../components/molecules/ProductForm";
import { MainLayout } from "../components/templates/MainLayout";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [tagFilter, setTagFilter] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20; // Adjust as needed

  const addItem = useCartStore((state) => state.addItem);

  // Fetch products whenever filters or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (search.trim()) params.search = search;
        if (tagFilter) params.tag = tagFilter;
        if (sort) params.sort = sort === "asc" ? "price" : "-price";

        const response = await getProducts(params);
        setProducts(response.products);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, search, sort, tagFilter]);

  // Get all tags for filter dropdown (fetch separately or from all products)
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        // Fetch products without limit to get all tags
        const response = await getProducts({ limit: 1000 });
        const tags = new Set<string>();
        // response is now { products: [], pagination: {} }
        if (response.products && Array.isArray(response.products)) {
          response.products.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
        }
        setAllTags(Array.from(tags));
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };
    fetchAllTags();
  }, []);

  const handleAddProduct = async (data: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    tags: string[];
  }) => {
    try {
      const newProduct = await createProduct(data);
      // Reset to first page and refetch
      setCurrentPage(1);
      setProducts((prev) => [newProduct, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add product", err);
      alert("Failed to add product. See console for details.");
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleTagChange = (value: string) => {
    setTagFilter(value);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleSortChange = (value: "asc" | "desc") => {
    setSort(value);
    setCurrentPage(1); // Reset to first page on sort
  };

  if (loading && products.length === 0)
    return (
      <MainLayout>
        <p className="p-6">Loading products...</p>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <p className="p-6 text-red-600">{error}</p>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Catalog</h1>
          <Button type="button" onClick={() => setShowForm(true)}>
            Add Product
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full sm:w-64"
          />
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as "asc" | "desc")}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
          </select>
          <select
            value={tagFilter}
            onChange={(e) => handleTagChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Loading indicator for page changes */}
        {loading && products.length > 0 && (
          <div className="text-center mb-4 text-gray-600">Loading...</div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                _id: product._id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                imageUrl: product.imageUrl,
                tags: product.tags,
              }}
              onAddToCart={() =>
                addItem({
                  id: product._id,
                  title: product.name,
                  price: product.price,
                  qty: 1,
                })
              }
            />
          ))}
          {products.length === 0 && !loading && (
            <p className="col-span-full text-center text-gray-500">
              No products found.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {products.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        )}

        {showForm && (
          <ProductForm
            onSubmit={handleAddProduct}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </MainLayout>
  );
}
