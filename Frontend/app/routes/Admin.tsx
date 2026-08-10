import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Nav from '../components/Nav';
import { useAuth } from '../context/AuthContext';

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
    displayOrder: number;
}

interface Subcategory {
    subcategoryId: number;
    slug?: string;
    description?: string;
}

interface Category {
    categoryId: number;
    slug?: string;
    description?: string;
    subcategories: Subcategory[];
}

const emptyProductForm: Partial<Product> = {
    name: '',
    shortDescription: '',
    price: 0,
    isVisible: true,
    displayOrder: 0,
};

const categoryLabel = (c: { description?: string; slug?: string; categoryId?: number; subcategoryId?: number }) =>
    c.description || c.slug || `#${c.categoryId ?? c.subcategoryId}`;

const Admin = () => {
    const { t } = useTranslation();
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Product>>({});
    const [activeTab, setActiveTab] = useState('products');

    // New States
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | 'ALL'>('ALL');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newProductForm, setNewProductForm] = useState<Partial<Product>>(emptyProductForm);

    useEffect(() => {
        if (authLoading) return;
        if (!user || !user.isAdmin) {
            navigate('/', { replace: true });
        }
    }, [authLoading, user, navigate]);

    useEffect(() => {
        if (authLoading || !user?.isAdmin) return;
        fetchProducts();
        fetchCategories();
    }, [authLoading, user]);

    const subcategories = useMemo(
        () => categories.flatMap(c => c.subcategories.map(s => ({ ...s, categoryLabel: categoryLabel(c) }))),
        [categories]
    );

    const subcategoryToCategory = useMemo(() => {
        const map = new Map<number, number>();
        categories.forEach(c => c.subcategories.forEach(s => map.set(s.subcategoryId, c.categoryId)));
        return map;
    }, [categories]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/Products");
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError(t('admin.errorLoadProducts'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/Category");
            setCategories(response.data);
        } catch (err) {
            console.error("Failed to load categories:", err);
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
        if (!editForm.subcategoryId) {
            alert(t('admin.errorSelectSubcategory'));
            return;
        }

        try {
            const response = await axios.put(`/api/Products/${id}`, editForm, { withCredentials: true });
            setProducts(products.map(p => p.productId === id ? response.data : p));
            setEditingId(null);
            setEditForm({});
        } catch (err) {
            console.error("Failed to save:", err);
            alert(t('admin.errorSave'));
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t('admin.deleteConfirm'))) return;

        try {
            await axios.delete(`/api/Products/${id}`, { withCredentials: true });
            setProducts(products.filter(p => p.productId !== id));
        } catch (err) {
            console.error("Failed to delete:", err);
            alert(t('admin.errorDelete'));
        }
    };

    const handleCreateNewProduct = async () => {
        if (!newProductForm.name) {
            alert(t('admin.errorEnterTitle'));
            return;
        }

        if (!newProductForm.subcategoryId) {
            alert(t('admin.errorSelectSubcategory'));
            return;
        }

        try {
            const response = await axios.post("/api/Products/create-product", newProductForm, { withCredentials: true });
            setProducts([response.data, ...products]);
            setIsAddingNew(false);
            setNewProductForm(emptyProductForm);
        } catch (err) {
            console.error("Failed to create:", err);
            alert(t('admin.errorCreate'));
        }
    };

    const displayedProducts = useMemo(() => {
        if (selectedCategoryFilter === 'ALL') {
            return products;
        }
        return products.filter(p => subcategoryToCategory.get(p.subcategoryId) === selectedCategoryFilter);
    }, [products, selectedCategoryFilter, subcategoryToCategory]);

    if (authLoading || !user?.isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <Nav />
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    {authLoading ? t('admin.loading') : t('admin.accessDenied')}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Nav />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:block">
                    <div className="p-6">
                        <h2 className="text-xl font-serif font-bold text-[#2a3731] mb-6">{t('admin.title')}</h2>
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-[#68a49c] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                {t('admin.products')}
                            </button>
                            <button
                                onClick={() => setActiveTab('categories')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-[#68a49c] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                {t('admin.categories')}
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
                                    {activeTab === 'products' ? t('admin.manageProducts') : t('admin.manageCategories')}
                                </h1>

                                {activeTab === 'products' && (
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm font-medium text-gray-600">{t('admin.filter')}</label>
                                        <select
                                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-[#68a49c] focus:border-[#68a49c] block px-3 py-2 shadow-sm outline-none"
                                            value={selectedCategoryFilter}
                                            onChange={(e) => setSelectedCategoryFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                                        >
                                            <option value="ALL">{t('admin.allCategories')}</option>
                                            {categories.map((c) => (
                                                <option key={c.categoryId} value={c.categoryId}>{categoryLabel(c)}</option>
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
                                            {t('admin.cancel')}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            {t('admin.newProduct')}
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
                                        <h3 className="text-xl font-serif text-[#2a3731] mb-5 border-b pb-3">{t('admin.createNewProduct')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.titleField')}</label>
                                                    <input
                                                        type="text"
                                                        placeholder={t('admin.titlePlaceholder')}
                                                        className="w-full text-smborder border-gray-300 rounded px-3 py-2.5 focus:ring-2 focus:ring-[#68a49c] focus:border-transparent outline-none"
                                                        value={newProductForm.name}
                                                        onChange={(e) => setNewProductForm({...newProductForm, name: e.target.value})}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.subcategory')}</label>
                                                    <select
                                                        className="w-full text-sm border border-gray-300 rounded px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#68a49c]"
                                                        value={newProductForm.subcategoryId ?? ''}
                                                        onChange={(e) => setNewProductForm({...newProductForm, subcategoryId: parseInt(e.target.value)})}
                                                    >
                                                        <option value="" disabled>{t('admin.pleaseSelect')}</option>
                                                        {categories.map((c) => (
                                                            <optgroup key={c.categoryId} label={categoryLabel(c)}>
                                                                {c.subcategories.map((s) => (
                                                                    <option key={s.subcategoryId} value={s.subcategoryId}>{categoryLabel(s)}</option>
                                                                ))}
                                                            </optgroup>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-6 pt-2">
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.price')}</label>
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
                                                            <span className="mr-3 text-sm font-medium text-gray-700">{newProductForm.isVisible ? t('admin.visibleActive') : t('admin.hiddenInactive')}</span>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.shortDescription')}</label>
                                                <textarea
                                                    className="w-full text-sm text-gray-700 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#68a49c] focus:border-transparent outline-none resize-none h-[180px]"
                                                    placeholder={t('admin.shortDescriptionPlaceholder')}
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
                                                {t('admin.saveProduct')}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                                                    <th className="px-6 py-4">{t('admin.id')}</th>
                                                    <th className="px-6 py-4">{t('admin.titleAndCategory')}</th>
                                                    <th className="px-6 py-4">{t('admin.description')}</th>
                                                    <th className="px-6 py-4">{t('admin.priceColumn')}</th>
                                                    <th className="px-6 py-4">{t('admin.status')}</th>
                                                    <th className="px-6 py-4 text-right">{t('admin.actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#68a49c] mx-auto mb-4"></div>
                                                            {t('admin.loadingProducts')}
                                                        </td>
                                                    </tr>
                                                ) : displayedProducts.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                            {t('admin.noProductsInCategory')}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    displayedProducts.map((product) => {
                                                        const isEditing = editingId === product.productId;
                                                        const subcategory = subcategories.find(s => s.subcategoryId === product.subcategoryId);

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
                                                                                value={editForm.subcategoryId ?? ''}
                                                                                onChange={(e) => setEditForm({...editForm, subcategoryId: parseInt(e.target.value)})}
                                                                            >
                                                                                <option value="" disabled>{t('admin.pleaseSelect')}</option>
                                                                                {categories.map((c) => (
                                                                                    <optgroup key={c.categoryId} label={categoryLabel(c)}>
                                                                                        {c.subcategories.map((s) => (
                                                                                            <option key={s.subcategoryId} value={s.subcategoryId}>{categoryLabel(s)}</option>
                                                                                        ))}
                                                                                    </optgroup>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                                            <div className="text-xs text-gray-500 mt-1">{subcategory ? categoryLabel(subcategory) : t('admin.unknown')}</div>
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
                                                                            {product.isVisible ? t('admin.active') : t('admin.inactive')}
                                                                        </span>
                                                                    )}
                                                                </td>

                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    {isEditing ? (
                                                                        <div className="flex justify-end gap-2">
                                                                            <button
                                                                                onClick={() => handleSave(product.productId)}
                                                                                className="text-white bg-[#68a49c] hover:bg-[#528a83] p-1.5 rounded"
                                                                                title={t('admin.save')}
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                            </button>
                                                                            <button
                                                                                onClick={handleCancelEdit}
                                                                                className="text-gray-600 bg-gray-100 hover:bg-gray-200 p-1.5 rounded"
                                                                                title={t('admin.cancel')}
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex justify-end gap-3">
                                                                            <button
                                                                                onClick={() => handleEditClick(product)}
                                                                                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                                                {t('admin.edit')}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDelete(product.productId)}
                                                                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                                {t('admin.delete')}
                                                                            </button>
                                                                        </div>
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
                                <h3 className="text-lg font-medium text-gray-900 mb-1">{t('admin.manageCategories')}</h3>
                                <p className="mb-4">{t('admin.categoriesInDevelopment')}</p>
                                <button className="mx-auto bg-[#2a3731] hover:bg-[#1f2924] text-white px-4 py-2 rounded shadow-sm text-sm font-medium transition-transform active:scale-95">
                                    {t('admin.newCategory')}
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
