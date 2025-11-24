#!/usr/bin/env node

const fs = require('fs');

// Read the XML file
const xml = fs.readFileSync('Squarespace-Wordpress-Export-07-19-2025.xml', 'utf8');

// Extract all items with title and link
const items = [];
const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let match;

while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    // Extract title
    const titleMatch = itemContent.match(/<title>(.*?)<\/title>/);
    // Extract link
    const linkMatch = itemContent.match(/<link>(\/blog\/.*?)<\/link>/);

    if (titleMatch && linkMatch) {
        const title = titleMatch[1]
            .replace(/&amp;amp;/g, '&')
            .replace(/&amp;/g, '&');
        const slug = linkMatch[1].replace('/blog/', '');

        items.push({
            title: title,
            slug: slug
        });
    }
}

console.log('Found blog posts from Squarespace:');
console.log(JSON.stringify(items, null, 2));

// Now read the current blog_index.json and update it
const blogIndex = JSON.parse(fs.readFileSync('blog_index.json', 'utf8'));

// Create a map of titles to slugs from Squarespace
const titleToSlug = {};
items.forEach(item => {
    titleToSlug[item.title] = item.slug;
});

// Update blog_index.json with correct slugs
let updated = 0;
let notFound = [];
blogIndex.forEach(post => {
    // Try exact match first
    if (titleToSlug[post.title]) {
        console.log(`\nUpdating: ${post.title}`);
        console.log(`  Old slug: ${post.slug}`);
        console.log(`  New slug: ${titleToSlug[post.title]}`);
        post.slug = titleToSlug[post.title];
        updated++;
    } else {
        // Try with normalized ampersands
        const normalizedTitle = post.title.replace(/&amp;/g, '&');
        if (titleToSlug[normalizedTitle]) {
            console.log(`\nUpdating: ${post.title}`);
            console.log(`  Old slug: ${post.slug}`);
            console.log(`  New slug: ${titleToSlug[normalizedTitle]}`);
            post.slug = titleToSlug[normalizedTitle];
            updated++;
        } else {
            notFound.push(post.title);
        }
    }
});

if (notFound.length > 0) {
    console.log('\n⚠️  Posts not found in Squarespace export:');
    notFound.forEach(title => console.log(`  - ${title}`));
}

// Write updated blog_index.json
fs.writeFileSync('blog_index.json', JSON.stringify(blogIndex, null, 2));
console.log(`\n✅ Updated ${updated} blog post slugs to match Squarespace URLs`);
