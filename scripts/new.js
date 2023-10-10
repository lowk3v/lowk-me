// make a new post by copying the template
// and opening it in the editor
// Usage: node scripts/new.js <title> <category>
function makePost(title, dir) {
    if (!title) {
        throw error('No title provided');
    }
    if (!dir) {
        dir = 'projects'
    }
    const fs = require('fs');
    const path = require('path');
    const template = path.join(__dirname, './content-template.mdx');
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}-${title.replace(/\s/g, '-')}.mdx`;
    
    let filepath = path.join(__dirname, `../content/${filename}`);
    if (dir) {
        filepath = path.join(__dirname, `../content/${dir}`);
        if (!fs.existsSync(filepath)) {
            fs.mkdirSync(filepath);
        }
        filepath = path.join(filepath, filename);
    } 
    
    const content = fs.readFileSync(template, 'utf-8')
        .replace(/{{title}}/g, title)
        .replace(/{{date}}/g, date);

    fs.writeFileSync(filepath, content);
    console.log(`Created ${filepath}`);
    return filepath;
}

makePost(process.argv[2], process.argv[3]);