#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read blog index
const blogIndex = JSON.parse(fs.readFileSync('blog_index.json', 'utf8'));

// Create a map of filename to correct slug
const filenameToSlug = {};
blogIndex.forEach(post => {
    filenameToSlug[post.filename] = post.slug;
});

// Update each markdown file
const blogPostsDir = 'blog_posts';
let updated = 0;

Object.keys(filenameToSlug).forEach(filename => {
    const filepath = path.join(blogPostsDir, filename);

    if (!fs.existsSync(filepath)) {
        console.log(`⚠️  File not found: ${filename}`);
        return;
    }

    // Read the markdown file
    const content = fs.readFileSync(filepath, 'utf8');

    // Parse frontmatter
    const frontmatterMatch = content.match(/^---\s*\n(.*?)\n---\s*\n(.*)$/s);

    if (!frontmatterMatch) {
        console.log(`⚠️  No frontmatter found in: ${filename}`);
        return;
    }

    const frontmatterText = frontmatterMatch[1];
    const body = frontmatterMatch[2];

    // Parse frontmatter fields
    const frontmatter = {};
    const lines = frontmatterText.split('\n');

    lines.forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
            frontmatter[match[1]] = match[2].replace(/^"(.*)"$/, '$1');
        }
    });

    // Update the slug
    const oldSlug = frontmatter.slug;
    const newSlug = filenameToSlug[filename];

    if (oldSlug === newSlug) {
        console.log(`✓ ${filename} - slug already correct: ${newSlug}`);
        return;
    }

    frontmatter.slug = newSlug;

    // Rebuild frontmatter
    const newFrontmatter = Object.keys(frontmatter)
        .map(key => `${key}: ${frontmatter[key]}`)
        .join('\n');

    // Rebuild file content
    const newContent = `---\n${newFrontmatter}\n---\n${body}`;

    // Write back to file
    fs.writeFileSync(filepath, newContent);

    console.log(`✓ Updated ${filename}`);
    console.log(`  Old slug: ${oldSlug}`);
    console.log(`  New slug: ${newSlug}`);
    updated++;
});

console.log(`\n✅ Updated ${updated} markdown files with correct slugs`);
