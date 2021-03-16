import { LoadBalancer, ChannelControlHelper } from './load-balancer';
import { SubchannelAddress } from './subchannel';
import { LoadBalancingConfig } from './load-balancing-config';
/**
 * "Load balancer" that delegates the actual load balancing logic to another
 * LoadBalancer class and adds hooks to track when calls started using that
 * LoadBalancer start and end, and uses the XdsClient to report that
 * information back to the xDS server.
 */
export declare class LrsLoadBalancer implements LoadBalancer {
    private channelControlHelper;
    private childBalancer;
    private localityStatsReporter;
    constructor(channelControlHelper: ChannelControlHelper);
    updateAddressList(addressList: SubchannelAddress[], lbConfig: LoadBalancingConfig, attributes: {
        [key: string]: unknown;
    }): void;
    exitIdle(): void;
    resetBackoff(): void;
    destroy(): void;
    getTypeName(): string;
}
export declare function setup(): void;
