const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 1. Autoriser Metro à intégrer les fichiers WebAssembly
config.resolver.assetExts.push('wasm');

// 2. Ajouter les en-têtes de sécurité stricts requis par le navigateur
// pour autoriser SQLite à utiliser la mémoire partagée (SharedArrayBuffer)
config.server = {
   ...config.server,
   enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
         res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
         res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
         return middleware(req, res, next);
      };
   },
};

module.exports = config;