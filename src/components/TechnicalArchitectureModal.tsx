import React, { useState } from 'react';
import {
  X,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  RefreshCw,
  GitMerge,
  Server,
  Smartphone,
  Sliders,
  CheckCircle2,
  FileCode,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalArchitectureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'flow' | 'er' | 'api' | 'offline' | 'roadmap'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Especificação Técnica & Arquitetura do Sistema
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300">
                  Entregáveis Seção 40
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Documentação estrutural da Plataforma de Gestão Rural AgroConnect
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex space-x-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'architecture', label: '1. Arquitetura em Camadas', icon: Cpu },
            { id: 'flow', label: '2. Fluxo Operacional & IA', icon: GitMerge },
            { id: 'er', label: '3. Modelo ER & Tabelas', icon: Database },
            { id: 'api', label: '4. Endpoints & APIs', icon: FileCode },
            { id: 'offline', label: '5. Modo Offline & Sync', icon: RefreshCw },
            { id: 'roadmap', label: '6. Módulos Entregues', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-800 text-sm">
          {activeSection === 'architecture' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">
                  1. Arquitetura do Sistema Multicamadas (Multi-Tier)
                </h3>
                <p className="text-xs text-stone-600">
                  Estrutura escalável projetada para pequenos e médios produtores com operação Local-First e sincronização centralizada.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                {/* Camada 1: Campo */}
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-700" />
                      1. Operação em Campo
                    </div>
                    <ul className="space-y-1 text-stone-600 text-[11px] list-disc list-inside">
                      <li>Modo Campo Mobile Simplificado</li>
                      <li>Apontamento de Colheitas & Lotes</li>
                      <li>Vendas Diretas em Feira/Box</li>
                      <li>Caderno de Campo Rápido</li>
                      <li>Armazenamento Local-First</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-200 text-[10px] text-amber-800 font-mono">
                    Sync: Offline Queue + REST
                  </div>
                </div>

                {/* Camada 2: Backend */}
                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-blue-700" />
                      2. Backend & Assistente
                    </div>
                    <ul className="space-y-1 text-stone-600 text-[11px] list-disc list-inside">
                      <li>Node.js / Express REST API</li>
                      <li>Chatbot Gemini Agrônomo</li>
                      <li>Motor Agronômico de Contingência</li>
                      <li>Fila de Sincronização Offline</li>
                      <li>Persistência Unificada de Estado</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-200 text-[10px] text-blue-800 font-mono">
                    Runtime: TypeScript / Express
                  </div>
                </div>

                {/* Camada 3: Dados */}
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-purple-700" />
                      3. Dados & Rastreio
                    </div>
                    <ul className="space-y-1 text-stone-600 text-[11px] list-disc list-inside">
                      <li>Catálogo de Culturas & Guias</li>
                      <li>Plantios & Lotes Rastreáveis</li>
                      <li>Rastreabilidade de Colheitas</li>
                      <li>Vendas & Carteira de Clientes</li>
                      <li>Financeiro & Estoque integrado</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-purple-200 text-[10px] text-purple-800 font-mono">
                    Persistência: Estado + Cache Local
                  </div>
                </div>

                {/* Camada 4: Aplicações */}
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-700" />
                      4. Interfaces de Acesso
                    </div>
                    <ul className="space-y-1 text-stone-600 text-[11px] list-disc list-inside">
                      <li>Login Dedicado para Agricultores</li>
                      <li>Painel Web ERP Completo</li>
                      <li>Modo Campo (Mobile)</li>
                      <li>Etiquetas com Lote de Rastreio</li>
                      <li>Relatórios Gerenciais Exportáveis</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-200 text-[10px] text-emerald-800 font-mono">
                    Frontend: React SPA + Tailwind
                  </div>
                </div>
              </div>

              {/* Hierarchy schema */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="font-bold text-xs uppercase text-stone-600 mb-2">
                  Fluxo Produtivo da Propriedade:
                </h4>
                <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-stone-700">
                  <span className="px-2.5 py-1 bg-white rounded-md border border-stone-300">
                    Fazenda Vista Verde — Família Bragança
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Cultura: Tomate Italiano (Lote TOM-2026-001)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="px-2.5 py-1 bg-white rounded-md border border-stone-300">
                    Colheita & Venda Rastreada
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'flow' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-base">
                2. Fluxo Operacional de Rastreabilidade & Assistente Gemini
              </h3>
              <p className="text-xs text-stone-600">
                Integração direta entre cadastros de produção, vendas e apoio técnico ao produtor:
              </p>

              <div className="p-4 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs space-y-2 border border-stone-800">
                <p className="text-emerald-400 font-bold">// 1. Ciclo Produtivo & Rastreabilidade</p>
                <p>Cultura ➜ Lote TOM-2026-001 (Tomate Italiano) ➜ Colheita (kg) ➜ Venda & Recibo</p>

                <p className="text-amber-400 font-bold pt-2">// 2. Consulta Agronômica (Chatbot Gemini Dr. Agro)</p>
                <p>Produtor envia dúvida (dosagem 20L, adubação, carência) ➜ POST /api/chat-pest</p>
                <p className="pl-4 text-emerald-300">➜ Cascata Server-Side: Gemini 3.1 Flash Lite ➜ Gemini 3.8 Flash ➜ Motor Local</p>
                <p className="pl-4 text-stone-400">➜ Resposta contextualizada para Fazenda Vista Verde (Dom Expedito Lopes - PI)</p>

                <p className="text-blue-400 font-bold pt-2">// 3. Gestão de Estoque & Financeiro</p>
                <p>Colheita / Venda / Despesa ➜ Atualiza saldo líquido e gera relatórios gerenciais</p>
              </div>
            </div>
          )}

          {activeSection === 'er' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-base">
                3. Modelo Relacional de Dados (Entidades Principais)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {[
                  {
                    t: 'propriedades',
                    fields: ['id (PK)', 'nome', 'proprietario', 'area_total', 'area_produtiva', 'tipo_solo'],
                  },
                  {
                    t: 'culturas',
                    fields: ['id (PK)', 'nome', 'nome_cientifico', 'ciclo_dias', 'temp_ideal_min_max'],
                  },
                  {
                    t: 'plantios_lotes',
                    fields: ['id (PK)', 'codigo_lote (UK)', 'cultura_id (FK)', 'data_plantio', 'previsao_colheita', 'estagio'],
                  },
                  {
                    t: 'colheitas',
                    fields: ['id (PK)', 'lote_id (FK)', 'data', 'quantidade', 'unidade', 'classificacao', 'custo_producao'],
                  },
                  {
                    t: 'vendas',
                    fields: ['id (PK)', 'numero_pedido', 'cliente_id (FK)', 'lote_id (FK)', 'quantidade', 'preco_total', 'forma_pagamento'],
                  },
                  {
                    t: 'clientes',
                    fields: ['id (PK)', 'nome', 'documento', 'tipo_cliente', 'telefone', 'endereco'],
                  },
                  {
                    t: 'estoque_insumos',
                    fields: ['id (PK)', 'nome', 'categoria', 'quantidade_atual', 'estoque_minimo', 'validade', 'custo_unit'],
                  },
                  {
                    t: 'despesas_financeiras',
                    fields: ['id (PK)', 'data', 'categoria', 'descricao', 'valor_reais', 'status_pagamento'],
                  },
                  {
                    t: 'agenda_agricola',
                    fields: ['id (PK)', 'data', 'titulo', 'tipo', 'cultura_ou_lote', 'concluido'],
                  },
                ].map((item) => (
                  <div key={item.t} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold font-mono text-stone-900 border-b border-stone-200 pb-1 mb-1.5 flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-emerald-600" />
                      {item.t}
                    </div>
                    <ul className="text-[11px] text-stone-600 space-y-0.5">
                      {item.fields.map((f, i) => (
                        <li key={i} className={f.includes('PK') ? 'font-bold text-stone-800' : ''}>
                          • {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-base">
                4. Especificação de APIs REST
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { method: 'GET', path: '/api/health', desc: 'Verifica disponibilidade do servidor AgroConnect e configuração Gemini' },
                  { method: 'GET', path: '/api/data', desc: 'Retorna estado sincronizado da propriedade, lotes, vendas e estoque' },
                  { method: 'POST', path: '/api/chat-pest', desc: 'Assistente agronômico Chatbot Gemini para dúvidas sobre manejo, dosagens e cultivos' },
                  { method: 'POST', path: '/api/save-state', desc: 'Persiste atualizações de produção, vendas, estoque e financeiro no servidor' },
                  { method: 'POST', path: '/api/sync', desc: 'Processa fila de ações offline salvas no celular quando a conexão for restabelecida' },
                ].map((ep, i) => (
                  <div key={i} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono font-bold text-stone-800">{ep.path}</span>
                    </div>
                    <span className="text-stone-500 text-[11px] text-right">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'offline' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-base">
                5. Funcionamento Offline & Resolução de Conflitos
              </h3>
              <p className="text-xs text-stone-600">
                Pequenos produtores frequentemente atuam em áreas rurais sem sinal 4G. O sistema implementa arquitetura Local-First:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    1. Operação Desconectada
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    O produtor registra colheitas, vendas e despesas direto no celular. Cada ação recebe UUID e timestamp.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                    2. Fila LocalStorage
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    As requisições são enfileiradas na lista de sincronização com estado pendente e badge visual para o usuário.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    3. Resolução Last-Write-Wins
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Ao detectar rede Wi-Fi/4G, a fila é enviada em lote ao backend via POST /api/sync com validação de estado.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'roadmap' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-base">
                6. Módulos Ativos no AgroConnect
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                {[
                  { fase: 'MÓDULO 1', t: 'Login & Perfis Rurais', s: 'Ativo' },
                  { fase: 'MÓDULO 2', t: 'Culturas & Guias', s: 'Ativo' },
                  { fase: 'MÓDULO 3', t: 'Produção & Lotes', s: 'Ativo' },
                  { fase: 'MÓDULO 4', t: 'Estoque & Custos', s: 'Ativo' },
                  { fase: 'MÓDULO 5', t: 'Vendas & Clientes', s: 'Ativo' },
                  { fase: 'MÓDULO 6', t: 'Chatbot Gemini Agrônomo', s: 'Ativo' },
                  { fase: 'MÓDULO 7', t: 'App Modo Campo Mobile', s: 'Ativo' },
                  { fase: 'MÓDULO 8', t: 'Painel Web ERP', s: 'Ativo' },
                  { fase: 'MÓDULO 9', t: 'Relatórios & Agenda', s: 'Ativo' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">{item.fase}</span>
                      <span className="font-semibold text-stone-800 text-xs">{item.t}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>AgroConnect • Fazenda Vista Verde • Dom Expedito Lopes - PI</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Fechar Especificação
          </button>
        </div>
      </div>
    </div>
  );
};
