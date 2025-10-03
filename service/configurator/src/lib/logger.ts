import { Logger } from 'tslog';

// Create a logger instance
export const logger = new Logger({
  name: 'saleor-configurator',
  minLevel: process.env.LOG_LEVEL === 'debug' ? 0 : 2, // 0 = debug, 2 = info
  prettyLogTemplate: '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}} {{logLevelName}} [{{name}}] ',
  prettyErrorTemplate: '\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}',
  prettyErrorStackTemplate: '  at {{fileName}}:{{lineNumber}}:{{columnNumber}}',
  prettyErrorParentNamesSeparator: ':',
  prettyErrorLoggerNameDelimiter: '',
  stylePrettyLogs: true,
  prettyLogTimeZone: 'local',
  maskValuesOfKeys: [],
  prettyLogStyles: {
    logLevelName: {
      '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
      FATAL: ['bold', 'red'],
      ERROR: ['bold', 'red'],
      WARN: ['bold', 'yellow'],
      INFO: ['bold', 'blue'],
      DEBUG: ['bold', 'green'],
      TRACE: ['bold', 'magenta'],
    },
    dateIsoStr: 'white',
    filePathWithLine: 'white',
    name: ['white', 'bold'],
    nameWithDelimiterPrefix: ['white', 'bold'],
    nameWithDelimiterSuffix: ['white', 'bold'],
    errorName: ['bold', 'bgRedBright', 'whiteBright'],
    fileName: ['yellow'],
    functionName: ['cyan'],
    methodName: ['cyan'],
    propertyName: ['cyan', 'dim'],
    propertyValue: ['white'],
    brackets: ['white', 'dim'],
    separator: ['white', 'dim'],
  },
});

// Export default logger
export default logger;
