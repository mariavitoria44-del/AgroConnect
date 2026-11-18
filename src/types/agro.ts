export type UserRole = 'proprietario' | 'gerente' | 'trabalhador' | 'agronomo' | 'admin';

export interface FarmerUser {
  id: string;
  name: string;
  role: UserRole;
  phoneOrCpf: string;
  farmName: string;
  city: string;
  avatarEmoji: string;
}

export interface Property {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  state: string;
  totalAreaHa: number;
  productiveAreaHa: number;
  propertyType: string; // 'Agricultura Familiar', 'Horticultura', etc.
  soilType: string;     // 'Argilo-Arenoso', 'Latossolo Vermelho', etc.
  irrigationSource: string; // 'Poço Artesiano + Açude'
  irrigationSystem: string; // 'Gotejamento e Microaspersão'
  notes?: string;
  fields: Field[];
}

export interface Field {
  id: string;
  propertyId: string;
  name: string; // 'Talhão 01'
  areaHa: number;
  soilMoistureTargetMin: number; // e.g. 40%
  soilMoistureTargetMax: number; // e.g. 70%
  areas: FieldArea[];
}

export interface FieldArea {
  id: string;
  fieldId: string;
  name: string; // 'Área A'
  subAreaHa: number;
  currentCropId?: string;
  currentCropName?: string;
  variety?: string;
  status: 'Plantado' | 'Preparando Solo' | 'Em Colheita' | 'Pousio';
}

export interface Crop {
  id: string;
  name: string;           // Tomate
  scientificName: string; // Solanum lycopersicum
  category: 'Hortaliça' | 'Frutífera' | 'Grão' | 'Erva/Tempero' | 'Tubérculo' | 'Outro';
  variety: string;        // Italiano
  cycleDays: number;      // 100
  waterNeedDailyMm: number; // 5
  lightRequirement: string; // Pleno Sol (6-8h)
  idealTempMinC: number;  // 18
  idealTempMaxC: number;  // 28
  soilMoistureMinPct: number; // 40
  soilMoistureMaxPct: number; // 75
  spacingCm: string;      // 80x40 cm
  commonPests: string[];  // ['Mosca-branca', 'Traça-do-tomateiro', 'Requeima']
  commonDiseases: string[]; // ['Mancha Bacteriana', 'Oídio']
  managementTips: string;
  icon?: string;
}

export interface Planting {
  id: string;
  lotNumber: string;       // TOM-2026-001
  cropId: string;
  cropName: string;
  variety: string;
  fieldId: string;
  fieldName: string;
  areaId: string;
  areaName: string;
  plantedAreaHa: number;
  plantingDate: string;
  expectedHarvestDate: string;
  seedlingsCount: number;
  stage: 'Semeadura' | 'Germinação' | 'Desenvolvimento Vegetativo' | 'Floração' | 'Frutificação' | 'Colheita' | 'Finalizado';
  irrigationType: string;
  responsibleName: string;
  estimatedYieldKg: number;
  harvestedYieldKg: number;
  notes?: string;
  status: 'Ativo' | 'Concluído' | 'Cancelado';
}

export type SensorType = 
  | 'umidade_solo'
  | 'temperatura_solo'
  | 'temperatura_ar'
  | 'umidade_ar'
  | 'chuva'
  | 'luminosidade'
  | 'nivel_reservatorio'
  | 'vazao_agua'
  | 'pressao_rede';

export interface Sensor {
  id: string;
  code: string; // SENS-01
  type: SensorType;
  name: string;
  model: string;
  fieldId?: string;
  fieldName?: string;
  cropName?: string;
  unit: string;
  currentValue: number;
  batteryPct: number;
  status: 'online' | 'offline' | 'alerta';
  lastCommunication: string;
  history: { timestamp: string; value: number }[];
}

export interface Actuator {
  id: string;
  code: string; // ACT-01
  name: string; // Bomba Principal
  type: 'bomba' | 'valvula_setor';
  sectorName: string; // Talhão 01 - Tomates
  fieldId: string;
  state: 'ligado' | 'desligado';
  mode: 'automatico' | 'manual';
  powerWatt: number;
  flowRateLMin: number;
  runtimeMinutesToday: number;
}

export interface IrrigationRule {
  id: string;
  name: string;
  enabled: boolean;
  fieldId: string;
  sectorName: string;
  actuatorId: string;
  triggerMoistureBelowPct: number; // e.g. 35%
  stopMoistureAbovePct: number;    // e.g. 60%
  blockIfRaining: boolean;
  minReservoirLevelPct: number;    // e.g. 20%
  allowedTimeStart: string;        // "05:00"
  allowedTimeEnd: string;          // "19:00"
  maxDurationMinutes: number;      // 45
  lastTriggered?: string;
}

export interface IrrigationLog {
  id: string;
  timestamp: string;
  sectorName: string;
  durationMinutes: number;
  waterVolumeLiters: number;
  triggerType: 'Automático (Regra IoT)' | 'Manual (Produtor)' | 'Programado (Agenda)';
  initialSoilMoisturePct: number;
  finalSoilMoisturePct: number;
  energyCostEstReais: number;
}

export interface PestReport {
  id: string;
  date: string;
  cropName: string;
  fieldId: string;
  fieldName: string;
  pestOrDiseaseName: string;
  category: 'Praga' | 'Doença' | 'Deficiência Nutricional';
  severity: 'Baixa' | 'Média' | 'Alta';
  affectedAreaPct: number;
  symptoms: string;
  imageUrl?: string;
  treatmentApplied?: string;
  productUsed?: string;
  dosage?: string;
  responsibleName: string;
  status: 'Identificado' | 'Em Tratamento' | 'Controlado';
  outcome?: string;
}

export interface Recommendation {
  id: string;
  date: string;
  title: string;
  category: 'Irrigação' | 'Fitossanitário' | 'Nutrição' | 'Colheita' | 'Estoque' | 'Clima';
  priority: 'Crítica' | 'Alta' | 'Média' | 'Informativa';
  cropName?: string;
  fieldName?: string;
  message: string;
  suggestedAction: string;
  status: 'Pendente' | 'Concluída' | 'Ignorada';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Sementes/Mudas' | 'Fertilizantes' | 'Defensivos' | 'Irrigação' | 'Ferramentas' | 'Embalagens' | 'Outros';
  unit: 'kg' | 'litros' | 'unidades' | 'sacos' | 'bobinas' | 'caixas';
  currentQty: number;
  minQty: number;
  maxQty: number;
  batchNumber: string;
  expiryDate?: string;
  supplier: string;
  unitCostReais: number;
}

export interface StockMovement {
  id: string;
  date: string;
  itemId: string;
  itemName: string;
  type: 'Entrada (Compra)' | 'Saída (Aplicação)' | 'Ajuste de Balanço' | 'Perda';
  quantity: number;
  unit: string;
  lotDestination?: string;
  reason?: string;
  responsibleName: string;
}

export interface Harvest {
  id: string;
  date: string;
  lotNumber: string;
  cropName: string;
  fieldName: string;
  quantity: number;
  unit: 'kg' | 'caixas' | 'maços' | 'toneladas';
  qualityGrade: 'Tipo 1 (Extra)' | 'Tipo 2 (Comercial)' | 'Industrial';
  lossesQty: number;
  destination: string; // 'CEASA', 'Venda Direta', 'Estoque'
  registeredBy: string;
  productionCostReais: number;
}

export interface Customer {
  id: string;
  name: string;
  document: string; // CPF ou CNPJ
  type: 'Feirante' | 'Supermercado' | 'Restaurante' | 'Consumidor Final' | 'Cooperativa/Ceasa';
  phone: string;
  address: string;
  totalPurchasedReais: number;
  ordersCount: number;
  notes?: string;
}

export interface Sale {
  id: string;
  orderNumber: string; // #000245
  date: string;
  customerId: string;
  customerName: string;
  cropName: string;
  lotNumber: string;
  quantity: number;
  unit: 'kg' | 'caixas' | 'maços';
  unitPriceReais: number;
  totalPriceReais: number;
  paymentMethod: 'PIX' | 'Dinheiro' | 'A Prazo (30 dias)' | 'Boleto' | 'Cartão';
  paymentStatus: 'Pago' | 'Pendente' | 'Parcial';
  fieldName: string;
  harvestDate: string;
  notes?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'Sementes/Mudas' | 'Fertilizantes/Adubos' | 'Defensivos' | 'Combustível' | 'Energia Elétrica' | 'Água/Irrigação' | 'Mão de Obra/Diárias' | 'Manutenção' | 'Outros';
  description: string;
  amountReais: number;
  fieldId?: string;
  fieldName?: string;
  cropName?: string;
  lotNumber?: string;
  paymentStatus: 'Pago' | 'A Pagar';
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'Plantio' | 'Irrigação' | 'Adubação' | 'Inspeção' | 'Colheita' | 'Venda/Entrega';
  lotOrCrop: string;
  location: string;
  completed: boolean;
}

export interface SyncQueueItem {
  id: string;
  action: 'create_pest' | 'toggle_irrigation' | 'log_harvest' | 'create_sale' | 'add_expense' | 'note';
  payload: any;
  createdAt: string;
  status: 'pending' | 'synced' | 'failed';
}

export interface AppState {
  currentRole: UserRole;
  currentPropertyId: string;
  isFieldMode: boolean; // Mobile outdoor mode vs Web ERP
  isOnline: boolean;
  offlineQueue: SyncQueueItem[];
}
