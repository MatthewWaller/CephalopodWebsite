#!/usr/bin/env python3
"""
Generate a blog index JSON file from markdown posts.
"""

import os
import re
import json
from datetime import datetime

def parse_frontmatter(content):
    """Extract YAML frontmatter from markdown."""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', content, re.DOTALL)
    if not match:
        return {}, content

    frontmatter_text = match.group(1)
    body = match.group(2)

    frontmatter = {}
    for line in frontmatter_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"')
            frontmatter[key] = value

    return frontmatter, body

def get_excerpt(body, max_length=200):
    """Get first paragraph or first max_length characters."""
    # Remove markdown images: ![alt](url)
    clean = re.sub(r'!\[([^\]]*)\]\([^)]+\)', '', body)

    # Remove markdown links but keep the text: [text](url) -> text
    clean = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', clean)

    # Remove remaining markdown formatting
    clean = re.sub(r'[#*`]', '', clean)

    # Clean up whitespace
    clean = re.sub(r'\n+', ' ', clean)
    clean = re.sub(r'\s+', ' ', clean)
    clean = clean.strip()

    if len(clean) <= max_length:
        return clean

    # Try to cut at sentence
    excerpt = clean[:max_length]
    last_period = excerpt.rfind('.')
    if last_period > max_length * 0.6:
        return excerpt[:last_period + 1]

    return excerpt + '...'

def get_first_image(body):
    """Extract the first image URL from markdown content."""
    # Look for markdown image syntax: ![alt](url)
    match = re.search(r'!\[([^\]]*)\]\(([^)]+)\)', body)
    if match:
        return match.group(2)
    return None

def main():
    blog_dir = '/Users/matthewwaller/Developer/CephalopodWebsite/blog_posts'
    output_file = '/Users/matthewwaller/Developer/CephalopodWebsite/blog_index.json'

    posts = []

    for filename in os.listdir(blog_dir):
        if not filename.endswith('.md'):
            continue

        filepath = os.path.join(blog_dir, filename)

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        frontmatter, body = parse_frontmatter(content)

        if not frontmatter:
            continue

        post = {
            'title': frontmatter.get('title', 'Untitled'),
            'date': frontmatter.get('date', '2020-01-01'),
            'slug': frontmatter.get('slug', filename.replace('.md', '')),
            'filename': filename,
            'excerpt': get_excerpt(body),
            'image': get_first_image(body)
        }

        posts.append(post)

    # Sort by date, newest first
    posts.sort(key=lambda x: x['date'], reverse=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2)

    print(f"✓ Generated blog index with {len(posts)} posts")
    print(f"  Saved to: {output_file}")

if __name__ == '__main__':
    main()
