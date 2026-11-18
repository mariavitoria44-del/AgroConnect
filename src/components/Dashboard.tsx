import React from 'react';
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Sprout,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  Layers
} from 'lucide-react';
import {
  Planting,
  Recommendation,
  InventoryItem,
  Sale,
  Expense
} from '../types/agro';

interface DashboardProps {
  plantings: Planting[];
  recommendations: Recommendation[];
  inventory: InventoryItem[];
  sales: Sale[];
  expenses: Expense[];
  onNavigateTab: (tab: string) => void;
  onOpenChatbot: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  plantings,
  recommendations,
  inventory,
  sales,
  expenses,
  onNavigateTab,
  onOpenChatbot,
}) => {
  // Financial computations
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalPriceReais, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amountReais, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Low inventory count
  const lowStockItems = inventory.filter((i) => i.currentQty <= i.minQty);

  // Active plantings
  const activePlantings = plantings.filter((p) => p.status === 'Ativo');
  const totalPlantedAreaHa = activePlantings.reduce((acc, p) => acc + p.plantedAreaHa, 0);

  // Filter out irrigation and pest recommendations if any remain in localStorage
  const visibleRecommendations = recommendations.filter(
    (r) => r.category !== 'Irrigação' && r.category !== 'Fitossanitário'
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Welcome & Farm Summary */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 rounded-2xl text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-40 h-40 rounded-full bg-emerald-500/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>Gestão Rural • Dom Expedito Lopes - PI</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Olá, Família Bragança • Fazenda Vista Verde (Dom Expedito Lopes)
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
              Tudo sob controle hoje. Acompanhamento de {activePlantings.length} lotes em produção em 32 hectares produtivos.
            </p>
          </div>

          {/* Farm Quick Summary Pill */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs">
            <div className="flex items-center space-x-2 px-2 border-r border-white/10">
              <Sprout className="w-5 h-5 text-emerald-300" />
              <div>
                <span className="font-bold text-white text-sm">{activePlantings.length} Lotes</span>
                <span className="block text-[10px] text-emerald-200">Em Produção</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-2 border-r border-white/10">
              <Layers className="w-5 h-5 text-amber-300" />
              <div>
                <span className="font-bold text-white text-sm">{totalPlantedAreaHa.toFixed(1)} ha</span>
                <span className="block text-[10px] text-emerald-200">Área Cultivada</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-2">
              <Calendar className="w-5 h-5 text-teal-300" />
              <div>
                <span className="font-bold text-white text-sm">Safra 2026</span>
                <span className="block text-[10px] text-emerald-200">PRONAF Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Faturamento */}
        <div
          onClick={() => onNavigateTab('finance')}
          className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Faturamento Vendas</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center text-[11px] font-semibold text-emerald-700 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{sales.length} vendas registradas</span>
          </div>
        </div>

        {/* KPI 2: Lucro Líquido */}
        <div
          onClick={() => onNavigateTab('finance')}
          className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Lucro Estimado</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
            R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center text-[11px] font-semibold text-blue-700 mt-1">
            <span>Margem estimada: {profitMargin}%</span>
          </div>
        </div>

        {/* KPI 3: Lotes em Produção */}
        <div
          onClick={() => onNavigateTab('production')}
          className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Lotes Ativos</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {activePlantings.length} culturas
          </div>
          <div className="flex items-center text-[11px] font-semibold text-emerald-700 mt-1">
            <span>{totalPlantedAreaHa.toFixed(1)} hectares plantados</span>
          </div>
        </div>

        {/* KPI 4: Alertas de Campo */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Avisos de Estoque</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {lowStockItems.length} alertas
          </div>
          <div className="flex items-center text-[11px] font-semibold text-amber-700 mt-1">
            <span>{lowStockItems.length} insumos em baixa</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Plantings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Plantings Widget */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <h2 className="font-bold text-stone-900 text-sm">Lotes de Plantio em Desenvolvimento</h2>
              </div>
              <button
                onClick={() => onNavigateTab('production')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Ver todos os lotes <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {activePlantings.map((p) => {
                // Calculate progress % based on dates
                const plantDate = new Date(p.plantingDate).getTime();
                const expDate = new Date(p.expectedHarvestDate).getTime();
                const now = new Date('2026-10-06').getTime();
                const total = Math.max(expDate - plantDate, 1);
                const elapsed = Math.max(now - plantDate, 0);
                const progressPct = Math.min(Math.round((elapsed / total) * 100), 100);

                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-stone-900 text-sm">{p.cropName}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-800">
                            {p.lotNumber}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {p.stage}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {p.variety} • {p.plantedAreaHa} ha • Resp.: {p.responsibleName}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900">
                          Colheita Prevista: {new Date(p.expectedHarvestDate).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="block text-[11px] text-stone-500">
                          Estimado: {p.estimatedYieldKg.toLocaleString()} kg
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-stone-500 font-semibold mt-1">
                      <span>Plantado em {new Date(p.plantingDate).toLocaleDateString('pt-BR')}</span>
                      <span>{progressPct}% do ciclo concluído</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Agronomic Recommendations & Quick Actions */}
        <div className="space-y-6">
          {/* Agronomic Recommendations */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="font-bold text-stone-900 text-sm">Recomendações da Lavoura</h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Avisos
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {visibleRecommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className={`p-3 rounded-xl border text-xs ${
                    rec.priority === 'Alta' || rec.priority === 'Crítica'
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      {rec.title}
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal">{rec.date}</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed mb-2">{rec.message}</p>
                  <div className="text-[11px] font-medium text-emerald-800 bg-white/80 p-2 rounded-lg border border-stone-100">
                    💡 <span className="font-bold">Ação:</span> {rec.suggestedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Bar */}
          <div className="bg-stone-900 text-white rounded-xl p-5 shadow-md">
            <h3 className="text-xs uppercase tracking-wider font-mono text-emerald-400 font-bold mb-3">
              Acesso Rápido ao Campo
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigateTab('production')}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-left transition-colors border border-stone-700 flex flex-col justify-between"
              >
                <span className="text-base">🌱</span>
                <span className="font-bold text-white mt-2">Produção & Colheita</span>
                <span className="text-[10px] text-stone-400">Lotes e safras</span>
              </button>

              <button
                onClick={onOpenChatbot}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-left transition-colors border border-stone-700 flex flex-col justify-between"
              >
                <span className="text-base">🤖</span>
                <span className="font-bold text-white mt-2">Dr. Agro Gemini</span>
                <span className="text-[10px] text-stone-400">Assistente agrônomo</span>
              </button>

              <button
                onClick={() => onNavigateTab('sales')}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-left transition-colors border border-stone-700 flex flex-col justify-between"
              >
                <span className="text-base">🧾</span>
                <span className="font-bold text-white mt-2">Nova Venda</span>
                <span className="text-[10px] text-stone-400">Com rastreio</span>
              </button>

              <button
                onClick={() => onNavigateTab('inventory')}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-left transition-colors border border-stone-700 flex flex-col justify-between"
              >
                <span className="text-base">📦</span>
                <span className="font-bold text-white mt-2">Lista de Compras</span>
                <span className="text-[10px] text-stone-400">{lowStockItems.length} alertas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
