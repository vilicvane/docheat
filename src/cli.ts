#!/usr/bin/env node

import 'source-map-support/register';

import * as Path from 'path';

import {CLI, Shim} from 'clime';

let cli = new CLI('docheat', Path.join(__dirname, 'commands'));

export default cli;

let shim = new Shim(cli);

// tslint:disable-next-line:no-floating-promises
shim.execute(process.argv);
