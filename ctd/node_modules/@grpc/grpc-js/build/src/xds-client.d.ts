import { StatusObject } from './call-stream';
import { ServiceConfig } from './service-config';
import { ChannelOptions } from './channel-options';
import { ClusterLoadAssignment__Output } from './generated/envoy/api/v2/ClusterLoadAssignment';
import { Cluster__Output } from './generated/envoy/api/v2/Cluster';
import { Locality__Output } from './generated/envoy/api/v2/core/Locality';
declare type EdsTypeUrl = 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment';
declare type CdsTypeUrl = 'type.googleapis.com/envoy.api.v2.Cluster';
declare type LdsTypeUrl = 'type.googleapis.com/envoy.api.v2.Listener';
declare type RdsTypeUrl = 'type.googleapis.com/envoy.api.v2.RouteConfiguration';
declare type AdsTypeUrl = EdsTypeUrl | CdsTypeUrl | RdsTypeUrl | LdsTypeUrl;
export interface Watcher<UpdateType> {
    onValidUpdate(update: UpdateType): void;
    onTransientError(error: StatusObject): void;
    onResourceDoesNotExist(): void;
}
export interface XdsClusterDropStats {
    addCallDropped(category: string): void;
}
export interface XdsClusterLocalityStats {
    addCallStarted(): void;
    addCallFinished(fail: boolean): void;
}
export declare class XdsClient {
    private adsNode;
    private adsClient;
    private adsCall;
    private lrsNode;
    private lrsClient;
    private lrsCall;
    private latestLrsSettings;
    private clusterStatsMap;
    private statsTimer;
    private hasShutdown;
    private adsState;
    constructor(targetName: string, serviceConfigWatcher: Watcher<ServiceConfig>, channelOptions: ChannelOptions);
    private handleAdsResponse;
    /**
     * Start the ADS stream if the client exists and there is not already an
     * existing stream, and there
     */
    private maybeStartAdsStream;
    /**
     * Acknowledge an update. This should be called after the local nonce and
     * version info are updated so that it sends the post-update values.
     */
    ack(typeUrl: AdsTypeUrl): void;
    /**
     * Reject an update. This should be called without updating the local
     * nonce and version info.
     */
    private nack;
    private updateNames;
    private reportStreamError;
    private maybeStartLrsStream;
    private sendStats;
    addEndpointWatcher(edsServiceName: string, watcher: Watcher<ClusterLoadAssignment__Output>): void;
    removeEndpointWatcher(edsServiceName: string, watcher: Watcher<ClusterLoadAssignment__Output>): void;
    addClusterWatcher(clusterName: string, watcher: Watcher<Cluster__Output>): void;
    removeClusterWatcher(clusterName: string, watcher: Watcher<Cluster__Output>): void;
    /**
     *
     * @param lrsServer The target name of the server to send stats to. An empty
     *     string indicates that the default LRS client should be used. Currently
     *     only the empty string is supported here.
     * @param clusterName
     * @param edsServiceName
     */
    addClusterDropStats(lrsServer: string, clusterName: string, edsServiceName: string): XdsClusterDropStats;
    addClusterLocalityStats(lrsServer: string, clusterName: string, edsServiceName: string, locality: Locality__Output): XdsClusterLocalityStats;
    shutdown(): void;
}
export {};
