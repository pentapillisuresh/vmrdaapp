const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');
const fs = require('node:fs');
const { FileStore } = require('metro-cache');
const { reportErrorToRemote } = require('./__create/report-error-to-remote');
const {
  handleResolveRequestError,
  VIRTUAL_ROOT,
  VIRTUAL_ROOT_UNRESOLVED,
} = require('./__create/handle-resolve-request-error');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// ---------- ALIASES ----------
const WEB_ALIASES = {
  'expo-secure-store': path.resolve(__dirname, './polyfills/web/secureStore.web.ts'),
  'react-native-webview': path.resolve(__dirname, './polyfills/web/webview.web.tsx'),
  'react-native-safe-area-context': path.resolve(__dirname, './polyfills/web/safeAreaContext.web.jsx'),
  'react-native-maps': path.resolve(__dirname, './polyfills/web/maps.web.jsx'),
  'react-native-web/dist/exports/SafeAreaView': path.resolve(__dirname, './polyfills/web/SafeAreaView.web.jsx'),
  'react-native-web/dist/exports/Alert': path.resolve(__dirname, './polyfills/web/alerts.web.tsx'),
  'react-native-web/dist/exports/RefreshControl': path.resolve(__dirname, './polyfills/web/refreshControl.web.tsx'),
  'expo-status-bar': path.resolve(__dirname, './polyfills/web/statusBar.web.tsx'),
  'expo-location': path.resolve(__dirname, './polyfills/web/location.web.ts'),
  './layouts/Tabs': path.resolve(__dirname, './polyfills/web/tabbar.web.jsx'),
  'expo-notifications': path.resolve(__dirname, './polyfills/web/notifications.web.tsx'),
  'expo-contacts': path.resolve(__dirname, './polyfills/web/contacts.web.ts'),
  'react-native-web/dist/exports/ScrollView': path.resolve(__dirname, './polyfills/web/scrollview.web.jsx'),
};

const NATIVE_ALIASES = {
  './Libraries/Components/TextInput/TextInput': path.resolve(__dirname, './polyfills/native/texinput.native.jsx'),
};

const SHARED_ALIASES = {
  'expo-image': path.resolve(__dirname, './polyfills/shared/expo-image.tsx'),
};

// ---------- WATCH FOLDERS ----------
fs.mkdirSync(VIRTUAL_ROOT_UNRESOLVED, { recursive: true });
config.watchFolders = [...config.watchFolders, VIRTUAL_ROOT, VIRTUAL_ROOT_UNRESOLVED];

// ---------- RESOLVE REQUEST ----------
config.resolver.resolveRequest = (context, moduleName, platform) => {
  try {
    const origin = context.originModulePath;

    // Skip polyfills themselves
    if (
      origin.startsWith(`${__dirname}/polyfills/native`) ||
      origin.startsWith(`${__dirname}/polyfills/web`) ||
      origin.startsWith(`${__dirname}/polyfills/shared`)
    ) {
      return context.resolveRequest(context, moduleName, platform);
    }

    // Expo Google Fonts wildcard
    if (moduleName.startsWith('@expo-google-fonts/') && moduleName !== '@expo-google-fonts/dev') {
      return context.resolveRequest(context, '@expo-google-fonts/dev', platform);
    }

    // Shared aliases
    if (SHARED_ALIASES[moduleName] && !moduleName.startsWith('./polyfills/')) {
      return context.resolveRequest(context, SHARED_ALIASES[moduleName], platform);
    }

    // Web aliases
    if (platform === 'web' && WEB_ALIASES[moduleName] && !moduleName.startsWith('./polyfills/')) {
      return context.resolveRequest(context, WEB_ALIASES[moduleName], platform);
    }

    // Native aliases
    if (NATIVE_ALIASES[moduleName] && !moduleName.startsWith('./polyfills/')) {
      return context.resolveRequest(context, NATIVE_ALIASES[moduleName], platform);
    }

    return context.resolveRequest(context, moduleName, platform);
  } catch (error) {
    return handleResolveRequestError({ error, context, platform, moduleName });
  }
};

// ---------- CACHE CONFIG ----------
const cacheDir = path.join(__dirname, 'caches');
fs.mkdirSync(cacheDir, { recursive: true }); // ✅ ensure cache folder exists

config.cacheStores = () => [
  new FileStore({
    root: path.join(cacheDir, '.metro-cache'),
  }),
];
config.fileMapCacheDirectory = cacheDir;

// ---------- REPORTER ----------
config.reporter = {
  ...config.reporter,
  update: (event) => {
    config.reporter?.update(event);
    const reportableErrors = [
      'error',
      'bundling_error',
      'cache_read_error',
      'hmr_client_error',
      'transformer_load_failed',
    ];
    if (reportableErrors.includes(event.type)) {
      reportErrorToRemote({ error: event.error }).catch(() => {});
    }
    return event;
  },
};

// ---------- TRANSFORMER ----------
const originalGetTransformOptions = config.transformer.getTransformOptions;
config.transformer = {
  ...config.transformer,
  getTransformOptions: async (entryPoints, options) => {
    // Avoid deleting the cache here; Metro must manage it safely
    return await originalGetTransformOptions(entryPoints, options);
  },
};

module.exports = config;
