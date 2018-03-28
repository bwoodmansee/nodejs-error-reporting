/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// jscs doesn't understand koa..
// jscs:disable

import {ErrorReporting} from '../../src';
const errorHandler = new ErrorReporting({
  // TODO: Address the fact that this configuration
  //       option is now invalid.
  onUncaughtException: 'report',
} as {});
import * as koa from 'koa';
const app = (koa as Function)();

app.use(errorHandler.koa);

app.use(function*(this, next) {
  // This will set status and message
  this.throw('Error Message', 500);
  yield next;
});

app.use(function*(this, next) {
  // TODO: Address the fact that new Date()
  //       is used instead of Date.now()
  const start = new Date() as any;
  yield next;
  const ms = new Date() as any - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger

app.use(function*(this, next) {
  const start = new Date() as any;
  yield next;
  const ms = new Date() as any - start;
  // eslint-disable-next-line no-console
  console.log('%s %s - %s', this.method, this.url, ms);
});

// response
app.use(function*(this, next) {
  this.body = 'Hello World';
  yield next;
});

app.listen(3000);