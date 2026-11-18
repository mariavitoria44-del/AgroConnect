/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  loadLocalDatabase,
  saveLocalDatabase,
  loadOfflineQueue,
  saveOfflineQueue,
  syncQueueWithServer,
  AgroDatabase
} from './services/api';
import { UserRole, SyncQueueItem, Crop, Planting, Harvest, Sale, Customer, Expense, InventoryItem, StockMovement, CalendarEvent, FarmerUser } from './types/agro';
import { LoginPage, DEMO_FARMERS } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CropsModule } from './components/CropsModule';
import { ProductionModule } from './components/ProductionModule';
import { InventoryModule } from './components/InventoryModule';
import { SalesModule } from './components/SalesModule';
import { FinanceModule } from './components/FinanceModule';
import { CalendarModule } from './components/CalendarModule';
import { ReportsModule } from './components/ReportsModule';
import { MobileFieldMode } from './components/MobileFieldMode';
import { TechnicalArchitectureModal } from './components/TechnicalArchitectureModal';
import { AgronomoChatModal } from './components/AgronomoChatModal';

export default function App() {
  const [db, setDb] = useState<AgroDatabase>(() => loadLocalDatabase());
  const [offlineQueue, setOfflineQueue] = useState<SyncQueueItem[]>(() => loadOfflineQueue());
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isFieldMode, setIsFieldMode] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('proprietario');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState<boolean>(false);

  // Farmer login state
  const [currentUser, setCurrentUser] = useState<FarmerUser | null>(() => {
    try {
      const saved = localStorage.getItem('agroconnect_farmer_user_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_FARMERS[0]; // Start authenticated with José de Bragança (Fazenda Vista Verde, Dom Expedito Lopes - PI)
  });

  const handleLogin = (user: FarmerUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem('agroconnect_farmer_user_v1', JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('agroconnect_farmer_user_v1');
    } catch {}
  };

  // Sync state changes with localStorage and server
  useEffect(() => {
    saveLocalDatabase(db);
  }, [db]);

  useEffect(() => {
    saveOfflineQueue(offlineQueue);
  }, [offlineQueue]);

  // Offline Sync Trigger
  const handleSyncNow = async () => {
    if (offlineQueue.length === 0) return;
    const res = await syncQueueWithServer();
    setOfflineQueue(res.remainingQueue);
  };

  // Add Item Handlers
  const handleAddPlanting = (planting: Planting) => {
    setDb((prev) => ({ ...prev, plantings: [planting, ...prev.plantings] }));
  };

  const handleAddHarvest = (harvest: Harvest) => {
    setDb((prev) => {
      // Also update the planting's harvested yield
      const updatedPlantings = prev.plantings.map((p) => {
        if (p.lotNumber === harvest.lotNumber) {
          return {
            ...p,
            harvestedYieldKg: p.harvestedYieldKg + harvest.quantity,
          };
        }
        return p;
      });

      return {
        ...prev,
        harvests: [harvest, ...prev.harvests],
        plantings: updatedPlantings,
      };
    });
  };

  const handleAddCrop = (crop: Crop) => {
    setDb((prev) => ({ ...prev, crops: [...prev.crops, crop] }));
  };

  const handleAddItem = (item: InventoryItem) => {
    setDb((prev) => ({ ...prev, inventory: [...prev.inventory, item] }));
  };

  const handleAddMovement = (movement: StockMovement) => {
    setDb((prev) => {
      const updatedInv = prev.inventory.map((item) => {
        if (item.id === movement.itemId) {
          const delta = movement.type.includes('Entrada') ? movement.quantity : -movement.quantity;
          return { ...item, currentQty: Math.max(0, item.currentQty + delta) };
        }
        return item;
      });
      return {
        ...prev,
        inventory: updatedInv,
        stockMovements: [movement, ...prev.stockMovements],
      };
    });
  };

  const handleAddSale = (sale: Sale) => {
    if (!isOnline) {
      setOfflineQueue((q) => [
        ...q,
        {
          id: `q-${Date.now()}`,
          action: 'create_sale',
          payload: sale,
          createdAt: new Date().toISOString(),
          status: 'pending',
        },
      ]);
    }
    setDb((prev) => ({ ...prev, sales: [sale, ...prev.sales] }));
  };

  const handleAddCustomer = (customer: Customer) => {
    setDb((prev) => ({ ...prev, customers: [...prev.customers, customer] }));
  };

  const handleAddExpense = (expense: Expense) => {
    if (!isOnline) {
      setOfflineQueue((q) => [
        ...q,
        {
          id: `q-${Date.now()}`,
          action: 'add_expense',
          payload: expense,
          createdAt: new Date().toISOString(),
          status: 'pending',
        },
      ]);
    }
    setDb((prev) => ({ ...prev, expenses: [expense, ...prev.expenses] }));
  };

  const handleAddEvent = (event: CalendarEvent) => {
    setDb((prev) => ({ ...prev, calendarEvents: [...prev.calendarEvents, event] }));
  };

  const handleToggleEventComplete = (eventId: string) => {
    setDb((prev) => ({
      ...prev,
      calendarEvents: prev.calendarEvents.map((e) =>
        e.id === eventId ? { ...e, completed: !e.completed } : e
      ),
    }));
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Global Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isFieldMode={isFieldMode}
        setIsFieldMode={setIsFieldMode}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        pendingSyncCount={offlineQueue.length}
        onSyncNow={handleSyncNow}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        onOpenChatbot={() => setIsChatbotModalOpen(true)}
        recommendations={db.recommendations}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* If Mode is Campo Mobile */}
        {isFieldMode ? (
          <MobileFieldMode
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            pendingSyncCount={offlineQueue.length}
            onSyncNow={handleSyncNow}
            plantings={db.plantings}
            onQuickLogHarvest={(h) => {
              const fullHarvest: Harvest = {
                id: `harv-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                lotNumber: 'TOM-2026-001',
                cropName: h.cropName || 'Tomate',
                fieldName: 'Setor Principal',
                quantity: h.quantity || 50,
                unit: (h.unit as any) || 'kg',
                qualityGrade: 'Tipo 1 (Extra)',
                lossesQty: 2,
                destination: h.destination || 'Feira Livre',
                registeredBy: 'Operador Móvel',
                productionCostReais: (h.quantity || 50) * 1.85,
              };
              handleAddHarvest(fullHarvest);
            }}
            onQuickLogSale={(s) => {
              const fullSale: Sale = {
                id: `sale-${Date.now()}`,
                orderNumber: `#000${Math.floor(100 + Math.random() * 900)}`,
                date: new Date().toISOString().split('T')[0],
                customerId: 'cust-3',
                customerName: s.customerName || 'Venda de Campo',
                cropName: s.cropName || 'Tomate',
                lotNumber: 'TOM-2026-001',
                quantity: s.quantity || 20,
                unit: (s.unit as any) || 'kg',
                unitPriceReais: s.unitPriceReais || 4.80,
                totalPriceReais: (s.quantity || 20) * (s.unitPriceReais || 4.80),
                paymentMethod: 'PIX',
                paymentStatus: 'Pago',
                fieldName: 'Setor Principal',
                harvestDate: new Date().toISOString().split('T')[0],
              };
              handleAddSale(fullSale);
            }}
          />
        ) : (
          /* Web ERP Mode Tabs */
          <>
            {currentTab === 'dashboard' && (
              <Dashboard
                plantings={db.plantings}
                recommendations={db.recommendations}
                inventory={db.inventory}
                sales={db.sales}
                expenses={db.expenses}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenChatbot={() => setIsChatbotModalOpen(true)}
              />
            )}

            {currentTab === 'crops' && (
              <CropsModule crops={db.crops} onAddCrop={handleAddCrop} />
            )}

            {currentTab === 'production' && (
              <ProductionModule
                plantings={db.plantings}
                harvests={db.harvests}
                properties={db.properties}
                crops={db.crops}
                onAddPlanting={handleAddPlanting}
                onAddHarvest={handleAddHarvest}
              />
            )}

            {currentTab === 'inventory' && (
              <InventoryModule
                inventory={db.inventory}
                movements={db.stockMovements}
                onAddItem={handleAddItem}
                onAddMovement={handleAddMovement}
              />
            )}

            {currentTab === 'sales' && (
              <SalesModule
                sales={db.sales}
                customers={db.customers}
                plantings={db.plantings}
                harvests={db.harvests}
                onAddSale={handleAddSale}
                onAddCustomer={handleAddCustomer}
              />
            )}

            {currentTab === 'finance' && (
              <FinanceModule
                expenses={db.expenses}
                sales={db.sales}
                properties={db.properties}
                crops={db.crops}
                onAddExpense={handleAddExpense}
              />
            )}

            {currentTab === 'calendar' && (
              <CalendarModule
                events={db.calendarEvents}
                onAddEvent={handleAddEvent}
                onToggleComplete={handleToggleEventComplete}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsModule
                plantings={db.plantings}
                harvests={db.harvests}
                sales={db.sales}
                expenses={db.expenses}
                inventory={db.inventory}
              />
            )}
          </>
        )}
      </main>

      {/* Gemini Agronomic Chatbot Modal */}
      <AgronomoChatModal
        isOpen={isChatbotModalOpen}
        onClose={() => setIsChatbotModalOpen(false)}
        crops={db.crops}
      />

      {/* Technical Architecture Modal (Section 40) */}
      <TechnicalArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <span className="font-bold text-stone-800">AgroConnect</span> • Gestão Rural Inteligente em Dom Expedito Lopes - PI
          </p>
          <p className="text-stone-400">
            Tecnologia no Campo: Produção • Rastreabilidade • Culturas • Gestão Financeira
          </p>
        </div>
      </footer>
    </div>
  );
}
