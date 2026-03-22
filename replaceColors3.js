import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./client/src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/violet-/g, 'slate-');
      
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated ' + filePath);
    }
  }
});
