import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { InventoryItem, StockMovement } from '../types/agro';

interface InventoryModuleProps {
  inventory: InventoryItem[];
  movements: StockMovement[];
  onAddItem: (item: InventoryItem) => void;
  onAddMovement: (movement: StockMovement) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  movements,
  onAddItem,
  onAddMovement,
}) => {
  const [activeTab, setActiveTab] = useState<'itens' | 'alertas' | 'movimentacoes'>('itens');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);

  // New item form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Fertilizantes');
  const [unit, setUnit] = useState<InventoryItem['unit']>('kg');
  const [currentQty, setCurrentQty] = useState(50);
  const [minQty, setMinQty] = useState(20);
  const [maxQty, setMaxQty] = useState(200);
  const [batchNumber, setBatchNumber] = useState('LOT-2026-X');
  const [supplier, setSupplier] = useState('Cooperativa Regional');
  const [unitCostReais, setUnitCostReais] = useState(12.50);

  // Stock movement state
  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || '');
  const [moveType, setMoveType] = useState<StockMovement['type']>('Saída (Aplicação)');
  const [moveQty, setMoveQty] = useState(5);
  const [moveReason, setMoveReason] = useState('Aplicação na cultura de Tomate');
  const [responsibleName, setResponsibleName] = useState('Severino Rocha');

  const lowStockItems = inventory.filter((i) => i.currentQty <= i.minQty);

  const filteredItems = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name,
      category,
      unit,
      currentQty: Number(currentQty),
      minQty: Number(minQty),
      maxQty: Number(maxQty),
      batchNumber,
      supplier,
      unitCostReais: Number(unitCostReais),
    };

    onAddItem(newItem);
    setShowAddModal(false);
  };

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find((i) => i.id === selectedItemId);
    if (!item) return;

    const newMove: StockMovement = {
      id: `smov-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      itemId: item.id,
      itemName: item.name,
      type: moveType,
      quantity: Number(moveQty),
      unit: item.unit,
      reason: moveReason,
      responsibleName,
    };

    onAddMovement(newMove);
    setShowMovementModal(false);
  };

  const totalInventoryValue = inventory.reduce((acc, item) => acc + item.currentQty * item.unitCostReais, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Almoxarifado & Insumos Agrícolas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Controle de Estoque & Compras
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Sementes, adubos, defensivos e materiais de irrigação com alerta de reposição automática.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {lowStockItems.length > 0 && (
            <button
              onClick={() => setShowShoppingListModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-xs"
              title="Gerar pedido de compras com itens abaixo do estoque mínimo"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Gerar Lista de Compras ({lowStockItems.length})</span>
            </button>
          )}

          <button
            onClick={() => setShowMovementModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors shadow-xs"
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span>Movimentar</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Insumo</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('itens')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'itens'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Itens em Estoque ({inventory.length})
        </button>

        <button
          onClick={() => setActiveTab('alertas')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'alertas'
              ? 'border-amber-500 text-amber-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Alertas de Estoque Baixo</span>
          {lowStockItems.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
              {lowStockItems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('movimentacoes')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'movimentacoes'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Histórico de Entradas & Saídas ({movements.length})
        </button>
      </div>

      {/* Tab: Itens em Estoque */}
      {activeTab === 'itens' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar insumo por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
              {['Todas', 'Sementes/Mudas', 'Fertilizantes', 'Defensivos', 'Irrigação', 'Embalagens'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === c
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Items Table / Cards */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-stone-100 text-xs">
              {filteredItems.map((item) => {
                const isLow = item.currentQty <= item.minQty;
                return (
                  <div
                    key={item.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isLow ? 'bg-amber-50/40' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900 text-sm">{item.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {item.category}
                        </span>
                        {isLow && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Estoque Baixo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Fornecedor: {item.supplier} • Lote: {item.batchNumber}
                        {item.expiryDate && ` • Validade: ${new Date(item.expiryDate).toLocaleDateString('pt-BR')}`}
                      </p>
                    </div>

                    <div className="flex items-center space-x-6 text-right">
                      <div>
                        <span className="text-base font-black text-stone-900">
                          {item.currentQty} {item.unit}
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          Mín: {item.minQty} / Máx: {item.maxQty}
                        </span>
                      </div>

                      <div className="border-l border-stone-100 pl-4 text-right">
                        <span className="text-xs font-bold text-stone-800">
                          R$ {(item.currentQty * item.unitCostReais).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          R$ {item.unitCostReais.toFixed(2)}/{item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Alertas de Estoque Baixo */}
      {activeTab === 'alertas' && (
        <div className="space-y-4">
          {lowStockItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              Todos os insumos estão com níveis adequados acima do estoque mínimo!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-amber-50/70 rounded-2xl border border-amber-300 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-800 flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Reposição Urgente
                      </span>
                      <h3 className="font-black text-stone-900 text-sm">{item.name}</h3>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Estoque atual: <strong className="text-rose-700">{item.currentQty} {item.unit}</strong> (Mínimo exigido: {item.minQty} {item.unit})
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-amber-200 text-amber-900">
                      Falta: {item.maxQty - item.currentQty} {item.unit}
                    </span>
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs text-stone-700 flex items-center justify-between">
                    <span>Custo estimado de reposição:</span>
                    <strong className="text-emerald-800">
                      R$ {((item.maxQty - item.currentQty) * item.unitCostReais).toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Movimentações */}
      {activeTab === 'movimentacoes' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Histórico de Entradas, Aplicações e Baixas</span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {movements.map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-900">{m.itemName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.type.includes('Entrada')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {m.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Data: {new Date(m.date).toLocaleDateString('pt-BR')} • {m.reason}
                    {m.lotDestination && ` • Destino: ${m.lotDestination}`} • Resp.: {m.responsibleName}
                  </p>
                </div>

                <span
                  className={`text-sm font-black ${
                    m.type.includes('Entrada') ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {m.type.includes('Entrada') ? '+' : '-'} {m.quantity} {m.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shopping List Printable Modal (Section 18) */}
      {showShoppingListModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 max-w-lg w-full animate-in fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-600" />
                  Lista de Compras Automatizada
                </h3>
                <p className="text-xs text-stone-500">
                  Gerada com base nos níveis de estoque mínimo da fazenda.
                </p>
              </div>
              <button
                onClick={() => setShowShoppingListModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 divide-y divide-stone-200 text-xs space-y-2">
              {lowStockItems.map((item) => {
                const buyQty = item.maxQty - item.currentQty;
                return (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between">
                    <div>
                      <strong className="text-stone-900 block">{item.name}</strong>
                      <span className="text-[10px] text-stone-500">
                        Disponível: {item.currentQty} {item.unit} • Fornecedor: {item.supplier}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-stone-900 text-xs block">
                        Comprar: {buyQty} {item.unit}
                      </span>
                      <span className="text-[11px] text-emerald-800 font-semibold">
                        ~ R$ {(buyQty * item.unitCostReais).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-stone-700">
                Total Estimado do Pedido:{' '}
                <strong className="text-emerald-800 text-sm">
                  R${' '}
                  {lowStockItems
                    .reduce((acc, i) => acc + (i.maxQty - i.currentQty) * i.unitCostReais, 0)
                    .toFixed(2)}
                </strong>
              </span>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Salvar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-md w-full animate-in fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-stone-900 text-base mb-1">Cadastrar Insumo</h3>
            <p className="text-xs text-stone-500 mb-4">Adicione um novo produto ao estoque da fazenda.</p>

            <form onSubmit={handleCreateItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nome do Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Adubo NPK 10-10-10 ou Óleo de Neem"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    <option value="Fertilizantes">Fertilizantes</option>
                    <option value="Sementes/Mudas">Sementes/Mudas</option>
                    <option value="Defensivos">Defensivos</option>
                    <option value="Irrigação">Irrigação</option>
                    <option value="Embalagens">Embalagens</option>
                    <option value="Ferramentas">Ferramentas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Unidade</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="kg">kg</option>
                    <option value="litros">litros</option>
                    <option value="unidades">unidades</option>
                    <option value="sacos">sacos</option>
                    <option value="bobinas">bobinas</option>
                    <option value="caixas">caixas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Qtd. Atual</label>
                  <input
                    type="number"
                    min="0"
                    value={currentQty}
                    onChange={(e) => setCurrentQty(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mínimo</label>
                  <input
                    type="number"
                    min="0"
                    value={minQty}
                    onChange={(e) => setMinQty(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Custo Unit. (R$)</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={unitCostReais}
                    onChange={(e) => setUnitCostReais(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Fornecedor Habitual</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Salvar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement Modal */}
      {showMovementModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-md w-full animate-in fade-in">
            <h3 className="font-bold text-stone-900 text-base mb-1">Registrar Movimentação</h3>
            <p className="text-xs text-stone-500 mb-4">Entrada por compra ou saída por aplicação no campo.</p>

            <form onSubmit={handleCreateMovement} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Item a Movimentar</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {inventory.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} (Atual: {i.currentQty} {i.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tipo de Movimentação</label>
                  <select
                    value={moveType}
                    onChange={(e) => setMoveType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Saída (Aplicação)">Saída (Aplicação no Campo)</option>
                    <option value="Entrada (Compra)">Entrada (Compra/Reposição)</option>
                    <option value="Perda">Perda / Descarte</option>
                    <option value="Ajuste de Balanço">Ajuste de Balanço</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={moveQty}
                    onChange={(e) => setMoveQty(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Motivo / Cultura de Destino</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aplicação de cobertura - Tomate Italiano"
                  value={moveReason}
                  onChange={(e) => setMoveReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="px-3.5 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Confirmar Baixa/Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
