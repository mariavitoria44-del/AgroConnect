import React, { useState } from 'react';
import {
  Package,
  DollarSign,
  Wifi,
  WifiOff,
  Sprout,
  Send
} from 'lucide-react';
import {
  Planting,
  Harvest,
  Sale
} from '../types/agro';

interface MobileFieldModeProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  onSyncNow: () => void;
  plantings: Planting[];
  onQuickLogHarvest: (harvest: Partial<Harvest>) => void;
  onQuickLogSale: (sale: Partial<Sale>) => void;
}

export const MobileFieldMode: React.FC<MobileFieldModeProps> = ({
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  onSyncNow,
  plantings,
  onQuickLogHarvest,
  onQuickLogSale,
}) => {
  const [activeModal, setActiveModal] = useState<'colheita' | 'venda' | 'nota' | null>(null);

  // Quick inputs
  const [quickCrop, setQuickCrop] = useState('Tomate Italiano');
  const [quickQty, setQuickQty] = useState<number>(50);
  const [quickUnit, setQuickUnit] = useState('kg');
  const [quickPrice, setQuickPrice] = useState<number>(4.80);
  const [quickCustomer, setQuickCustomer] = useState('Feira Livre');
  const [quickNote, setQuickNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activePlantingsCount = plantings.filter((p) => p.status === 'Ativo').length;

  const handleSaveQuickHarvest = () => {
    onQuickLogHarvest({
      cropName: quickCrop,
      quantity: quickQty,
      unit: quickUnit as any,
      qualityGrade: 'Tipo 1 (Extra)',
      destination: 'Feira / Venda Local',
    });
    setActiveModal(null);
    showToast(isOnline ? '✅ Colheita salva e sincronizada!' : '💾 Salvo localmente na fila offline!');
  };

  const handleSaveQuickSale = () => {
    onQuickLogSale({
      customerName: quickCustomer,
      cropName: quickCrop,
      quantity: quickQty,
      unit: quickUnit as any,
      unitPriceReais: quickPrice,
      totalPriceReais: quickQty * quickPrice,
      paymentMethod: 'PIX',
      paymentStatus: 'Pago',
    });
    setActiveModal(null);
    showToast(isOnline ? '✅ Venda registrada!' : '💾 Venda salva na fila offline!');
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12 animate-in fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-stone-700 animate-in zoom-in-95">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Outdoor Mobile Header */}
      <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-lg border border-stone-800">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
              MODO CAMPO • ALTO CONTRASTE
            </span>
            <h2 className="text-lg font-black text-white">Fazenda Vista Verde</h2>
            <span className="text-[10px] text-stone-400 block font-medium">Família Bragança • Dom Expedito Lopes - PI</span>
          </div>

          {/* Offline/Online Badge */}
          <button
            onClick={onToggleOnline}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500 text-white animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? '4G Conectado' : 'Sem Sinal'}</span>
          </button>
        </div>

        {/* Offline Queue Bar */}
        {pendingSyncCount > 0 && (
          <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              {pendingSyncCount} registros guardados no celular
            </span>
            <button
              onClick={onSyncNow}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs"
            >
              Enviar Agora
            </button>
          </div>
        )}
      </div>

      {/* Field Glance Summary */}
      <div className="bg-white rounded-2xl border-2 border-stone-300 p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-stone-500 block">
              Lotes em Produção
            </span>
            <span className="text-xl font-black text-stone-900">
              {activePlantingsCount} culturas ativas
            </span>
          </div>
        </div>
        <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 uppercase">
          Em Dia
        </span>
      </div>

      {/* Oversized Touch Action Buttons (One-Handed Field Operation) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Action 1: Registrar Colheita */}
        <button
          onClick={() => setActiveModal('colheita')}
          className="p-4 rounded-2xl bg-emerald-700 text-white font-extrabold text-left shadow-sm hover:bg-emerald-800 transition-all flex flex-col justify-between h-28 border border-emerald-800"
        >
          <Package className="w-6 h-6 text-emerald-200" />
          <div>
            <span className="block text-sm">Anotar Colheita</span>
            <span className="text-[10px] font-normal text-emerald-200">Pesagem e caixas</span>
          </div>
        </button>

        {/* Action 2: Venda Rápida */}
        <button
          onClick={() => setActiveModal('venda')}
          className="p-4 rounded-2xl bg-blue-700 text-white font-extrabold text-left shadow-sm hover:bg-blue-800 transition-all flex flex-col justify-between h-28 border border-blue-800"
        >
          <DollarSign className="w-6 h-6 text-blue-200" />
          <div>
            <span className="block text-sm">Venda Rápida</span>
            <span className="text-[10px] font-normal text-blue-200">PIX ou dinheiro</span>
          </div>
        </button>
      </div>

      {/* Quick Field Note Box */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-4 shadow-xs space-y-2">
        <label className="text-xs font-bold text-stone-800 block">
          Caderno de Campo Rápido:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Válvula do cano 3 trocada hoje..."
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => {
              if (quickNote.trim()) {
                showToast('📝 Anotação salva no histórico!');
                setQuickNote('');
              }
            }}
            className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals for Quick Mobile Actions */}
      {activeModal === 'colheita' && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-5 max-w-sm w-full animate-in fade-in space-y-3.5 text-xs">
            <h3 className="font-extrabold text-stone-900 text-base">Anotar Colheita no Campo</h3>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Cultura</label>
              <select
                value={quickCrop}
                onChange={(e) => setQuickCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              >
                <option value="Tomate Italiano">Tomate Italiano</option>
                <option value="Alface Crespa">Alface Crespa</option>
                <option value="Pimentão Amarelo">Pimentão Amarelo</option>
                <option value="Coentro Verdão">Coentro Verdão</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Quantidade</label>
                <input
                  type="number"
                  value={quickQty}
                  onChange={(e) => setQuickQty(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-base font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Unidade</label>
                <select
                  value={quickUnit}
                  onChange={(e) => setQuickUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                >
                  <option value="kg">kg</option>
                  <option value="caixas">caixas</option>
                  <option value="maços">maços</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveQuickHarvest}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700"
              >
                Salvar Colheita
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'venda' && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-5 max-w-sm w-full animate-in fade-in space-y-3.5 text-xs">
            <h3 className="font-extrabold text-stone-900 text-base">Venda Direta Rápida</h3>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Comprador</label>
              <input
                type="text"
                value={quickCustomer}
                onChange={(e) => setQuickCustomer(e.target.value)}
                placeholder="Ex: Feirante Zé ou Venda no Portão"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Qtd ({quickUnit})</label>
                <input
                  type="number"
                  value={quickQty}
                  onChange={(e) => setQuickQty(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Preço Unit. (R$)</label>
                <input
                  type="number"
                  step="0.10"
                  value={quickPrice}
                  onChange={(e) => setQuickPrice(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl text-blue-900 font-bold flex justify-between">
              <span>Total a Receber:</span>
              <span>R$ {(quickQty * quickPrice).toFixed(2)}</span>
            </div>

            <div className="flex gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveQuickSale}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700"
              >
                Concluir Venda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
