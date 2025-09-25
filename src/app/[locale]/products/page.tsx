'use client'

import {
  BuildingOfficeIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'
import { SiteHeader } from '@/components/SiteHeader'

export default function ProductsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white">
      {/* Site Header */}
      <SiteHeader />

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            {t('products.title') || 'Продукти та Послуги'}
          </h1>
          <p className="text-xl text-center text-yellow-100 max-w-4xl mx-auto">
            {t('products.subtitle') || 'АТ «БАНК АВАНГАРД» пропонує широкий спектр банківських продуктів і послуг, зосереджуючи свою основну діяльність на:'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Services */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <CurrencyDollarIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t('products.currencyMarket') || 'валютному ринку'}
            </h3>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <ChartBarIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t('products.moneyMarket') || 'грошовому ринку'}
            </h3>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <DocumentTextIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t('products.debtMarket') || 'ринку боргових цінних паперів'}
            </h3>
          </div>
        </div>

        {/* Corporate Clients Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <BuildingOfficeIcon className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              {t('products.corporateTitle') || 'Для корпоративних клієнтів'}
            </h2>
          </div>
          <p className="text-gray-700 text-lg mb-8">
            {t('products.corporateDescription') || 'Банк спеціалізується на обслуговуванні юридичних осіб, зокрема експортерів та імпортерів, які здійснюють зовнішньоекономічні операції.'}
          </p>

          {/* FX Forward Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <ShieldCheckIcon className="w-6 h-6 text-blue-600 mr-2" />
              {t('products.fxForwardTitle') || 'Сучасні інструменти хеджування валютних ризиків (FX FW)'}
            </h3>
            <p className="text-gray-700 mb-4">
              {t('products.fxForwardDescription') || 'Форвардний контракт — це угода між Клієнтом та Банком про обов\'язковий обмін валюти у майбутньому за фіксованим курсом. Доступні валюти: USD, EUR, UAH.'}
            </p>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              {t('products.fxForwardBenefitsTitle') || 'Переваги форвардних угод:'}
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {t('products.fxForwardBenefit1') || 'Зниження валютних ризиків у нестабільних ринкових умовах'}
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {t('products.fxForwardBenefit2') || 'Прогнозованість грошових потоків'}
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {t('products.fxForwardBenefit3') || 'Гарантований курс для купівлі валюти незалежно від ринкових коливань'}
              </li>
            </ul>
          </div>
        </div>

        {/* Private Clients Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <UserIcon className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              {t('products.privateTitle') || 'Для приватних клієнтів'}
            </h2>
          </div>
          <p className="text-gray-700 text-lg mb-6">
            {t('products.privateDescription') || 'АТ «БАНК АВАНГАРД» обслуговує фізичних осіб виключно через мобільний застосунок ICU Bank, забезпечуючи:'}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <DevicePhoneMobileIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <p className="text-gray-700">
                {t('products.privateFeature1') || 'зручний перегляд рахунків'}
              </p>
            </div>
            <div className="text-center">
              <CurrencyDollarIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <p className="text-gray-700">
                {t('products.privateFeature2') || 'перекази, платежі та обмін валют'}
              </p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <p className="text-gray-700">
                {t('products.privateFeature3') || 'сучасні банківські продукти з прозорими умовами'}
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions Section */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('products.termsTitle') || 'Типові умови та договори'}
          </h2>
          <p className="text-gray-700 text-lg">
            {t('products.termsDescription') || 'Усі банківські послуги регламентуються публічними договорами та типовими умовами обслуговування, які доступні для ознайомлення на офіційному сайті банку.'}
          </p>
        </div>

        {/* Working Hours Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <ClockIcon className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">
              {t('products.scheduleTitle') || 'Графік роботи'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="font-semibold mr-2">
                    {t('products.workingDays') || 'Понеділок – п\'ятниця:'}
                  </span>
                  <span>{t('products.workingHours') || '09:00 – 18:00'}</span>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold mr-2">
                    {t('products.lunchBreak') || 'Обідня перерва:'}
                  </span>
                  <span>{t('products.lunchHours') || '13:00 – 14:00'}</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">
                  {t('products.branchesNote') || 'Відділення, банкомати чи фізичні офіси – відсутні'}
                </span>
              </p>
              <p className="text-gray-600 mt-2">
                {t('products.digitalNote') || 'Банк працює виключно дистанційно, використовуючи цифрові канали обслуговування.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
