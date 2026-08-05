import { useState } from "react";
import { useLocation, Link } from "react-router";
import { useCart } from "../context/CartContext";

const Nav = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();
  const totalItemCount = cart?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 0;

  const productCategories = [
    { name: 'Parfüm & Düfte', href: '/products?category=parfuem-duefte' },
    { name: 'Pflege & Hygiene', href: '/products?category=pflege-hygiene' },
    { name: 'Gesicht & Haut', href: '/products?category=gesicht-haut' },
    { name: 'Haar & Bart', href: '/products?category=haar-bart' },
    { name: 'Make-Up', href: '/products?category=make-up' },
    { name: 'Öle & Essenzen', href: '/products?category=oele-essenzen' },
    { name: 'Haushalt & Reinigung', href: '/products?category=haushalt-reinigung' },
    { name: 'Ernährung & Vitalität', href: '/products?category=ernaehrung-vitalitaet' },
  ];

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products', isDropdown: true },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const activeLink = navLinks.find(link => 
    link.href === location.pathname || (link.isDropdown && location.pathname === '/products')
  )?.name;

  return (
    <nav className="bg-[#f2f4f3] text-[#333e38] shadow-sm font-sans sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/">
              <h1 className="text-4xl font-serif text-[#3e564c]">
                Velora<span className="text-[#3e564c] ml-1">.</span>
              </h1>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-grow justify-center space-x-10">
            {navLinks.map((link) => (
              <div key={link.name} className={link.isDropdown ? "relative group/nav" : ""}>
                <a
                  href={link.href}
                  className={`text-sm tracking-widest uppercase relative pb-2 transition duration-300 flex items-center gap-1
                    ${activeLink === link.name
                      ? 'text-[#2a3731] font-medium after:absolute after:bottom-0 after:left-0 after:bg-[#68a49c] after:h-[2px] after:w-full'
                      : 'text-[#8c9490] hover:text-[#2a3731]'
                    }
                  `}
                >
                  {link.name}
                  {link.isDropdown && (
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/nav:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </a>
                
                {/* Desktop Dropdown for Products */}
                {link.isDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform z-50">
                    <div className="bg-white shadow-xl rounded-xl border border-[#e2e8e4] overflow-hidden flex flex-col py-2">
                      <Link to="/products" className="px-5 py-2.5 text-sm font-semibold tracking-wider text-[#2a3731] hover:bg-[#f2f4f3] uppercase border-b border-[#e2e8e4]">
                        Alle Produkte
                      </Link>
                      {productCategories.map((cat) => (
                        <Link 
                          key={cat.name} 
                          to={cat.href}
                          className="px-5 py-2.5 text-sm font-medium text-[#8c9490] hover:text-[#2a3731] hover:bg-[#f2f4f3] transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-6 text-[#2a3731]">
            <button aria-label="User Account">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>
            <div className="relative group/cart py-2 flex items-center">
              <Link to="/checkout" aria-label="Shopping Cart" className="relative block transition-transform group-hover/cart:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.119-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {/* Notification Badge */}
                {totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#68a49c] text-[10px] text-white font-bold shadow-sm">
                    {totalItemCount}
                  </span>
                )}
              </Link>

              {/* Cart Dropdown Hover Panel */}
              <div className="absolute right-0 top-full pt-4 w-80 opacity-0 invisible group-hover/cart:opacity-100 group-hover/cart:visible transition-all duration-300 transform origin-top-right z-50">
                <div className="bg-white shadow-xl rounded-xl border border-[#e2e8e4] overflow-hidden">
                  {cart?.length === 0 ? (
                    <div className="p-6 text-center text-[#8c9490] text-sm">
                      Your cart is empty.
                    </div>
                  ) : (
                    <div className="p-4 flex flex-col gap-4">
                      <div className="text-xs tracking-wider uppercase font-medium text-[#8c9490] border-b border-[#e2e8e4] pb-2">
                        Recently Added
                      </div>

                      <div className="space-y-3">
                        {cart?.slice(0, 3).map((item: any, index: number) => (
                          <div key={item.id || index} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#f2f4f3] rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <svg className="w-6 h-6 text-[#8c9490]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-[#2a3731] truncate">{item.name || "Unknown Product"}</div>
                              <div className="text-xs text-[#8c9490] font-medium">
                                {item.quantity > 1 ? `${item.quantity} × ` : ""}€{(item.price || 0).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {cart?.length > 3 && (
                        <div className="text-xs text-center text-[#8c9490] pt-1">
                          +{cart.length - 3} more items in cart
                        </div>
                      )}

                      <Link to="/checkout" className="w-full block bg-[#3e564c] text-white py-2.5 rounded hover:bg-[#2a3731] transition duration-300 text-sm font-medium tracking-wide uppercase text-center mt-1">
                        Go to Checkout
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#3e564c] hover:text-[#2a3731] focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden bg-white border-t border-[#e2e8e4] transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.isDropdown ? (
                <div>
                  <button
                    onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                    className={`w-full flex justify-between items-center text-sm tracking-widest uppercase transition duration-300 py-2
                      ${activeLink === link.name ? 'text-[#2a3731] font-medium' : 'text-[#8c9490] hover:text-[#2a3731]'}`}
                  >
                    <span>{link.name}</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`pl-4 overflow-hidden transition-all duration-300 ${isMobileProductsOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
                    <Link 
                      to="/products"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-sm text-[#2a3731] font-medium tracking-wide uppercase"
                    >
                      Alle Produkte
                    </Link>
                    {productCategories.map((cat) => (
                      <Link 
                        key={cat.name} 
                        to={cat.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-sm text-[#8c9490] hover:text-[#2a3731] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-sm tracking-widest uppercase transition duration-300 py-2
                    ${activeLink === link.name
                      ? 'text-[#2a3731] font-medium'
                      : 'text-[#8c9490] hover:text-[#2a3731]'
                    }
                  `}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile Icons */}
          <div className="flex items-center space-x-6 pt-4 mt-2 border-t border-[#e2e8e4] text-[#2a3731]">
            <a href="/signin" aria-label="User Account" className="hover:text-[#68a49c] transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </a>
            <Link to="/checkout" aria-label="Shopping Cart" className="relative group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-transform group-hover:scale-110">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.119-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#68a49c] text-[10px] text-white font-bold shadow-sm">
                  {totalItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav;