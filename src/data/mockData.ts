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
  CalendarEvent
} from '../types/agro';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'Fazenda Vista Verde',
    ownerName: 'Família Bragança (José de Bragança)',
    location: 'Rodovia BR-316, Zona Rural',
    state: 'Dom Expedito Lopes - PI',
    totalAreaHa: 50,
    productiveAreaHa: 32,
    propertyType: 'Agricultura Familiar & Irrigada',
    soilType: 'Argilo-Arenoso com boa drenagem',
    irrigationSource: 'Poço Artesiano (25 m³/h) + Açude de contenção',
    irrigationSystem: 'Gotejamento automatizado com fita de 16mm e Microaspersão',
    notes: 'Propriedade da Família Bragança assistida pelo PRONAF em Dom Expedito Lopes - PI.',
    fields: [
      {
        id: 'field-1',
        propertyId: 'prop-1',
        name: 'Setor 01 (Hortaliças Fruto)',
        areaHa: 10,
        soilMoistureTargetMin: 40,
        soilMoistureTargetMax: 70,
        areas: [
          {
            id: 'area-1a',
            fieldId: 'field-1',
            name: 'Área A — Tomate',
            subAreaHa: 5,
            currentCropId: 'crop-tomate',
            currentCropName: 'Tomate Italiano',
            variety: 'Saladete San Marzano',
            status: 'Plantado'
          },
          {
            id: 'area-1b',
            fieldId: 'field-1',
            name: 'Área B — Pimentão',
            subAreaHa: 5,
            currentCropId: 'crop-pimentao',
            currentCropName: 'Pimentão Amarelo',
            variety: 'Zarco Híbrido',
            status: 'Plantado'
          }
        ]
      },
      {
        id: 'field-2',
        propertyId: 'prop-1',
        name: 'Setor 02 (Folhosas & Ervas)',
        areaHa: 8,
        soilMoistureTargetMin: 55,
        soilMoistureTargetMax: 80,
        areas: [
          {
            id: 'area-2a',
            fieldId: 'field-2',
            name: 'Área A — Alface',
            subAreaHa: 4,
            currentCropId: 'crop-alface',
            currentCropName: 'Alface Crespa',
            variety: 'Vera Hortitec',
            status: 'Em Colheita'
          },
          {
            id: 'area-2b',
            fieldId: 'field-2',
            name: 'Área B — Coentro',
            subAreaHa: 4,
            currentCropId: 'crop-coentro',
            currentCropName: 'Coentro Verdão',
            variety: 'Verdão Especial',
            status: 'Plantado'
          }
        ]
      },
      {
        id: 'field-3',
        propertyId: 'prop-1',
        name: 'Setor 03 (Grãos & Raízes)',
        areaHa: 14,
        soilMoistureTargetMin: 35,
        soilMoistureTargetMax: 65,
        areas: [
          {
            id: 'area-3a',
            fieldId: 'field-3',
            name: 'Área A — Milho Verde',
            subAreaHa: 8,
            currentCropId: 'crop-milho',
            currentCropName: 'Milho Verde Híbrido',
            variety: 'AG 1051',
            status: 'Plantado'
          },
          {
            id: 'area-3b',
            fieldId: 'field-3',
            name: 'Área B — Mandioca',
            subAreaHa: 6,
            currentCropId: 'crop-mandioca',
            currentCropName: 'Mandioca de Mesa',
            variety: 'Manteiga Branca',
            status: 'Preparando Solo'
          }
        ]
      }
    ]
  }
];

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'crop-tomate',
    name: 'Tomate',
    scientificName: 'Solanum lycopersicum',
    category: 'Hortaliça',
    variety: 'Italiano / Saladete',
    cycleDays: 105,
    waterNeedDailyMm: 5.5,
    lightRequirement: 'Pleno Sol (6-8h)',
    idealTempMinC: 19,
    idealTempMaxC: 28,
    soilMoistureMinPct: 40,
    soilMoistureMaxPct: 70,
    spacingCm: '80 x 40 cm',
    commonPests: ['Mosca-branca (Bemisia tabaci)', 'Traça-do-tomateiro (Tuta absoluta)', 'Lagarta-falsa-medideira'],
    commonDiseases: ['Requeima (Phytophthora)', 'Mancha-bacteriana (Xanthomonas)', 'Oídio'],
    managementTips: 'Desbrota regular para direcionar nutrientes aos frutos. Irrigação por gotejamento na raiz sem molhar as folhas para evitar fungos. Conduzir em fitilho duplo.',
    icon: '🍅'
  },
  {
    id: 'crop-alface',
    name: 'Alface',
    scientificName: 'Lactuca sativa',
    category: 'Hortaliça',
    variety: 'Crespa (Vera)',
    cycleDays: 45,
    waterNeedDailyMm: 4.0,
    lightRequirement: 'Sol pleno ou meia-sombra',
    idealTempMinC: 16,
    idealTempMaxC: 25,
    soilMoistureMinPct: 55,
    soilMoistureMaxPct: 80,
    spacingCm: '25 x 25 cm',
    commonPests: ['Pulgão (Myzus persicae)', 'Lesmas e Caracóis', 'Lagarta-rosca'],
    commonDiseases: ['Míldio (Bremia lactucae)', 'Podridão-de-esclerotinia', 'Vira-cabeça'],
    managementTips: 'Cultura de ciclo rápido. Requer solo fofo, rico em matéria orgânica e umidade constante sem encharcamento. Colheita nas primeiras horas da manhã.',
    icon: '🥬'
  },
  {
    id: 'crop-pimentao',
    name: 'Pimentão',
    scientificName: 'Capsicum annuum',
    category: 'Hortaliça',
    variety: 'Amarelo & Vermelho',
    cycleDays: 110,
    waterNeedDailyMm: 5.0,
    lightRequirement: 'Sol Pleno',
    idealTempMinC: 20,
    idealTempMaxC: 30,
    soilMoistureMinPct: 45,
    soilMoistureMaxPct: 75,
    spacingCm: '90 x 40 cm',
    commonPests: ['Ácaro-branco (Polyphagotarsonemus latus)', 'Tripes', 'Pulgões'],
    commonDiseases: ['Antracnose', 'Murcha de Phytophthora', 'Mosaico'],
    managementTips: 'Exige boa adubação potássica na frutificação para conferir espessura de casca e brilho. Tutoramento essencial para não tombar.',
    icon: '🫑'
  },
  {
    id: 'crop-coentro',
    name: 'Coentro',
    scientificName: 'Coriandrum sativum',
    category: 'Erva/Tempero',
    variety: 'Verdão Especial',
    cycleDays: 40,
    waterNeedDailyMm: 3.5,
    lightRequirement: 'Sol pleno',
    idealTempMinC: 18,
    idealTempMaxC: 28,
    soilMoistureMinPct: 50,
    soilMoistureMaxPct: 75,
    spacingCm: '15 x 10 cm em canteiro',
    commonPests: ['Pulgões', 'Lagarta-militar'],
    commonDiseases: ['Tombamento de plântulas (Damping-off)', 'Mancha-de-cercospora'],
    managementTips: 'Excelente para rotação de cultura. Não tolera seca durante a germinação. Regas leves e frequentes.',
    icon: '🌿'
  },
  {
    id: 'crop-milho',
    name: 'Milho Verde',
    scientificName: 'Zea mays',
    category: 'Grão',
    variety: 'Híbrido AG 1051',
    cycleDays: 80,
    waterNeedDailyMm: 6.0,
    lightRequirement: 'Sol pleno (8h+)',
    idealTempMinC: 22,
    idealTempMaxC: 32,
    soilMoistureMinPct: 40,
    soilMoistureMaxPct: 70,
    spacingCm: '80 x 20 cm',
    commonPests: ['Lagarta-do-cartucho (Spodoptera frugiperda)', 'Broca-da-espiga'],
    commonDiseases: ['Ferrugem-comum (Puccinia sorghi)', 'Helmintosporiose'],
    managementTips: 'Adubação de cobertura com nitrogênio no estágio V4-V6. Irrigação crítica na fase de pendoamento e enchimento de grãos.',
    icon: '🌽'
  },
  {
    id: 'crop-mandioca',
    name: 'Mandioca',
    scientificName: 'Manihot esculenta',
    category: 'Tubérculo',
    variety: 'Mesa / Macaxeira Manteiga',
    cycleDays: 240,
    waterNeedDailyMm: 3.0,
    lightRequirement: 'Sol Pleno',
    idealTempMinC: 22,
    idealTempMaxC: 34,
    soilMoistureMinPct: 30,
    soilMoistureMaxPct: 60,
    spacingCm: '100 x 60 cm',
    commonPests: ['Mandarová-da-mandioca (Erinnyis ello)', 'Mosca-branca', 'Ácaro-verde'],
    commonDiseases: ['Podridão radicular', 'Bacteriose'],
    managementTips: 'Rústica e tolerante a secas, mas com irrigação estratégica dobra o rendimento de raízes macias e fáceis de cozinhar.',
    icon: '🥔'
  }
];

export const INITIAL_PLANTINGS: Planting[] = [
  {
    id: 'plant-1',
    lotNumber: 'TOM-2026-001',
    cropId: 'crop-tomate',
    cropName: 'Tomate Italiano',
    variety: 'Saladete San Marzano',
    fieldId: 'field-1',
    fieldName: 'Setor 01',
    areaId: 'area-1a',
    areaName: 'Área A',
    plantedAreaHa: 5.0,
    plantingDate: '2026-08-10',
    expectedHarvestDate: '2026-11-15',
    seedlingsCount: 14500,
    stage: 'Frutificação',
    irrigationType: 'Gotejamento Automatizado',
    responsibleName: 'Severino Rocha (Tratador Chefe)',
    estimatedYieldKg: 28000,
    harvestedYieldKg: 850,
    notes: 'Plantio vigoroso. Lote com desbrota feita há 5 dias. 1ª colheita parcial em andamento.',
    status: 'Ativo'
  },
  {
    id: 'plant-2',
    lotNumber: 'ALF-2026-042',
    cropId: 'crop-alface',
    cropName: 'Alface Crespa',
    variety: 'Vera Hortitec',
    fieldId: 'field-2',
    fieldName: 'Setor 02',
    areaId: 'area-2a',
    areaName: 'Área A',
    plantedAreaHa: 4.0,
    plantingDate: '2026-09-02',
    expectedHarvestDate: '2026-10-18',
    seedlingsCount: 18000,
    stage: 'Colheita',
    irrigationType: 'Microaspersão & Gotejamento',
    responsibleName: 'Maria Clara Bragança',
    estimatedYieldKg: 7200,
    harvestedYieldKg: 4200,
    notes: 'Ponto de corte excelente, folhas túrgidas e sem queima de borda. Atendendo feiras livres e mercados da cidade.',
    status: 'Ativo'
  },
  {
    id: 'plant-3',
    lotNumber: 'PIM-2026-018',
    cropId: 'crop-pimentao',
    cropName: 'Pimentão Amarelo',
    variety: 'Zarco Híbrido',
    fieldId: 'field-1',
    fieldName: 'Setor 01',
    areaId: 'area-1b',
    areaName: 'Área B',
    plantedAreaHa: 5.0,
    plantingDate: '2026-08-01',
    expectedHarvestDate: '2026-11-20',
    seedlingsCount: 13000,
    stage: 'Floração',
    irrigationType: 'Gotejamento Automatizado',
    responsibleName: 'Severino Rocha',
    estimatedYieldKg: 22000,
    harvestedYieldKg: 0,
    notes: 'Floração abundante. Adubação potássica programada para amanhã.',
    status: 'Ativo'
  },
  {
    id: 'plant-4',
    lotNumber: 'COEN-2026-095',
    cropId: 'crop-coentro',
    cropName: 'Coentro Verdão',
    variety: 'Verdão Especial',
    fieldId: 'field-2',
    fieldName: 'Setor 02',
    areaId: 'area-2b',
    areaName: 'Área B',
    plantedAreaHa: 4.0,
    plantingDate: '2026-09-22',
    expectedHarvestDate: '2026-10-28',
    seedlingsCount: 30000,
    stage: 'Desenvolvimento Vegetativo',
    irrigationType: 'Microaspersão',
    responsibleName: 'Lucas Oliveira',
    estimatedYieldKg: 4800,
    harvestedYieldKg: 0,
    notes: 'Germinação 95%. Irrigação matinal leve mantida diariamente.',
    status: 'Ativo'
  }
];

export const INITIAL_SENSORS: Sensor[] = [
  {
    id: 'sens-1',
    code: 'SENS-01',
    type: 'umidade_solo',
    name: 'Sensor de Umidade do Solo (Prof. 20cm)',
    model: 'Capacitivo RS485 Industrial',
    fieldId: 'field-1',
    fieldName: 'Talhão 01 (Tomate/Pimentão)',
    cropName: 'Tomate Italiano',
    unit: '%',
    currentValue: 31.8,
    batteryPct: 92,
    status: 'alerta', // < 35% trigger
    lastCommunication: 'Há 2 min',
    history: [
      { timestamp: '00:00', value: 44 },
      { timestamp: '04:00', value: 41 },
      { timestamp: '08:00', value: 38 },
      { timestamp: '12:00', value: 34 },
      { timestamp: '14:00', value: 31.8 }
    ]
  },
  {
    id: 'sens-2',
    code: 'SENS-02',
    type: 'temperatura_solo',
    name: 'Sensor de Temperatura do Solo',
    model: 'DS18B20 Encapsulado Aço Inox',
    fieldId: 'field-1',
    fieldName: 'Talhão 01',
    cropName: 'Tomate Italiano',
    unit: '°C',
    currentValue: 24.6,
    batteryPct: 95,
    status: 'online',
    lastCommunication: 'Há 2 min',
    history: [
      { timestamp: '00:00', value: 21 },
      { timestamp: '04:00', value: 20 },
      { timestamp: '08:00', value: 22 },
      { timestamp: '12:00', value: 25.5 },
      { timestamp: '14:00', value: 24.6 }
    ]
  },
  {
    id: 'sens-3',
    code: 'SENS-03',
    type: 'umidade_solo',
    name: 'Sensor de Umidade do Solo Canteiros',
    model: 'FDR TDR-100 FieldProbe',
    fieldId: 'field-2',
    fieldName: 'Talhão 02 (Alface/Coentro)',
    cropName: 'Alface Crespa',
    unit: '%',
    currentValue: 68.4,
    batteryPct: 88,
    status: 'online',
    lastCommunication: 'Há 5 min',
    history: [
      { timestamp: '00:00', value: 72 },
      { timestamp: '04:00', value: 70 },
      { timestamp: '08:00', value: 75 },
      { timestamp: '12:00', value: 69 },
      { timestamp: '14:00', value: 68.4 }
    ]
  },
  {
    id: 'sens-4',
    code: 'SENS-04',
    type: 'nivel_reservatorio',
    name: 'Nível do Reservatório Principal (50.000 L)',
    model: 'Ultrassônico HC-SR04 IP67 com Gateway ESP32',
    fieldId: 'field-1',
    fieldName: 'Central Hídrica',
    unit: '%',
    currentValue: 79.0,
    batteryPct: 100,
    status: 'online',
    lastCommunication: 'Há 1 min',
    history: [
      { timestamp: '00:00', value: 85 },
      { timestamp: '04:00', value: 85 },
      { timestamp: '08:00', value: 83 },
      { timestamp: '12:00', value: 80 },
      { timestamp: '14:00', value: 79.0 }
    ]
  },
  {
    id: 'sens-5',
    code: 'SENS-05',
    type: 'chuva',
    name: 'Sensor de Chuva (Pluviômetro Óptico)',
    model: 'PluvioMet Optical RG-11',
    fieldId: 'field-1',
    fieldName: 'Estação Meteorológica Fazenda',
    unit: 'mm',
    currentValue: 0.0,
    batteryPct: 91,
    status: 'online',
    lastCommunication: 'Há 1 min',
    history: [
      { timestamp: '00:00', value: 0 },
      { timestamp: '04:00', value: 0 },
      { timestamp: '08:00', value: 0 },
      { timestamp: '12:00', value: 0 },
      { timestamp: '14:00', value: 0 }
    ]
  },
  {
    id: 'sens-6',
    code: 'SENS-06',
    type: 'temperatura_ar',
    name: 'Temperatura e Umidade do Ar',
    model: 'SHT31 Alta Precisão',
    fieldId: 'field-1',
    fieldName: 'Estação Meteorológica Fazenda',
    unit: '°C',
    currentValue: 28.5,
    batteryPct: 93,
    status: 'online',
    lastCommunication: 'Há 3 min',
    history: [
      { timestamp: '00:00', value: 20 },
      { timestamp: '04:00', value: 19 },
      { timestamp: '08:00', value: 24 },
      { timestamp: '12:00', value: 29.8 },
      { timestamp: '14:00', value: 28.5 }
    ]
  },
  {
    id: 'sens-7',
    code: 'SENS-07',
    type: 'vazao_agua',
    name: 'Sensor de Vazão de Linha Principal',
    model: 'Eletromagnético DN50 Pulse',
    fieldId: 'field-1',
    fieldName: 'Linha Adutora Geral',
    unit: 'L/min',
    currentValue: 46.2,
    batteryPct: 99,
    status: 'online',
    lastCommunication: 'Tempo Real',
    history: [
      { timestamp: '00:00', value: 0 },
      { timestamp: '06:00', value: 45 },
      { timestamp: '08:00', value: 0 },
      { timestamp: '13:30', value: 46.2 }
    ]
  },
  {
    id: 'sens-8',
    code: 'SENS-08',
    type: 'pressao_rede',
    name: 'Sensor de Pressão Manométrica',
    model: 'Transdutor Cerâmico 0-10 bar',
    fieldId: 'field-1',
    fieldName: 'Filtro de Disco / Linha Geral',
    unit: 'bar',
    currentValue: 2.3,
    batteryPct: 96,
    status: 'online',
    lastCommunication: 'Há 1 min',
    history: [
      { timestamp: '00:00', value: 0.1 },
      { timestamp: '06:00', value: 2.4 },
      { timestamp: '13:30', value: 2.3 }
    ]
  }
];

export const INITIAL_ACTUATORS: Actuator[] = [
  {
    id: 'act-1',
    code: 'ACT-01',
    name: 'Bomba Principal 5CV (Trifásica)',
    type: 'bomba',
    sectorName: 'Central Hídrica - Poço/Açude',
    fieldId: 'field-1',
    state: 'ligado',
    mode: 'automatico',
    powerWatt: 3700,
    flowRateLMin: 46.2,
    runtimeMinutesToday: 45
  },
  {
    id: 'act-2',
    code: 'ACT-02',
    name: 'Eletroválvula Setor 1 — Talhão 01',
    type: 'valvula_setor',
    sectorName: 'Talhão 01 (Tomate & Pimentão)',
    fieldId: 'field-1',
    state: 'ligado',
    mode: 'automatico',
    powerWatt: 12,
    flowRateLMin: 46.2,
    runtimeMinutesToday: 35
  },
  {
    id: 'act-3',
    code: 'ACT-03',
    name: 'Eletroválvula Setor 2 — Talhão 02',
    type: 'valvula_setor',
    sectorName: 'Talhão 02 (Alface & Coentro)',
    fieldId: 'field-2',
    state: 'desligado',
    mode: 'automatico',
    powerWatt: 12,
    flowRateLMin: 32.0,
    runtimeMinutesToday: 25
  },
  {
    id: 'act-4',
    code: 'ACT-04',
    name: 'Eletroválvula Setor 3 — Talhão 03',
    type: 'valvula_setor',
    sectorName: 'Talhão 03 (Milho & Mandioca)',
    fieldId: 'field-3',
    state: 'desligado',
    mode: 'manual',
    powerWatt: 12,
    flowRateLMin: 50.0,
    runtimeMinutesToday: 0
  }
];

export const INITIAL_RULES: IrrigationRule[] = [
  {
    id: 'rule-1',
    name: 'Automação Talhão 01 (Tomate) por Umidade',
    enabled: true,
    fieldId: 'field-1',
    sectorName: 'Talhão 01 - Tomate & Pimentão',
    actuatorId: 'act-2',
    triggerMoistureBelowPct: 35,
    stopMoistureAbovePct: 60,
    blockIfRaining: true,
    minReservoirLevelPct: 20,
    allowedTimeStart: '05:00',
    allowedTimeEnd: '19:00',
    maxDurationMinutes: 60,
    lastTriggered: 'Hoje às 13:42 (Disparado por Umidade < 35%)'
  },
  {
    id: 'rule-2',
    name: 'Automação Talhão 02 (Alface) Ciclo Frescor',
    enabled: true,
    fieldId: 'field-2',
    sectorName: 'Talhão 02 - Folhosas',
    actuatorId: 'act-3',
    triggerMoistureBelowPct: 55,
    stopMoistureAbovePct: 75,
    blockIfRaining: true,
    minReservoirLevelPct: 25,
    allowedTimeStart: '06:00',
    allowedTimeEnd: '18:00',
    maxDurationMinutes: 30,
    lastTriggered: 'Hoje às 06:15'
  }
];

export const INITIAL_IRRIGATION_LOGS: IrrigationLog[] = [
  {
    id: 'ilog-1',
    timestamp: 'Hoje 13:42',
    sectorName: 'Talhão 01 — Setor Tomate',
    durationMinutes: 35,
    waterVolumeLiters: 1617,
    triggerType: 'Automático (Regra IoT)',
    initialSoilMoisturePct: 31.8,
    finalSoilMoisturePct: 54.0,
    energyCostEstReais: 2.15
  },
  {
    id: 'ilog-2',
    timestamp: 'Hoje 06:15',
    sectorName: 'Talhão 02 — Setor Alface',
    durationMinutes: 25,
    waterVolumeLiters: 800,
    triggerType: 'Programado (Agenda)',
    initialSoilMoisturePct: 54.0,
    finalSoilMoisturePct: 72.0,
    energyCostEstReais: 1.54
  },
  {
    id: 'ilog-3',
    timestamp: 'Ontem 17:30',
    sectorName: 'Talhão 01 — Setor Tomate',
    durationMinutes: 40,
    waterVolumeLiters: 1840,
    triggerType: 'Manual (Produtor)',
    initialSoilMoisturePct: 34.0,
    finalSoilMoisturePct: 58.5,
    energyCostEstReais: 2.46
  }
];

export const INITIAL_PESTS: PestReport[] = [
  {
    id: 'pest-1',
    date: '2026-10-04',
    cropName: 'Tomate Italiano',
    fieldId: 'field-1',
    fieldName: 'Talhão 01 — Área A',
    pestOrDiseaseName: 'Mosca-branca (Bemisia tabaci)',
    category: 'Praga',
    severity: 'Média',
    affectedAreaPct: 8,
    symptoms: 'Reboleiras no canto leste com presença de pequenos insetos brancos na página inferior das folhas e leve secreção adocicada.',
    treatmentApplied: 'Pulverização com calda de sabão de coco + Óleo de Neem a 0,5% e colocação de armadilhas cromáticas amarelas.',
    productUsed: 'Óleo de Neem Orgânico Prensado a Frio',
    dosage: '500 ml por 100 L de água',
    responsibleName: 'Maria Clara Bragança',
    status: 'Em Tratamento',
    outcome: 'Redução notável de espécimes adultos após 48h. Segunda aplicação agendada em 5 dias.'
  },
  {
    id: 'pest-2',
    date: '2026-09-28',
    cropName: 'Alface Crespa',
    fieldId: 'field-2',
    fieldName: 'Talhão 02 — Área A',
    pestOrDiseaseName: 'Míldio (Bremia lactucae)',
    category: 'Doença',
    severity: 'Baixa',
    affectedAreaPct: 3,
    symptoms: 'Manchas verde-claras/amareladas angulares na face superior das folhas basais.',
    treatmentApplied: 'Eliminação manual de folhas infectadas e aplicação preventiva de extrato aquoso de alho e bicarbonato de potássio.',
    productUsed: 'Bioextrato Preventivo',
    dosage: '100g para 20 L',
    responsibleName: 'José de Bragança',
    status: 'Controlado',
    outcome: 'Foco contido sem propagação aos canteiros vizinhos.'
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    date: 'Hoje, 06:00',
    title: 'Adubação de Cobertura Potássica',
    category: 'Nutrição',
    priority: 'Média',
    cropName: 'Pimentão Amarelo',
    message: 'Lote PIM-2026-018 entrou na fase de floração e demanda reforço de potássio para pegamento dos frutos.',
    suggestedAction: 'Aplicar cobertura potássica conforme recomendação nutricional do catálogo de culturas.',
    status: 'Pendente'
  },
  {
    id: 'rec-2',
    date: 'Hoje, 07:15',
    title: 'Estoque Baixo: Sementes de Tomate e Óleo de Neem',
    category: 'Estoque',
    priority: 'Alta',
    message: 'O estoque de Óleo de Neem atingiu apenas 2 frascos (mínimo: 5) e Sementes de Tomate restam 4 pacotes (mínimo: 5).',
    suggestedAction: 'Emitir pedido de reposição aos fornecedores locais antes da próxima rodada de plantio.',
    status: 'Pendente'
  },
  {
    id: 'rec-3',
    date: '04/10/2026',
    title: 'Preparação de Colheita do Lote TOM-2026-001',
    category: 'Colheita',
    priority: 'Média',
    cropName: 'Tomate Italiano',
    message: 'Frutos em ponto de maturação comercial; organizar caixas vazadas higienizadas para colheita matinal.',
    suggestedAction: 'Separar caixas padrão CEASA e emitir etiquetas rastreáveis do lote.',
    status: 'Pendente'
  },
  {
    id: 'rec-4',
    date: '02/10/2026',
    title: 'Pico de Colheita de Alface Lote ALF-2026-042',
    category: 'Colheita',
    priority: 'Informativa',
    cropName: 'Alface Crespa',
    fieldName: 'Talhão 02',
    message: 'Alface atingiu o tamanho comercial ideal (45 dias de ciclo). Mercado Central aumentou demanda semanal.',
    suggestedAction: 'Colher 800 maços amanhã às 05h da manhã para entrega fresca às 07h.',
    status: 'Concluída'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Sementes Tomate Italiano San Marzano (Envelope 5.000 sementes)',
    category: 'Sementes/Mudas',
    unit: 'unidades',
    currentQty: 4,
    minQty: 5,
    maxQty: 20,
    batchNumber: 'LOT-SEM-992',
    expiryDate: '2027-04-30',
    supplier: 'AgroSementes Vale do Sol',
    unitCostReais: 145.00
  },
  {
    id: 'inv-2',
    name: 'Adubo NPK 04-14-08 Granulado',
    category: 'Fertilizantes',
    unit: 'kg',
    currentQty: 450,
    minQty: 200,
    maxQty: 1000,
    batchNumber: 'NPK-8812',
    expiryDate: '2028-01-10',
    supplier: 'Cooperativa Agrícola Regional',
    unitCostReais: 3.40
  },
  {
    id: 'inv-3',
    name: 'Composto Orgânico Matéria Seca Curtida',
    category: 'Fertilizantes',
    unit: 'kg',
    currentQty: 1200,
    minQty: 400,
    maxQty: 3000,
    batchNumber: 'ORG-2026-B',
    supplier: 'Produção Própria da Fazenda',
    unitCostReais: 0.80
  },
  {
    id: 'inv-4',
    name: 'Óleo de Neem Puro 1L (Bioinseticida)',
    category: 'Defensivos',
    unit: 'litros',
    currentQty: 2,
    minQty: 5,
    maxQty: 15,
    batchNumber: 'NEEM-331',
    expiryDate: '2027-08-15',
    supplier: 'BioAgro Defensivos Naturais',
    unitCostReais: 68.00
  },
  {
    id: 'inv-5',
    name: 'Fita Gotejadora 16mm com espaçamento 20cm (Bobina 500m)',
    category: 'Irrigação',
    unit: 'bobinas',
    currentQty: 3,
    minQty: 2,
    maxQty: 8,
    batchNumber: 'FITA-2026',
    supplier: 'TuboForte Irrigação',
    unitCostReais: 280.00
  },
  {
    id: 'inv-6',
    name: 'Caixas Plásticas Vazadas Colheita Padrão Ceasa (48L)',
    category: 'Embalagens',
    unit: 'caixas',
    currentQty: 120,
    minQty: 50,
    maxQty: 250,
    batchNumber: 'CX-POLI-01',
    supplier: 'Plásticos Nordeste',
    unitCostReais: 32.00
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'smov-1',
    date: '2026-10-04',
    itemId: 'inv-4',
    itemName: 'Óleo de Neem Puro 1L',
    type: 'Saída (Aplicação)',
    quantity: 1,
    unit: 'litros',
    lotDestination: 'TOM-2026-001 (Tomate Italiano)',
    reason: 'Adubação e trato preventivo foliar',
    responsibleName: 'Maria Clara Bragança'
  },
  {
    id: 'smov-2',
    date: '2026-09-20',
    itemId: 'inv-2',
    itemName: 'Adubo NPK 04-14-08 Granulado',
    type: 'Saída (Aplicação)',
    quantity: 100,
    unit: 'kg',
    lotDestination: 'COEN-2026-095 (Coentro Verdão)',
    reason: 'Adubação de fundação canteiros',
    responsibleName: 'Lucas Oliveira'
  },
  {
    id: 'smov-3',
    date: '2026-09-15',
    itemId: 'inv-2',
    itemName: 'Adubo NPK 04-14-08 Granulado',
    type: 'Entrada (Compra)',
    quantity: 500,
    unit: 'kg',
    reason: 'Reposição para safra de primavera',
    responsibleName: 'José de Bragança'
  }
];

export const INITIAL_HARVESTS: Harvest[] = [
  {
    id: 'harv-1',
    date: '2026-10-05',
    lotNumber: 'TOM-2026-001',
    cropName: 'Tomate Italiano',
    fieldName: 'Setor 01 — Área A',
    quantity: 850,
    unit: 'kg',
    qualityGrade: 'Tipo 1 (Extra)',
    lossesQty: 25,
    destination: 'CEASA e Mercado Central',
    registeredBy: 'Severino Rocha',
    productionCostReais: 1572.50
  },
  {
    id: 'harv-2',
    date: '2026-10-04',
    lotNumber: 'ALF-2026-042',
    cropName: 'Alface Crespa',
    fieldName: 'Setor 02 — Área A',
    quantity: 650,
    unit: 'maços',
    qualityGrade: 'Tipo 1 (Extra)',
    lossesQty: 15,
    destination: 'Feirantes e Quitanda do Bairro',
    registeredBy: 'Maria Clara Bragança',
    productionCostReais: 585.00
  },
  {
    id: 'harv-3',
    date: '2026-09-30',
    lotNumber: 'ALF-2026-042',
    cropName: 'Alface Crespa',
    fieldName: 'Setor 02 — Área A',
    quantity: 1200,
    unit: 'maços',
    qualityGrade: 'Tipo 1 (Extra)',
    lossesQty: 20,
    destination: 'Supermercado Bom Preço',
    registeredBy: 'José de Bragança',
    productionCostReais: 1080.00
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Supermercado Bom Preço da Vila',
    document: '12.345.678/0001-90',
    type: 'Supermercado',
    phone: '(87) 99123-4567',
    address: 'Av. Principal, 420 - Centro',
    totalPurchasedReais: 6850.00,
    ordersCount: 8,
    notes: 'Compra semanal regular às terças e sextas.'
  },
  {
    id: 'cust-2',
    name: 'Distribuidora Ceasa Box 44 (Verde Vida)',
    document: '98.765.432/0001-11',
    type: 'Cooperativa/Ceasa',
    phone: '(87) 98877-1122',
    address: 'Pavilhão Hortigranjeiros Box 44',
    totalPurchasedReais: 14200.00,
    ordersCount: 12,
    notes: 'Compra grandes lotes de tomate e pimentão.'
  },
  {
    id: 'cust-3',
    name: 'Feirante Zé do Melão & Folhas',
    document: '123.456.789-00',
    type: 'Feirante',
    phone: '(87) 99654-3321',
    address: 'Banca 12 Feira Livre do Parque',
    totalPurchasedReais: 2450.00,
    ordersCount: 15,
    notes: 'Pagamento imediato via PIX na retirada.'
  },
  {
    id: 'cust-4',
    name: 'Restaurante Sabor da Terra',
    document: '44.332.110/0001-55',
    type: 'Restaurante',
    phone: '(87) 99811-2233',
    address: 'Rua das Palmeiras, 85',
    totalPurchasedReais: 1890.00,
    ordersCount: 6,
    notes: 'Exige padrão Tipo 1 para saladas.'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-1',
    orderNumber: '#000245',
    date: '2026-10-05',
    customerId: 'cust-2',
    customerName: 'Distribuidora Ceasa Box 44 (Verde Vida)',
    cropName: 'Tomate Italiano',
    lotNumber: 'TOM-2026-001',
    quantity: 500,
    unit: 'kg',
    unitPriceReais: 4.80,
    totalPriceReais: 2400.00,
    paymentMethod: 'PIX',
    paymentStatus: 'Pago',
    fieldName: 'Setor 01',
    harvestDate: '2026-10-05',
    notes: 'Rastreabilidade Lote TOM-2026-001 impressa na nota.'
  },
  {
    id: 'sale-2',
    orderNumber: '#000246',
    date: '2026-10-05',
    customerId: 'cust-3',
    customerName: 'Feirante Zé do Melão & Folhas',
    cropName: 'Alface Crespa',
    lotNumber: 'ALF-2026-042',
    quantity: 400,
    unit: 'maços',
    unitPriceReais: 2.50,
    totalPriceReais: 1000.00,
    paymentMethod: 'PIX',
    paymentStatus: 'Pago',
    fieldName: 'Setor 02',
    harvestDate: '2026-10-04'
  },
  {
    id: 'sale-3',
    orderNumber: '#000247',
    date: '2026-10-03',
    customerId: 'cust-1',
    customerName: 'Supermercado Bom Preço da Vila',
    cropName: 'Tomate Italiano',
    lotNumber: 'TOM-2026-001',
    quantity: 350,
    unit: 'kg',
    unitPriceReais: 5.20,
    totalPriceReais: 1820.00,
    paymentMethod: 'A Prazo (30 dias)',
    paymentStatus: 'Pendente',
    fieldName: 'Setor 01',
    harvestDate: '2026-10-02'
  },
  {
    id: 'sale-4',
    orderNumber: '#000248',
    date: '2026-10-02',
    customerId: 'cust-4',
    customerName: 'Restaurante Sabor da Terra',
    cropName: 'Alface Crespa',
    lotNumber: 'ALF-2026-042',
    quantity: 200,
    unit: 'maços',
    unitPriceReais: 2.80,
    totalPriceReais: 560.00,
    paymentMethod: 'Dinheiro',
    paymentStatus: 'Pago',
    fieldName: 'Setor 02',
    harvestDate: '2026-10-02'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    date: '2026-10-01',
    category: 'Energia Elétrica',
    description: 'Conta de Energia Trifásica — Bomba de Irrigação (Mês Ref. Setembro)',
    amountReais: 642.50,
    fieldName: 'Geral Propriedade',
    paymentStatus: 'Pago'
  },
  {
    id: 'exp-2',
    date: '2026-09-25',
    category: 'Mão de Obra/Diárias',
    description: 'Diárias de colheita e desbrota (3 diaristas x 2 dias)',
    amountReais: 720.00,
    fieldId: 'field-1',
    fieldName: 'Setor 01',
    cropName: 'Tomate Italiano',
    lotNumber: 'TOM-2026-001',
    paymentStatus: 'Pago'
  },
  {
    id: 'exp-3',
    date: '2026-09-18',
    category: 'Fertilizantes/Adubos',
    description: 'Compra 500kg Adubo NPK 04-14-08 cooperativa',
    amountReais: 1700.00,
    fieldName: 'Estoque Central',
    paymentStatus: 'Pago'
  },
  {
    id: 'exp-4',
    date: '2026-09-10',
    category: 'Defensivos',
    description: 'Compra Bioinseticida Óleo de Neem e sabão potássico',
    amountReais: 340.00,
    fieldName: 'Setores 01 & 02',
    paymentStatus: 'Pago'
  },
  {
    id: 'exp-5',
    date: '2026-09-05',
    category: 'Manutenção',
    description: 'Troca de vedação e filtro de disco do cabeçal de controle',
    amountReais: 185.00,
    fieldName: 'Central de Irrigação',
    paymentStatus: 'Pago'
  },
  {
    id: 'exp-6',
    date: '2026-09-02',
    category: 'Sementes/Mudas',
    description: 'Bandejas de mudas alface crespa enraizadas',
    amountReais: 450.00,
    fieldId: 'field-2',
    fieldName: 'Setor 02',
    cropName: 'Alface Crespa',
    lotNumber: 'ALF-2026-042',
    paymentStatus: 'Pago'
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    date: '2026-10-06',
    title: 'Vistoria de Canteiros e Tutoramento (Lote TOM-2026-001)',
    type: 'Adubação',
    lotOrCrop: 'Tomate Italiano',
    location: 'Área de Hortaliças',
    completed: true
  },
  {
    id: 'ev-2',
    date: '2026-10-07',
    title: 'Adubação de Cobertura Potássica',
    type: 'Adubação',
    lotOrCrop: 'Pimentão Amarelo',
    location: 'Lote PIM-2026-018',
    completed: false
  },
  {
    id: 'ev-3',
    date: '2026-10-08',
    title: 'Separação de Caixas e Etiquetas de Rastreabilidade',
    type: 'Colheita',
    lotOrCrop: 'Tomate Italiano',
    location: 'Galpão de Embalagem',
    completed: false
  },
  {
    id: 'ev-4',
    date: '2026-10-09',
    title: 'Colheita 800 maços Alface para Feira de Sábado',
    type: 'Colheita',
    lotOrCrop: 'Alface Crespa (Lote ALF-2026-042)',
    location: 'Setor Folhosas',
    completed: false
  },
  {
    id: 'ev-5',
    date: '2026-10-10',
    title: 'Entrega Semanal Supermercado Bom Preço',
    type: 'Venda/Entrega',
    lotOrCrop: 'Tomate + Alface',
    location: 'Cidade / Box',
    completed: false
  },
  {
    id: 'ev-6',
    date: '2026-10-15',
    title: 'Início da Preparação de Solo Setor 03 (Mandioca)',
    type: 'Plantio',
    lotOrCrop: 'Mandioca Manteiga',
    location: 'Setor 03 - Área B',
    completed: false
  }
];
