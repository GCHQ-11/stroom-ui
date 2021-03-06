/*
 * Copyright 2017 Crown Copyright
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

export class IHttpError {
  status: number;
  message: string;
  stack: string;
}

export class HttpError implements IHttpError {
  status: number;
  message: string;
  stack: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
    this.stack = new Error().stack || "";
  }
}

HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;
