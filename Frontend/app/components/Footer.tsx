import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
      <footer className="bg-[#2a3731] text-[#A5C0B5] py-12">
         <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
               <h3 className="text-3xl font-serif text-white mb-4">Velora<span className="text-[#68a49c]">.</span></h3>
               <p className="font-light text-sm">{t('footer.tagline')}</p>
            </div>
            <div>
               <h4 className="text-white font-semibold uppercase tracking-widest mb-4">{t('footer.shopCategories')}</h4>
               <ul className="space-y-2 text-sm font-light">
                  <li><Link to="/products?category=parfuem-duefte" className="hover:text-white transition-colors">{t('categories.parfuemDuefte')}</Link></li>
                  <li><Link to="/products?category=pflege-hygiene" className="hover:text-white transition-colors">{t('categories.pflegeHygiene')}</Link></li>
                  <li><Link to="/products?category=gesicht-haut" className="hover:text-white transition-colors">{t('categories.gesichtHaut')}</Link></li>
                  <li><Link to="/products?category=haushalt-reinigung" className="hover:text-white transition-colors">{t('categories.haushaltReinigung')}</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-semibold uppercase tracking-widest mb-4">{t('footer.legal')}</h4>
               <ul className="space-y-2 text-sm font-light">
                  <li><a href="#" className="hover:text-white transition-colors">{t('footer.impressum')}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t('footer.datenschutz')}</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">{t('footer.agb')}</a></li>
               </ul>
            </div>
         </div>
         <div className="container mx-auto px-6 mt-12 pt-8 border-t border-[#3E564C] text-center text-sm font-light">
            &copy; {new Date().getFullYear()} Velora. {t('footer.rightsReserved')}
         </div>
      </footer>
    );
};

export default Footer;
