import { useTranslation } from "react-i18next";
import Nav from "../components/Nav";

const SignUp = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-[#f2f4f3] font-sans flex flex-col">
            <Nav />
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-10 sm:py-12">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#e2e8e4] p-6 sm:p-8 md:p-10 transform transition-all">
                    <div className="text-center mb-8 sm:mb-10">
                        <h1 className="text-3xl font-serif text-[#3e564c] mb-2">{t('signup.title')}</h1>
                        <p className="text-[#8c9490]">{t('signup.subtitle')}</p>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#3e564c] mb-1.5 ml-1" htmlFor="first-name">
                                    {t('signup.firstName')}
                                </label>
                                <input
                                    id="first-name"
                                    type="text"
                                    required
                                    className="w-full border-[#e2e8e4] rounded-xl shadow-sm focus:ring-2 focus:ring-[#68a49c] focus:border-transparent px-4 py-3 border outline-none transition-all duration-200 bg-[#fbfcfb]"
                                    placeholder="Jane"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#3e564c] mb-1.5 ml-1" htmlFor="last-name">
                                    {t('signup.lastName')}
                                </label>
                                <input
                                    id="last-name"
                                    type="text"
                                    required
                                    className="w-full border-[#e2e8e4] rounded-xl shadow-sm focus:ring-2 focus:ring-[#68a49c] focus:border-transparent px-4 py-3 border outline-none transition-all duration-200 bg-[#fbfcfb]"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#3e564c] mb-1.5 ml-1" htmlFor="email">
                                {t('signup.email')}
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full border-[#e2e8e4] rounded-xl shadow-sm focus:ring-2 focus:ring-[#68a49c] focus:border-transparent px-4 py-3 border outline-none transition-all duration-200 bg-[#fbfcfb]"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#3e564c] mb-1.5 ml-1" htmlFor="password">
                                {t('signup.password')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full border-[#e2e8e4] rounded-xl shadow-sm focus:ring-2 focus:ring-[#68a49c] focus:border-transparent px-4 py-3 border outline-none transition-all duration-200 bg-[#fbfcfb]"
                                placeholder="••••••••"
                            />
                            <p className="mt-1.5 text-[10px] text-[#8c9490] ml-1">{t('signup.passwordHint')}</p>
                        </div>

                        <div className="flex items-start ml-1">
                            <input id="terms" type="checkbox" required className="mt-1 h-4 w-4 text-[#68a49c] focus:ring-[#68a49c] border-[#e2e8e4] rounded" />
                            <label htmlFor="terms" className="ml-2 block text-xs text-[#8c9490] leading-relaxed">
                                {t('signup.termsPrefix')} <a href="#" className="text-[#68a49c] hover:underline">{t('signup.termsOfService')}</a> {t('signup.and')} <a href="#" className="text-[#68a49c] hover:underline">{t('signup.privacyPolicy')}</a>{t('signup.termsSuffix') ? ` ${t('signup.termsSuffix')}` : ''}
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#3e564c] text-white py-3.5 rounded-xl hover:bg-[#2a3731] transform active:scale-[0.98] transition-all duration-200 font-medium tracking-wide uppercase text-sm shadow-md mt-2"
                        >
                            {t('signup.createAccount')}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#e2e8e4] text-center">
                        <p className="text-[#8c9490] text-sm md:text-base">
                            {t('signup.alreadyHaveAccount')}{" "}
                            <a href="/signin" className="text-[#68a49c] font-semibold hover:text-[#3e564c] underline decoration-2 underline-offset-4 transition-colors">
                                {t('signup.signIn')}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
