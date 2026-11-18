import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Users,
  Receipt,
  Printer,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Building,
  Phone,
  QrCode
} from 'lucide-react';
import { Sale, Customer, Planting, Harvest } from '../types/agro';

interface SalesModuleProps {
  sales: Sale[];
  customers: Customer[];
  plantings: Planting[];
  harvests: Harvest[];
  onAddSale: (sale: Sale) => void;
  onAddCustomer: (customer: Customer) => void;
}

export const SalesModule: React.FC<SalesModuleProps> = ({
  sales,
  customers,
  plantings,
  harvests,
  onAddSale,
  onAddCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'vendas' | 'clientes'>('vendas');
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<Sale | null>(null);

  // New Sale state
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [cropName, setCropName] = useState('Tomate Italiano');
  const [lotNumber, setLotNumber] = useState('TOM-2026-001');
  const [quantity, setQuantity] = useState(200);
  const [unit, setUnit] = useState<Sale['unit']>('kg');
  const [unitPriceReais, setUnitPriceReais] = useState(4.80);
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('PIX');
  const [paymentStatus, setPaymentStatus] = useState<Sale['paymentStatus']>('Pago');
  const [notes, setNotes] = useState('Entrega padrão no mercado');

  // New Customer state
  const [custName, setCustName] = useState('');
  const [custType, setCustType] = useState<Customer['type']>('Feirante');
  const [custDoc, setCustDoc] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');

  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalPriceReais, 0);

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);

    const randNum = Math.floor(100 + Math.random() * 900);
    const orderNumber = `#000${randNum}`;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      orderNumber,
      date: new Date().toISOString().split('T')[0],
      customerId,
      customerName: cust?.name || 'Cliente Local',
      cropName,
      lotNumber,
      quantity: Number(quantity),
      unit,
      unitPriceReais: Number(unitPriceReais),
      totalPriceReais: Number(quantity) * Number(unitPriceReais),
      paymentMethod,
      paymentStatus,
      fieldName: 'Setor Principal',
      harvestDate: new Date().toISOString().split('T')[0],
      notes,
    };

    onAddSale(newSale);
    setShowSaleModal(false);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: custName,
      document: custDoc,
      type: custType,
      phone: custPhone,
      address: custAddress,
      totalPurchasedReais: 0,
      ordersCount: 0,
    };

    onAddCustomer(newCust);
    setShowCustomerModal(false);
    setCustName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Comercialização & Clientes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Gestão de Vendas & CRM Rural
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Registro de pedidos com vínculo ao lote colhido, controle de recebimento e histórico de clientes.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCustomerModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors shadow-xs"
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Novo Cliente</span>
          </button>

          <button
            onClick={() => setShowSaleModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Venda</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('vendas')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'vendas'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Pedidos de Venda ({sales.length})
        </button>

        <button
          onClick={() => setActiveTab('clientes')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'clientes'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Carteira de Clientes ({customers.length})
        </button>
      </div>

      {/* Tab: Vendas */}
      {activeTab === 'vendas' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Relação de Vendas Registradas</span>
            <span className="text-emerald-800 font-extrabold text-sm">
              Total: R$ {totalSalesRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-stone-900 text-sm">{sale.orderNumber}</span>
                    <span className="font-bold text-emerald-800">{sale.cropName}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                      Lote: {sale.lotNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sale.paymentStatus === 'Pago'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sale.paymentStatus} ({sale.paymentMethod})
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-1">
                    Cliente: <strong className="text-stone-800">{sale.customerName}</strong> • Data: {new Date(sale.date).toLocaleDateString('pt-BR')}
                    {sale.notes && ` • Obs: ${sale.notes}`}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-base font-black text-stone-900 block">
                      R$ {sale.totalPriceReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-stone-500 block">
                      {sale.quantity} {sale.unit} × R$ {sale.unitPriceReais.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedSaleForReceipt(sale)}
                    className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                    title="Imprimir Recibo de Entrega e Rastreabilidade"
                  >
                    <Receipt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Clientes */}
      {activeTab === 'clientes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">{c.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-block mt-1">
                    {c.type}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-800 block">
                    R$ {c.totalPurchasedReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-stone-400 block">{c.ordersCount} pedidos realizados</span>
                </div>
              </div>

              <div className="text-xs space-y-1 text-stone-600">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  {c.phone}
                </p>
                <p className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-stone-400" />
                  {c.address}
                </p>
                {c.document && <p className="text-[11px] text-stone-400">Doc: {c.document}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sale Receipt Modal (Section 21 & 36) */}
      {selectedSaleForReceipt && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 max-w-md w-full animate-in fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                Comprovante de Venda & Entrega
              </h3>
              <button
                onClick={() => setSelectedSaleForReceipt(null)}
                className="text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-4 rounded-xl border border-stone-300 bg-stone-50/50 space-y-3 font-mono text-xs">
              <div className="text-center border-b border-stone-200 pb-2">
                <h4 className="font-bold text-stone-900 text-sm">FAZENDA VISTA VERDE (FAMÍLIA BRAGANÇA)</h4>
                <p className="text-[10px] text-stone-500">DOM EXPEDITO LOPES - PI • AGRICULTURA FAMILIAR</p>
                <span className="text-xs font-bold text-emerald-800 block mt-1">
                  PEDIDO {selectedSaleForReceipt.orderNumber}
                </span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-500">CLIENTE:</span>
                  <span className="font-bold text-stone-900">{selectedSaleForReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">PRODUTO:</span>
                  <span className="font-bold text-stone-900">{selectedSaleForReceipt.cropName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">LOTE RASTREADO:</span>
                  <span className="font-bold text-emerald-800">{selectedSaleForReceipt.lotNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">QUANTIDADE:</span>
                  <span className="font-bold text-stone-900">
                    {selectedSaleForReceipt.quantity} {selectedSaleForReceipt.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">PREÇO UNIT.:</span>
                  <span className="text-stone-900">R$ {selectedSaleForReceipt.unitPriceReais.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-stone-200">
                  <span className="font-bold text-stone-900">TOTAL:</span>
                  <span className="font-black text-emerald-800">
                    R$ {selectedSaleForReceipt.totalPriceReais.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] pt-1 text-stone-500">
                  <span>PAGAMENTO: {selectedSaleForReceipt.paymentMethod}</span>
                  <span className="font-bold text-emerald-700">STATUS: {selectedSaleForReceipt.paymentStatus}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-stone-300 text-center text-[10px] text-stone-400">
                Alimento fresco de qualidade e procedência garantida.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Recibo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Sale Modal */}
      {showSaleModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-md w-full animate-in fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-stone-900 text-base mb-1">Registrar Nova Venda</h3>
            <p className="text-xs text-stone-500 mb-4">Vincule ao lote colhido para rastreabilidade automática.</p>

            <form onSubmit={handleCreateSale} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Cliente</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Produto / Cultura</label>
                  <select
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Tomate Italiano">Tomate Italiano</option>
                    <option value="Alface Crespa">Alface Crespa</option>
                    <option value="Pimentão Amarelo">Pimentão Amarelo</option>
                    <option value="Coentro Verdão">Coentro Verdão</option>
                    <option value="Milho Verde">Milho Verde</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Lote Colhido</label>
                  <select
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  >
                    <option value="TOM-2026-001">TOM-2026-001 (Tomate Italiano)</option>
                    <option value="ALF-2026-042">ALF-2026-042 (Alface Crespa)</option>
                    <option value="PIM-2026-018">PIM-2026-018 (Pimentão Amarelo)</option>
                    <option value="COEN-2026-095">COEN-2026-095 (Coentro Verdão)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Unidade</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="kg">kg</option>
                    <option value="caixas">caixas</option>
                    <option value="maços">maços</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Preço Unit. (R$)</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0.10"
                    required
                    value={unitPriceReais}
                    onChange={(e) => setUnitPriceReais(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Forma de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="PIX">PIX (Imediato)</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="A Prazo (30 dias)">A Prazo (30 dias)</option>
                    <option value="Boleto">Boleto Bancário</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Status Pagamento</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Pago">Pago</option>
                    <option value="Pendente">Pendente / A Receber</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex justify-between font-bold">
                <span>Total Calculado:</span>
                <span className="text-base font-extrabold">
                  R$ {(quantity * unitPriceReais).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="px-3.5 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Concluir Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-md w-full animate-in fade-in">
            <h3 className="font-bold text-stone-900 text-base mb-1">Cadastrar Cliente / Comprador</h3>
            <p className="text-xs text-stone-500 mb-4">Mantenha a agenda e histórico de contatos do produtor.</p>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nome / Razão Social</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Quitanda do Bairro ou Box 15 Ceasa"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tipo de Cliente</label>
                  <select
                    value={custType}
                    onChange={(e) => setCustType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Feirante">Feirante</option>
                    <option value="Supermercado">Supermercado</option>
                    <option value="Restaurante">Restaurante</option>
                    <option value="Cooperativa/Ceasa">Cooperativa / CEASA</option>
                    <option value="Consumidor Final">Consumidor Final</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(87) 99999-0000"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Endereço / Local de Entrega</label>
                <input
                  type="text"
                  placeholder="Ex: Banca 12 Feira Livre Central"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="px-3.5 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
