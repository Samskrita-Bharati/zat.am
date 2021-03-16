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
exports.setup = exports.CdsLoadBalancer = void 0;
const load_balancer_1 = require("./load-balancer");
const load_balancing_config_1 = require("./load-balancing-config");
const xds_client_1 = require("./xds-client");
const load_balancer_child_handler_1 = require("./load-balancer-child-handler");
const channel_1 = require("./channel");
const picker_1 = require("./picker");
const constants_1 = require("./constants");
const metadata_1 = require("./metadata");
const TYPE_NAME = 'cds';
class CdsLoadBalancer {
    constructor(channelControlHelper) {
        this.channelControlHelper = channelControlHelper;
        this.xdsClient = null;
        this.isWatcherActive = false;
        this.latestCdsUpdate = null;
        this.latestConfig = null;
        this.latestAttributes = {};
        this.childBalancer = new load_balancer_child_handler_1.ChildLoadBalancerHandler(channelControlHelper);
        this.watcher = {
            onValidUpdate: (update) => {
                var _a;
                this.latestCdsUpdate = update;
                const edsConfig = {
                    cluster: update.name,
                    edsServiceName: update.eds_cluster_config.service_name === ''
                        ? undefined
                        : update.eds_cluster_config.service_name,
                    localityPickingPolicy: [],
                    endpointPickingPolicy: [],
                };
                if ((_a = update.lrs_server) === null || _a === void 0 ? void 0 : _a.self) {
                    /* the lrs_server.self field indicates that the same server should be
                     * used for load reporting as for other xDS operations. Setting
                     * lrsLoadReportingServerName to the empty string sets that behavior.
                     * Otherwise, if the field is omitted, load reporting is disabled. */
                    edsConfig.lrsLoadReportingServerName = '';
                }
                this.childBalancer.updateAddressList([], { name: 'eds', eds: edsConfig }, this.latestAttributes);
            },
            onResourceDoesNotExist: () => {
                var _a;
                (_a = this.xdsClient) === null || _a === void 0 ? void 0 : _a.removeClusterWatcher(this.latestConfig.cds.cluster, this.watcher);
                this.isWatcherActive = false;
            },
            onTransientError: (status) => {
                if (this.latestCdsUpdate === null) {
                    channelControlHelper.updateState(channel_1.ConnectivityState.TRANSIENT_FAILURE, new picker_1.UnavailablePicker({
                        code: constants_1.Status.UNAVAILABLE,
                        details: `xDS request failed with error ${status.details}`,
                        metadata: new metadata_1.Metadata(),
                    }));
                }
            },
        };
    }
    updateAddressList(addressList, lbConfig, attributes) {
        var _a;
        if (!load_balancing_config_1.isCdsLoadBalancingConfig(lbConfig)) {
            return;
        }
        if (!(attributes.xdsClient instanceof xds_client_1.XdsClient)) {
            return;
        }
        this.xdsClient = attributes.xdsClient;
        this.latestAttributes = attributes;
        /* If the cluster is changing, disable the old watcher before adding the new
         * one */
        if (this.isWatcherActive &&
            ((_a = this.latestConfig) === null || _a === void 0 ? void 0 : _a.cds.cluster) !== lbConfig.cds.cluster) {
            this.xdsClient.removeClusterWatcher(this.latestConfig.cds.cluster, this.watcher);
            /* Setting isWatcherActive to false here lets us have one code path for
             * calling addClusterWatcher */
            this.isWatcherActive = false;
            /* If we have a new name, the latestCdsUpdate does not correspond to
             * the new config, so it is no longer valid */
            this.latestCdsUpdate = null;
        }
        this.latestConfig = lbConfig;
        if (!this.isWatcherActive) {
            this.xdsClient.addClusterWatcher(lbConfig.cds.cluster, this.watcher);
            this.isWatcherActive = true;
        }
    }
    exitIdle() {
        this.childBalancer.exitIdle();
    }
    resetBackoff() {
        this.childBalancer.resetBackoff();
    }
    destroy() {
        var _a;
        this.childBalancer.destroy();
        if (this.isWatcherActive) {
            (_a = this.xdsClient) === null || _a === void 0 ? void 0 : _a.removeClusterWatcher(this.latestConfig.cds.cluster, this.watcher);
        }
    }
    getTypeName() {
        return TYPE_NAME;
    }
}
exports.CdsLoadBalancer = CdsLoadBalancer;
function setup() {
    load_balancer_1.registerLoadBalancerType(TYPE_NAME, CdsLoadBalancer);
}
exports.setup = setup;
//# sourceMappingURL=load-balancer-cds.js.map