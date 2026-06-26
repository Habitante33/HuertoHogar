const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(componentsDir)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(componentsDir, f));

files.push('index.html');

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/js\?v=\d+/g, 'js?v=14');
    fs.writeFileSync(f, content);
});

console.log('Versions bumped to v14');
