#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read blog index
const blogIndex = JSON.parse(fs.readFileSync('blog_index.json', 'utf8'));

// Create blog directory if it doesn't exist
const blogDir = 'blog';
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
}

// Template for individual blog post pages
const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} - Cephalopod Studio</title>
    <link rel="stylesheet" href="../styles.css">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
    <header>
        <div class="logo-container">
            <img src="../assets/octopus.png" alt="Cephalopod Studio Logo" class="logo">
            <h1><a href="../index.html" class="header-link">Cephalopod Studio</a></h1>
        </div>
        <nav>
            <ul>
                <li><a href="../index.html">Projects</a></li>
                <li><a href="../blog.html" class="active">Blog</a></li>
                <li><a href="../contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article class="blog-post-content">
            <div id="post-loading">Loading post...</div>
            <div id="post-content" style="display: none;">
                <div class="post-meta">
                    <a href="../blog.html" class="back-link">← Back to Blog</a>
                    <time id="post-date"></time>
                </div>
                <h1 id="post-title"></h1>
                <div id="post-body" class="markdown-content"></div>
            </div>
            <div id="post-error" style="display: none;">
                <p>Error loading blog post.</p>
                <a href="../blog.html">Return to blog</a>
            </div>
        </article>
    </main>

    <footer>
        <p>&copy; 2025 Cephalopod Studio. All rights reserved.</p>
    </footer>

    <script>
        async function loadBlogPost() {
            try {
                const response = await fetch('../blog_posts/{{FILENAME}}');
                if (!response.ok) throw new Error('Post not found');

                const markdown = await response.text();

                // Parse frontmatter
                const frontmatterMatch = markdown.match(/^---\\s*\\n(.*?)\\n---\\s*\\n(.*)$/s);

                if (!frontmatterMatch) {
                    throw new Error('Invalid post format');
                }

                const frontmatterText = frontmatterMatch[1];
                let body = frontmatterMatch[2];

                // Fix indentation issues: remove leading spaces from markdown elements
                // but preserve relative indentation in code blocks
                const lines = body.split('\\n');
                let inCodeBlock = false;

                body = lines.map(line => {
                    const trimmed = line.trim();

                    // Track fenced code blocks
                    if (trimmed.startsWith('\`\`\`')) {
                        inCodeBlock = !inCodeBlock;
                        return trimmed;
                    }

                    // If we're in a fenced code block, preserve indentation
                    if (inCodeBlock) {
                        return line;
                    }

                    // For markdown elements (images, headers, lists, etc.), remove leading spaces
                    if (trimmed.startsWith('![')||  // Images
                        trimmed.startsWith('#') ||   // Headers
                        trimmed.startsWith('-') ||   // Lists
                        trimmed.startsWith('*') ||   // Lists/bold
                        trimmed.startsWith('>') ||   // Blockquotes
                        trimmed.startsWith('[')) {   // Links
                        return trimmed;
                    }

                    // For regular text, remove excessive indentation (keep max 3 spaces to avoid code block)
                    const leadingSpaces = line.match(/^(\\s*)/)[1].length;
                    if (leadingSpaces >= 4) {
                        return line.slice(leadingSpaces);
                    }

                    return line;
                }).join('\\n');

                // Parse frontmatter fields
                const frontmatter = {};
                frontmatterText.split('\\n').forEach(line => {
                    const match = line.match(/^(\\w+):\\s*"?(.+?)"?$/);
                    if (match) {
                        frontmatter[match[1]] = match[2].replace(/^"(.*)"$/, '$1');
                    }
                });

                // Update page
                document.getElementById('post-title').textContent = frontmatter.title || 'Untitled';
                document.title = \`\${frontmatter.title || 'Blog Post'} - Cephalopod Studio\`;

                if (frontmatter.date) {
                    const date = new Date(frontmatter.date);
                    document.getElementById('post-date').textContent = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    document.getElementById('post-date').setAttribute('datetime', frontmatter.date);
                }

                // Convert markdown to HTML
                let html = marked.parse(body);

                // Fix image paths: blog posts reference ../blog_assets/ which is correct from blog/ folder
                document.getElementById('post-body').innerHTML = html;

                // Show content
                document.getElementById('post-loading').style.display = 'none';
                document.getElementById('post-content').style.display = 'block';

            } catch (error) {
                console.error('Error loading post:', error);
                showError();
            }
        }

        function showError() {
            document.getElementById('post-loading').style.display = 'none';
            document.getElementById('post-error').style.display = 'block';
        }

        // Load post when page loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadBlogPost);
        } else {
            loadBlogPost();
        }
    </script>
</body>
</html>`;

// Generate a page for each blog post
blogIndex.forEach(post => {
    const filename = `${post.slug}.html`;
    const filepath = path.join(blogDir, filename);

    const pageContent = template
        .replace(/{{TITLE}}/g, post.title)
        .replace(/{{FILENAME}}/g, post.filename);

    fs.writeFileSync(filepath, pageContent);
    console.log(`Generated: ${filepath}`);
});

console.log(`\nSuccessfully generated ${blogIndex.length} blog post pages!`);
