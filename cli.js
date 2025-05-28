#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { startServer } from './index.js';
import { connectClient } from './client.js';

yargs(hideBin(process.argv))
  .command('start', 'Start the broadcast server', (yargs) => {
    return yargs.option('port', {
      alias: 'p',
      type: 'number',
      description: 'Port to run the server on',
      default: 3000
    });
  }, (argv) => {
    console.log(`Attempting to start server on port ${argv.port}...`);
    startServer(argv.port);
  })
  .command('connect', 'Connect to the broadcast server', (yargs) => {
    return yargs.option('host', {
      type: 'string',
      description: 'Host of the server',
      default: 'localhost'
    }).option('port', {
      alias: 'p',
      type: 'number',
      description: 'Port of the server',
      default: 3000
    });
  }, (argv) => {
    const serverUrl = `ws://${argv.host}:${argv.port}`;
    console.log(`Attempting to connect to server at ${serverUrl}...`);
    connectClient(serverUrl);
  })
  .demandCommand(1, 'You need to specify a command: start or connect')
  .help()
  .alias('help', 'h')
  .argv;