module.exports = {
  testEnvironment: 'node',
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '.',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathAsClassName: true,
    }]
  ],
  collectCoverageFrom: [
    'server.js',
    '!node_modules/**',
  ],
};
