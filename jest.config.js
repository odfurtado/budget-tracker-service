/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFiles: ['./test/config/setup.ts'],
	verbose: true,
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
};

// const merge = require('merge');
// const ts_preset = require('ts-jest/jest-preset');
// const jest_mongodb = require('@shelf/jest-mongodb/jest-preset');

// module.exports = merge.recursive(ts_preset, jest_mongodb);
