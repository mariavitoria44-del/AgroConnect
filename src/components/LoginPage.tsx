import React, { useState } from 'react';
import {
  Sprout,
  Lock,
  Phone,
  User,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { FarmerUser, UserRole } from '../types/agro';

export const DEMO_FARMERS: FarmerUser[] = [
  {
    id: 'user-jose',
    name: 'José de Bragança',
    role: 'proprietario',
    phoneOrCpf: '(89) 99450-1234',
    farmName: 'Fazenda Vista Verde',
    city: 'Dom Expedito Lopes - PI',
    avatarEmoji: '👨‍🌾',
  },
  {
    id: 'user-severino',
    name: 'Severino Rocha',
    role: 'trabalhador',
    phoneOrCpf: '(89) 99411-5678',
    farmName: 'Fazenda Vista Verde',
    city: 'Dom Expedito Lopes - PI',
    avatarEmoji: '🚜',
  },
  {
    id: 'user-mariaclara',
    name: 'Maria Clara Bragança',
    role: 'gerente',
    phoneOrCpf: '(89) 99422-9012',
    farmName: 'Fazenda Vista Verde',
    city: 'Dom Expedito Lopes - PI',
    avatarEmoji: '🥬',
  },
  {
    id: 'user-juliana',
    name: 'Dra. Juliana Mendes',
    role: 'agronomo',
    phoneOrCpf: 'CREA-PI 45210/D',
    farmName: 'Assistência Técnica Agronômica',
    city: 'Dom Expedito Lopes / Picos - PI',
    avatarEmoji: '🌿',
  },
];

interface LoginPageProps {
  onLogin: (user: FarmerUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [phoneOrCpf, setPhoneOrCpf] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrCpf.trim()) {
      setErrorMsg('Por favor, informe seu Telefone ou CPF.');
      return;
    }

    // Match existing or create session for the farmer
    const matched = DEMO_FARMERS.find(
      (u) =>
        u.phoneOrCpf.toLowerCase().includes(phoneOrCpf.trim().toLowerCase()) ||
        u.name.toLowerCase().includes(phoneOrCpf.trim().toLowerCase())
    );

    if (matched) {
      onLogin(matched);
    } else {
      // Dynamic farmer user
      const customUser: FarmerUser = {
        id: `user-${Date.now()}`,
        name: phoneOrCpf.includes('@') ? phoneOrCpf.split('@')[0] : 'Produtor Rural (Família Bragança)',
        role: 'proprietario',
        phoneOrCpf,
        farmName: 'Fazenda Vista Verde',
        city: 'Dom Expedito Lopes - PI',
        avatarEmoji: '👨‍🌾',
      };
      onLogin(customUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-emerald-50/40 to-stone-100 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-600 selection:text-white">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 text-white shadow-lg shadow-emerald-700/20 ring-4 ring-emerald-500/10">
            <Sprout className="w-9 h-9" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
              AgroConnect
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-emerald-800 flex items-center justify-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Dom Expedito Lopes - Piauí</span>
            </p>
          </div>

          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Plataforma de gestão rural simples e moderna para pequenos produtores e trabalhadores do campo.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-6 sm:p-7 space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-800">Acesso do Agricultor</h2>
            <p className="text-[11px] text-stone-400">
              Entre com seu telefone ou CPF cadastrado na propriedade.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs font-semibold animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Telefone ou CPF do Agricultor
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="(89) 99999-0000 ou CPF"
                  value={phoneOrCpf}
                  onChange={(e) => {
                    setPhoneOrCpf(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-stone-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-700">Senha ou PIN de 4 dígitos</label>
                <span className="text-[10px] text-stone-400 font-medium">Ex: 1234</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••"
                  value={passwordOrPin}
                  onChange={(e) => setPasswordOrPin(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-stone-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 accent-emerald-600"
                />
                <span className="text-[11px] font-medium">Lembrar meu celular</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold cursor-pointer hover:underline">
                Ajuda no Sindicato?
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Entrar no AgroConnect</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access (1-click profiles) */}
          <div className="pt-4 border-t border-stone-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Acesso Rápido para Demonstração:
              </span>
              <span className="text-[10px] text-stone-400">1 clique</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {DEMO_FARMERS.map((farmer) => (
                <button
                  key={farmer.id}
                  type="button"
                  onClick={() => onLogin(farmer)}
                  className="p-2.5 rounded-xl border border-stone-200/90 bg-stone-50/70 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl p-1 bg-white rounded-lg shadow-2xs border border-stone-100">
                      {farmer.avatarEmoji}
                    </span>
                    <div>
                      <div className="font-bold text-stone-800 text-xs group-hover:text-emerald-900 transition-colors">
                        {farmer.name}
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium">
                        {farmer.role === 'proprietario'
                          ? 'Proprietário Rural • Fazenda Vista Verde'
                          : farmer.role === 'trabalhador'
                          ? 'Operador de Campo'
                          : farmer.role === 'gerente'
                          ? 'Responsável por Vendas & Colheitas'
                          : 'Técnica / Engenheira Agrônoma'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors">
                    Entrar
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Informative Footer */}
        <div className="text-center text-[11px] text-stone-500 space-y-1">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sistema seguro com funcionamento offline e sincronização automática</span>
          </p>
          <p className="text-[10px] text-stone-400">
            Fazenda Vista Verde • Família Bragança • Dom Expedito Lopes - PI
          </p>
        </div>
      </div>
    </div>
  );
};
