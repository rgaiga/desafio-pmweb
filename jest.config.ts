import type { Config } from 'jest';

const config: Config = {
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    moduleNameMapper: {
        '@controllers/(.+)': '<rootDir>/src/controllers/$1',
        '@controllers': '<rootDir>/src/controllers',
        '@errors/(.+)': '<rootDir>/src/errors/$1',
        '@errors': '<rootDir>/src/errors',
        '@middlewares/(.+)': '<rootDir>/src/middlewares/$1',
        '@middlewares': '<rootDir>/src/middlewares',
        '@models/(.+)': '<rootDir>/src/models/$1',
        '@models': '<rootDir>/src/models',
        '@routes/(.+)': '<rootDir>/src/routes/$1',
        '@routes': '<rootDir>/src/routes',
        '@services/(.+)': '<rootDir>/src/services/$1',
        '@services': '<rootDir>/src/services',
        '@utils/(.+)': '<rootDir>/src/utils/$1',
        '@utils': '<rootDir>/src/utils',
    },
    preset: 'ts-jest',
    testMatch: ['<rootDir>/__tests__/**/*.spec.ts'],
};

export default config;
