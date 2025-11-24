// Load and display blog posts
async function loadBlogPosts() {
    try {
        const response = await fetch('blog_index.json');
        const posts = await response.json();

        const container = document.getElementById('blog-posts');

        if (!posts || posts.length === 0) {
            container.innerHTML = '<p>No blog posts yet.</p>';
            return;
        }

        container.innerHTML = posts.map(post => {
            // Fix image path - convert ../blog_assets/ to blog_assets/
            const imagePath = post.image ? post.image.replace('../blog_assets/', 'blog_assets/') : null;

            return `
            <article class="blog-post-card">
                ${imagePath ? `
                    <a href="blog/${post.slug}" class="blog-post-image">
                        <img src="${imagePath}" alt="${post.title}" loading="lazy">
                    </a>
                ` : ''}
                <div class="blog-post-text">
                    <div class="blog-post-meta">
                        <time datetime="${post.date}">${formatDate(post.date)}</time>
                    </div>
                    <h3><a href="blog/${post.slug}">${post.title}</a></h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="blog/${post.slug}" class="read-more">Read more →</a>
                </div>
            </article>
        `;
        }).join('');

    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('blog-posts').innerHTML = '<p>Error loading blog posts.</p>';
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Load posts when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogPosts);
} else {
    loadBlogPosts();
}
