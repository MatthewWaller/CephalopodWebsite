#!/usr/bin/env python3
"""
Clean up WordPress caption shortcodes and other formatting issues in blog posts.
"""

import os
import re

def clean_wordpress_content(content):
    """Clean up WordPress-specific formatting issues."""
    # Remove WordPress caption shortcodes but keep the image
    # Pattern: [caption ...]![alt](url) caption text [/caption]
    content = re.sub(
        r'\[caption[^\]]*\](!\[[^\]]*\]\([^)]+\))[^\[]*\[/caption\]',
        r'\1',
        content
    )

    # Remove any remaining caption tags
    content = re.sub(r'\[/?caption[^\]]*\]', '', content)

    # Clean up excessive whitespace
    content = re.sub(r'\n{3,}', '\n\n', content)

    # Clean up empty lines with just spaces
    content = re.sub(r'\n\s+\n', '\n\n', content)

    return content

def main():
    blog_dir = '/Users/matthewwaller/Developer/CephalopodWebsite/blog_posts'

    count = 0
    for filename in os.listdir(blog_dir):
        if not filename.endswith('.md'):
            continue

        filepath = os.path.join(blog_dir, filename)

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if it has caption shortcodes
        if '[caption' in content or '[/caption]' in content:
            cleaned = clean_wordpress_content(content)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned)

            count += 1
            print(f"✓ Cleaned: {filename}")

    print(f"\n✅ Cleaned {count} blog posts")

if __name__ == '__main__':
    main()
