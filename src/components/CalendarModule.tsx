import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  Sprout,
  Droplets,
  Package,
  ShieldAlert,
  DollarSign
} from 'lucide-react';
import { CalendarEvent } from '../types/agro';

interface CalendarModuleProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onToggleComplete: (eventId: string) => void;
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({
  events,
  onAddEvent,
  onToggleComplete,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New event form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CalendarEvent['type']>('Adubação');
  const [date, setDate] = useState('2026-10-12');
  const [lotOrCrop, setLotOrCrop] = useState('Tomate Italiano');
  const [location, setLocation] = useState('Setor Hortaliças');

  const filteredEvents = events.filter((e) => {
    if (selectedFilter === 'Todos') return true;
    return e.type === selectedFilter;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      date,
      title,
      type,
      lotOrCrop,
      location,
      completed: false,
    };

    onAddEvent(newEv);
    setShowAddModal(false);
    setTitle('');
  };

  const getEventIcon = (t: CalendarEvent['type']) => {
    switch (t) {
      case 'Irrigação':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'Colheita':
        return <Package className="w-4 h-4 text-amber-600" />;
      case 'Inspeção':
        return <ShieldAlert className="w-4 h-4 text-purple-600" />;
      case 'Venda/Entrega':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'Plantio':
      case 'Adubação':
      default:
        return <Sprout className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>Cronograma da Fazenda</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Calendário Agrícola & Lembretes
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Planejamento de plantios, adubações, vistorias e janelas de colheita.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Atividade</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {['Todos', 'Irrigação', 'Adubação', 'Inspeção', 'Colheita', 'Venda/Entrega', 'Plantio'].map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === f
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Events Timeline / List */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="space-y-3">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onToggleComplete(ev.id)}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                ev.completed
                  ? 'bg-stone-50/70 border-stone-200 opacity-60'
                  : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    ev.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-stone-300 hover:border-emerald-500'
                  }`}
                >
                  {ev.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded bg-stone-100">{getEventIcon(ev.type)}</span>
                    <h3
                      className={`font-bold text-xs ${
                        ev.completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {ev.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {ev.type}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Data: <strong className="text-stone-700">{new Date(ev.date).toLocaleDateString('pt-BR')}</strong> • {ev.lotOrCrop} • Local: {ev.location}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  ev.completed ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {ev.completed ? 'Concluído' : 'Pendente'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-md w-full animate-in fade-in">
            <h3 className="font-bold text-stone-900 text-base mb-1">Agendar Atividade Agrícola</h3>
            <p className="text-xs text-stone-500 mb-4">Mantenha a rotina da fazenda organizada com lembretes.</p>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Título da Atividade</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pulverização preventiva ou Adubação NPK"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tipo de Evento</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Irrigação">Irrigação</option>
                    <option value="Adubação">Adubação</option>
                    <option value="Inspeção">Vistoria Técnica</option>
                    <option value="Colheita">Colheita</option>
                    <option value="Venda/Entrega">Venda / Entrega</option>
                    <option value="Plantio">Plantio</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Data Programada</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cultura / Lote</label>
                  <input
                    type="text"
                    value={lotOrCrop}
                    onChange={(e) => setLotOrCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Localização / Setor</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
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
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
