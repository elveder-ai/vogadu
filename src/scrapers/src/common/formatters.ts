export function formatCarData(data: string) {
  return data.toLowerCase().replaceAll(' ', '-').replaceAll('_', '-').replaceAll('/', '').replaceAll(',', '');
}

export function formatText(text: string) {
  let result = text;

  result = result.replace('TABLE OF CONTENTS:', '\n');
  result = result.replaceAll(' * ', '\n');
  result = result.replace(/(\r\n|\n){2,}/g, '\n\n');

  return result;
}

export function splitTextIntoParagraphs(text: string) {
  const paragraphRegex = /(?:\r?\n\s*){2,}/;

  return text.split(paragraphRegex).filter(paragraph => paragraph.trim() != '');
}