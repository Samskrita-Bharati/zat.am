"use strict";
/*
 * Copyright 2020 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.XdsClient = void 0;
const protoLoader = require("@grpc/proto-loader");
const make_client_1 = require("./make-client");
const channel_credentials_1 = require("./channel-credentials");
const xds_bootstrap_1 = require("./xds-bootstrap");
const net_1 = require("net");
const constants_1 = require("./constants");
const metadata_1 = require("./metadata");
const logging = require("./logging");
const TRACER_NAME = 'xds_client';
function trace(text) {
    logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, text);
}
const clientVersion = require('../../package.json').version;
const EDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment';
const CDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.Cluster';
const LDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.Listener';
const RDS_TYPE_URL = 'type.googleapis.com/envoy.api.v2.RouteConfiguration';
const HTTP_CONNECTION_MANGER_TYPE_URL = 'type.googleapis.com/envoy.config.filter.network.http_connection_manager.v2.HttpConnectionManager';
let loadedProtos = null;
function loadAdsProtos() {
    if (loadedProtos !== null) {
        return loadedProtos;
    }
    loadedProtos = protoLoader
        .load([
        'envoy/service/discovery/v2/ads.proto',
        'envoy/service/load_stats/v2/lrs.proto',
        'envoy/api/v2/listener.proto',
        'envoy/api/v2/route.proto',
        'envoy/api/v2/cluster.proto',
        'envoy/api/v2/endpoint.proto',
        'envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto',
    ], {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [
            // Paths are relative to src/build
            __dirname + '/../../deps/envoy-api/',
            __dirname + '/../../deps/udpa/',
            __dirname + '/../../deps/googleapis/',
            __dirname + '/../../deps/protoc-gen-validate/',
        ],
    })
        .then((packageDefinition) => make_client_1.loadPackageDefinition(packageDefinition));
    return loadedProtos;
}
function localityEqual(loc1, loc2) {
    return (loc1.region === loc2.region &&
        loc1.zone === loc2.zone &&
        loc1.sub_zone === loc2.sub_zone);
}
class ClusterLoadReportMap {
    constructor() {
        this.statsMap = [];
    }
    get(clusterName, edsServiceName) {
        for (const statsObj of this.statsMap) {
            if (statsObj.clusterName === clusterName &&
                statsObj.edsServiceName === edsServiceName) {
                return statsObj.stats;
            }
        }
        return undefined;
    }
    getOrCreate(clusterName, edsServiceName) {
        for (const statsObj of this.statsMap) {
            if (statsObj.clusterName === clusterName &&
                statsObj.edsServiceName === edsServiceName) {
                return statsObj.stats;
            }
        }
        const newStats = {
            callsDropped: new Map(),
            localityStats: [],
            intervalStart: process.hrtime(),
        };
        this.statsMap.push({
            clusterName,
            edsServiceName,
            stats: newStats,
        });
        return newStats;
    }
    *entries() {
        for (const statsEntry of this.statsMap) {
            yield [
                {
                    clusterName: statsEntry.clusterName,
                    edsServiceName: statsEntry.edsServiceName,
                },
                statsEntry.stats,
            ];
        }
    }
}
class EdsState {
    constructor(updateResourceNames) {
        this.updateResourceNames = updateResourceNames;
        this.versionInfo = '';
        this.nonce = '';
        this.watchers = new Map();
        this.latestResponses = [];
    }
    /**
     * Add the watcher to the watcher list. Returns true if the list of resource
     * names has changed, and false otherwise.
     * @param edsServiceName
     * @param watcher
     */
    addWatcher(edsServiceName, watcher) {
        let watchersEntry = this.watchers.get(edsServiceName);
        let addedServiceName = false;
        if (watchersEntry === undefined) {
            addedServiceName = true;
            watchersEntry = [];
            this.watchers.set(edsServiceName, watchersEntry);
        }
        watchersEntry.push(watcher);
        /* If we have already received an update for the requested edsServiceName,
         * immediately pass that update along to the watcher */
        for (const message of this.latestResponses) {
            if (message.cluster_name === edsServiceName) {
                /* These updates normally occur asynchronously, so we ensure that
                 * the same happens here */
                process.nextTick(() => {
                    watcher.onValidUpdate(message);
                });
            }
        }
        if (addedServiceName) {
            this.updateResourceNames();
        }
    }
    removeWatcher(edsServiceName, watcher) {
        const watchersEntry = this.watchers.get(edsServiceName);
        let removedServiceName = false;
        if (watchersEntry !== undefined) {
            const entryIndex = watchersEntry.indexOf(watcher);
            if (entryIndex >= 0) {
                watchersEntry.splice(entryIndex, 1);
            }
            if (watchersEntry.length === 0) {
                removedServiceName = true;
                this.watchers.delete(edsServiceName);
            }
        }
        if (removedServiceName) {
            this.updateResourceNames();
        }
    }
    getResourceNames() {
        return Array.from(this.watchers.keys());
    }
    /**
     * Validate the ClusterLoadAssignment object by these rules:
     * https://github.com/grpc/proposal/blob/master/A27-xds-global-load-balancing.md#clusterloadassignment-proto
     * @param message
     */
    validateResponse(message) {
        var _a, _b;
        for (const endpoint of message.endpoints) {
            for (const lb of endpoint.lb_endpoints) {
                const socketAddress = (_b = (_a = lb.endpoint) === null || _a === void 0 ? void 0 : _a.address) === null || _b === void 0 ? void 0 : _b.socket_address;
                if (!socketAddress) {
                    return false;
                }
                if (socketAddress.port_specifier !== 'port_value') {
                    return false;
                }
                if (!(net_1.isIPv4(socketAddress.address) || net_1.isIPv6(socketAddress.address))) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Given a list of edsServiceNames (which may actually be the cluster name),
     * for each watcher watching a name not on the list, call that watcher's
     * onResourceDoesNotExist method.
     * @param allClusterNames
     */
    handleMissingNames(allEdsServiceNames) {
        for (const [edsServiceName, watcherList] of this.watchers.entries()) {
            if (!allEdsServiceNames.has(edsServiceName)) {
                for (const watcher of watcherList) {
                    watcher.onResourceDoesNotExist();
                }
            }
        }
    }
    handleResponses(responses) {
        var _a;
        for (const message of responses) {
            if (!this.validateResponse(message)) {
                return 'ClusterLoadAssignment validation failed';
            }
        }
        this.latestResponses = responses;
        const allClusterNames = new Set();
        for (const message of responses) {
            allClusterNames.add(message.cluster_name);
            const watchers = (_a = this.watchers.get(message.cluster_name)) !== null && _a !== void 0 ? _a : [];
            for (const watcher of watchers) {
                watcher.onValidUpdate(message);
            }
        }
        this.handleMissingNames(allClusterNames);
        return null;
    }
    reportStreamError(status) {
        for (const watcherList of this.watchers.values()) {
            for (const watcher of watcherList) {
                watcher.onTransientError(status);
            }
        }
    }
}
class CdsState {
    constructor(edsState, updateResourceNames) {
        this.edsState = edsState;
        this.updateResourceNames = updateResourceNames;
        this.versionInfo = '';
        this.nonce = '';
        this.watchers = new Map();
        this.latestResponses = [];
    }
    /**
     * Add the watcher to the watcher list. Returns true if the list of resource
     * names has changed, and false otherwise.
     * @param clusterName
     * @param watcher
     */
    addWatcher(clusterName, watcher) {
        let watchersEntry = this.watchers.get(clusterName);
        let addedServiceName = false;
        if (watchersEntry === undefined) {
            addedServiceName = true;
            watchersEntry = [];
            this.watchers.set(clusterName, watchersEntry);
        }
        watchersEntry.push(watcher);
        /* If we have already received an update for the requested edsServiceName,
         * immediately pass that update along to the watcher */
        for (const message of this.latestResponses) {
            if (message.name === clusterName) {
                /* These updates normally occur asynchronously, so we ensure that
                 * the same happens here */
                process.nextTick(() => {
                    watcher.onValidUpdate(message);
                });
            }
        }
        if (addedServiceName) {
            this.updateResourceNames();
        }
    }
    removeWatcher(clusterName, watcher) {
        const watchersEntry = this.watchers.get(clusterName);
        let removedServiceName = false;
        if (watchersEntry !== undefined) {
            const entryIndex = watchersEntry.indexOf(watcher);
            if (entryIndex >= 0) {
                watchersEntry.splice(entryIndex, 1);
            }
            if (watchersEntry.length === 0) {
                removedServiceName = true;
                this.watchers.delete(clusterName);
            }
        }
        if (removedServiceName) {
            this.updateResourceNames();
        }
    }
    getResourceNames() {
        return Array.from(this.watchers.keys());
    }
    validateResponse(message) {
        var _a, _b;
        if (message.type !== 'EDS') {
            return false;
        }
        if (!((_b = (_a = message.eds_cluster_config) === null || _a === void 0 ? void 0 : _a.eds_config) === null || _b === void 0 ? void 0 : _b.ads)) {
            return false;
        }
        if (message.lb_policy !== 'ROUND_ROBIN') {
            return false;
        }
        if (message.lrs_server) {
            if (!message.lrs_server.self) {
                return false;
            }
        }
        return true;
    }
    /**
     * Given a list of edsServiceNames (which may actually be the cluster name),
     * for each watcher watching a name not on the list, call that watcher's
     * onResourceDoesNotExist method.
     * @param allClusterNames
     */
    handleMissingNames(allClusterNames) {
        for (const [edsServiceName, watcherList] of this.watchers.entries()) {
            if (!allClusterNames.has(edsServiceName)) {
                for (const watcher of watcherList) {
                    watcher.onResourceDoesNotExist();
                }
            }
        }
    }
    handleResponses(responses) {
        var _a, _b, _c;
        for (const message of responses) {
            if (!this.validateResponse(message)) {
                return 'Cluster validation failed';
            }
        }
        this.latestResponses = responses;
        const allEdsServiceNames = new Set();
        const allClusterNames = new Set();
        for (const message of responses) {
            allClusterNames.add(message.name);
            const edsServiceName = (_b = (_a = message.eds_cluster_config) === null || _a === void 0 ? void 0 : _a.service_name) !== null && _b !== void 0 ? _b : '';
            allEdsServiceNames.add(edsServiceName === '' ? message.name : edsServiceName);
            const watchers = (_c = this.watchers.get(message.name)) !== null && _c !== void 0 ? _c : [];
            for (const watcher of watchers) {
                watcher.onValidUpdate(message);
            }
        }
        this.handleMissingNames(allClusterNames);
        this.edsState.handleMissingNames(allEdsServiceNames);
        return null;
    }
    reportStreamError(status) {
        for (const watcherList of this.watchers.values()) {
            for (const watcher of watcherList) {
                watcher.onTransientError(status);
            }
        }
    }
}
class RdsState {
    constructor(watcher, updateResouceNames) {
        this.watcher = watcher;
        this.updateResouceNames = updateResouceNames;
        this.versionInfo = '';
        this.nonce = '';
        this.routeConfigName = null;
    }
    getResourceNames() {
        return this.routeConfigName ? [this.routeConfigName] : [];
    }
    handleSingleMessage(message) {
        var _a, _b;
        for (const virtualHost of message.virtual_hosts) {
            if (virtualHost.domains.indexOf(this.routeConfigName) >= 0) {
                const route = virtualHost.routes[virtualHost.routes.length - 1];
                if (((_a = route.match) === null || _a === void 0 ? void 0 : _a.prefix) === '' && ((_b = route.route) === null || _b === void 0 ? void 0 : _b.cluster)) {
                    this.watcher.onValidUpdate({
                        methodConfig: [],
                        loadBalancingConfig: [
                            {
                                name: 'cds',
                                cds: {
                                    cluster: route.route.cluster,
                                },
                            },
                        ],
                    });
                    break;
                }
            }
        }
        /* If none of the routes match the one we are looking for, bubble up an
         * error. */
        this.watcher.onResourceDoesNotExist();
    }
    handleResponses(responses) {
        if (this.routeConfigName !== null) {
            for (const message of responses) {
                if (message.name === this.routeConfigName) {
                    this.handleSingleMessage(message);
                    return null;
                }
            }
        }
        return null;
    }
    setRouteConfigName(name) {
        const oldName = this.routeConfigName;
        this.routeConfigName = name;
        if (name !== oldName) {
            this.updateResouceNames();
        }
    }
    reportStreamError(status) {
        this.watcher.onTransientError(status);
    }
}
class LdsState {
    constructor(targetName, rdsState) {
        this.targetName = targetName;
        this.rdsState = rdsState;
        this.versionInfo = '';
        this.nonce = '';
    }
    getResourceNames() {
        return [this.targetName];
    }
    validateResponse(message) {
        var _a, _b, _c, _d, _e;
        if (!(((_a = message.api_listener) === null || _a === void 0 ? void 0 : _a.api_listener) &&
            protoLoader.isAnyExtension(message.api_listener.api_listener) &&
            ((_b = message.api_listener) === null || _b === void 0 ? void 0 : _b.api_listener['@type']) ===
                HTTP_CONNECTION_MANGER_TYPE_URL)) {
            return false;
        }
        const httpConnectionManager = (_c = message.api_listener) === null || _c === void 0 ? void 0 : _c.api_listener;
        switch (httpConnectionManager.route_specifier) {
            case 'rds':
                return !!((_e = (_d = httpConnectionManager.rds) === null || _d === void 0 ? void 0 : _d.config_source) === null || _e === void 0 ? void 0 : _e.ads);
            case 'route_config':
                return true;
        }
        return false;
    }
    handleResponses(responses) {
        for (const message of responses) {
            if (message.name === this.targetName) {
                if (this.validateResponse(message)) {
                    // The validation step ensures that this is correct
                    const httpConnectionManager = message.api_listener
                        .api_listener;
                    switch (httpConnectionManager.route_specifier) {
                        case 'rds':
                            this.rdsState.setRouteConfigName(httpConnectionManager.rds.route_config_name);
                            break;
                        case 'route_config':
                            this.rdsState.setRouteConfigName(null);
                            this.rdsState.handleSingleMessage(httpConnectionManager.route_config);
                            break;
                        default:
                        // The validation rules should prevent this
                    }
                }
                else {
                    return 'Listener validation failed';
                }
            }
        }
        throw new Error('Method not implemented.');
    }
    reportStreamError(status) {
        // Nothing to do here
    }
}
function getResponseMessages(typeUrl, resources) {
    const result = [];
    for (const resource of resources) {
        if (protoLoader.isAnyExtension(resource) && resource['@type'] === typeUrl) {
            result.push(resource);
        }
        else {
            throw new Error(`Invalid resource type ${protoLoader.isAnyExtension(resource)
                ? resource['@type']
                : resource.type_url}`);
        }
    }
    return result;
}
class XdsClient {
    constructor(targetName, serviceConfigWatcher, channelOptions) {
        this.adsNode = null;
        this.adsClient = null;
        this.adsCall = null;
        this.lrsNode = null;
        this.lrsClient = null;
        this.lrsCall = null;
        this.latestLrsSettings = null;
        this.clusterStatsMap = new ClusterLoadReportMap();
        this.hasShutdown = false;
        const edsState = new EdsState(() => {
            this.updateNames(EDS_TYPE_URL);
        });
        const cdsState = new CdsState(edsState, () => {
            this.updateNames(CDS_TYPE_URL);
        });
        const rdsState = new RdsState(serviceConfigWatcher, () => {
            this.updateNames(RDS_TYPE_URL);
        });
        const ldsState = new LdsState(targetName, rdsState);
        this.adsState = {
            [EDS_TYPE_URL]: edsState,
            [CDS_TYPE_URL]: cdsState,
            [RDS_TYPE_URL]: rdsState,
            [LDS_TYPE_URL]: ldsState,
        };
        const channelArgs = Object.assign({}, channelOptions);
        const channelArgsToRemove = [
            /* The SSL target name override corresponds to the target, and this
             * client has its own target */
            'grpc.ssl_target_name_override',
            /* The default authority also corresponds to the target */
            'grpc.default_authority',
            /* This client will have its own specific keepalive time setting */
            'grpc.keepalive_time_ms',
            /* The service config specifies the load balancing policy. This channel
             * needs its own separate load balancing policy setting. In particular,
             * recursively using an xDS load balancer for the xDS client would be
             * bad */
            'grpc.service_config',
        ];
        for (const arg of channelArgsToRemove) {
            delete channelArgs[arg];
        }
        channelArgs['grpc.keepalive_time_ms'] = 5000;
        Promise.all([xds_bootstrap_1.loadBootstrapInfo(), loadAdsProtos()]).then(([bootstrapInfo, protoDefinitions]) => {
            if (this.hasShutdown) {
                return;
            }
            const node = Object.assign(Object.assign({}, bootstrapInfo.node), { build_version: `gRPC Node Pure JS ${clientVersion}`, user_agent_name: 'gRPC Node Pure JS' });
            this.adsNode = Object.assign(Object.assign({}, node), { client_features: ['envoy.lb.does_not_support_overprovisioning'] });
            this.lrsNode = Object.assign(Object.assign({}, node), { client_features: ['envoy.lrs.supports_send_all_clusters'] });
            this.adsClient = new protoDefinitions.envoy.service.discovery.v2.AggregatedDiscoveryService(bootstrapInfo.xdsServers[0].serverUri, channel_credentials_1.createGoogleDefaultCredentials(), channelArgs);
            this.maybeStartAdsStream();
            this.lrsClient = new protoDefinitions.envoy.service.load_stats.v2.LoadReportingService(bootstrapInfo.xdsServers[0].serverUri, channel_credentials_1.createGoogleDefaultCredentials(), channelArgs);
            this.maybeStartLrsStream();
        }, (error) => {
            trace('Failed to initialize xDS Client. ' + error.message);
            // Bubble this error up to any listeners
            this.reportStreamError({
                code: constants_1.Status.INTERNAL,
                details: `Failed to initialize xDS Client. ${error.message}`,
                metadata: new metadata_1.Metadata(),
            });
        });
        this.statsTimer = setInterval(() => { }, 0);
        clearInterval(this.statsTimer);
    }
    handleAdsResponse(message) {
        let errorString;
        /* The cases in this switch statement look redundant but separating them
         * out like this is necessary for the typechecker to validate the types
         * as narrowly as we need it to. */
        switch (message.type_url) {
            case EDS_TYPE_URL:
                errorString = this.adsState[message.type_url].handleResponses(getResponseMessages(message.type_url, message.resources));
                break;
            case CDS_TYPE_URL:
                errorString = this.adsState[message.type_url].handleResponses(getResponseMessages(message.type_url, message.resources));
                break;
            case RDS_TYPE_URL:
                errorString = this.adsState[message.type_url].handleResponses(getResponseMessages(message.type_url, message.resources));
                break;
            case LDS_TYPE_URL:
                errorString = this.adsState[message.type_url].handleResponses(getResponseMessages(message.type_url, message.resources));
                break;
            default:
                errorString = `Unknown type_url ${message.type_url}`;
        }
        if (errorString === null) {
            /* errorString can only be null in one of the first 4 cases, which
             * implies that message.type_url is one of the 4 known type URLs, which
             * means that this type assertion is valid. */
            const typeUrl = message.type_url;
            this.adsState[typeUrl].nonce = message.nonce;
            this.adsState[typeUrl].versionInfo = message.version_info;
            this.ack(typeUrl);
        }
        else {
            this.nack(message.type_url, errorString);
        }
    }
    /**
     * Start the ADS stream if the client exists and there is not already an
     * existing stream, and there
     */
    maybeStartAdsStream() {
        if (this.adsClient === null) {
            return;
        }
        if (this.adsCall !== null) {
            return;
        }
        if (this.hasShutdown) {
            return;
        }
        this.adsCall = this.adsClient.StreamAggregatedResources();
        this.adsCall.on('data', (message) => {
            this.handleAdsResponse(message);
        });
        this.adsCall.on('error', (error) => {
            trace('ADS stream ended. code=' + error.code + ' details= ' + error.details);
            this.adsCall = null;
            this.reportStreamError(error);
            /* Connection backoff is handled by the client object, so we can
             * immediately start a new request to indicate that it should try to
             * reconnect */
            this.maybeStartAdsStream();
        });
        const allTypeUrls = [
            EDS_TYPE_URL,
            CDS_TYPE_URL,
            RDS_TYPE_URL,
            LDS_TYPE_URL,
        ];
        for (const typeUrl of allTypeUrls) {
            const state = this.adsState[typeUrl];
            state.nonce = '';
            state.versionInfo = '';
            if (state.getResourceNames().length > 0) {
                this.updateNames(typeUrl);
            }
        }
    }
    /**
     * Acknowledge an update. This should be called after the local nonce and
     * version info are updated so that it sends the post-update values.
     */
    ack(typeUrl) {
        this.updateNames(typeUrl);
    }
    /**
     * Reject an update. This should be called without updating the local
     * nonce and version info.
     */
    nack(typeUrl, message) {
        var _a;
        let resourceNames;
        let nonce;
        let versionInfo;
        switch (typeUrl) {
            case EDS_TYPE_URL:
            case CDS_TYPE_URL:
            case RDS_TYPE_URL:
            case LDS_TYPE_URL:
                resourceNames = this.adsState[typeUrl].getResourceNames();
                nonce = this.adsState[typeUrl].nonce;
                versionInfo = this.adsState[typeUrl].versionInfo;
                break;
            default:
                resourceNames = [];
                nonce = '';
                versionInfo = '';
        }
        (_a = this.adsCall) === null || _a === void 0 ? void 0 : _a.write({
            node: this.adsNode,
            type_url: typeUrl,
            resource_names: resourceNames,
            response_nonce: nonce,
            version_info: versionInfo,
            error_detail: {
                message: message,
            },
        });
    }
    updateNames(typeUrl) {
        var _a;
        (_a = this.adsCall) === null || _a === void 0 ? void 0 : _a.write({
            node: this.adsNode,
            type_url: typeUrl,
            resource_names: this.adsState[typeUrl].getResourceNames(),
            response_nonce: this.adsState[typeUrl].nonce,
            version_info: this.adsState[typeUrl].versionInfo,
        });
    }
    reportStreamError(status) {
        this.adsState[EDS_TYPE_URL].reportStreamError(status);
        this.adsState[CDS_TYPE_URL].reportStreamError(status);
        this.adsState[RDS_TYPE_URL].reportStreamError(status);
        this.adsState[LDS_TYPE_URL].reportStreamError(status);
    }
    maybeStartLrsStream() {
        if (!this.lrsClient) {
            return;
        }
        if (this.lrsCall) {
            return;
        }
        if (this.hasShutdown) {
            return;
        }
        this.lrsCall = this.lrsClient.streamLoadStats();
        this.lrsCall.on('data', (message) => {
            var _a, _b, _c, _d, _e, _f;
            if (((_a = message.load_reporting_interval) === null || _a === void 0 ? void 0 : _a.seconds) !== ((_c = (_b = this.latestLrsSettings) === null || _b === void 0 ? void 0 : _b.load_reporting_interval) === null || _c === void 0 ? void 0 : _c.seconds) ||
                ((_d = message.load_reporting_interval) === null || _d === void 0 ? void 0 : _d.nanos) !== ((_f = (_e = this.latestLrsSettings) === null || _e === void 0 ? void 0 : _e.load_reporting_interval) === null || _f === void 0 ? void 0 : _f.nanos)) {
                /* Only reset the timer if the interval has changed or was not set
                 * before. */
                clearInterval(this.statsTimer);
                /* Convert a google.protobuf.Duration to a number of milliseconds for
                 * use with setInterval. */
                const loadReportingIntervalMs = Number.parseInt(message.load_reporting_interval.seconds) * 1000 +
                    message.load_reporting_interval.nanos / 1000000;
                setInterval(() => {
                    this.sendStats();
                }, loadReportingIntervalMs);
            }
            this.latestLrsSettings = message;
        });
        this.lrsCall.on('error', (error) => {
            trace('LRS stream ended. code=' + error.code + ' details= ' + error.details);
            this.lrsCall = null;
            clearInterval(this.statsTimer);
            /* Connection backoff is handled by the client object, so we can
             * immediately start a new request to indicate that it should try to
             * reconnect */
            this.maybeStartAdsStream();
        });
        this.lrsCall.write({
            node: this.lrsNode,
        });
    }
    sendStats() {
        if (!this.lrsCall) {
            return;
        }
        const clusterStats = [];
        for (const [{ clusterName, edsServiceName }, stats,] of this.clusterStatsMap.entries()) {
            if (this.latestLrsSettings.send_all_clusters ||
                this.latestLrsSettings.clusters.indexOf(clusterName) > 0) {
                const upstreamLocalityStats = [];
                for (const localityStats of stats.localityStats) {
                    // Skip localities with 0 requests
                    if (localityStats.callsStarted > 0 ||
                        localityStats.callsSucceeded > 0 ||
                        localityStats.callsFailed > 0) {
                        upstreamLocalityStats.push({
                            locality: localityStats.locality,
                            total_issued_requests: localityStats.callsStarted,
                            total_successful_requests: localityStats.callsSucceeded,
                            total_error_requests: localityStats.callsFailed,
                            total_requests_in_progress: localityStats.callsInProgress,
                        });
                        localityStats.callsStarted = 0;
                        localityStats.callsSucceeded = 0;
                        localityStats.callsFailed = 0;
                    }
                }
                const droppedRequests = [];
                let totalDroppedRequests = 0;
                for (const [category, count] of stats.callsDropped.entries()) {
                    if (count > 0) {
                        droppedRequests.push({
                            category,
                            dropped_count: count,
                        });
                        totalDroppedRequests += count;
                    }
                }
                // Clear out dropped call stats after sending them
                stats.callsDropped.clear();
                const interval = process.hrtime(stats.intervalStart);
                stats.intervalStart = process.hrtime();
                // Skip clusters with 0 requests
                if (upstreamLocalityStats.length > 0 || totalDroppedRequests > 0) {
                    clusterStats.push({
                        cluster_name: clusterName,
                        cluster_service_name: edsServiceName,
                        dropped_requests: droppedRequests,
                        total_dropped_requests: totalDroppedRequests,
                        upstream_locality_stats: upstreamLocalityStats,
                        load_report_interval: {
                            seconds: interval[0],
                            nanos: interval[1],
                        },
                    });
                }
            }
        }
        this.lrsCall.write({
            node: this.lrsNode,
            cluster_stats: clusterStats,
        });
    }
    addEndpointWatcher(edsServiceName, watcher) {
        trace('Watcher added for endpoint ' + edsServiceName);
        this.adsState[EDS_TYPE_URL].addWatcher(edsServiceName, watcher);
    }
    removeEndpointWatcher(edsServiceName, watcher) {
        trace('Watcher removed for endpoint ' + edsServiceName);
        this.adsState[EDS_TYPE_URL].removeWatcher(edsServiceName, watcher);
    }
    addClusterWatcher(clusterName, watcher) {
        trace('Watcher added for cluster ' + clusterName);
        this.adsState[CDS_TYPE_URL].addWatcher(clusterName, watcher);
    }
    removeClusterWatcher(clusterName, watcher) {
        trace('Watcher removed for endpoint ' + clusterName);
        this.adsState[CDS_TYPE_URL].removeWatcher(clusterName, watcher);
    }
    /**
     *
     * @param lrsServer The target name of the server to send stats to. An empty
     *     string indicates that the default LRS client should be used. Currently
     *     only the empty string is supported here.
     * @param clusterName
     * @param edsServiceName
     */
    addClusterDropStats(lrsServer, clusterName, edsServiceName) {
        if (lrsServer !== '') {
            return {
                addCallDropped: (category) => { },
            };
        }
        const clusterStats = this.clusterStatsMap.getOrCreate(clusterName, edsServiceName);
        return {
            addCallDropped: (category) => {
                var _a;
                const prevCount = (_a = clusterStats.callsDropped.get(category)) !== null && _a !== void 0 ? _a : 0;
                clusterStats.callsDropped.set(category, prevCount + 1);
            },
        };
    }
    addClusterLocalityStats(lrsServer, clusterName, edsServiceName, locality) {
        if (lrsServer !== '') {
            return {
                addCallStarted: () => { },
                addCallFinished: (fail) => { },
            };
        }
        const clusterStats = this.clusterStatsMap.getOrCreate(clusterName, edsServiceName);
        let localityStats = null;
        for (const statsObj of clusterStats.localityStats) {
            if (localityEqual(locality, statsObj.locality)) {
                localityStats = statsObj;
                break;
            }
        }
        if (localityStats === null) {
            localityStats = {
                locality: locality,
                callsInProgress: 0,
                callsStarted: 0,
                callsSucceeded: 0,
                callsFailed: 0,
            };
            clusterStats.localityStats.push(localityStats);
        }
        /* Help the compiler understand that this object is always non-null in the
         * closure */
        const finalLocalityStats = localityStats;
        return {
            addCallStarted: () => {
                finalLocalityStats.callsStarted += 1;
                finalLocalityStats.callsInProgress += 1;
            },
            addCallFinished: (fail) => {
                if (fail) {
                    finalLocalityStats.callsFailed += 1;
                }
                else {
                    finalLocalityStats.callsSucceeded += 1;
                }
                finalLocalityStats.callsInProgress -= 1;
            },
        };
    }
    shutdown() {
        var _a, _b, _c, _d;
        (_a = this.adsCall) === null || _a === void 0 ? void 0 : _a.cancel();
        (_b = this.adsClient) === null || _b === void 0 ? void 0 : _b.close();
        (_c = this.lrsCall) === null || _c === void 0 ? void 0 : _c.cancel();
        (_d = this.lrsClient) === null || _d === void 0 ? void 0 : _d.close();
        this.hasShutdown = true;
    }
}
exports.XdsClient = XdsClient;
//# sourceMappingURL=xds-client.js.map