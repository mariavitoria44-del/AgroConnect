import React, { useState } from 'react';
import {
  Sprout,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Bell,
  Code2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Bot
} from 'lucide-react';
import { UserRole, Recommendation, FarmerUser } from '../types/agro';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isFieldMode: boolean;
  setIsFieldMode: (val: boolean) => void;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  pendingSyncCount: number;
  onSyncNow: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenArchitecture: () => void;
  onOpenChatbot: () => void;
  recommendations: Recommendation[];
  currentUser: FarmerUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isFieldMode,
  setIsFieldMode,
  isOnline,
  setIsOnline,
  pendingSyncCount,
  onSyncNow,
  currentRole,
  setCurrentRole,
  onOpenArchitecture,
  onOpenChatbot,
  recommendations,
  currentUser,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pendingRecommendations = recommendations.filter(
    (r) => r.status === 'Pendente' && r.category !== 'Irrigação' && r.category !== 'Fitossanitário'
  );

  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'crops', label: 'Culturas', icon: BookOpen },
    { id: 'production', label: 'Produção', icon: Sprout },
    { id: 'inventory', label: 'Estoque', icon: Package },
    { id: 'sales', label: 'Vendas', icon: DollarSign },
    { id: 'finance', label: 'Financeiro', icon: TrendingUp },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    proprietario: { label: 'Proprietário Rural', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    gerente: { label: 'Gerente de Produção', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    trabalhador: { label: 'Operador de Campo', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    agronomo: { label: 'Técnico / Agrônomo', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    admin: { label: 'Administrador', color: 'bg-stone-50 text-stone-800 border-stone-200' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Farm Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/10">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-stone-900">AgroConnect</span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200/70">
                  Dom Expedito Lopes - PI
                </span>
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                <span>Fazenda Vista Verde</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-600 font-medium">Família Bragança</span>
                <span className="text-stone-300">•</span>
                <span className="text-emerald-700 font-semibold">32 ha</span>
              </p>
            </div>
          </div>

          {/* Controls: Mode Switch, Offline Simulator, User Profile, Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Field Mode vs Web ERP Toggle */}
            <button
              onClick={() => setIsFieldMode(!isFieldMode)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isFieldMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-400/20'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200/80'
              }`}
              title="Alternar entre visualização de Campo no Celular e Painel Web ERP"
            >
              {isFieldMode ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isFieldMode ? 'Modo Campo' : 'Modo Web'}</span>
            </button>

            {/* Offline Simulator Pill */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isOnline
                  ? 'bg-emerald-50/70 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70'
                  : 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
              }`}
              title={isOnline ? 'Online no campo: Clique para simular perda de sinal' : 'Offline: Clique para reconectar'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-rose-600" />}
              <span className="hidden lg:inline">{isOnline ? 'Online' : 'Offline'}</span>
              {pendingSyncCount > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onSyncNow();
                  }}
                  className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white cursor-pointer hover:bg-amber-600"
                >
                  {pendingSyncCount} sync
                </span>
              )}
            </button>

            {/* Dr. Agro Gemini Chatbot Button */}
            <button
              onClick={onOpenChatbot}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition-colors shadow-2xs"
              title="Abrir Assistente Agronômico Gemini (Dr. Agro)"
            >
              <Bot className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden md:inline">Dr. Agro</span>
            </button>

            {/* Architecture Button (Section 40) */}
            <button
              onClick={onOpenArchitecture}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-2xs"
              title="Especificação Técnica, Modelo ER e APIs (Item 40)"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Arquitetura</span>
            </button>

            {/* Notification Drawer Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 relative transition-colors border border-transparent hover:border-stone-200"
                title="Notificações e Alertas Agronômicos"
              >
                <Bell className="w-4 h-4" />
                {pendingRecommendations.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                    <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      Alertas da Lavoura
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500">
                      {pendingRecommendations.length} pendentes
                    </span>
                  </div>

                  <div className="mt-2.5 max-h-72 overflow-y-auto space-y-2 pr-1">
                    {pendingRecommendations.length === 0 ? (
                      <p className="text-xs text-stone-500 py-4 text-center">Nenhum alerta pendente no momento.</p>
                    ) : (
                      pendingRecommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className={`p-3 rounded-xl border text-xs ${
                            rec.priority === 'Crítica' || rec.priority === 'Alta'
                              ? 'bg-rose-50/60 border-rose-200 text-stone-800'
                              : 'bg-stone-50 border-stone-200 text-stone-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span className="flex items-center gap-1 text-stone-900">
                              <AlertTriangle
                                className={`w-3.5 h-3.5 ${
                                  rec.priority === 'Crítica' || rec.priority === 'Alta'
                                    ? 'text-rose-600'
                                    : 'text-amber-500'
                                }`}
                              />
                              {rec.title}
                            </span>
                            <span className="text-[10px] text-stone-400 font-normal">{rec.date}</span>
                          </div>
                          <p className="text-stone-600 text-[11px] leading-relaxed">{rec.message}</p>
                          <div className="mt-1.5 text-[11px] text-emerald-800 font-medium bg-white/80 p-2 rounded-lg border border-stone-100">
                            👉 {rec.suggestedAction}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-stone-100 transition-all text-xs font-semibold"
              >
                <span className="text-base">{currentUser?.avatarEmoji || '👨‍🌾'}</span>
                <div className="text-left hidden sm:block">
                  <span className="block text-stone-900 font-bold leading-tight">
                    {currentUser?.name || 'Agricultor'}
                  </span>
                  <span className="block text-[10px] text-stone-500 leading-tight">
                    {roleLabels[currentRole].label.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-stone-100">
                    <span className="text-xs font-bold text-stone-900 block">{currentUser?.name}</span>
                    <span className="text-[10px] text-stone-500 block">{currentUser?.farmName}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">{currentUser?.city}</span>
                  </div>

                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">
                    Alternar Perfil
                  </div>
                  {(['proprietario', 'gerente', 'trabalhador', 'agronomo'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setCurrentRole(r);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-stone-50 ${
                        currentRole === r ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-stone-700'
                      }`}
                    >
                      <span>{roleLabels[r].label}</span>
                      {currentRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}

                  <div className="border-t border-stone-100 mt-2 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair / Trocar Agricultor</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clean, Modern Navigation Pill Tabs (Web Mode) */}
        {!isFieldMode && (
          <div className="flex space-x-1.5 overflow-x-auto py-2.5 no-scrollbar border-t border-stone-100">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-700/20'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
