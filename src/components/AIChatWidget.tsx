'use client'

import React, { useState } from 'react'
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'

export function AIChatWidget() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = () => {
    if (!isOpen) {
      setIsLoading(true)
      // Simulate loading delay
      setTimeout(() => {
        setIsLoading(false)
        setIsOpen(true)
      }, 800)
    } else {
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggle}
          className={`
            relative group flex items-center justify-center w-14 h-14 
            bg-gradient-to-r from-yellow-400 to-yellow-500 
            hover:from-yellow-500 hover:to-yellow-600 
            text-white rounded-full shadow-lg hover:shadow-xl 
            transition-all duration-300 transform hover:scale-110
            focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50
            ${isOpen ? 'rotate-0' : 'rotate-0 hover:rotate-12'}
          `}
          aria-label={t('chat.aiChat') || 'AI Chat'}
          aria-expanded={isOpen}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin">
              <SparklesIcon className="w-6 h-6" />
            </div>
          ) : isOpen ? (
            <XMarkIcon className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <ChatBubbleLeftRightIcon className="w-6 h-6 transition-transform duration-200" />
          )}
          
          {/* Pulse animation when closed */}
          {!isOpen && !isLoading && (
            <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-20"></div>
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {t('chat.aiChat') || 'AI Chat'}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] sm:w-96">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {t('chat.aiAssistant') || 'AI Assistant'}
                  </h3>
                  <p className="text-yellow-100 text-xs">
                    {t('chat.avangardSupport') || 'Avangard Bank Support'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors duration-200 p-1"
                aria-label={t('common.close') || 'Close'}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="h-80 flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Welcome Message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                    <p className="text-gray-800 text-sm">
                      {t('chat.welcomeMessage') || 'Вітаю! Я AI-асистент Авангард Банку. Як можу допомогти?'}
                    </p>
                  </div>
                </div>

                {/* Coming Soon Message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                    <p className="text-blue-800 text-sm font-medium mb-1">
                      {t('chat.comingSoon') || 'Незабаром!'}
                    </p>
                    <p className="text-blue-700 text-xs">
                      {t('chat.comingSoonMessage') || 'AI-чат знаходиться в розробці. Скоро ви зможете отримувати миттєві відповіді на ваші питання про банківські послуги.'}
                    </p>
                  </div>
                </div>

                {/* Feature Preview */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="text-yellow-800 font-medium text-sm mb-2">
                    {t('chat.futureFeatures') || 'Майбутні можливості:'}
                  </h4>
                  <ul className="text-yellow-700 text-xs space-y-1">
                    <li>• {t('chat.feature1') || 'Миттєві відповіді на питання'}</li>
                    <li>• {t('chat.feature2') || 'Допомога з банківскими послугами'}</li>
                    <li>• {t('chat.feature3') || 'Розрахунок кредитів та депозитів'}</li>
                    <li>• {t('chat.feature4') || 'Підтримка 24/7'}</li>
                  </ul>
                </div>
              </div>

              {/* Input Area (Disabled) */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={t('chat.inputPlaceholder') || 'Напишіть ваше питання...'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-50 text-gray-400 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <button
                    className="w-10 h-10 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center cursor-not-allowed"
                    disabled
                    aria-label={t('common.send') || 'Send'}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {t('chat.developmentNote') || 'Функція знаходиться в розробці'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 sm:hidden"
          onClick={handleClose}
        />
      )}
    </>
  )
}
