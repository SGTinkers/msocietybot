#! /usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

'use strict';

const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, '../.nvmrc'), 'utf8', function(error, data) {
  if (error) throw error;
  const expectedVersion = data.trim().replace('v', '');
  const currentVersion = process.version.replace('v', '');

  const versionMatchesExactly = expectedVersion === currentVersion;
  const versionMatchesMajor = expectedVersion.split('.')[0] === currentVersion.split('.')[0];
  if (versionMatchesExactly) {
    process.exit();
  }

  const nvmInstallText = 'To do this you can install nvm (https://github.com/nvm-sh/nvm) then run `nvm install`.';

  if (versionMatchesMajor) {
    console.log(
      '' +
        'Warning: You are using Node.js version ' +
        currentVersion +
        ' which we do not use. ' +
        '\n\n' +
        'You may encounter issues, consider installing Node.js version ' +
        expectedVersion +
        '.' +
        '\n\n' +
        nvmInstallText +
        '',
    );
    process.exit();
  }

  console.log(
    '' +
      'You are using Node.js version ' +
      currentVersion +
      ' which we do not support. ' +
      '\n\n' +
      'Please install Node.js version ' +
      expectedVersion +
      ' and try again.' +
      '\n\n' +
      nvmInstallText +
      '',
  );
  process.exit(1); // exit with a failure mode
});
