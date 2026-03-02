'use client';

import { FaInstagram, FaWhatsapp, FaTiktok, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Логотип и описание */}
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">NARXOZ COLLEGE</h2>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              © 2026 Экономический Колледж НАРХОЗ
            </p>
            <p className="text-gray-300 text-sm">
              Качественное образование для вашего будущего
            </p>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <div className="space-y-3 text-sm">
              <a href="tel:+77273132028" className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
                <FaPhone className="text-green-400" />
                +7 (727) 313-20-28 - Приемная
              </a>
              <a href="tel:+77068080002" className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
                <FaPhone className="text-green-400" />
                +7 (706) 808-00-02 - Приемная комиссия
              </a>
              <a href="tel:+77000270011" className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
                <FaPhone className="text-green-400" />
                +7 (700) 027-00-11 - Приемная комиссия
              </a>
              <a href="mailto:info@college-narxoz.kz" className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
                <FaEnvelope className="text-blue-400" />
                info@college-narxoz.kz
              </a>
              <div className="flex items-start gap-2 text-gray-200">
                <FaMapMarkerAlt className="text-red-400 mt-1 flex-shrink-0" />
                <a href="https://maps.app.goo.gl/hT4wcRHKf2scRc7QA" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  050035, г. Алматы, 10-й микрорайон 7А
                </a>
              </div>
              <a href="https://collegenarxoz.kz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
                🌐 collegenarxoz.kz
              </a>
            </div>
          </div>

          {/* Социальные сети */}
          <div>
            <h3 className="text-lg font-bold mb-4">Мы в соцсетях</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/narxozcollege/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                title="Instagram: narxozcollege"
              >
                <FaInstagram size={24} />
              </a>

              {/* Instagram Alumni */}
              <a
                href="https://www.instagram.com/narxozcollege_alumni/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                title="Instagram: narxozcollege_alumni"
              >
                <FaInstagram size={24} />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/77068080002"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                title="WhatsApp: +7 (706) 808-00-02"
              >
                <FaWhatsapp size={24} />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@narxozcollege"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                title="TikTok: @narxozcollege"
              >
                <FaTiktok size={24} />
              </a>
            </div>
            <p className="text-gray-300 text-xs">
              Следите за нашими новостями и обновлениями
            </p>
          </div>
        </div>

        {/* Нижняя линия */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300 text-sm">
          <p>Narxoz College - Экономический колледж НАРХОЗ</p>
        </div>
      </div>
    </footer>
  );
}
