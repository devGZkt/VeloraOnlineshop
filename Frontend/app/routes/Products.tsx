import Nav from "../components/Nav"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router"
import { useCart } from "app/context/CartContext"
import axios from "axios"

interface Product {
    productId: number;
    categoryId: number;
    name: string;
    sku?: string;
    slug?: string;
    shortDescription?: string;
    longDescription?: string;
    price: number;
    isVisible: boolean;
}

const CATEGORIES = {
    "parfuem-duefte": { id: 1, name: "Parfüm & Düfte" },
    "pflege-hygiene": { id: 2, name: "Pflege & Hygiene" },
    "gesicht-haut": { id: 3, name: "Gesicht & Haut" },
    "haar-bart": { id: 4, name: "Haar & Bart" },
    "make-up": { id: 5, name: "Make-Up" },
    "oele-essenzen": { id: 6, name: "Öle & Essenzen" },
    "haushalt-reinigung": { id: 7, name: "Haushalt & Reinigung" },
    "ernaehrung-vitalitaet": { id: 8, name: "Ernährung & Vitalität" }
};

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    const categorySlug = searchParams.get("category");
    const activeCategory = categorySlug ? CATEGORIES[categorySlug as keyof typeof CATEGORIES] : null;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = categorySlug
                    ? `/api/products?categorySlug=${categorySlug}`
                    : "/api/products";
                const response = await axios.get(url);
                setProducts(response.data);
            } catch (err) {
                setError("Failed to load products.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categorySlug]);

    const filteredProducts = products;


    //access to cart logic
    const { addToCart } = useCart();

    return (
        <div className="min-h-screen bg-gray-50">
            <Nav />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
                    {activeCategory ? activeCategory.name : "All Products"}
                </h1>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <div key={product.productId} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col border border-gray-100">
                                <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                    {/* Placeholder for no image */}
                                    <div className="text-gray-400 group-hover:scale-105 transition-transform duration-500">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    {!product.isVisible && (
                                        <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Not Visible</span>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{product.name}</h2>
                                    <p className="text-gray-500 mb-4 text-sm flex-grow line-clamp-3">
                                        {product.shortDescription || "No description available."}
                                    </p>
                                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
                                        <span className="text-2xl font-black text-gray-900">
                                            €{product.price.toFixed(2)}
                                        </span>
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-200 transition-all active:scale-95 focus:ring-2 focus:ring-blue-500 focus:outline-none" onClick={() => addToCart(product.productId)}>
                                            Buy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No Products Found</h3>
                                <p className="text-gray-500">We couldn't find any products at the moment. Please check back later.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Products;