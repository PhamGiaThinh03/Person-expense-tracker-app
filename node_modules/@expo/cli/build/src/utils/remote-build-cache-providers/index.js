"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    resolvePluginFunction: function() {
        return resolvePluginFunction;
    },
    resolveRemoteBuildCache: function() {
        return resolveRemoteBuildCache;
    },
    resolveRemoteBuildCacheProvider: function() {
        return resolveRemoteBuildCacheProvider;
    },
    uploadRemoteBuildCache: function() {
        return uploadRemoteBuildCache;
    }
});
function _resolvefrom() {
    const data = /*#__PURE__*/ _interop_require_default(require("resolve-from"));
    _resolvefrom = function() {
        return data;
    };
    return data;
}
const _eas = require("./eas");
const _helpers = require("./helpers");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('expo:run:remote-build');
const resolveRemoteBuildCacheProvider = (provider, projectRoot)=>{
    if (!provider) {
        return;
    }
    if (provider === 'eas') {
        return {
            plugin: _eas.EASRemoteBuildCacheProvider,
            options: {}
        };
    }
    if (typeof provider === 'object' && typeof provider.plugin === 'string') {
        const plugin = resolvePluginFunction(projectRoot, provider.plugin);
        return {
            plugin,
            options: provider.options
        };
    }
    throw new Error('Invalid remote build cache provider');
};
async function resolveRemoteBuildCache({ projectRoot, platform, provider, runOptions }) {
    const fingerprintHash = await calculateFingerprintHashAsync({
        projectRoot,
        platform,
        provider,
        runOptions
    });
    if (!fingerprintHash) {
        return null;
    }
    return await provider.plugin.resolveRemoteBuildCache({
        fingerprintHash,
        platform,
        runOptions,
        projectRoot
    }, provider.options);
}
async function uploadRemoteBuildCache({ projectRoot, platform, provider, buildPath, runOptions }) {
    const fingerprintHash = await calculateFingerprintHashAsync({
        projectRoot,
        platform,
        provider,
        runOptions
    });
    if (!fingerprintHash) {
        debug('No fingerprint hash found, skipping upload');
        return;
    }
    await provider.plugin.uploadRemoteBuildCache({
        projectRoot,
        platform,
        fingerprintHash,
        buildPath,
        runOptions
    }, provider.options);
}
async function calculateFingerprintHashAsync({ projectRoot, platform, provider, runOptions }) {
    if (provider.plugin.calculateFingerprintHash) {
        return await provider.plugin.calculateFingerprintHash({
            projectRoot,
            platform,
            runOptions
        }, provider.options);
    }
    const Fingerprint = importFingerprintForDev(projectRoot);
    if (!Fingerprint) {
        debug('@expo/fingerprint is not installed in the project, unable to calculate fingerprint');
        return null;
    }
    const fingerprint = await Fingerprint.createFingerprintAsync(projectRoot);
    return fingerprint.hash;
}
function importFingerprintForDev(projectRoot) {
    try {
        return require(require.resolve('@expo/fingerprint', {
            paths: [
                projectRoot
            ]
        }));
    } catch  {
        return null;
    }
}
/**
 * Resolve the provider plugin from a node module or package.
 * If the module or package does not include a provider plugin, this function throws.
 * The resolution is done in following order:
 *   1. Is the reference a relative file path or an import specifier with file path? e.g. `./file.js`, `pkg/file.js` or `@org/pkg/file.js`?
 *     - Resolve the provider plugin as-is
 *   2. Does the module have a valid provider plugin in the `main` field?
 *     - Resolve the `main` entry point as provider plugin
 */ function resolvePluginFilePathForModule(projectRoot, pluginReference) {
    if ((0, _helpers.moduleNameIsDirectFileReference)(pluginReference)) {
        // Only resolve `./file.js`, `package/file.js`, `@org/package/file.js`
        const pluginScriptFile = _resolvefrom().default.silent(projectRoot, pluginReference);
        if (pluginScriptFile) {
            return pluginScriptFile;
        }
    } else if ((0, _helpers.moduleNameIsPackageReference)(pluginReference)) {
        // Try to resole the `main` entry as config plugin
        const packageMainEntry = _resolvefrom().default.silent(projectRoot, pluginReference);
        if (packageMainEntry) {
            return packageMainEntry;
        }
    }
    throw new Error(`Failed to resolve provider plugin for module "${pluginReference}" relative to "${projectRoot}". Do you have node modules installed?`);
}
function resolvePluginFunction(projectRoot, pluginReference) {
    const pluginFile = resolvePluginFilePathForModule(projectRoot, pluginReference);
    try {
        let plugin = require(pluginFile);
        if ((plugin == null ? void 0 : plugin.default) != null) {
            plugin = plugin.default;
        }
        if (typeof plugin !== 'object' || typeof plugin.resolveRemoteBuildCache !== 'function' || typeof plugin.uploadRemoteBuildCache !== 'function') {
            throw new Error(`
        The provider plugin "${pluginReference}" must export an object containing
        the resolveRemoteBuildCache and uploadRemoteBuildCache functions.
      `);
        }
        return plugin;
    } catch (error) {
        if (error instanceof SyntaxError) {
        // Add error linking to the docs of how create a valid provider plugin
        }
        throw error;
    }
}

//# sourceMappingURL=index.js.map