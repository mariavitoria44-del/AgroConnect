import {
  Property,
  Crop,
  Planting,
  Sensor,
  Actuator,
  IrrigationRule,
  IrrigationLog,
  PestReport,
  Recommendation,
  InventoryItem,
  StockMovement,
  Harvest,
  Customer,
  Sale,
  Expense,
  CalendarEvent,
  SyncQueueItem
} from '../types/agro';

import {
  INITIAL_PROPERTIES,
  INITIAL_CROPS,
  INITIAL_PLANTINGS,
  INITIAL_SENSORS,
  INITIAL_ACTUATORS,
  INITIAL_RULES,
  INITIAL_IRRIGATION_LOGS,
  INITIAL_PESTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_INVENTORY,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_HARVESTS,
  INITIAL_CUSTOMERS,
  INITIAL_SALES,
  INITIAL_EXPENSES,
  INITIAL_CALENDAR_EVENTS,
} from '../data/mockData';

const LOCAL_STORAGE_KEY = 'agroconnect_farm_db_v1';
const QUEUE_STORAGE_KEY = 'agroconnect_offline_queue_v1';

export interface AgroDatabase {
  properties: Property[];
  crops: Crop[];
  plantings: Planting[];
  sensors: Sensor[];
  actuators: Actuator[];
  rules: IrrigationRule[];
  irrigationLogs: IrrigationLog[];
  pests: PestReport[];
  recommendations: Recommendation[];
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  harvests: Harvest[];
  customers: Customer[];
  sales: Sale[];
  expenses: Expense[];
  calendarEvents: CalendarEvent[];
}

export function loadLocalDatabase(): AgroDatabase {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.properties && parsed.crops && parsed.plantings) {
        if (parsed.properties[0] && (parsed.properties[0].name === 'Fazenda Boa Esperança' || !parsed.properties[0].name.includes('Vista Verde'))) {
          parsed.properties[0].name = 'Fazenda Vista Verde';
          parsed.properties[0].ownerName = 'Família Bragança (José de Bragança)';
          parsed.properties[0].notes = 'Propriedade da Família Bragança assistida pelo PRONAF em Dom Expedito Lopes - PI.';
          saveLocalDatabase(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler banco local:', e);
  }

  // Initial Seed
  const initialDb: AgroDatabase = {
    properties: INITIAL_PROPERTIES,
    crops: INITIAL_CROPS,
    plantings: INITIAL_PLANTINGS,
    sensors: INITIAL_SENSORS,
    actuators: INITIAL_ACTUATORS,
    rules: INITIAL_RULES,
    irrigationLogs: INITIAL_IRRIGATION_LOGS,
    pests: INITIAL_PESTS,
    recommendations: INITIAL_RECOMMENDATIONS,
    inventory: INITIAL_INVENTORY,
    stockMovements: INITIAL_STOCK_MOVEMENTS,
    harvests: INITIAL_HARVESTS,
    customers: INITIAL_CUSTOMERS,
    sales: INITIAL_SALES,
    expenses: INITIAL_EXPENSES,
    calendarEvents: INITIAL_CALENDAR_EVENTS,
  };

  saveLocalDatabase(initialDb);
  return initialDb;
}

export function saveLocalDatabase(db: AgroDatabase) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    // Asynchronously try to persist to server if online
    if (navigator.onLine) {
      fetch('/api/save-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: db }),
      }).catch(() => {});
    }
  } catch (e) {
    console.error('Erro ao salvar banco local:', e);
  }
}

export function loadOfflineQueue(): SyncQueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOfflineQueue(queue: SyncQueueItem[]) {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Erro ao salvar fila offline:', e);
  }
}

export async function syncQueueWithServer(): Promise<{ syncedCount: number; remainingQueue: SyncQueueItem[] }> {
  const queue = loadOfflineQueue();
  if (queue.length === 0) return { syncedCount: 0, remainingQueue: [] };

  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queue }),
    });

    if (res.ok) {
      saveOfflineQueue([]);
      return { syncedCount: queue.length, remainingQueue: [] };
    }
  } catch (e) {
    console.warn('Falha na sincronização com servidor (continuando offline):', e);
  }

  return { syncedCount: 0, remainingQueue: queue };
}

export interface ChatPestResponse {
  reply: string;
  source: 'gemini' | 'expert-engine' | 'fallback';
  model?: string;
  latencyMs?: number;
}

export async function chatWithPestAI(payload: {
  messages: Array<{ role: 'user' | 'model'; content: string }>;
  cropName?: string;
  farmLocation?: string;
}): Promise<ChatPestResponse> {
  const startClientTime = Date.now();
  try {
    const res = await fetch('/api/chat-pest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return {
          reply: data.reply,
          source: data.source || 'gemini',
          model: data.model || 'Gemini 3.1 Flash Lite',
          latencyMs: data.latencyMs ?? (Date.now() - startClientTime),
        };
      }
    }
  } catch (e) {
    console.warn('Erro ao chamar chatbot fitossanitário:', e);
  }

  // Graceful client fallback if completely disconnected
  const lastMsg = payload.messages[payload.messages.length - 1]?.content?.toLowerCase() || '';
  let fallbackText = 'Como agrônomo assistente da Fazenda Vista Verde (Dom Expedito Lopes - PI), recomendo isolar o foco afetado, desinfetar tesouras de poda com álcool 70% e aplicar calda protetora de óleo de neem com sabão de coco neutro ao entardecer.';
  if (lastMsg.includes('dosagem') || lastMsg.includes('pulverizador') || lastMsg.includes('20')) {
    fallbackText = 'Para pulverizador costal de 20 litros na Fazenda Vista Verde: use 100ml de óleo de neem (0,5%) e 20g de sabão de coco neutro dissolvido. Aplique no final da tarde, cobrindo bem a face inferior das folhas.';
  } else if (lastMsg.includes('carência') || lastMsg.includes('carencia') || lastMsg.includes('colheita')) {
    fallbackText = 'Para produtos biológicos e calda de neem, o intervalo de carência é de 24h a 48h. Para calda bordalesa, aguarde 3 a 5 dias antes da colheita.';
  }

  return {
    reply: fallbackText,
    source: 'fallback',
    model: 'Motor Agronômico Local',
    latencyMs: Date.now() - startClientTime,
  };
}

