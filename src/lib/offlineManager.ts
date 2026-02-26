// Offline Manager for handling all offline operations
import { indexedDBStorage } from './indexedDB';

export interface OfflineOperation {
  id: string;
  type: 'plant_identification' | 'disease_detection' | 'fertilizer_calculation' | 'weather_request';
  data: any;
  timestamp: number;
  synced: boolean;
  retryCount: number;
}

export interface OfflineCache {
  key: string;
  data: any;
  timestamp: number;
  expiresAt: number;
}

export class OfflineManager {
  private static instance: OfflineManager;
  private syncInterval: NodeJS.Timeout | null = null;
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    this.initializeEventListeners();
    this.startPeriodicSync();
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  private initializeEventListeners(): void {
    // Handle online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingOperations();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Handle service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_COMPLETE') {
          console.log('Sync completed:', event.data);
        }
      });
    }
  }

  private startPeriodicSync(): void {
    // Sync every 5 minutes when online
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncPendingOperations();
      }
    }, 5 * 60 * 1000);
  }

  // Queue an operation for offline execution
  async queueOperation(type: OfflineOperation['type'], data: any): Promise<string> {
    const operation: OfflineOperation = {
      id: this.generateId(),
      type,
      data,
      timestamp: Date.now(),
      synced: false,
      retryCount: 0
    };

    try {
      await indexedDBStorage.addToQueue(type, operation);
      console.log(`Operation queued: ${type}`, operation);
      return operation.id;
    } catch (error) {
      console.error('Failed to queue operation:', error);
      throw error;
    }
  }

  // Cache data for offline use
  async cacheData(key: string, data: any, ttl: number = 3600000): Promise<void> {
    const cache: OfflineCache = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    };

    try {
      await indexedDBStorage.setSetting(`cache_${key}`, cache);
      console.log(`Data cached: ${key}`, cache);
    } catch (error) {
      console.error('Failed to cache data:', error);
      throw error;
    }
  }

  // Get cached data
  async getCachedData(key: string): Promise<any | null> {
    try {
      const cache: OfflineCache = await indexedDBStorage.getSetting(`cache_${key}`);
      
      if (!cache) {
        return null;
      }

      // Check if cache is expired
      if (cache.expiresAt < Date.now()) {
        await this.clearCachedData(key);
        return null;
      }

      console.log(`Cache hit: ${key}`, cache);
      return cache.data;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }

  // Clear cached data
  async clearCachedData(key: string): Promise<void> {
    try {
      await indexedDBStorage.setSetting(`cache_${key}`, null);
      console.log(`Cache cleared: ${key}`);
    } catch (error) {
      console.error('Failed to clear cached data:', error);
      throw error;
    }
  }

  // Sync pending operations
  async syncPendingOperations(): Promise<void> {
    if (!this.isOnline) {
      console.log('Cannot sync while offline');
      return;
    }

    try {
      const pendingOperations = await indexedDBStorage.getQueueItems();
      
      if (pendingOperations.length === 0) {
        console.log('No pending operations to sync');
        return;
      }

      console.log(`Syncing ${pendingOperations.length} pending operations...`);

      for (const operation of pendingOperations) {
        try {
          await this.executeOperation(operation);
          await indexedDBStorage.markQueueItemSynced(operation.id);
          console.log(`Operation synced: ${operation.type}`, operation);
        } catch (error) {
          console.error(`Failed to sync operation: ${operation.type}`, error);
          
          // Increment retry count
          operation.retryCount++;
          await indexedDBStorage.update('offlineQueue', operation.id, operation);
          
          // Remove operation if too many retries
          if (operation.retryCount >= 3) {
            await indexedDBStorage.delete('offlineQueue', operation.id);
            console.log(`Operation removed after too many retries: ${operation.type}`);
          }
        }
      }

      // Clear synced operations
      await indexedDBStorage.clearSyncedQueueItems();
      
      // Notify service worker about sync completion
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.active?.postMessage({
          type: 'SYNC_COMPLETE',
          data: { syncedCount: pendingOperations.length }
        });
      }
    } catch (error) {
      console.error('Failed to sync pending operations:', error);
    }
  }

  // Execute a single operation
  private async executeOperation(operation: OfflineOperation): Promise<void> {
    switch (operation.type) {
      case 'plant_identification':
        await this.syncPlantIdentification(operation.data);
        break;
      case 'disease_detection':
        await this.syncDiseaseDetection(operation.data);
        break;
      case 'fertilizer_calculation':
        await this.syncFertilizerCalculation(operation.data);
        break;
      case 'weather_request':
        await this.syncWeatherRequest(operation.data);
        break;
      default:
        throw new Error(`Unknown operation type: ${operation.type}`);
    }
  }

  // Sync specific operation types
  private async syncPlantIdentification(data: any): Promise<void> {
    const response = await fetch('/api/identify-plant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // Store the result in IndexedDB for offline access
    await indexedDBStorage.add('plantIdentifications', {
      ...result,
      timestamp: Date.now(),
      synced: true
    });
  }

  private async syncDiseaseDetection(data: any): Promise<void> {
    const response = await fetch('/api/predict-disease', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // Store the result in IndexedDB for offline access
    await indexedDBStorage.add('diseaseDetections', {
      ...result,
      timestamp: Date.now(),
      synced: true
    });
  }

  private async syncFertilizerCalculation(data: any): Promise<void> {
    const response = await fetch('/api/fertilizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // Store the result in IndexedDB for offline access
    await indexedDBStorage.add('fertilizerCalculations', {
      ...result,
      timestamp: Date.now(),
      synced: true
    });
  }

  private async syncWeatherRequest(data: any): Promise<void> {
    const response = await fetch('/api/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // Cache the weather data
    await this.cacheData(`weather_${data.location}`, result, 3600000); // 1 hour TTL
  }

  // Get offline status
  getOfflineStatus(): {
    isOnline: boolean;
    pendingOperations: number;
    cacheSize: number;
  } {
    return {
      isOnline: this.isOnline,
      pendingOperations: 0, // This would be fetched from IndexedDB
      cacheSize: 0 // This would be calculated from IndexedDB
    };
  }

  // Clear all offline data
  async clearAllOfflineData(): Promise<void> {
    try {
      // Clear IndexedDB stores
      await indexedDBStorage.clear('offlineQueue');
      await indexedDBStorage.clear('plantIdentifications');
      await indexedDBStorage.clear('diseaseDetections');
      await indexedDBStorage.clear('fertilizerCalculations');
      await indexedDBStorage.clear('weatherData');
      
      // Clear cache settings
      const allSettings = await indexedDBStorage.getAll('appSettings');
      for (const setting of allSettings) {
        if (setting.key.startsWith('cache_')) {
          await indexedDBStorage.delete('appSettings', setting.key);
        }
      }

      // Clear service worker cache
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.active?.postMessage({ type: 'CLEAR_CACHE' });
      }

      console.log('All offline data cleared');
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      throw error;
    }
  }

  // Get offline statistics
  async getOfflineStats(): Promise<{
    pendingOperations: number;
    cachedItems: number;
    plantIdentifications: number;
    diseaseDetections: number;
    fertilizerCalculations: number;
    weatherData: number;
  }> {
    try {
      const pendingOperations = await indexedDBStorage.getQueueItems();
      const cachedItems = await indexedDBStorage.getAll('appSettings');
      const plantIdentifications = await indexedDBStorage.getAll('plantIdentifications');
      const diseaseDetections = await indexedDBStorage.getAll('diseaseDetections');
      const fertilizerCalculations = await indexedDBStorage.getAll('fertilizerCalculations');
      const weatherData = await indexedDBStorage.getAll('weatherData');

      return {
        pendingOperations: pendingOperations.length,
        cachedItems: cachedItems.filter(item => item.key.startsWith('cache_')).length,
        plantIdentifications: plantIdentifications.length,
        diseaseDetections: diseaseDetections.length,
        fertilizerCalculations: fertilizerCalculations.length,
        weatherData: weatherData.length
      };
    } catch (error) {
      console.error('Failed to get offline stats:', error);
      throw error;
    }
  }

  // Clean up expired cache items
  async cleanupExpiredCache(): Promise<void> {
    try {
      await indexedDBStorage.clearExpiredCache();
      console.log('Expired cache items cleaned up');
    } catch (error) {
      console.error('Failed to cleanup expired cache:', error);
      throw error;
    }
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Destroy the instance (cleanup)
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Export singleton instance
export const offlineManager = OfflineManager.getInstance();