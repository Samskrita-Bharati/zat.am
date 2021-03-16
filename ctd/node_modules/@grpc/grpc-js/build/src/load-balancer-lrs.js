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
exports.setup = exports.LrsLoadBalancer = void 0;
const load_balancer_1 = require("./load-balancer");
const load_balancing_config_1 = require("./load-balancing-config");
const load_balancer_child_handler_1 = require("./load-balancer-child-handler");
const picker_1 = require("./picker");
const xds_client_1 = require("./xds-client");
const filter_1 = require("./filter");
const constants_1 = require("./constants");
const filter_stack_1 = require("./filter-stack");
const TYPE_NAME = 'lrs';
/**
 * Filter class that reports when the call ends.
 */
class CallEndTrackingFilter extends filter_1.BaseFilter {
    constructor(localityStatsReporter) {
        super();
        this.localityStatsReporter = localityStatsReporter;
    }
    receiveTrailers(status) {
        this.localityStatsReporter.addCallFinished(status.code !== constants_1.Status.OK);
        return status;
    }
}
class CallEndTrackingFilterFactory {
    constructor(localityStatsReporter) {
        this.localityStatsReporter = localityStatsReporter;
    }
    createFilter(callStream) {
        return new CallEndTrackingFilter(this.localityStatsReporter);
    }
}
/**
 * Picker that delegates picking to another picker, and reports when calls
 * created using those picks start and end.
 */
class LoadReportingPicker {
    constructor(wrappedPicker, localityStatsReporter) {
        this.wrappedPicker = wrappedPicker;
        this.localityStatsReporter = localityStatsReporter;
    }
    pick(pickArgs) {
        const wrappedPick = this.wrappedPicker.pick(pickArgs);
        if (wrappedPick.pickResultType === picker_1.PickResultType.COMPLETE) {
            const trackingFilterFactory = new CallEndTrackingFilterFactory(this.localityStatsReporter);
            /* In the unlikely event that the wrappedPick already has an
             * extraFilterFactory, preserve it in a FilterStackFactory. */
            const extraFilterFactory = wrappedPick.extraFilterFactory
                ? new filter_stack_1.FilterStackFactory([
                    wrappedPick.extraFilterFactory,
                    trackingFilterFactory,
                ])
                : trackingFilterFactory;
            return {
                pickResultType: picker_1.PickResultType.COMPLETE,
                subchannel: wrappedPick.subchannel,
                status: null,
                onCallStarted: () => {
                    var _a;
                    (_a = wrappedPick.onCallStarted) === null || _a === void 0 ? void 0 : _a.call(wrappedPick);
                    this.localityStatsReporter.addCallStarted();
                },
                extraFilterFactory: extraFilterFactory,
            };
        }
        else {
            return wrappedPick;
        }
    }
}
/**
 * "Load balancer" that delegates the actual load balancing logic to another
 * LoadBalancer class and adds hooks to track when calls started using that
 * LoadBalancer start and end, and uses the XdsClient to report that
 * information back to the xDS server.
 */
class LrsLoadBalancer {
    constructor(channelControlHelper) {
        this.channelControlHelper = channelControlHelper;
        this.localityStatsReporter = null;
        this.childBalancer = new load_balancer_child_handler_1.ChildLoadBalancerHandler({
            createSubchannel: (subchannelAddress, subchannelArgs) => channelControlHelper.createSubchannel(subchannelAddress, subchannelArgs),
            requestReresolution: () => channelControlHelper.requestReresolution(),
            updateState: (connectivityState, picker) => {
                if (this.localityStatsReporter !== null) {
                    picker = new LoadReportingPicker(picker, this.localityStatsReporter);
                }
                channelControlHelper.updateState(connectivityState, picker);
            },
        });
    }
    updateAddressList(addressList, lbConfig, attributes) {
        var _a;
        if (!load_balancing_config_1.isLrsLoadBalancingConfig(lbConfig)) {
            return;
        }
        if (!(attributes.xdsClient instanceof xds_client_1.XdsClient)) {
            return;
        }
        const lrsConfig = lbConfig.lrs;
        this.localityStatsReporter = attributes.xdsClient.addClusterLocalityStats(lrsConfig.lrs_load_reporting_server_name, lrsConfig.cluster_name, lrsConfig.eds_service_name, lrsConfig.locality);
        const childPolicy = (_a = load_balancer_1.getFirstUsableConfig(lrsConfig.child_policy)) !== null && _a !== void 0 ? _a : { name: 'pick_first', pick_first: {} };
        this.childBalancer.updateAddressList(addressList, childPolicy, attributes);
    }
    exitIdle() {
        this.childBalancer.exitIdle();
    }
    resetBackoff() {
        this.childBalancer.resetBackoff();
    }
    destroy() {
        this.childBalancer.destroy();
    }
    getTypeName() {
        return TYPE_NAME;
    }
}
exports.LrsLoadBalancer = LrsLoadBalancer;
function setup() {
    load_balancer_1.registerLoadBalancerType(TYPE_NAME, LrsLoadBalancer);
}
exports.setup = setup;
//# sourceMappingURL=load-balancer-lrs.js.map