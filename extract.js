const fs = require('fs');
const indexContent = fs.readFileSync('index.html', 'utf8');
const blogContent = fs.readFileSync('src/components/blog.html', 'utf8');

const nosotrosMatch = indexContent.match(/<!-- SECCIÓN NOSOTROS Y MAPA -->[\s\S]*?(?=<!-- SECCIÓN CONTACTO -->)/);
if (!nosotrosMatch) {
    console.error('Nosotros section not found');
    process.exit(1);
}
const nosotrosHtml = nosotrosMatch[0];

let blogHeader = blogContent.split('<!-- HERO SECTION -->')[0];
blogHeader = blogHeader.replace('<title>HuertoHogar - Blog & Noticias</title>', '<title>HuertoHogar - Nosotros</title>');
blogHeader = blogHeader.replace(/<li class="nav-item"><a class="nav-link nav-link-hh active" href="blog\.html" id="nav-blog">Blog<\/a><\/li>/, '<li class="nav-item"><a class="nav-link nav-link-hh" href="blog.html" id="nav-blog">Blog</a></li>');
blogHeader = blogHeader.replace(/<li class="nav-item"><a class="nav-link nav-link-hh" href="\.\.\/\.\.\/index\.html#nosotros" id="nav-nosotros">Nosotros<\/a><\/li>/, '<li class="nav-item"><a class="nav-link nav-link-hh active" href="nosotros.html" id="nav-nosotros">Nosotros</a></li>');

const blogFooterMatch = blogContent.match(/<!-- FOOTER \(Direct Embed for file:\/\/ compatibility\) -->[\s\S]*/);
const blogFooter = blogFooterMatch[0];

const newNosotrosContent = blogHeader + '<div style="padding-top: 20px;"></div>\n' + nosotrosHtml + '\n' + blogFooter;
fs.writeFileSync('src/components/nosotros.html', newNosotrosContent);

const newIndexContent = indexContent.replace(nosotrosMatch[0], '');
fs.writeFileSync('index.html', newIndexContent);

// Now update hrefs in all html files
const files = [
    'src/components/admin.html',
    'src/components/blog.html',
    'src/components/carrito.html',
    'src/components/detalle.html',
    'src/components/login.html',
    'src/components/productos.html',
    'index.html'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (f === 'index.html') {
        content = content.replace(/href="index\.html#nosotros"/g, 'href="src/components/nosotros.html"');
    } else {
        content = content.replace(/href="\.\.\/\.\.\/index\.html#nosotros"/g, 'href="nosotros.html"');
    }
    fs.writeFileSync(f, content);
});

console.log('Success');
