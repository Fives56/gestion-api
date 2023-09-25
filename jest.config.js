module.exports = {    
    testEnvironment: 'node',
    testRegex: '/__test__/.*\\.(test|spec)?\\.(js)$',
    collectCoverage: true,
    coverageReporters: [
      "html"
    ],
    moduleFileExtensions: ['js', 'json', 'node']
};