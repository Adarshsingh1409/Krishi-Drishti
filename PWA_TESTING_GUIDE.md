# Krishi Drishti PWA Testing Guide

This guide provides comprehensive instructions for testing the Progressive Web App (PWA) functionality and offline capabilities of Krishi Drishti.

## Table of Contents
1. [PWA Features Overview](#pwa-features-overview)
2. [Installation Testing](#installation-testing)
3. [Offline Functionality Testing](#offline-functionality-testing)
4. [Service Worker Testing](#service-worker-testing)
5. [Cache Management Testing](#cache-management-testing)
6. [IndexedDB Testing](#indexeddb-testing)
7. [Background Sync Testing](#background-sync-testing)
8. [Cross-Browser Testing](#cross-browser-testing)
9. [Performance Testing](#performance-testing)
10. [Troubleshooting](#troubleshooting)

## PWA Features Overview

Krishi Drishti implements the following PWA features:

### Core PWA Features
- **Service Worker**: Caches assets and API responses for offline use
- **Web App Manifest**: Enables app installation on home screen
- **Offline Support**: Works without internet connection
- **Background Sync**: Syncs data when connection is restored
- **Push Notifications**: Ready for implementation

### Offline Capabilities
- **Plant Identification**: Works with cached ML models
- **Disease Detection**: Offline + online modes
- **Weather Information**: Cached for 1 hour
- **Fertilizer Calculator**: Works offline
- **Cultivation Tips**: Pre-loaded data available offline

## Installation Testing

### 1. Browser Installation
**Steps:**
1. Open the app in Chrome, Edge, or Firefox
2. Look for the install icon in the address bar
3. Click "Install" or "Add to Home Screen"
4. Verify the app installs successfully

**Expected Results:**
- App icon appears on desktop/home screen
- App opens in standalone mode
- App works without browser chrome

### 2. Mobile Installation
**Steps:**
1. Open the app in mobile Chrome/Safari
2. Look for "Add to Home Screen" prompt
3. Tap "Add" or "Install"
4. Verify the app appears on home screen

**Expected Results:**
- App icon appears on home screen
- App launches in fullscreen mode
- Touch interactions work properly

### 3. Manifest Verification
**Steps:**
1. Navigate to `/manifest.json`
2. Verify all required fields are present
3. Check icon paths are correct

**Expected Results:**
- Manifest loads successfully
- All icons are accessible
- PWA installable criteria met

## Offline Functionality Testing

### 1. Basic Offline Test
**Steps:**
1. Open the app while online
2. Navigate through all tabs to cache content
3. Disconnect from internet (Airplane mode or disable WiFi)
4. Try using the app features

**Expected Results:**
- App loads and functions normally
- Navigation works smoothly
- Basic UI elements are accessible

### 2. Plant Identification Offline
**Steps:**
1. Go online and use plant identification once
2. Go offline
3. Try plant identification again
4. Check recent results section

**Expected Results:**
- Recent identifications are visible
- Offline mode indicator appears
- Cached results display correctly

### 3. Weather Information Offline
**Steps:**
1. Check weather while online
2. Note the timestamp
3. Go offline
4. Refresh weather data

**Expected Results:**
- Cached weather data displays
- "Cached Data" badge appears
- Data shows last online timestamp

### 4. Disease Detection Offline
**Steps:**
1. Perform disease detection while online
2. Go offline
3. Try disease detection again
4. Verify offline fallback behavior

**Expected Results:**
- Offline mode activates
- Local disease detection works
- Results are cached for later sync

## Service Worker Testing

### 1. Service Worker Registration
**Steps:**
1. Open Developer Tools (F12)
2. Go to Application > Service Workers
3. Check if service worker is registered and running

**Expected Results:**
- Service worker is registered
- Status shows "activated" or "running"
- No errors in console

### 2. Cache Inspection
**Steps:**
1. In Developer Tools, go to Application > Cache Storage
2. Inspect the different cache stores
3. Verify cached assets and API responses

**Expected Results:**
- Multiple cache stores exist
- Static assets are cached
- API responses are cached

### 3. Network Throttling Test
**Steps:**
1. Open Developer Tools
2. Go to Network tab
3. Throttle connection to "Offline"
4. Navigate through the app

**Expected Results:**
- App loads from cache
- Service worker handles requests
- No network errors in console

## Cache Management Testing

### 1. Cache Strategy Verification
**Steps:**
1. Use the PWA Tester component
2. Click "Check Status" to view cache details
3. Verify different cache stores

**Expected Results:**
- Static cache: JS, CSS, icons
- API cache: Weather, tips, fertilizer data
- Image cache: Uploaded images
- Cache sizes are reasonable

### 2. Cache Clearing Test
**Steps:**
1. In PWA Tester, click "Clear Cache"
2. Verify cache is cleared
3. Refresh the app

**Expected Results:**
- Cache size drops to 0
- App reloads and recaches assets
- Functionality remains intact

### 3. Cache Expiration Test
**Steps:**
1. Cache weather data
2. Wait for expiration (1 hour)
3. Try to access cached data

**Expected Results:**
- Expired data is cleared
- Fresh data is fetched when online
- Graceful fallback when offline

## IndexedDB Testing

### 1. Database Initialization
**Steps:**
1. Open Developer Tools
2. Go to Application > IndexedDB
3. Verify KrishiDrishtiDB exists
4. Check object stores

**Expected Results:**
- Database is created successfully
- All object stores are present:
  - plantIdentifications
  - diseaseDetections
  - fertilizerCalculations
  - weatherData
  - cultivationTips
  - appSettings
  - offlineQueue

### 2. Data Persistence Test
**Steps:**
1. Perform various app operations
2. Check IndexedDB for stored data
3. Close and reopen the app
4. Verify data persists

**Expected Results:**
- Data is stored correctly
- Data survives app restart
- No data corruption occurs

### 3. Offline Queue Test
**Steps:**
1. Go offline
2. Perform operations that require sync
3. Check offline queue in IndexedDB
4. Go online and verify sync

**Expected Results:**
- Operations are queued when offline
- Queue items are processed when online
- Sync status updates correctly

## Background Sync Testing

### 1. Automatic Sync Test
**Steps:**
1. Go offline
2. Perform several operations
3. Go back online
4. Monitor console for sync messages

**Expected Results:**
- Sync triggers automatically
- Queued operations are processed
- Success/error messages appear

### 2. Manual Sync Test
**Steps:**
1. Use PWA Tester component
2. Click "Sync Offline Data"
3. Verify sync completion

**Expected Results:**
- Manual sync initiates
- Data synchronizes successfully
- UI updates to reflect sync status

### 3. Sync Failure Handling
**Steps:**
1. Go offline
2. Queue operations
3. Go online with poor connection
4. Monitor retry behavior

**Expected Results:**
- Failed syncs are retried
- Retry count is tracked
- Operations are removed after max retries

## Cross-Browser Testing

### 1. Chrome/Edge Testing
**Features to test:**
- Installation
- Service worker registration
- Offline functionality
- Background sync
- Push notifications

### 2. Firefox Testing
**Features to test:**
- Installation
- Service worker registration
- Offline functionality
- Cache management

### 3. Safari Testing
**Features to test:**
- Add to Home Screen
- Offline functionality
- Service worker support (limited)
- Cache behavior

### 4. Mobile Testing
**Devices to test:**
- Android (Chrome)
- iOS (Safari)
- Responsive design
- Touch interactions

## Performance Testing

### 1. Load Time Testing
**Metrics to measure:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

### 2. Offline Performance
**Tests to run:**
- App startup time offline
- Feature response time offline
- Cache retrieval speed
- Database query performance

### 3. Memory Usage
**Monitor:**
- Memory footprint
- Cache size growth
- Database size limits
- Garbage collection efficiency

## Troubleshooting

### Common Issues and Solutions

#### 1. Service Worker Not Registering
**Symptoms:**
- App doesn't work offline
- No service worker in DevTools
- Console registration errors

**Solutions:**
- Check service worker scope
- Verify HTTPS (required for service workers)
- Clear browser cache and retry
- Check for syntax errors in service worker

#### 2. Cache Not Working
**Symptoms:**
- App fails offline
- Assets not cached
- Cache errors in console

**Solutions:**
- Verify cache strategies
- Check cache size limits
- Clear and rebuild cache
- Test cache API support

#### 3. IndexedDB Issues
**Symptoms:**
- Data not persisting
- Database errors
- Performance issues

**Solutions:**
- Check database version
- Verify object store structure
- Handle database upgrades
- Monitor storage quotas

#### 4. Installation Problems
**Symptoms:**
- Install prompt not showing
- Installation fails
- App doesn't launch standalone

**Solutions:**
- Verify manifest.json
- Check PWA criteria
- Test on different browsers
- Clear site data

### Debug Tools

#### Chrome DevTools
- **Application Tab**: Service workers, caches, IndexedDB
- **Network Tab**: Request handling, throttling
- **Console Tab**: Error messages, debug info
- **Audits Tab**: PWA compliance testing

#### Firefox DevTools
- **Storage Tab**: IndexedDB, cache
- **Service Workers**: Registration and status
- **Network Monitor**: Request analysis

#### Safari Web Inspector
- **Storage Tab**: IndexedDB, localStorage
- **Network Tab**: Request analysis
- **Console Tab**: Error messages

## Testing Checklist

### Pre-Launch Checklist
- [ ] Service worker registers successfully
- [ ] App is installable on all target platforms
- [ ] All features work offline
- [ ] Data syncs correctly when online
- [ ] Cache management works properly
- [ ] IndexedDB operations are reliable
- [ ] Performance meets standards
- [ ] No console errors in normal operation
- [ ] PWA passes Lighthouse audit
- [ ] Cross-browser compatibility verified

### Regression Testing
- [ ] Offline functionality after updates
- [ ] Service worker updates correctly
- [ ] Cache invalidation works
- [ ] Database migrations work
- [ ] Installation still works
- [ ] Performance maintained

## Conclusion

This comprehensive testing guide ensures that Krishi Drishti delivers a robust PWA experience with reliable offline functionality. Regular testing using these procedures will help maintain high quality and user satisfaction.

For additional support or to report issues, please refer to the project documentation or contact the development team.