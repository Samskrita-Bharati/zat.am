import { LoadBalancer, ChannelControlHelper } from './load-balancer';
import { SubchannelAddress } from './subchannel';
import { LoadBalancingConfig } from './load-balancing-config';
export declare class CdsLoadBalancer implements LoadBalancer {
    private readonly channelControlHelper;
    private childBalancer;
    private xdsClient;
    private watcher;
    private isWatcherActive;
    private latestCdsUpdate;
    private latestConfig;
    private latestAttributes;
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
