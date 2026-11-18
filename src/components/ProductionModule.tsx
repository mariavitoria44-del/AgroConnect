import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  QrCode,
  Calendar,
  CheckCircle2,
  Printer,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  PackageCheck
} from 'lucide-react';
import { Planting, Harvest, Property, Crop } from '../types/agro';

interface ProductionModuleProps {
  plantings: Planting[];
  harvests: Harvest[];
  properties: Property[];
  crops: Crop[];
  onAddPlanting: (planting: Planting) => void;
  onAddHarvest: (harvest: Harvest) => void;
}

export const ProductionModule: React.FC<ProductionModuleProps> = ({
  plantings,
  harvests,
  properties,
  crops,
  onAddPlanting,
  onAddHarvest,
}) => {
  const [activeTab, setActiveTab] = useState<'lotes' | 'colheitas'>('lotes');
  const [showNewPlantingModal, setShowNewPlantingModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [selectedPlantingForHarvest, setSelectedPlantingForHarvest] = useState<Planting | null>(null);
  const [selectedLotForTraceability, setSelectedLotForTraceability] = useState<Planting | null>(null);

  // Form states for new planting
  const [cropId, setCropId] = useState(crops[0]?.id || '');
  const [fieldId, setFieldId] = useState(properties[0]?.fields[0]?.id || '');
  const [areaId, setAreaId] = useState(properties[0]?.fields[0]?.areas[0]?.id || '');
  const [plantedAreaHa, setPlantedAreaHa] = useState(3.0);
  const [plantingDate, setPlantingDate] = useState('2026-10-06');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('2027-01-15');
  const [seedlingsCount, setSeedlingsCount] = useState(10000);
  const [estimatedYieldKg, setEstimatedYieldKg] = useState(20000);
  const [responsibleName, setResponsibleName] = useState('Severino Rocha');

  // Form states for harvest
  const [harvestQty, setHarvestQty] = useState(500);
  const [harvestUnit, setHarvestUnit] = useState<Harvest['unit']>('kg');
  const [qualityGrade, setQualityGrade] = useState<Harvest['qualityGrade']>('Tipo 1 (Extra)');
  const [lossesQty, setLossesQty] = useState(15);
  const [destination, setDestination] = useState('CEASA e Mercado Municipal');

  const handleCreatePlanting = (e: React.FormEvent) => {
    e.preventDefault();
    const selCrop = crops.find((c) => c.id === cropId);
    const selField = properties[0]?.fields.find((f) => f.id === fieldId);
    const selArea = selField?.areas.find((a) => a.id === areaId);

    const prefix = selCrop?.name.substring(0, 3).toUpperCase() || 'CUL';
    const rand = Math.floor(100 + Math.random() * 900);
    const lotNumber = `${prefix}-2026-${rand}`;

    const newPlant: Planting = {
      id: `plant-${Date.now()}`,
      lotNumber,
      cropId,
      cropName: selCrop?.name || 'Cultura',
      variety: selCrop?.variety || 'Padrão',
      fieldId: fieldId,
      fieldName: selField?.name || 'Setor Principal',
      areaId: areaId,
      areaName: selArea?.name || 'Área Principal',
      plantedAreaHa: Number(plantedAreaHa),
      plantingDate,
      expectedHarvestDate,
      seedlingsCount: Number(seedlingsCount),
      stage: 'Semeadura',
      irrigationType: 'Gotejamento Automatizado',
      responsibleName,
      estimatedYieldKg: Number(estimatedYieldKg),
      harvestedYieldKg: 0,
      status: 'Ativo',
    };

    onAddPlanting(newPlant);
    setShowNewPlantingModal(false);
  };

  const handleRegisterHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlantingForHarvest) return;

    const newHarv: Harvest = {
      id: `harv-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      lotNumber: selectedPlantingForHarvest.lotNumber,
      cropName: selectedPlantingForHarvest.cropName,
      fieldName: selectedPlantingForHarvest.fieldName,
      quantity: Number(harvestQty),
      unit: harvestUnit,
      qualityGrade,
      lossesQty: Number(lossesQty),
      destination,
      registeredBy: 'Equipe de Campo',
      productionCostReais: Number(harvestQty) * 1.85,
    };

    onAddHarvest(newHarv);
    setShowHarvestModal(false);
    setSelectedPlantingForHarvest(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4" />
            <span>Gestão da Produção & Rastreabilidade</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Plantio, Ciclo Vegetativo & Colheita
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Acompanhe o cronograma da cultura, geração de lotes agrícolas e emissão de etiquetas rastreáveis.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewPlantingModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Plantio</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('lotes')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'lotes'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Lotes Ativos em Produção ({plantings.filter((p) => p.status === 'Ativo').length})
        </button>

        <button
          onClick={() => setActiveTab('colheitas')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'colheitas'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Histórico de Colheitas ({harvests.length})
        </button>
      </div>

      {/* Tab: Lotes Ativos */}
      {activeTab === 'lotes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plantings.map((p) => {
              const stages = [
                'Semeadura',
                'Germinação',
                'Desenvolvimento Vegetativo',
                'Floração',
                'Frutificação',
                'Colheita',
              ];
              const currentStageIndex = stages.indexOf(p.stage);

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-black text-stone-900 text-base">{p.cropName}</h3>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                          {p.lotNumber}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Variedade: <span className="font-semibold text-stone-700">{p.variety}</span> • Área: {p.plantedAreaHa} ha
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {p.stage}
                    </span>
                  </div>

                  {/* Vegetative Stages Stepper */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1.5">
                      Estágio Fenológico da Cultura
                    </span>
                    <div className="grid grid-cols-6 gap-1">
                      {stages.map((stg, idx) => {
                        const isDone = idx <= currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        return (
                          <div key={stg} className="text-center">
                            <div
                              className={`h-2 rounded-full mb-1 transition-all ${
                                isCurrent
                                  ? 'bg-emerald-600 ring-2 ring-emerald-300'
                                  : isDone
                                  ? 'bg-emerald-500'
                                  : 'bg-stone-200'
                              }`}
                            />
                            <span
                              className={`text-[9px] block truncate ${
                                isCurrent ? 'font-bold text-emerald-900' : 'text-stone-400'
                              }`}
                              title={stg}
                            >
                              {stg.split(' ')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Planned vs Realized */}
                  <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <div>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                        Estimativa Produção
                      </span>
                      <span className="font-extrabold text-stone-900 text-sm">
                        {p.estimatedYieldKg.toLocaleString()} kg
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        Área: {p.plantedAreaHa} ha ({p.seedlingsCount.toLocaleString()} mudas)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                        Colhido até Agora
                      </span>
                      <span className="font-extrabold text-emerald-800 text-sm">
                        {p.harvestedYieldKg.toLocaleString()} kg
                      </span>
                      <span className="text-[10px] text-emerald-700 block">
                        {((p.harvestedYieldKg / p.estimatedYieldKg) * 100).toFixed(0)}% da meta
                      </span>
                    </div>
                  </div>

                  {/* Dates & Footer Actions */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                    <span className="text-stone-500 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      Colheita Prevista: {new Date(p.expectedHarvestDate).toLocaleDateString('pt-BR')}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedLotForTraceability(p)}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-100 flex items-center gap-1"
                        title="Ver e Imprimir Etiqueta de Rastreabilidade para Caixas"
                      >
                        <QrCode className="w-3.5 h-3.5 text-stone-600" />
                        <span>Etiqueta</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPlantingForHarvest(p);
                          setShowHarvestModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Colher</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Colheitas */}
      {activeTab === 'colheitas' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Registros de Colheita & Destinação</span>
            <span className="text-stone-500 font-normal">Total colhido rastreado</span>
          </div>

          <div className="divide-y divide-stone-100">
            {harvests.map((h) => (
              <div key={h.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-stone-900 text-sm">{h.cropName}</span>
                    <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                      {h.lotNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {h.qualityGrade}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Data: {new Date(h.date).toLocaleDateString('pt-BR')} • Destino: {h.destination}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-stone-900">
                      {h.quantity.toLocaleString()} {h.unit}
                    </span>
                    <span className="block text-[10px] text-stone-400">
                      Perdas de campo: {h.lossesQty} {h.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traceability Tag Printable Preview Modal (Section 36) */}
      {selectedLotForTraceability && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 max-w-md w-full animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                Etiqueta de Rastreabilidade Rural
              </h3>
              <button
                onClick={() => setSelectedLotForTraceability(null)}
                className="text-xs text-stone-400 hover:text-stone-700"
              >
                ✕ Fechar
              </button>
            </div>

            {/* Printable Tag Container */}
            <div className="p-4 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50/60 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                    PRODUÇÃO RURAL FAMILIAR
                  </span>
                  <h4 className="font-black text-stone-900 text-sm">FAZENDA VISTA VERDE</h4>
                  <p className="text-[10px] text-stone-500">Família Bragança • Dom Expedito Lopes - PI • Selo PRONAF</p>
                </div>
                <div className="w-14 h-14 bg-white p-1 rounded border border-stone-300 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-stone-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">PRODUTO:</span>
                  <span className="font-black text-stone-900">{selectedLotForTraceability.cropName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">VARIEDADE:</span>
                  <span className="font-bold text-stone-800">{selectedLotForTraceability.variety}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">LOTE RASTREADO:</span>
                  <span className="font-mono font-extrabold text-emerald-800 text-xs">
                    {selectedLotForTraceability.lotNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">ORIGEM:</span>
                  <span className="font-bold text-stone-800">
                    Fazenda Vista Verde ({selectedLotForTraceability.plantedAreaHa} ha)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">DATA PLANTIO:</span>
                  <span className="font-medium text-stone-700">{selectedLotForTraceability.plantingDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">COLHEITA PREV.:</span>
                  <span className="font-bold text-stone-900">
                    {selectedLotForTraceability.expectedHarvestDate}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 text-center text-[10px] text-stone-500">
                Aponte a câmera para consultar a ficha agronômica e procedência deste alimento.
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end space-x-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Etiquetas de Caixa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Harvest Modal */}
      {showHarvestModal && selectedPlantingForHarvest && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-md w-full animate-in fade-in">
            <h3 className="font-bold text-stone-900 text-base mb-1">Registrar Colheita</h3>
            <p className="text-xs text-stone-500 mb-4">
              Lote: <span className="font-bold text-stone-800">{selectedPlantingForHarvest.lotNumber}</span> ({selectedPlantingForHarvest.cropName})
            </p>

            <form onSubmit={handleRegisterHarvest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantidade Colhida</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={harvestQty}
                    onChange={(e) => setHarvestQty(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Unidade</label>
                  <select
                    value={harvestUnit}
                    onChange={(e) => setHarvestUnit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="kg">kg (Quilogramas)</option>
                    <option value="caixas">caixas (48L Padrão)</option>
                    <option value="maços">maços (Folhosas)</option>
                    <option value="toneladas">toneladas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Classificação / Qualidade</label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Tipo 1 (Extra)">Tipo 1 (Extra / Comercial Superior)</option>
                    <option value="Tipo 2 (Comercial)">Tipo 2 (Comercial Padrão)</option>
                    <option value="Industrial">Industrial / Processamento</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Perdas no Campo ({harvestUnit})</label>
                  <input
                    type="number"
                    min="0"
                    value={lossesQty}
                    onChange={(e) => setLossesQty(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Destinação Prevista</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ex: CEASA Box 44 e Feira de Domingo"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowHarvestModal(false)}
                  className="px-3.5 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Confirmar Colheita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Planting Modal */}
      {showNewPlantingModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-lg w-full animate-in fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-stone-900 text-base mb-1">Registrar Novo Plantio</h3>
            <p className="text-xs text-stone-500 mb-4">
              O sistema gerará automaticamente o código do lote para rastreamento.
            </p>

            <form onSubmit={handleCreatePlanting} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cultura</label>
                  <select
                    value={cropId}
                    onChange={(e) => setCropId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.variety})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Área de Cultivo</label>
                  <select
                    value={fieldId}
                    onChange={(e) => {
                      setFieldId(e.target.value);
                      const f = properties[0]?.fields.find((item) => item.id === e.target.value);
                      if (f && f.areas[0]) setAreaId(f.areas[0].id);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {properties[0]?.fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.areaHa} ha)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Área Plantada (ha)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={plantedAreaHa}
                    onChange={(e) => setPlantedAreaHa(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Qtd. Mudas/Sementes</label>
                  <input
                    type="number"
                    min="100"
                    value={seedlingsCount}
                    onChange={(e) => setSeedlingsCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Produção Prevista (kg)</label>
                  <input
                    type="number"
                    min="100"
                    value={estimatedYieldKg}
                    onChange={(e) => setEstimatedYieldKg(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Data de Plantio</label>
                  <input
                    type="date"
                    required
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Previsão de Colheita</label>
                  <input
                    type="date"
                    required
                    value={expectedHarvestDate}
                    onChange={(e) => setExpectedHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Responsável Técnico/Operador</label>
                <input
                  type="text"
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowNewPlantingModal(false)}
                  className="px-3.5 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Iniciar Lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
