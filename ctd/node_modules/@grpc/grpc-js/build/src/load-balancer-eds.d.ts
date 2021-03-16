import { LoadBalancer, ChannelControlHelper } from './load-balancer';
import { SubchannelAddress } from './subchannel';
import { LoadBalancingConfig } from './load-balancing-config';
/**
 * This class load balances over a cluster by making an EDS request and then
 * transforming the result into a configuration for another load balancing
 * policy.
 */
export declare class EdsLoadBalancer implements LoadBalancer {
    private readonly channelControlHelper;
    /**
     * The child load balancer that will handle balancing the results of the EDS
     * requests.
     */
    private childBalancer;
    private xdsClient;
    private edsServiceName;
    private watcher;
    /**
     * Indicates whether the watcher has already been passed to this.xdsClient
     * and is getting updates.
     */
    private isWatcherActive;
    private lastestConfig;
    private latestAttributes;
    private latestEdsUpdate;
    /**
     * The priority of each locality the last time we got an update.
     */
    private localityPriorities;
    /**
     * The name we assigned to each priority number the last time we got an
     * update.
     */
    private priorityNames;
    private nextPriorityChildNumber;
    private clusterDropStats;
    constructor(channelControlHelper: ChannelControlHelper);
    /**
     * Check whether a single call should be dropped according to the current
     * policy, based on randomly chosen numbers. Returns the drop category if
     * the call should be dropped, and null otherwise.
     */
    private checkForDrop;
    /**
     * Should be called when this balancer gets a new config and when the
     * XdsClient returns a new ClusterLoadAssignment.
     */
    private updateChild;
    updateAddressList(addressList: SubchannelAddress[], lbConfig: LoadBalancingConfig, attributes: {
        [key: string]: unknown;
    }): void;
    exitIdle(): void;
    resetBackoff(): void;
    destroy(): void;
    getTypeName(): string;
}
export declare function setup(): void;
