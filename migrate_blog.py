#!/usr/bin/env python3
"""
Script to migrate blog posts from WordPress XML export to Markdown files.
Downloads images and videos, converts HTML to Markdown.
"""

import xml.etree.ElementTree as ET
import re
import os
import urllib.request
import urllib.parse
from html.parser import HTMLParser
from datetime import datetime
import hashlib
import json
import html

class HTMLToMarkdown(HTMLParser):
    """Convert HTML to Markdown format."""

    def __init__(self):
        super().__init__()
        self.markdown = []
        self.current_tag = []
        self.list_stack = []
        self.link_url = None
        self.image_data = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        if tag == 'p':
            self.current_tag.append('p')
        elif tag == 'strong' or tag == 'b':
            self.markdown.append('**')
        elif tag == 'em' or tag == 'i':
            self.markdown.append('*')
        elif tag == 'a':
            self.link_url = attrs_dict.get('href', '')
            self.markdown.append('[')
        elif tag == 'img':
            src = attrs_dict.get('src', '')
            alt = attrs_dict.get('alt', 'image')
            self.image_data.append({'src': src, 'alt': alt})
            self.markdown.append(f'![{alt}]({src})')
        elif tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            level = int(tag[1])
            self.markdown.append('\n' + '#' * level + ' ')
            self.current_tag.append(tag)
        elif tag == 'br':
            self.markdown.append('\n')
        elif tag == 'ul':
            self.list_stack.append('ul')
            if len(self.markdown) > 0 and self.markdown[-1] != '\n':
                self.markdown.append('\n')
        elif tag == 'ol':
            self.list_stack.append('ol')
            if len(self.markdown) > 0 and self.markdown[-1] != '\n':
                self.markdown.append('\n')
        elif tag == 'li':
            if self.list_stack:
                if self.list_stack[-1] == 'ul':
                    self.markdown.append('- ')
                else:
                    self.markdown.append('1. ')
        elif tag == 'code':
            self.markdown.append('`')
        elif tag == 'pre':
            self.markdown.append('\n```\n')
        elif tag == 'blockquote':
            self.markdown.append('\n> ')
        elif tag == 'video':
            src = attrs_dict.get('src', '')
            if src:
                self.image_data.append({'src': src, 'alt': 'video', 'type': 'video'})
                self.markdown.append(f'\n[Video: {src}]\n')

    def handle_endtag(self, tag):
        if tag == 'p':
            if 'p' in self.current_tag:
                self.current_tag.remove('p')
            self.markdown.append('\n\n')
        elif tag == 'strong' or tag == 'b':
            self.markdown.append('**')
        elif tag == 'em' or tag == 'i':
            self.markdown.append('*')
        elif tag == 'a':
            if self.link_url:
                self.markdown.append(f']({self.link_url})')
                self.link_url = None
        elif tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            if tag in self.current_tag:
                self.current_tag.remove(tag)
            self.markdown.append('\n\n')
        elif tag == 'ul' or tag == 'ol':
            if self.list_stack:
                self.list_stack.pop()
            self.markdown.append('\n')
        elif tag == 'li':
            self.markdown.append('\n')
        elif tag == 'code':
            self.markdown.append('`')
        elif tag == 'pre':
            self.markdown.append('\n```\n')

    def handle_data(self, data):
        self.markdown.append(data)

    def get_markdown(self):
        result = ''.join(self.markdown)
        # Clean up multiple newlines
        result = re.sub(r'\n{3,}', '\n\n', result)
        return result.strip()

    def get_images(self):
        return self.image_data


def sanitize_filename(title):
    """Convert title to safe filename."""
    # Remove special characters and replace spaces with underscores
    filename = re.sub(r'[^\w\s-]', '', title.lower())
    filename = re.sub(r'[-\s]+', '_', filename)
    return filename[:100]  # Limit length


def download_file(url, dest_path):
    """Download a file from URL to destination path."""
    try:
        # Add headers to mimic a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)

        with urllib.request.urlopen(req, timeout=30) as response:
            with open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
        return True
    except Exception as e:
        print(f"  ⚠️  Failed to download {url}: {e}")
        return False


def extract_media_urls(content):
    """Extract image and video URLs from content."""
    media = {'images': [], 'videos': []}

    # Find image URLs
    img_pattern = r'<img[^>]+src=["\']([^"\']+)["\']'
    images = re.findall(img_pattern, content, re.IGNORECASE)
    media['images'].extend(images)

    # Find video URLs
    video_pattern = r'<video[^>]+src=["\']([^"\']+)["\']'
    videos = re.findall(video_pattern, content, re.IGNORECASE)
    media['videos'].extend(videos)

    # Find source tags (for video)
    source_pattern = r'<source[^>]+src=["\']([^"\']+)["\']'
    sources = re.findall(source_pattern, content, re.IGNORECASE)
    for src in sources:
        if any(ext in src.lower() for ext in ['.mp4', '.webm', '.mov', '.avi']):
            media['videos'].append(src)

    # Extract Squarespace native videos from data-config-video JSON
    # Note: These videos may not be downloadable if they're no longer hosted
    sqsp_video_pattern = r'data-config-video="([^"]+)"'
    sqsp_videos = re.findall(sqsp_video_pattern, content, re.IGNORECASE)

    for encoded_json in sqsp_videos:
        try:
            # Decode HTML entities
            decoded = html.unescape(encoded_json)
            video_data = json.loads(decoded)

            # Extract alexandriaUrl - this is the base URL pattern
            if 'alexandriaUrl' in video_data:
                base_url = video_data['alexandriaUrl']
                # Get the variants (different resolutions)
                variants = video_data.get('systemDataVariants', '').split(',')

                # Use the highest quality variant (first one is usually highest)
                if variants and variants[0]:
                    # Squarespace videos might be at the base URL without variant,
                    # or with just the width part of the variant
                    variant_full = variants[0].strip()  # e.g., "1080:1562"

                    # Try different URL patterns
                    # Pattern 1: Just the base without variant placeholder
                    if '{variant}' in base_url:
                        # Try with full variant
                        video_url = base_url.replace('{variant}', variant_full)
                        media['videos'].append(video_url)

                        # Also try with just the width
                        variant_width = variant_full.split(':')[0]
                        video_url_alt = base_url.replace('{variant}', variant_width)
                        if video_url_alt != video_url:
                            media['videos'].append(video_url_alt)
                    else:
                        media['videos'].append(base_url)

                    print(f"  Found Squarespace video: {video_data.get('filename', 'unknown')} (may not be downloadable)")
        except (json.JSONDecodeError, KeyError) as e:
            print(f"  ⚠️  Failed to parse Squarespace video data: {e}")
            continue

    # Extract YouTube embeds
    youtube_patterns = [
        r'youtube\.com/embed/([a-zA-Z0-9_-]+)',
        r'youtube\.com/watch\?v=([a-zA-Z0-9_-]+)',
        r'youtu\.be/([a-zA-Z0-9_-]+)'
    ]

    for pattern in youtube_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        for video_id in matches:
            youtube_url = f'https://www.youtube.com/watch?v={video_id}'
            if youtube_url not in media['videos']:
                media['videos'].append(f'YOUTUBE:{video_id}')  # Mark as YouTube embed
                print(f"  Found YouTube video: {video_id}")

    return media


def parse_wordpress_xml(xml_file):
    """Parse WordPress XML export and extract blog posts."""
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # WordPress namespace
    namespaces = {
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'wp': 'http://wordpress.org/export/1.2/',
        'dc': 'http://purl.org/dc/elements/1.1/'
    }

    posts = []

    for item in root.findall('.//item'):
        # Extract basic info
        title_elem = item.find('title')
        title = title_elem.text if title_elem is not None and title_elem.text else 'Untitled'

        link_elem = item.find('link')
        link = link_elem.text if link_elem is not None and link_elem.text else ''

        pub_date_elem = item.find('pubDate')
        pub_date = pub_date_elem.text if pub_date_elem is not None else ''

        # Extract content
        content_elem = item.find('content:encoded', namespaces)
        content = content_elem.text if content_elem is not None and content_elem.text else ''

        # Extract post type
        post_type_elem = item.find('wp:post_type', namespaces)
        post_type = post_type_elem.text if post_type_elem is not None else ''

        # Extract status
        status_elem = item.find('wp:status', namespaces)
        status = status_elem.text if status_elem is not None else ''

        # Only process published posts (not pages or drafts)
        if post_type == 'post' and status == 'publish' and content.strip():
            posts.append({
                'title': title,
                'link': link,
                'date': pub_date,
                'content': content
            })

    return posts


def main():
    xml_file = '/Users/matthewwaller/Developer/CephalopodWebsite/Squarespace-Wordpress-Export-07-19-2025.xml'
    blog_dir = '/Users/matthewwaller/Developer/CephalopodWebsite/blog_posts'
    assets_dir = '/Users/matthewwaller/Developer/CephalopodWebsite/blog_assets'

    # Create directories
    os.makedirs(blog_dir, exist_ok=True)
    os.makedirs(assets_dir, exist_ok=True)

    print("📚 Parsing WordPress XML export...")
    posts = parse_wordpress_xml(xml_file)
    print(f"✓ Found {len(posts)} blog posts\n")

    for i, post in enumerate(posts, 1):
        print(f"[{i}/{len(posts)}] Processing: {post['title']}")

        # Create safe filename
        filename = sanitize_filename(post['title'])
        post_slug = filename

        # Parse date
        try:
            date_obj = datetime.strptime(post['date'], '%a, %d %b %Y %H:%M:%S %z')
            date_str = date_obj.strftime('%Y-%m-%d')
        except:
            date_str = '2020-01-01'

        # Extract and download media
        media = extract_media_urls(post['content'])
        downloaded_images = {}
        downloaded_videos = {}

        # Download images
        for img_url in media['images']:
            # Create unique filename based on URL
            url_hash = hashlib.md5(img_url.encode()).hexdigest()[:8]
            ext = os.path.splitext(urllib.parse.urlparse(img_url).path)[1] or '.jpg'
            img_filename = f"{post_slug}_{url_hash}{ext}"
            img_path = os.path.join(assets_dir, img_filename)

            if download_file(img_url, img_path):
                print(f"  ✓ Downloaded image: {img_filename}")
                downloaded_images[img_url] = f"../blog_assets/{img_filename}"
            else:
                downloaded_images[img_url] = img_url  # Keep original URL if download fails

        # Download videos (or convert YouTube embeds)
        for video_url in media['videos']:
            # Handle YouTube embeds specially
            if video_url.startswith('YOUTUBE:'):
                video_id = video_url.replace('YOUTUBE:', '')
                # Create markdown-friendly YouTube embed
                youtube_embed = f'[Watch on YouTube](https://www.youtube.com/watch?v={video_id})'
                # We don't actually replace this here; we'll add it to markdown later
                print(f"  ✓ Found YouTube embed: {video_id}")
                continue

            # Try to download regular video files
            url_hash = hashlib.md5(video_url.encode()).hexdigest()[:8]
            ext = os.path.splitext(urllib.parse.urlparse(video_url).path)[1] or '.mp4'
            video_filename = f"{post_slug}_{url_hash}{ext}"
            video_path = os.path.join(assets_dir, video_filename)

            if download_file(video_url, video_path):
                print(f"  ✓ Downloaded video: {video_filename}")
                downloaded_videos[video_url] = f"../blog_assets/{video_filename}"
            else:
                # Keep the URL in markdown as a link instead
                downloaded_videos[video_url] = video_url

        # Convert HTML to Markdown
        content = post['content']

        # Replace downloaded media URLs with local paths
        for old_url, new_path in downloaded_images.items():
            content = content.replace(old_url, new_path)
        for old_url, new_path in downloaded_videos.items():
            content = content.replace(old_url, new_path)

        parser = HTMLToMarkdown()
        parser.feed(content)
        markdown_content = parser.get_markdown()

        # Create markdown file with frontmatter
        md_filename = f"{filename}.md"
        md_path = os.path.join(blog_dir, md_filename)

        with open(md_path, 'w', encoding='utf-8') as f:
            f.write('---\n')
            f.write(f'title: "{post["title"]}"\n')
            f.write(f'date: {date_str}\n')
            f.write(f'slug: {post_slug}\n')
            f.write('---\n\n')
            f.write(markdown_content)

        print(f"  ✓ Created: {md_filename}\n")

    print(f"\n✅ Migration complete!")
    print(f"   Blog posts: {blog_dir}")
    print(f"   Assets: {assets_dir}")


if __name__ == '__main__':
    main()
