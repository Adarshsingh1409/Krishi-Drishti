// IndexedDB utility for offline data storage
export class IndexedDBStorage {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string = 'KrishiDrishtiDB', version: number = 1) {
    this.dbName = dbName;
    this.version = version;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores for different data types
        if (!db.objectStoreNames.contains('plantIdentifications')) {
          const plantStore = db.createObjectStore('plantIdentifications', { keyPath: 'id', autoIncrement: true });
          plantStore.createIndex('date', 'createdAt');
          plantStore.createIndex('plantName', 'plantName');
        }

        if (!db.objectStoreNames.contains('diseaseDetections')) {
          const diseaseStore = db.createObjectStore('diseaseDetections', { keyPath: 'id', autoIncrement: true });
          diseaseStore.createIndex('date', 'createdAt');
          diseaseStore.createIndex('diseaseName', 'diseaseName');
        }

        if (!db.objectStoreNames.contains('fertilizerCalculations')) {
          const fertilizerStore = db.createObjectStore('fertilizerCalculations', { keyPath: 'id', autoIncrement: true });
          fertilizerStore.createIndex('date', 'createdAt');
          fertilizerStore.createIndex('crop', 'crop');
        }

        if (!db.objectStoreNames.contains('weatherData')) {
          const weatherStore = db.createObjectStore('weatherData', { keyPath: 'id', autoIncrement: true });
          weatherStore.createIndex('date', 'createdAt');
          weatherStore.createIndex('location', 'location');
        }

        if (!db.objectStoreNames.contains('cultivationTips')) {
          const tipsStore = db.createObjectStore('cultivationTips', { keyPath: 'id', autoIncrement: true });
          tipsStore.createIndex('crop', 'crop');
        }

        if (!db.objectStoreNames.contains('appSettings')) {
          const settingsStore = db.createObjectStore('appSettings', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('offlineQueue')) {
          const queueStore = db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
          queueStore.createIndex('timestamp', 'timestamp');
        }
      };
    });
  }

  async add(storeName: string, data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => {
        resolve(request.result as string);
      };

      request.onerror = () => {
        reject(new Error('Failed to add data'));
      };
    });
  }

  async get(storeName: string, key: string | number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get data'));
      };
    });
  }

  async getAll(storeName: string, index?: string, key?: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      let request: IDBRequest;

      if (index && key !== undefined) {
        const indexObj = store.index(index);
        request = indexObj.getAll(key);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get all data'));
      };
    });
  }

  async update(storeName: string, key: string | number, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to update data'));
      };
    });
  }

  async delete(storeName: string, key: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to delete data'));
      };
    });
  }

  async clear(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear store'));
      };
    });
  }

  async addToQueue(operation: string, data: any): Promise<string> {
    const queueItem = {
      operation,
      data,
      timestamp: Date.now(),
      synced: false
    };
    return this.add('offlineQueue', queueItem);
  }

  async getQueueItems(): Promise<any[]> {
    return this.getAll('offlineQueue', 'synced', false);
  }

  async markQueueItemSynced(id: string): Promise<void> {
    const item = await this.get('offlineQueue', id);
    if (item) {
      item.synced = true;
      await this.update('offlineQueue', id, item);
    }
  }

  async clearSyncedQueueItems(): Promise<void> {
    const allItems = await this.getAll('offlineQueue');
    const syncedItems = allItems.filter(item => item.synced);
    
    for (const item of syncedItems) {
      await this.delete('offlineQueue', item.id);
    }
  }

  async getSetting(key: string): Promise<any> {
    const setting = await this.get('appSettings', key);
    return setting ? setting.value : null;
  }

  async setSetting(key: string, value: any): Promise<void> {
    await this.update('appSettings', key, { key, value });
  }

  async cacheWeatherData(location: string, data: any): Promise<void> {
    const cacheKey = `weather_${location}`;
    const cachedData = {
      key: cacheKey,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour cache
    };
    await this.update('appSettings', cacheKey, cachedData);
  }

  async getCachedWeatherData(location: string): Promise<any | null> {
    const cacheKey = `weather_${location}`;
    const cached = await this.get('appSettings', cacheKey);
    
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
    
    return null;
  }

  async clearExpiredCache(): Promise<void> {
    const allSettings = await this.getAll('appSettings');
    const now = Date.now();
    
    for (const setting of allSettings) {
      if (setting.key.startsWith('weather_') && setting.expiresAt && setting.expiresAt <= now) {
        await this.delete('appSettings', setting.key);
      }
    }
  }
}

// Export a singleton instance
export const indexedDBStorage = new IndexedDBStorage();

// Initialize the database when the module is loaded
if (typeof window !== 'undefined') {
  indexedDBStorage.init().catch(console.error);
}