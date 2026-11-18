import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Layers,
  Calendar
} from 'lucide-react';
import { Expense, Sale, Property, Crop } from '../types/agro';

interface FinanceModuleProps {
  expenses: Expense[];
  sales: Sale[];
  properties: Property[];
  crops: Crop[];
  onAddExpense: (expense: Expense) => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  expenses,
  sales,
  properties,
  crops,
  onAddExpense,
}) => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // New Expense form state
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Fertilizantes/Adubos');
  const [amountReais, setAmountReais] = useState<number>(350);
  const [fieldId, setFieldId] = useState(properties[0]?.fields[0]?.id || '');
  const [cropName, setCropName] = useState('Tomate Italiano');
  const [lotNumber, setLotNumber] = useState('TOM-2026-001');

  // Calculations
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalPriceReais, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amountReais, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMarginPct = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  const accountsReceivable = sales
    .filter((s) => s.paymentStatus === 'Pendente')
    .reduce((acc, s) => acc + s.totalPriceReais, 0);

  // Profitability per Crop estimate
  const tomatoSales = sales.filter((s) => s.cropName.includes('Tomate')).reduce((acc, s) => acc + s.totalPriceReais, 0);
  const lettuceSales = sales.filter((s) => s.cropName.includes('Alface')).reduce((acc, s) => acc + s.totalPriceReais, 0);

  const tomatoCosts = expenses.filter((e) => e.cropName?.includes('Tomate') || e.description.includes('Tomate')).reduce((acc, e) => acc + e.amountReais, 0) + 1200; // allocated electric/labor
  const lettuceCosts = expenses.filter((e) => e.cropName?.includes('Alface') || e.description.includes('Alface')).reduce((acc, e) => acc + e.amountReais, 0) + 700;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const selField = properties[0]?.fields.find((f) => f.id === fieldId);

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category,
      description,
      amountReais: Number(amountReais),
      fieldId,
      fieldName: selField?.name || 'Geral',
      cropName,
      lotNumber,
      paymentStatus: 'Pago',
    };

    onAddExpense(newExp);
    setShowExpenseModal(false);
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Gestão Financeira Simplificada</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Fluxo de Caixa, Custos & Rentabilidade
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Acompanhe receitas de colheitas, custos operacionais e margem líquida por cultura produzida.
          </p>
        </div>

        <button
          onClick={() => setShowExpenseModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Despesa</span>
        </button>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">Receita Total</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Entradas de vendas
          </span>
        </div>

        <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 shadow-xs">
          <span className="text-[10px] font-bold text-rose-700 uppercase block">Despesas da Safra</span>
          <div className="text-xl sm:text-2xl font-black text-rose-950 mt-1">
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-rose-700 flex items-center gap-1 font-semibold mt-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> Insumos, energia, diárias
          </span>
        </div>

        <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-[10px] font-bold text-blue-700 uppercase block">Lucro Líquido</span>
          <div className="text-xl sm:text-2xl font-black text-blue-950 mt-1">
            R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
            Margem Operacional: {profitMarginPct}%
          </span>
        </div>

        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase block">A Receber (A Prazo)</span>
          <div className="text-xl sm:text-2xl font-black text-amber-950 mt-1">
            R$ {accountsReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
            Vendas a prazo (30 dias)
          </span>
        </div>
      </div>

      {/* Margin and Profitability Breakdown by Crop (Section 24) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-600" />
          Análise de Rentabilidade por Cultura
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Tomate */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                🍅 Tomate Italiano (Lote TOM-2026)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Alta Margem
              </span>
            </div>

            <div className="space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span>Faturamento Realizado:</span>
                <strong className="text-stone-900">R$ {tomatoSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="flex justify-between">
                <span>Custos Atribuídos:</span>
                <strong className="text-rose-700">R$ {tomatoCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-200">
                <span>Custo Médio de Produção:</span>
                <strong className="text-stone-800">R$ 1,85 / kg</strong>
              </div>
              <div className="flex justify-between">
                <span>Preço Médio de Venda:</span>
                <strong className="text-emerald-800">R$ 4,80 / kg</strong>
              </div>
              <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-stone-200">
                <span>Lucro Líquido Estimado:</span>
                <span>R$ {(tomatoSales - tomatoCosts).toFixed(2)} (Margem: {(((tomatoSales - tomatoCosts) / tomatoSales) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>

          {/* Alface */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                🥬 Alface Crespa (Lote ALF-2026)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                Giro Rápido (45d)
              </span>
            </div>

            <div className="space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span>Faturamento Realizado:</span>
                <strong className="text-stone-900">R$ {lettuceSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="flex justify-between">
                <span>Custos Atribuídos:</span>
                <strong className="text-rose-700">R$ {lettuceCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-200">
                <span>Custo Médio por Maço:</span>
                <strong className="text-stone-800">R$ 0,90 / maço</strong>
              </div>
              <div className="flex justify-between">
                <span>Preço Médio de Venda:</span>
                <strong className="text-emerald-800">R$ 2,50 / maço</strong>
              </div>
              <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-stone-200">
                <span>Lucro Líquido Estimado:</span>
                <span>R$ {(lettuceSales - lettuceCosts).toFixed(2)} (Margem: {(((lettuceSales - lettuceCosts) / lettuceSales) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
          <span>Despesas da Fazenda Registradas</span>
          <span className="text-stone-500 font-normal">{expenses.length} lançamentos</span>
        </div>

        <div className="divide-y divide-stone-100 text-xs">
          {expenses.map((e) => (
            <div key={e.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-stone-900">{e.description}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {e.category}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Data: {new Date(e.date).toLocaleDateString('pt-BR')} • {e.fieldName || 'Geral'}
                  {e.cropName && ` • Cultura: ${e.cropName}`}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-rose-800 block">
                  - R$ {e.amountReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">{e.paymentStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-md w-full animate-in fade-in">
            <h3 className="font-bold text-stone-900 text-base mb-1">Registrar Despesa</h3>
            <p className="text-xs text-stone-500 mb-4">Lance custos operacionais para manter o controle de lucro real.</p>

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Compra de adubo ou Diária de capina"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Fertilizantes/Adubos">Fertilizantes/Adubos</option>
                    <option value="Sementes/Mudas">Sementes/Mudas</option>
                    <option value="Defensivos">Defensivos</option>
                    <option value="Energia Elétrica">Energia Elétrica</option>
                    <option value="Combustível">Combustível</option>
                    <option value="Água/Irrigação">Água/Irrigação</option>
                    <option value="Mão de Obra/Diárias">Mão de Obra / Diárias</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={amountReais}
                    onChange={(e) => setAmountReais(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Setor / Área (Opcional)</label>
                  <select
                    value={fieldId}
                    onChange={(e) => setFieldId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {properties[0]?.fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cultura Vinculada</label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-3.5 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Lançar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
