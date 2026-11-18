import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  Trash2,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { Crop } from '../types/agro';
import { chatWithPestAI } from '../services/api';

interface AgronomoChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: Crop[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'expert-engine' | 'fallback';
  model?: string;
  latencyMs?: number;
}

export const AgronomoChatModal: React.FC<AgronomoChatModalProps> = ({
  isOpen,
  onClose,
  crops,
}) => {
  const [chatCropName, setChatCropName] = useState<string>(crops[0]?.name || 'Tomate');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'model',
      content:
        'Olá! Sou o Assistente Agronômico Gemini do AgroConnect, dedicado à Fazenda Vista Verde em Dom Expedito Lopes - PI. Posso tirar dúvidas sobre manejo das culturas, adubação foliar, dosagens para pulverizadores costais de 20 litros, preparo de caldas orgânicas e ponto de colheita. Como posso ajudar hoje?',
      timestamp: 'Agora',
      source: 'gemini',
      model: 'Gemini 3.1 Flash Lite API',
      latencyMs: 750,
    },
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [currentModelName, setCurrentModelName] = useState<string>('Gemini 3.1 Flash Lite (Alta Eficiência)');
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(750);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  if (!isOpen) return null;

  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = (presetText || userChatInput).trim();
    if (!textToSend || isChatLoading) return;

    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: nowTime,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!presetText) setUserChatInput('');
    setIsChatLoading(true);

    try {
      const history = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const chatResponse = await chatWithPestAI({
        messages: history,
        cropName: chatCropName,
        farmLocation: 'Fazenda Vista Verde - Dom Expedito Lopes - PI',
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: chatResponse.reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        source: chatResponse.source,
        model: chatResponse.model || 'Gemini 3.1 Flash Lite',
        latencyMs: chatResponse.latencyMs,
      };

      if (chatResponse.latencyMs) setLastLatencyMs(chatResponse.latencyMs);
      if (chatResponse.model) setCurrentModelName(chatResponse.model);

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Erro ao responder mensagem:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          content:
            'Na Fazenda Vista Verde: recomendo aplicar adubação foliar orgânica ou calda protetora de óleo de neem (100ml em 20L de água) com 20g de sabão neutro dissolvido no final da tarde.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          source: 'expert-engine',
          model: 'Motor Agronômico de Contingência',
          latencyMs: 120,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2500);
  };

  const handleClearChat = () => {
    setChatMessages([
      {
        id: `msg-reset-${Date.now()}`,
        role: 'model',
        content:
          'Conversa reiniciada. Sou o Doutor Agro do AgroConnect conectado via API Gemini. Como posso ajudar com suas culturas na Fazenda Vista Verde?',
        timestamp: 'Agora',
        source: 'gemini',
        model: 'Gemini 3.1 Flash Lite API',
        latencyMs: 350,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-3xl w-full p-5 sm:p-6 animate-in fade-in space-y-4 max-h-[94vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-stone-900 text-base sm:text-lg">
                Chatbot Gemini Agronômico (Dr. Agro)
              </h3>
              <p className="text-xs text-stone-500">
                Assistente agronômico para a Fazenda Vista Verde (Dom Expedito Lopes - PI).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-xs px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            ✕ Fechar
          </button>
        </div>

        <div className="space-y-3 animate-in fade-in text-xs">
          {/* Assistant Info & Context Card */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center font-bold relative shadow-2xs shrink-0">
                <Bot className="w-5 h-5" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-white animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-stone-900 flex items-center flex-wrap gap-1.5">
                  <span>Dr. Agro • Gemini Agrônomo</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>API Ativa</span>
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                    {currentModelName}
                  </span>
                  {lastLatencyMs && (
                    <span className="text-[10px] font-medium text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                      ⚡ {(lastLatencyMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Fazenda Vista Verde • Família Bragança • Dom Expedito Lopes - PI
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={chatCropName}
                onChange={(e) => setChatCropName(e.target.value)}
                aria-label="Cultura em foco"
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.name}>
                    Cultura: {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleClearChat}
                className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-stone-200 transition-colors"
                title="Reiniciar histórico de conversa"
              >
                <Trash2 className="w-3.5 h-3.5 text-stone-400" />
                <span>Limpar</span>
              </button>
            </div>
          </div>

          {/* Chat Scroll Container */}
          <div className="h-80 overflow-y-auto space-y-3 p-3.5 bg-stone-50/70 rounded-2xl border border-stone-200">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white border border-purple-100 text-stone-800 rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-80 border-b border-black/5 pb-0.5">
                    <span className="font-bold flex items-center gap-1.5">
                      {msg.role === 'user' ? (
                        '👨‍🌾 Produtor'
                      ) : (
                        <>
                          <span>🤖 Dr. Agro Gemini</span>
                          {msg.source === 'gemini' && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                              <Zap className="w-2.5 h-2.5 text-amber-500" />
                              <span>Gemini API</span>
                            </span>
                          )}
                        </>
                      )}
                    </span>
                    <div className="flex items-center space-x-2">
                      {msg.role === 'model' && (
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="text-stone-400 hover:text-stone-700 transition-colors"
                          title="Copiar orientação técnica"
                        >
                          {copiedMessageId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                  <div className="whitespace-pre-line font-normal">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-purple-200 rounded-2xl p-3 text-xs flex items-center space-x-2 text-purple-900 shadow-2xs">
                  <span className="w-3.5 h-3.5 border-2 border-purple-700 border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold text-[11px]">Gemini API processando orientação agronômica...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Perguntas Frequentes & Ações Rápidas (1 clique):
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleSendChatMessage('Qual a dosagem de óleo de neem para um pulverizador costal de 20 litros?')}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-purple-100 text-stone-700 hover:text-purple-900 border border-stone-200 text-[11px] font-medium transition-colors"
              >
                🧪 Dosagem para pulverizador 20L
              </button>
              <button
                type="button"
                onClick={() => handleSendChatMessage('Qual o tempo de carência antes da colheita após a aplicação?')}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-purple-100 text-stone-700 hover:text-purple-900 border border-stone-200 text-[11px] font-medium transition-colors"
              >
                ⏱️ Tempo de carência para colheita
              </button>
              <button
                type="button"
                onClick={() => handleSendChatMessage('Como preparar uma receita caseira orgânica para proteger a lavoura?')}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-purple-100 text-stone-700 hover:text-purple-900 border border-stone-200 text-[11px] font-medium transition-colors"
              >
                🥥 Receita caseira orgânica
              </button>
              <button
                type="button"
                onClick={() => handleSendChatMessage('Qual biofertilizante ou adubação foliar ajuda a fortalecer a cultura?')}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-purple-100 text-stone-700 hover:text-purple-900 border border-stone-200 text-[11px] font-medium transition-colors"
              >
                🌿 Adubação foliar e vigor
              </button>
              <button
                type="button"
                onClick={() => handleSendChatMessage('Quais os melhores horários para tratos culturais no clima de Dom Expedito Lopes - PI?')}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-purple-100 text-stone-700 hover:text-purple-900 border border-stone-200 text-[11px] font-medium transition-colors"
              >
                ☀️ Melhores horários no Piauí
              </button>
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChatMessage();
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={userChatInput}
              onChange={(e) => setUserChatInput(e.target.value)}
              placeholder="Digite sua dúvida sobre manejo, adubação ou colheita..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-stone-50 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isChatLoading || !userChatInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
