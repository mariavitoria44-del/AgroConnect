import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer
} from 'lucide-react';
import {
  Planting,
  Harvest,
  Sale,
  Expense,
  InventoryItem
} from '../types/agro';

interface ReportsModuleProps {
  plantings: Planting[];
  harvests: Harvest[];
  sales: Sale[];
  expenses: Expense[];
  inventory: InventoryItem[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  plantings,
  harvests,
  sales,
  expenses,
}) => {
  const [selectedReportType, setSelectedReportType] = useState<'geral' | 'financeiro'>('geral');

  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalPriceReais, 0);
  const totalExpensesAmount = expenses.reduce((acc, e) => acc + e.amountReais, 0);
  const netProfit = totalSalesRevenue - totalExpensesAmount;

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Data,Tipo,Descricao/Item,Lote/Cultura,Valor/Qtd,Status\n';

    sales.forEach((s) => {
      csvContent += `${s.date},Venda,${s.customerName},${s.cropName} (${s.lotNumber}),R$ ${s.totalPriceReais},${s.paymentStatus}\n`;
    });

    expenses.forEach((e) => {
      csvContent += `${e.date},Despesa,${e.description},${e.cropName || 'Geral'},-R$ ${e.amountReais},Pago\n`;
    });

    harvests.forEach((h) => {
      csvContent += `${h.date},Colheita,${h.cropName},${h.lotNumber},${h.quantity} ${h.unit},Concluído\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_agroconnect_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Relatórios Gerenciais & Contábeis</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Emissão de Relatórios & Prestação de Contas
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Documento consolidado para crédito rural (PRONAF), assistência técnica e planejamento da safra.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Exportar Dados CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Report Filter Tabs */}
      <div className="flex space-x-2 border-b border-stone-200">
        {[
          { id: 'geral', label: 'Relatório Consolidado da Safra' },
          { id: 'financeiro', label: 'Demonstrativo Financeiro' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedReportType(tab.id as any)}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              selectedReportType === tab.id
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Printable Report Document Body */}
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6 printable-document">
        {/* Document Header */}
        <div className="border-b-2 border-stone-800 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-700 font-extrabold text-lg">🌾 FAZENDA VISTA VERDE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-700">
                CAF / PRONAF ATIVO
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Proprietário: Família Bragança (José de Bragança) • Rodovia BR-316, Zona Rural, Dom Expedito Lopes - PI
            </p>
            <p className="text-[11px] text-stone-400">
              Área Total: 50 hectares (32 ha em área produtiva)
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-stone-900 block">
              EMISSÃO: {new Date().toLocaleDateString('pt-BR')}
            </span>
            <span className="text-[10px] text-stone-500 block">Período: Safra 2026 / 2º Semestre</span>
            <span className="text-[10px] text-emerald-800 font-bold block mt-1">Status: Regular</span>
          </div>
        </div>

        {/* Section 1: Produção Consolidada */}
        {(selectedReportType === 'geral' || selectedReportType === 'financeiro') && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm uppercase text-stone-900 border-b border-stone-200 pb-1">
              1. Balanço de Produção e Comercialização
            </h3>

            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-semibold uppercase">Faturamento Bruto</span>
                <span className="text-base font-black text-emerald-800">
                  R$ {totalSalesRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-semibold uppercase">Despesas Operacionais</span>
                <span className="text-base font-black text-rose-800">
                  R$ {totalExpensesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-semibold uppercase">Resultado Líquido</span>
                <span className="text-base font-black text-blue-800">
                  R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <table className="w-full text-xs text-left border border-stone-200 mt-2">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="p-2 border-b">Lote Rastreável</th>
                  <th className="p-2 border-b">Cultura</th>
                  <th className="p-2 border-b">Área Plantada</th>
                  <th className="p-2 border-b">Colheita Realizada</th>
                  <th className="p-2 border-b text-right">Faturamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {plantings.map((p) => {
                  const lotSales = sales.filter((s) => s.lotNumber === p.lotNumber);
                  const revenue = lotSales.reduce((acc, s) => acc + s.totalPriceReais, 0);
                  return (
                    <tr key={p.id}>
                      <td className="p-2 font-mono font-bold text-emerald-800">{p.lotNumber}</td>
                      <td className="p-2 font-semibold">{p.cropName}</td>
                      <td className="p-2">{p.plantedAreaHa} ha</td>
                      <td className="p-2">{p.harvestedYieldKg.toLocaleString()} kg</td>
                      <td className="p-2 text-right font-bold">R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Signature */}
        <div className="pt-8 border-t border-stone-300 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="border-b border-stone-400 w-48 mx-auto mb-1" />
            <span className="font-bold text-stone-800 block">José de Bragança</span>
            <span className="text-[10px] text-stone-500">Família Bragança • Produtor Titular</span>
          </div>

          <div>
            <div className="border-b border-stone-400 w-48 mx-auto mb-1" />
            <span className="font-bold text-stone-800 block">Severino Rocha</span>
            <span className="text-[10px] text-stone-500">Responsável Operacional de Campo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
