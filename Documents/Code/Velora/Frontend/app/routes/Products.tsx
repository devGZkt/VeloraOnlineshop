import Nav from "../components/Nav"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams, Link } from "react-router"
import axios from "axios"
import { useCart } from "../context/CartContext"

interface Subcategory {
  subcategoryId: number;
  slug: string;
  description?: string;
}

interface Category {
  categoryId: number;
  slug: string;
  description?: string;
  subcategories: Subcategory[];
}

interface Product {
  productId: number;
  subcategoryId: number;
  name: string;
  sku?: string;
  slug?: string;
  shortDescription?: string;
  longDescription?: string;
  price: number;
  isVisible: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.productId,
      productId: product.productId,
      name: product.name,
      price: product.price,
      shortDescription: product.shortDescription,
    });
    setAddedProductId(product.productId);
    setTimeout(() => {
      setAddedProductId((current) => (current === product.productId ? null : current));
    }, 1500);
  };

  const categorySlug = searchParams.get("category");
  const subcategorySlug = searchParams.get("subcategory");

  // Fetch Categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/Category");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/Products`;
        const params = new URLSearchParams();
        if (categorySlug) params.append("categorySlug", categorySlug);
        if (subcategorySlug) params.append("subcategorySlug", subcategorySlug);

        const response = await axios.get(`${url}?${params.toString()}`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, subcategorySlug]);

  const activeCategory = useMemo(() =>
    categories.find(c => c.slug === categorySlug),
    [categories, categorySlug]);

  const formatSlug = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav />
      <div className="container mx-auto px-6 py-12 grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          {activeCategory && activeCategory.subcategories.length > 0 && (
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg f flexont-bold text-gray-900 mb-4 border-b pb-2">
                  Subcategories
                </h2>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to={`/products?category=${categorySlug}`}
                      className={`block px-3 py-2 rounded-lg transition-colors ${!subcategorySlug ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      All {formatSlug(categorySlug || "")}
                    </Link>
                  </li>
                  {activeCategory.subcategories.map(sub => (
                    <li key={sub.subcategoryId}>
                      <Link
                        to={`/products?category=${categorySlug}&subcategory=${sub.slug}`}
                        className={`block px-3 py-2 rounded-lg transition-colors ${subcategorySlug === sub.slug ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {formatSlug(sub.slug)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="grow">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {subcategorySlug ? formatSlug(subcategorySlug) : (activeCategory ? formatSlug(activeCategory.slug) : "All Products")}
              </h1>
              {activeCategory && (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {products.length} Products
                </span>
              )}
            </div>

            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product.productId} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col border border-gray-100">
                    <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                      <div className="text-gray-400 group-hover:scale-105 transition-transform duration-500">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      {!product.isVisible && (
                        <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Not Visible</span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col grow">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{product.name}</h2>
                      <p className="text-gray-500 mb-4 text-sm grow line-clamp-3">
                        {product.shortDescription || "No description available."}
                      </p>
                      <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
                        <span className="text-2xl font-black text-gray-900">
                          €{product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all active:scale-95 focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center gap-2 ${addedProductId === product.productId
                            ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                            }`}
                        >
                          {addedProductId === product.productId ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Added!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Buy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="col-span-full bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Products Found</h3>
                    <p className="text-gray-500">We couldn't find any products in this category. Please check back later.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Products;
