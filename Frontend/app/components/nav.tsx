const nav = () => {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <h1>Velora</h1>
            <ul className="flex space-x-4">
                <li><a href="/" className="hover:text-gray-400">Home</a></li>
                <li><a href="/products" className="hover:text-gray-400">Products</a></li>
                <li><a href="/about" className="hover:text-gray-400">About us</a></li>
                <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
            </ul>
        </nav>
    )
}

export default nav;