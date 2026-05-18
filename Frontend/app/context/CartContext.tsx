import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

//
export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<any[]>(() => {
        if (typeof window !== "undefined") {
            const storedCart = localStorage.getItem("velora-cart");
            if (storedCart) return JSON.parse(storedCart);
            
            // Default mock data for presentation
            return [
                { id: "1", name: "Velora Signature Blend", price: 24.99, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=2670&auto=format&fit=crop" },
                { id: "2", name: "Artisanal Ceramic Mug", price: 18.50, image: "https://images.unsplash.com/photo-1514228742587-6b1558fbed20?q=80&w=2670&auto=format&fit=crop" },
                { id: "3", name: "Premium Coffee Grinder", price: 85.00, image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f505?q=80&w=2670&auto=format&fit=crop" },
                { id: "4", name: "Organic Tea Leaves", price: 12.00, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=2670&auto=format&fit=crop" }
            ];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("velora-cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        setCart((prev: any[]) => [...prev, product]);
    }

    const removeFromCart = (productId: string) => {
        setCart((prev: any[]) => prev.filter(item => item.id !== productId));
    }

    const clearCart = () => {
        setCart([]);
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);