import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Nav from "../components/Nav";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const res = await axios.post(
                "/api/User/login",
                { email, pw: password },
                { withCredentials: true }
            );
            login({
                userId: res.data.userId,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                isAdmin: res.data.isAdmin,
            });
            navigate("/");
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data || "Anmeldung fehlgeschlagen.";
            setError(typeof msg === "string" ? msg : "Anmeldung fehlgeschlagen.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f2f4f3] font-sans flex flex-col">
            <Nav />
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#e2e8e4] p-6 sm:p-8 md:p-10 transform transition-all">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif text-[#3e564c] mb-2">Welcome Back</h1>
                        <p className="text-[#8c9490]">Enter your credentials to access your account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-[#3e564c] mb-1.5 ml-1" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#fbfcfb] text-[#2a3731] border-[#e2e8e4] rounded-xl shadow-sm focus:ring-2 focus:ring-[#68a49c] focus:border-transparent px-4 py-3 border outline-none transition-all duration-200"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="text-sm font-medium text-[#3e564c]" htmlFor="password">
                                    Password
                                </label>
                                <a href="#" className="text-xs text-[#68a49c] hover:text-[#3e564c] transition-colors">Forgot Password?</a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#fbfcfb] text-[#2a3731] border-[#e2e8e4] rounded-xl shadow-sm focus:ring-2 focus:ring-[#68a49c] focus:border-transparent px-4 py-3 border outline-none transition-all duration-200"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between ml-1 py-1">
                            <label htmlFor="remember-me" className="text-sm font-medium text-[#3e564c] cursor-pointer select-none">
                                Remember me
                            </label>
                            <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out cursor-pointer">
                                <input 
                                    id="remember-me" 
                                    type="checkbox" 
                                    className="peer opacity-0 w-0 h-0" 
                                />
                                <label 
                                    htmlFor="remember-me" 
                                    className="absolute inset-0 bg-[#e2e8e4] rounded-full cursor-pointer transition-colors duration-300 peer-checked:bg-[#68a49c] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 peer-checked:after:translate-x-5 shadow-inner"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#3e564c] text-white py-3.5 rounded-xl hover:bg-[#2a3731] disabled:opacity-50 transform active:scale-[0.98] transition-all duration-200 font-medium tracking-wide uppercase text-sm shadow-md"
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#e2e8e4] text-center">
                        <p className="text-[#8c9490] text-sm md:text-base">
                            Don't have an account?{" "}
                            <a href="/signup" className="text-[#68a49c] font-semibold hover:text-[#3e564c] underline decoration-2 underline-offset-4 transition-colors">
                                Create Account
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
