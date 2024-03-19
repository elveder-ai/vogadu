const scriptName = process.argv[2];

try {
    require(`./dist/${scriptName}.js`);
} catch (error) {
    console.error(`Failed to run script: ${scriptName}`, error);
}
