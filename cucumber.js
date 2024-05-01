module.exports = {
    default: [
        '--require-module ts-node/register', // Load TypeScript module
        '--require src/tests/step-definitions/**/*.ts', // Load all step definitions
        'src/tests/features/**/*.feature', // Specify feature files location
        '--format progress-bar', // Use the progress bar format
    ].join(' ')
};
