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
    EASRemoteBuildCacheProvider: function() {
        return EASRemoteBuildCacheProvider;
    },
    calculateEASFingerprintHashAsync: function() {
        return calculateEASFingerprintHashAsync;
    },
    resolveEASRemoteBuildCache: function() {
        return resolveEASRemoteBuildCache;
    },
    uploadEASRemoteBuildCache: function() {
        return uploadEASRemoteBuildCache;
    }
});
function _spawnasync() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/spawn-async"));
    _spawnasync = function() {
        return data;
    };
    return data;
}
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _helpers = require("./helpers");
const _log = require("../../log");
const _xcrun = require("../../start/platforms/ios/xcrun");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('expo:eas-remote-build-cache');
async function resolveEASRemoteBuildCache({ projectRoot, platform, fingerprintHash, runOptions }) {
    const easJsonPath = _path().default.join(projectRoot, 'eas.json');
    if (!_fs().default.existsSync(easJsonPath)) {
        debug('eas.json not found, skip checking for remote builds');
        return null;
    }
    _log.Log.log((0, _chalk().default)`{whiteBright \u203A} {bold Searching builds with matching fingerprint on EAS servers}`);
    try {
        const results = await (0, _spawnasync().default)('npx', [
            'eas-cli',
            'build:download',
            `--platform=${platform}`,
            `--fingerprint=${fingerprintHash}`,
            '--non-interactive',
            (0, _helpers.isDevClientBuild)({
                runOptions,
                projectRoot
            }) ? '--dev-client' : '--no-dev-client',
            '--json'
        ], {
            cwd: projectRoot
        });
        _log.Log.log((0, _chalk().default)`{whiteBright \u203A} {bold Successfully downloaded cached build}`);
        // {
        //   "path": "/var/folders/03/lppcpcnn61q3mz5ckzmzd8w80000gn/T/eas-cli-nodejs/eas-build-run-cache/c0f9ba9c-0cf1-4c5c-8566-b28b7971050f_22f1bbfa-1c09-4b67-9e4a-721906546b58.app"
        // }
        const json = JSON.parse(results.stdout.trim());
        return json == null ? void 0 : json.path;
    } catch (error) {
        debug('eas-cli error:', error);
        // @TODO(2025-04-11): remove this in a future release
        if ((0, _xcrun.isSpawnResultError)(error) && error.stderr.includes('command build:download not found')) {
            _log.Log.warn(`To take advantage of remote build cache, upgrade your eas-cli installation to latest.`);
        }
        return null;
    }
}
async function uploadEASRemoteBuildCache({ projectRoot, platform, fingerprintHash, buildPath }) {
    const easJsonPath = _path().default.join(projectRoot, 'eas.json');
    if (!_fs().default.existsSync(easJsonPath)) {
        debug('eas.json not found, skip uploading builds');
        return null;
    }
    try {
        _log.Log.log((0, _chalk().default)`{whiteBright \u203A} {bold Uploading build to remote cache}`);
        const results = await (0, _spawnasync().default)('npx', [
            'eas-cli',
            'upload',
            `--platform=${platform}`,
            `--fingerprint=${fingerprintHash}`,
            buildPath ? `--build-path=${buildPath}` : '',
            '--non-interactive',
            '--json'
        ], {
            cwd: projectRoot
        });
        // {
        //   "url": "/var/folders/03/lppcpcnn61q3mz5ckzmzd8w80000gn/T/eas-cli-nodejs/eas-build-run-cache/c0f9ba9c-0cf1-4c5c-8566-b28b7971050f_22f1bbfa-1c09-4b67-9e4a-721906546b58.app"
        // }
        const json = JSON.parse(results.stdout.trim());
        _log.Log.log((0, _chalk().default)`{whiteBright \u203A} {bold Build successfully uploaded: ${json == null ? void 0 : json.url}}`);
        return json == null ? void 0 : json.url;
    } catch (error) {
        debug('eas-cli error:', error);
    }
    return null;
}
async function calculateEASFingerprintHashAsync({ projectRoot, platform }) {
    // prefer using `eas fingerprint:generate` because it automatically upload sources
    try {
        const results = await (0, _spawnasync().default)('npx', [
            'eas-cli',
            'fingerprint:generate',
            `--platform=${platform}`,
            '--json',
            '--non-interactive'
        ], {
            cwd: projectRoot
        });
        // {
        //   "hash": "203f960b965e154b77dc31c6c42e5582e8d77196"
        // }
        const json = JSON.parse(results.stdout.trim());
        return json == null ? void 0 : json.hash;
    } catch (error) {
        debug('eas-cli error:', error);
    }
    return null;
}
const EASRemoteBuildCacheProvider = {
    resolveRemoteBuildCache: resolveEASRemoteBuildCache,
    uploadRemoteBuildCache: uploadEASRemoteBuildCache,
    calculateFingerprintHash: calculateEASFingerprintHashAsync
};

//# sourceMappingURL=eas.js.map