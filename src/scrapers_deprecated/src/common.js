const fs = require('fs').promises;
const path = require('path');

async function getCarMakers(directory) {
  const artifactsDirectoryPath = await _getArtifatcsDirectoryPath(directory);
  const filePath = path.join(artifactsDirectoryPath, 'car-makers.txt');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const result = data.split('\n').filter(line => line.trim() !== '').map(m => m.replace(/\r?\n?/g, ''));;

    return result;
  } catch (e) {
    console.log('ERROR GETTING DATA FROM FILE');
    console.error(e);

    return [];
  }
}

async function saveUrls(directory, urls) {
  const data = Array.from(urls).join('\n');

  const artifactsDirectoryPath = await _getArtifatcsDirectoryPath(directory);
  const filePath = path.join(artifactsDirectoryPath, `urls.txt`);

  try {
    await fs.writeFile(filePath, data);

    console.log(`Saved to ${filePath}`);
  } catch (e) {
    console.log('ERROR SAVING TO FILE');
    console.error(e);
  }
}

async function getUrls(directory) {
  const artifactsDirectoryPath = await _getArtifatcsDirectoryPath(directory);
  const filePath = path.join(artifactsDirectoryPath, 'urls.txt');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const result = data.split('\n').filter(line => line.trim() !== '');

    return result;
  } catch (e) {
    console.log('ERROR GETTING DATA FROM FILE');
    console.error(e);

    return [];
  }
}

function formatText(text) {
  let result = text;
  
  result = result.replace('TABLE OF CONTENTS:', '\n');
  result = result.replaceAll(' * ', '\n');
  result = result.replace(/(\r\n|\n){2,}/g, '\n\n');

  return result;
}

async function saveArticle(prefix, title, text) {
  const articlesDirectoryPath = path.join(__dirname, '../../../articles');
  await _addDirectoryIfNotExist(articlesDirectoryPath);

  const filePath = path.join(articlesDirectoryPath, `${prefix}_${title}.txt`);

  try {
    await fs.writeFile(filePath, text);

    console.log(`Saved to ${filePath}`);
  } catch (e) {
    console.log('ERROR SAVING TO FILE');
    console.error(e);
  }
}

async function saveReview(prefix, title, text) {
  const reviewsDirectoryPath = path.join(__dirname, '../../../reviews');
  await _addDirectoryIfNotExist(reviewsDirectoryPath);

  const filePath = path.join(reviewsDirectoryPath, `${prefix}_${title}.txt`);

  try {
    await fs.writeFile(filePath, text);

    console.log(`Saved to ${filePath}`);
  } catch (e) {
    console.log('ERROR SAVING TO FILE');
    console.error(e);
  }
}

async function _directoryExists(directory) {
  try {
      await fs.access(directory);

      return true;
  } catch (e) {
      return false;
  }
}

async function _addDirectoryIfNotExist(directory) {
  if (await _directoryExists(directory) == false) {
    await fs.mkdir(directory, { recursive: true });

    console.log('Added folder:', directory);
  }
}

async function _getArtifatcsDirectoryPath(directory) {
  const artifactsDirectoryPath = path.join(directory, 'artifacts');

  await _addDirectoryIfNotExist(artifactsDirectoryPath);

  return artifactsDirectoryPath;
}

module.exports = { getCarMakers, saveUrls, getUrls, formatText, saveArticle, saveReview }