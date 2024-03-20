export function formatText(text: string) {
    let result = text;
    
    result = result.replace('TABLE OF CONTENTS:', '\n');
    result = result.replaceAll(' * ', '\n');
    result = result.replace(/(\r\n|\n){2,}/g, '\n\n');
  
    return result;
}