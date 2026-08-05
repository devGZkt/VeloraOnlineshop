import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';

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

const CATEGORIES: Record<number, string> = {
    1: "Parfüm & Düfte",
    2: "Pflege & Hygiene",
    3: "Gesicht & Haut",
    4: "Haar & Bart",
    5: "Make-Up",
    6: "Öle & Essenzen",
    7: "Haushalt & Reinigung",
    8: "Ernährung & Vitalität"
};

const Admin = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Product>>({});
    const [activeTab, setActiveTab] = useState('products');
    
    // New States
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | 'ALL'>('ALL');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
        categoryId: 1,
        name: '',
        shortDescription: '',
        price: 0,
        isVisible: true
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5142/api/Products");
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError("Fehler beim Laden der Produkte.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (product: Product) => {
        setEditingId(product.productId);
        setEditForm(product);
        setIsAddingNew(false);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = async (id: number) => {
        try {
            // Update local state optimistic UI
            setProducts(products.map(p => p.productId === id ? { ...p, ...editForm } as Product : p));
            setEditingId(null);
            
            // Note: In a real app we'd make a PUT request to the backend.
            // await axios.put(`http://localhost:5142/api/Products/${id}`, editForm);
        } catch (err) {
            console.error("Fehler beim Speichern:", err);
            alert("Fehler beim Speichern der Änderungen.");
            fetchProducts(); // Revert on error
        }
    };

    const handleCreateNewProduct = async () => {
        try {
            if (!newProductForm.name) {
                alert("Bitte einen Titel eingeben.");
                return;
            }

            // Generate a fake ID for UI purposes since there's no working backend POST yet
            const fakeId = Math.max(0, ...products.map(p => p.productId)) + 1;
            const newProduct = {
                ...newProductForm,
                productId: fakeId
            } as Product;

            // Optimistic UI insert
            setProducts([newProduct, ...products]);
            setIsAddingNew(false);
            setNewProductForm({
                categoryId: 1,
                name: '',
                shortDescription: '',
                price: 0,
                isVisible: true
            });

            // Make POST request to backend
            // await axios.post("http://localhost:5142/api/Products", newProductForm);
        } catch (err) {
            console.error("Fehler beim Anlegen:", err);
            alert("Fehler beim Erstellen des neuen Produkts.");
        }
    };

    const displayedProducts = useMemo(() => {
        if (selectedCategoryFilter === 'ALL') {
            return products;
        }
        return products.filter(p => p.categoryId === selectedCategoryFilter);
    }, [products, selectedCategoryFilter]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Nav />
            
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:block">
                    <div className="p-6">
                        <h2 className="text-xl font-serif font-bold text-[#2a3731] mb-6">Velora Admin</h2>
                        <nav className="space-y-2">
                            <button 
                                onClick={() => setActiveTab('products')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-[#68a49c] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                Produkte
                            </button>
                            <button 
                                onClick={() => setActiveTab('categories')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-[#68a49c] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                Kategorien
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {activeTab === 'products' ? 'Produkte Verwalten' : 'Kategorien Verwalten'}
                                </h1>
                                
                                {activeTab === 'products' && (
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm font-medium text-gray-600">Filter:</label>
                                        <select 
                                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-[#68a49c] focus:border-[#68a49c] block px-3 py-2 shadow-sm outline-none"
                                            value={selectedCategoryFilter}
                                            onChange={(e) => setSelectedCategoryFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                                        >
                                            <option value="ALL">Alle Kategorien</option>
                                            {Object.entries(CATEGORIES).map(([id, name]) => (
                                                <option key={id} value={id}>{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {activeTab === 'products' && (
                                <button 
                                    onClick={() => {
                                        setIsAddingNew(!isAddingNew);
                                        setEditingId(null);
                                    }}
                                    className="bg-[#2a3731] hover:bg-[#1f2924] text-white px-5 py-2.5 rounded-lg shadow-sm text-sm font-medium transition-transform active:scale-95 flex items-center gap-2"
                                >
                                    {isAddingNew ? (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            Abbrechen
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            Neues Produkt
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <>
                                {isAddingNew && (
                                    <div className="bg-white rounded-xl shadow-lg border border-[#e2e8e4] p-6 mb-8 transform transition-all duration-300 animate-fade-in-up">
                                        <h3 className="text-xl font-serif text-[#2a3731] mb-5 border-b pb-3">Neues Produkt anlegen</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="z.B. Aqua de Parfum"
                                                        className="w-full text-smborder border-gray-300 rounded px-3 py-2.5 focus:ring-2 focus:ring-[#68a49c] focus:border-transparent outline-none"
                                                        value={newProductForm.name}
                                                        onChange={(e) => setNewProductForm({...newProductForm, name: e.target.value})}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
                                                    <select 
                                                        className="w-full text-sm border border-gray-300 rounded px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#68a49c]"
                                                        value={newProductForm.categoryId}
                                                        onChange={(e) => setNewProductForm({...newProductForm, categoryId: parseInt(e.target.value)})}
                                                    >
                                                        {Object.entries(CATEGORIES).map(([id, name]) => (
                                                            <option key={id} value={id}>{name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-6 pt-2">
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preis (€)</label>
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#68a49c] focus:border-transparent outline-none"
                                                            value={newProductForm.price}
                                                            onChange={(e) => setNewProductForm({...newProductForm, price: parseFloat(e.target.value)})}
                                                        />
                                                    </div>
                                                    <div className="flex-1 pt-6 text-center">
                                                        <label className="inline-flex items-center cursor-pointer">
                                                            <span className="mr-3 text-sm font-medium text-gray-700">{newProductForm.isVisible ? 'Sichtbar (Aktiv)' : 'Versteckt (Inaktiv)'}</span>
                                                            <input 
                                                                type="checkbox" 
                                                                className="sr-only peer" 
                                                                checked={newProductForm.isVisible}
                                                                onChange={(e) => setNewProductForm({...newProductForm, isVisible: e.target.checked})}
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#68a49c]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#68a49c]"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Kurzbeschreibung</label>
                                                <textarea 
                                                    className="w-full text-sm text-gray-700 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#68a49c] focus:border-transparent outline-none resize-none h-[180px]"
                                                    placeholder="Beschreibungstext für das Produkt..."
                                                    value={newProductForm.shortDescription}
                                                    onChange={(e) => setNewProductForm({...newProductForm, shortDescription: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <button 
                                                onClick={handleCreateNewProduct}
                                                className="bg-[#68a49c] hover:bg-[#528a83] text-white px-8 py-2.5 rounded shadow text-sm font-medium transition-transform active:scale-95"
                                            >
                                                Produkt Speichern
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                                                    <th className="px-6 py-4">ID</th>
                                                    <th className="px-6 py-4">Titel & Kategorie</th>
                                                    <th className="px-6 py-4">Beschreibung</th>
                                                    <th className="px-6 py-4">Preis (€)</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4 text-right">Aktionen</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#68a49c] mx-auto mb-4"></div>
                                                            Lade Produkte...
                                                        </td>
                                                    </tr>
                                                ) : displayedProducts.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                            Keine Produkte in der ausgewählten Kategorie gefunden.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    displayedProducts.map((product) => {
                                                        const isEditing = editingId === product.productId;
                                                        
                                                        return (
                                                            <tr key={product.productId} className="hover:bg-gray-50/50 transition-colors">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    #{product.productId}
                                                                </td>
                                                                
                                                                <td className="px-6 py-4">
                                                                    {isEditing ? (
                                                                        <div className="space-y-2">
                                                                            <input 
                                                                                type="text" 
                                                                                className="w-full text-sm font-medium text-gray-900 border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-[#68a49c] focus:border-transparent outline-none"
                                                                                value={editForm.name || ''}
                                                                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                                            />
                                                                            <select 
                                                                                className="w-full text-xs text-gray-500 border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#68a49c]"
                                                                                value={editForm.categoryId || 1}
                                                                                onChange={(e) => setEditForm({...editForm, categoryId: parseInt(e.target.value)})}
                                                                            >
                                                                                {Object.entries(CATEGORIES).map(([id, name]) => (
                                                                                    <option key={id} value={id}>{name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                                            <div className="text-xs text-gray-500 mt-1">{CATEGORIES[product.categoryId] || 'Unbekannt'}</div>
                                                                        </div>
                                                                    )}
                                                                </td>

                                                                <td className="px-6 py-4">
                                                                    {isEditing ? (
                                                                        <textarea 
                                                                            className="w-full text-sm text-gray-700 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#68a49c] focus:border-transparent outline-none resize-y min-h-[60px]"
                                                                            value={editForm.shortDescription || ''}
                                                                            onChange={(e) => setEditForm({...editForm, shortDescription: e.target.value})}
                                                                        />
                                                                    ) : (
                                                                        <div className="text-sm text-gray-600 max-w-xs line-clamp-2" title={product.shortDescription}>
                                                                            {product.shortDescription || '-'}
                                                                        </div>
                                                                    )}
                                                                </td>

                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    {isEditing ? (
                                                                        <div className="relative">
                                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">€</span>
                                                                            <input 
                                                                                type="number" 
                                                                                step="0.01"
                                                                                className="w-24 pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#68a49c] focus:border-transparent outline-none"
                                                                                value={editForm.price || 0}
                                                                                onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-sm font-medium text-gray-900">
                                                                            €{product.price.toFixed(2)}
                                                                        </span>
                                                                    )}
                                                                </td>

                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    {isEditing ? (
                                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                                            <input 
                                                                                type="checkbox" 
                                                                                className="sr-only peer" 
                                                                                checked={editForm.isVisible}
                                                                                onChange={(e) => setEditForm({...editForm, isVisible: e.target.checked})}
                                                                            />
                                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#68a49c]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#68a49c]"></div>
                                                                        </label>
                                                                    ) : (
                                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                            {product.isVisible ? 'Aktiv' : 'Inaktiv'}
                                                                        </span>
                                                                    )}
                                                                </td>

                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    {isEditing ? (
                                                                        <div className="flex justify-end gap-2">
                                                                            <button 
                                                                                onClick={() => handleSave(product.productId)}
                                                                                className="text-white bg-[#68a49c] hover:bg-[#528a83] p-1.5 rounded"
                                                                                title="Speichern"
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                            </button>
                                                                            <button 
                                                                                onClick={handleCancelEdit}
                                                                                className="text-gray-600 bg-gray-100 hover:bg-gray-200 p-1.5 rounded"
                                                                                title="Abbrechen"
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <button 
                                                                            onClick={() => handleEditClick(product)}
                                                                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 ml-auto"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                                            Bearbeiten
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'categories' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Kategorien Verwalten</h3>
                                <p className="mb-4">Die Kategorie-Verwaltung befindet sich in Entwicklung.</p>
                                <button className="mx-auto bg-[#2a3731] hover:bg-[#1f2924] text-white px-4 py-2 rounded shadow-sm text-sm font-medium transition-transform active:scale-95">
                                    Neue Kategorie anlegen
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            {/* CSS for custom animations */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
                }
                .animate-fade-in-up {
                animation: fadeInUp 0.4s ease-out forwards;
                }
            `}} />
        </div>
    );
};

export default Admin;
