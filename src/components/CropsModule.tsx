import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Droplets,
  Sun,
  Thermometer,
  ShieldAlert,
  BookOpen,
  Calendar,
  Check,
  Search,
  Filter
} from 'lucide-react';
import { Crop } from '../types/agro';

interface CropsModuleProps {
  crops: Crop[];
  onAddCrop: (crop: Crop) => void;
}

export const CropsModule: React.FC<CropsModuleProps> = ({ crops, onAddCrop }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(crops[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New crop form state
  const [name, setName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [category, setCategory] = useState<Crop['category']>('Hortaliça');
  const [variety, setVariety] = useState('');
  const [cycleDays, setCycleDays] = useState(90);
  const [waterNeedDailyMm, setWaterNeedDailyMm] = useState(5.0);
  const [idealTempMinC, setIdealTempMinC] = useState(18);
  const [idealTempMaxC, setIdealTempMaxC] = useState(28);
  const [soilMoistureMinPct, setSoilMoistureMinPct] = useState(40);
  const [soilMoistureMaxPct, setSoilMoistureMaxPct] = useState(70);
  const [spacingCm, setSpacingCm] = useState('80 x 40 cm');
  const [managementTips, setManagementTips] = useState('');
  const [icon, setIcon] = useState('🌱');

  const filteredCrops = crops.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCrop: Crop = {
      id: `crop-${Date.now()}`,
      name,
      scientificName,
      category,
      variety,
      cycleDays: Number(cycleDays),
      waterNeedDailyMm: Number(waterNeedDailyMm),
      lightRequirement: 'Pleno Sol (6-8h)',
      idealTempMinC: Number(idealTempMinC),
      idealTempMaxC: Number(idealTempMaxC),
      soilMoistureMinPct: Number(soilMoistureMinPct),
      soilMoistureMaxPct: Number(soilMoistureMaxPct),
      spacingCm,
      commonPests: ['Pulgões', 'Lagartas'],
      commonDiseases: ['Podridão radicular', 'Fungos foliares'],
      managementTips: managementTips || 'Manejo balanceado com regas regulares e adubação orgânica.',
      icon: icon || '🌱',
    };

    onAddCrop(newCrop);
    setSelectedCrop(newCrop);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Search */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Biblioteca Agronômica</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Culturas & Guias de Manejo
            </h1>
            <p className="text-stone-500 text-xs mt-0.5">
              Parâmetros agronômicos, demanda hídrica ideal, ciclo produtivo e fitossanidade.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Cultura</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou nome científico (ex: Tomate, Solanum)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
            {['Todas', 'Hortaliça', 'Grão', 'Erva/Tempero', 'Tubérculo'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Crops Catalog & Active Inspection Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crops List */}
        <div className="space-y-3">
          {filteredCrops.map((crop) => {
            const isSelected = selectedCrop?.id === crop.id;
            return (
              <div
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-emerald-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl p-1 bg-white rounded-lg border border-stone-100 shadow-2xs">
                      {crop.icon || '🌱'}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-sm">{crop.name}</h3>
                      <p className="text-[11px] text-stone-500 italic">{crop.scientificName}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    {crop.cycleDays} dias
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-stone-600 pt-2 border-t border-stone-100">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    {crop.waterNeedDailyMm} mm/dia
                  </span>
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    {crop.idealTempMinC}°C - {crop.idealTempMaxC}°C
                  </span>
                  <span className="text-emerald-700 font-bold">{crop.category}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Crop Agronomic Detail Card */}
        <div className="lg:col-span-2">
          {selectedCrop ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl p-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                    {selectedCrop.icon || '🌱'}
                  </span>
                  <div>
                    <h2 className="text-xl font-black text-stone-900">{selectedCrop.name}</h2>
                    <p className="text-xs text-stone-500 italic">
                      {selectedCrop.scientificName} • Variedade: {selectedCrop.variety}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {selectedCrop.category}
                </span>
              </div>

              {/* Technical Agronomic Parameters Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-stone-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-600" /> Ciclo Médio
                  </span>
                  <span className="text-base font-extrabold text-stone-900 mt-1 block">
                    {selectedCrop.cycleDays} dias
                  </span>
                  <span className="text-[11px] text-stone-500">Da semeadura ao corte</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-stone-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" /> Demanda Hídrica
                  </span>
                  <span className="text-base font-extrabold text-blue-800 mt-1 block">
                    {selectedCrop.waterNeedDailyMm} mm/dia
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Solo: {selectedCrop.soilMoistureMinPct}% a {selectedCrop.soilMoistureMaxPct}%
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-stone-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-500" /> Temperatura
                  </span>
                  <span className="text-base font-extrabold text-amber-800 mt-1 block">
                    {selectedCrop.idealTempMinC}° a {selectedCrop.idealTempMaxC}°C
                  </span>
                  <span className="text-[11px] text-stone-500">Faixa ideal de conforto</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-stone-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                    <Sun className="w-3 h-3 text-yellow-500" /> Espaçamento
                  </span>
                  <span className="text-base font-extrabold text-stone-900 mt-1 block">
                    {selectedCrop.spacingCm}
                  </span>
                  <span className="text-[11px] text-stone-500">{selectedCrop.lightRequirement}</span>
                </div>
              </div>

              {/* Management Recommendations */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <h3 className="font-extrabold text-xs uppercase text-emerald-900 mb-1.5 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  Boas Práticas de Manejo & Tratos Culturais
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedCrop.managementTips}
                </p>
              </div>

              {/* Sanitary Guidance */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5 text-amber-700">
                  <ShieldAlert className="w-4 h-4" />
                  Cuidados Preventivos & Doenças Comuns
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-stone-600 text-[11px]">
                  {selectedCrop.commonDiseases.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              Selecione uma cultura para ver a ficha técnica.
            </div>
          )}
        </div>
      </div>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-lg w-full animate-in fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-stone-900 text-base mb-1">Cadastrar Nova Cultura</h3>
            <p className="text-xs text-stone-500 mb-4">Adicione uma espécie com parâmetros agronômicos personalizados.</p>

            <form onSubmit={handleCreateCrop} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nome Comum</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Melancia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nome Científico</label>
                  <input
                    type="text"
                    placeholder="Ex: Citrullus lanatus"
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Hortaliça">Hortaliça</option>
                    <option value="Frutífera">Frutífera</option>
                    <option value="Grão">Grão</option>
                    <option value="Erva/Tempero">Erva/Tempero</option>
                    <option value="Tubérculo">Tubérculo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Variedade</label>
                  <input
                    type="text"
                    placeholder="Ex: Crimson Sweet"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Ícone Emoji</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-center text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Ciclo (dias)</label>
                  <input
                    type="number"
                    value={cycleDays}
                    onChange={(e) => setCycleDays(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Água (mm/dia)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={waterNeedDailyMm}
                    onChange={(e) => setWaterNeedDailyMm(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Espaçamento</label>
                  <input
                    type="text"
                    value={spacingCm}
                    onChange={(e) => setSpacingCm(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dicas de Manejo e Colheita</label>
                <textarea
                  rows={3}
                  value={managementTips}
                  onChange={(e) => setManagementTips(e.target.value)}
                  placeholder="Instruções para adubação, poda e momento ideal de colheita..."
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
                  Salvar Cultura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
