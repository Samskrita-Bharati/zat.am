/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ErrorCode, Headers, XhrIo } from '../../src/implementation/xhrio';
export declare type SendHook = (xhrio: TestingXhrIo, url: string, method: string, body?: ArrayBufferView | Blob | string | null, headers?: Headers) => void;
export declare enum State {
    START = 0,
    SENT = 1,
    DONE = 2
}
export interface StringHeaders {
    [name: string]: string;
}
export declare class TestingXhrIo implements XhrIo {
    private state;
    private sendPromise;
    private resolve;
    private sendHook;
    private status;
    private responseText;
    private headers;
    private errorCode;
    constructor(sendHook: SendHook | null);
    send(url: string, method: string, body?: ArrayBufferView | Blob | string | null, headers?: Headers): Promise<XhrIo>;
    simulateResponse(status: number, body: string, headers: {
        [key: string]: string;
    }): void;
    getErrorCode(): ErrorCode;
    getStatus(): number;
    getResponseText(): string;
    abort(): void;
    getResponseHeader(header: string): string | null;
    addUploadProgressListener(): void;
    removeUploadProgressListener(): void;
}
