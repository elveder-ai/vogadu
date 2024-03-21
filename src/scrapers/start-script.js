const scriptName = process.argv[2];

try {
    require(`./dist/scrapers/src/${scriptName}.js`);
} catch (error) {
    console.error(`Failed to run script: ${scriptName}`, error);
}
