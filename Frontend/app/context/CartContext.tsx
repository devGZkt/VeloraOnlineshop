import { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    id: string | number;
    productId?: number;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    shortDescription?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: string | number) => void;
    updateQuantity: (productId: string | number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    // Starts empty on both server and the client's first render so hydration
    // always matches; the real cart is loaded from localStorage right after
    // mount instead of during the initial render (which previously produced
    // a client-only cart badge and a hydration mismatch).
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const storedCart = localStorage.getItem("velora-cart");
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse stored cart", e);
            }
        }
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem("velora-cart", JSON.stringify(cart));
        }
    }, [cart, isHydrated]);

    const addToCart = (product: any) => {
        const id = product.id ?? product.productId;
        if (id === undefined || id === null) return;

        setCart((prev: CartItem[]) => {
            const existingIndex = prev.findIndex(
                (item) => String(item.id ?? item.productId) === String(id)
            );
            if (existingIndex > -1) {
                const updated = [...prev];
                const item = updated[existingIndex];
                updated[existingIndex] = {
                    ...item,
                    quantity: (item.quantity || 1) + 1,
                };
                return updated;
            }
            return [
                ...prev,
                {
                    id: id,
                    productId: product.productId || (typeof id === "number" ? id : parseInt(id, 10) || 0),
                    name: product.name || "Product",
                    price: product.price || 0,
                    image: product.image,
                    quantity: product.quantity || 1,
                    shortDescription: product.shortDescription,
                },
            ];
        });
    };

    const updateQuantity = (productId: string | number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev: CartItem[]) =>
            prev.map((item) =>
                String(item.id ?? item.productId) === String(productId)
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const removeFromCart = (productId: string | number) => {
        setCart((prev: CartItem[]) =>
            prev.filter((item) => String(item.id ?? item.productId) !== String(productId))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        return {
            cart: [],
            addToCart: () => {},
            removeFromCart: () => {},
            updateQuantity: () => {},
            clearCart: () => {},
        };
    }
    return context;
};