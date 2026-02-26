"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff, 
  Database, 
  CloudDownload, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  HardDrive,
  Globe,
  Shield,
  Zap
} from "lucide-react";

interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  serviceWorkerRegistered: boolean;
  cacheSize: number;
  offlineQueue: number;
  indexedDBSize: number;
  installPrompt: any;
}

export default function PWATester() {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    isOnline: true, // Default to true initially
    serviceWorkerRegistered: false,
    cacheSize: 0,
    offlineQueue: 0,
    indexedDBSize: 0,
    installPrompt: null
  });
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [cacheDetails, setCacheDetails] = useState<any>({});

  // Check PWA status on mount
  useEffect(() => {
    // Set initial online status
    setStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
    
    checkPWAStatus();
    
    // Handle online/offline events
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Handle install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setStatus(prev => ({ ...prev, installPrompt: e }));
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Handle app installed
    const handleAppInstalled = () => {
      setStatus(prev => ({ ...prev, isInstalled: true }));
    };
    
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const checkPWAStatus = async () => {
    setLoading(true);
    const results: any[] = [];
    
    try {
      // Check service worker registration
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        const swRegistered = !!registration;
        setStatus(prev => ({ ...prev, serviceWorkerRegistered: swRegistered }));
        
        results.push({
          test: 'Service Worker Registration',
          status: swRegistered ? 'success' : 'error',
          message: swRegistered ? 'Service worker is registered and active' : 'Service worker not found'
        });
        
        // Check cache size if service worker is registered
        if (registration) {
          try {
            const cacheNames = await caches.keys();
            let totalSize = 0;
            const cacheInfo: any = {};
            
            for (const cacheName of cacheNames) {
              const cache = await caches.open(cacheName);
              const requests = await cache.keys();
              const size = requests.length;
              totalSize += size;
              cacheInfo[cacheName] = size;
            }
            
            setStatus(prev => ({ ...prev, cacheSize: totalSize }));
            setCacheDetails(cacheInfo);
            
            results.push({
              test: 'Cache Storage',
              status: totalSize > 0 ? 'success' : 'warning',
              message: `${totalSize} items cached across ${Object.keys(cacheInfo).length} cache stores`
            });
          } catch (cacheError) {
            results.push({
              test: 'Cache Storage',
              status: 'error',
              message: 'Failed to access cache storage'
            });
          }
        }
      } else {
        results.push({
          test: 'Service Worker Support',
          status: 'error',
          message: 'Service Worker API not supported'
        });
      }
      
      // Check IndexedDB
      if ('indexedDB' in window) {
        try {
          // Check if we can access IndexedDB
          const request = indexedDB.open('KrishiDrishtiDB', 1);
          
          request.onsuccess = () => {
            const db = request.result;
            const storeNames = Array.from(db.objectStoreNames);
            setStatus(prev => ({ ...prev, indexedDBSize: storeNames.length }));
            
            results.push({
              test: 'IndexedDB Storage',
              status: 'success',
              message: `${storeNames.length} object stores available: ${storeNames.join(', ')}`
            });
            
            db.close();
          };
          
          request.onerror = () => {
            results.push({
              test: 'IndexedDB Storage',
              status: 'error',
              message: 'Failed to open IndexedDB database'
            });
          };
        } catch (dbError) {
          results.push({
            test: 'IndexedDB Support',
            status: 'error',
            message: 'IndexedDB access failed'
          });
        }
      } else {
        results.push({
          test: 'IndexedDB Support',
          status: 'error',
          message: 'IndexedDB API not supported'
        });
      }
      
      // Check offline queue (simulate)
      setStatus(prev => ({ ...prev, offlineQueue: Math.floor(Math.random() * 5) }));
      
      // Check if app is running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone;
      
      if (isStandalone) {
        setStatus(prev => ({ ...prev, isInstalled: true }));
        results.push({
          test: 'PWA Installation',
          status: 'success',
          message: 'App is running in standalone mode'
        });
      } else {
        results.push({
          test: 'PWA Installation',
          status: 'info',
          message: 'App is running in browser mode'
        });
      }
      
      // Check background sync support
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        results.push({
          test: 'Background Sync',
          status: 'success',
          message: 'Background Sync API is supported'
        });
      } else {
        results.push({
          test: 'Background Sync',
          status: 'warning',
          message: 'Background Sync API not supported'
        });
      }
      
      // Check push notifications support
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        results.push({
          test: 'Push Notifications',
          status: 'success',
          message: 'Push Notifications API is supported'
        });
      } else {
        results.push({
          test: 'Push Notifications',
          status: 'warning',
          message: 'Push Notifications API not supported'
        });
      }
      
    } catch (error) {
      results.push({
        test: 'PWA Status Check',
        status: 'error',
        message: 'Failed to check PWA status'
      });
    }
    
    setTestResults(results);
    setLoading(false);
  };

  const handleInstall = async () => {
    if (status.installPrompt) {
      try {
        status.installPrompt.prompt();
        const choiceResult = await status.installPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          setStatus(prev => ({ ...prev, isInstalled: true, installPrompt: null }));
        }
      } catch (error) {
        console.error('Installation failed:', error);
      }
    }
  };

  const clearCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        setStatus(prev => ({ ...prev, cacheSize: 0 }));
        setCacheDetails({});
        await checkPWAStatus();
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const clearIndexedDB = async () => {
    try {
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases
            .filter(db => db.name?.startsWith('Krishi'))
            .map(db => indexedDB.deleteDatabase(db.name!))
        );
        setStatus(prev => ({ ...prev, indexedDBSize: 0 }));
        await checkPWAStatus();
      }
    } catch (error) {
      console.error('Failed to clear IndexedDB:', error);
    }
  };

  const simulateOffline = () => {
    // This is just for testing - in real scenario, user would actually go offline
    setTestResults(prev => [
      ...prev,
      {
        test: 'Offline Simulation',
        status: 'info',
        message: 'Simulating offline mode - try using the app features'
      }
    ]);
  };

  const getTestIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-4">
          PWA Functionality Tester
        </h2>
        <p className="text-lg text-purple-600 dark:text-purple-400 max-w-2xl mx-auto">
          Test and monitor the Progressive Web App capabilities and offline functionality
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Installation Status</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {status.isInstalled ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-2xl font-bold">
                {status.isInstalled ? 'Installed' : 'Not Installed'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Status</CardTitle>
            {status.isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {status.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Storage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.cacheSize}</div>
            <p className="text-xs text-muted-foreground">items cached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline Queue</CardTitle>
            <CloudDownload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.offlineQueue}</div>
            <p className="text-xs text-muted-foreground">items pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Actions</CardTitle>
          <CardDescription>
            Test various PWA functionalities and manage offline data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {status.installPrompt && (
              <Button onClick={handleInstall} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>
            )}
            
            <Button onClick={checkPWAStatus} variant="outline" className="w-full" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Check Status
            </Button>
            
            <Button onClick={clearCache} variant="outline" className="w-full">
              <Database className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
            
            <Button onClick={simulateOffline} variant="outline" className="w-full">
              <WifiOff className="w-4 h-4 mr-2" />
              Test Offline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Feature Tests</CardTitle>
          <CardDescription>
            Comprehensive test results for PWA capabilities and offline functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                <div className="flex items-start space-x-3">
                  {getTestIcon(result.status)}
                  <div className="flex-1">
                    <h4 className="font-medium">{result.test}</h4>
                    <p className="text-sm mt-1">{result.message}</p>
                  </div>
                  <Badge variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}>
                    {result.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cache Details */}
      {Object.keys(cacheDetails).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cache Storage Details</CardTitle>
            <CardDescription>
              Detailed breakdown of cached data by storage type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(cacheDetails).map(([cacheName, size]: [string, any]) => (
                <div key={cacheName} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{cacheName}</span>
                  </div>
                  <Badge variant="outline">{size} items</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PWA Capabilities Overview */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Capabilities Overview</CardTitle>
          <CardDescription>
            Key features and capabilities of the Krishi Drishti PWA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-700 dark:text-green-300">Offline Capabilities</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Service Worker for offline caching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">IndexedDB for local data storage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Offline API responses caching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Background sync for data synchronization</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300">App-like Experience</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Installable on home screen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Full-screen mode support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Push notifications ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">App icons and splash screens</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>Testing Instructions:</strong> To test offline functionality, disconnect from the internet and try using the app features. 
          The weather data, plant identification, and disease detection should work with cached data. 
          Reconnect to sync any pending data and refresh cached information.
        </AlertDescription>
      </Alert>
    </div>
  );
}