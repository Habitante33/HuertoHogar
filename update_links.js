const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(componentsDir)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(componentsDir, f));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/href="\.\.\/\.\.\/index\.html#contacto"/g, 'href="contacto.html"');
    fs.writeFileSync(f, content);
});

let indexContent = fs.readFileSync('index.html', 'utf8');
indexContent = indexContent.replace(/href="index\.html#contacto"/g, 'href="src/components/contacto.html"');
fs.writeFileSync('index.html', indexContent);

console.log('Nav links updated');
