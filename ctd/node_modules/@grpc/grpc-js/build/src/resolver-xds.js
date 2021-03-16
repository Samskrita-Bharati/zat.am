"use strict";
/*
 * Copyright 2019 gRPC authors.
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
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const resolver_1 = require("./resolver");
const uri_parser_1 = require("./uri-parser");
const xds_client_1 = require("./xds-client");
const constants_1 = require("./constants");
const metadata_1 = require("./metadata");
class XdsResolver {
    constructor(target, listener, channelOptions) {
        this.target = target;
        this.listener = listener;
        this.channelOptions = channelOptions;
        this.resolutionStarted = false;
        this.hasReportedSuccess = false;
    }
    reportResolutionError() {
        this.listener.onError({
            code: constants_1.Status.UNAVAILABLE,
            details: `xDS name resolution failed for target ${uri_parser_1.uriToString(this.target)}`,
            metadata: new metadata_1.Metadata(),
        });
    }
    updateResolution() {
        // Wait until updateResolution is called once to start the xDS requests
        if (!this.resolutionStarted) {
            this.resolutionStarted = true;
            const xdsClient = new xds_client_1.XdsClient(this.target.path, {
                onValidUpdate: (update) => {
                    this.hasReportedSuccess = true;
                    this.listener.onSuccessfulResolution([], update, null, {
                        xdsClient: xdsClient,
                    });
                },
                onTransientError: (error) => {
                    /* A transient error only needs to bubble up as a failure if we have
                     * not already provided a ServiceConfig for the upper layer to use */
                    if (!this.hasReportedSuccess) {
                        this.reportResolutionError();
                    }
                },
                onResourceDoesNotExist: () => {
                    this.reportResolutionError();
                },
            }, this.channelOptions);
        }
    }
    static getDefaultAuthority(target) {
        return target.path;
    }
}
function setup() {
    resolver_1.registerResolver('xds', XdsResolver);
}
exports.setup = setup;
//# sourceMappingURL=resolver-xds.js.map