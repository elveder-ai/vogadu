const fs = require('fs').promises;
const path = require('path');

async function saveCars(cars) {
  const data = Array.from(cars).join('\n');

  const filePath = path.join(__dirname, `artifacts/cars.txt`);

  try {
    await fs.writeFile(filePath, data);

    console.log(`Saved to ${filePath}`);
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

async function getCars() {
  const filePath = path.join(__dirname, 'artifacts/cars.txt');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const result = data.split('\n').filter(line => line.trim() !== '');

    return result;
  } catch (err) {
    console.error('Error reading file:', err);

    return [];
  }
}

module.exports = { saveCars, getCars }