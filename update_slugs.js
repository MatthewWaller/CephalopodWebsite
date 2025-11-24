#!/usr/bin/env node

const fs = require('fs');

// Read blog index
const blogIndex = JSON.parse(fs.readFileSync('blog_index.json', 'utf8'));

// Function to create a cleaner slug from title
function createCleanSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
        .substring(0, 80);             // Limit length
}

// Update slugs
blogIndex.forEach(post => {
    const cleanSlug = createCleanSlug(post.title);
    console.log(`${post.slug} -> ${cleanSlug}`);
    post.slug = cleanSlug;
});

// Write updated index
fs.writeFileSync('blog_index.json', JSON.stringify(blogIndex, null, 2));
console.log('\nUpdated blog_index.json with clean slugs');
