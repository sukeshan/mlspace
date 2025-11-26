document.addEventListener('DOMContentLoaded', () => {
    // Character-level glow effect (single char)
    document.querySelectorAll('.glow-text').forEach(el => {
        // Normalize whitespace: replace newlines and multiple spaces with a single space
        const text = el.textContent.replace(/\s+/g, ' ').trim();
        el.innerHTML = text.split('').map(char => {
            return char === ' ' ? ' ' : `<span>${char}</span>`;
        }).join('');
    });

    // Word-level glow effect
    document.querySelectorAll('.glow-text-word').forEach(el => {
        const text = el.textContent.trim();
        // Split by spaces
        const words = text.split(/\s+/);
        el.innerHTML = words.map(word => {
            return `<span>${word}</span>`;
        }).join(' '); // Join with space
    });

    // --- Blog Logic ---

    const blogData = [
        {
            title: "Why Do We Need √D_k?",
            category: "NLP",
            description: "Uncover the math behind the magic number. Why dividing by the square root of the dimension saves your gradients from vanishing.",
            url: "blog/sqrt-dk.html",
            date: "Nov 22 2025"
        },
        {
            title: "Smart Batching: Train Faster, Waste Less",
            category: "NLP",
            description: "Skip the padding tax. Learn how dynamic batching and uniform length strategies can 2x your training speed without sacrificing accuracy.",
            url: "blog/smart-batching.html",
            date: "Feb 03 2025"
        },
        {
            title: "The Tokenizer Trap: Optimizing the Unseen",
            category: "NLP",
            description: "Uncover the hidden trade-offs in tokenizer design. Learn how fertility, compression, and vocabulary size silently impact your model's performance.",
            url: "blog/tokenization.html",
            date: "Jan 02 2025"
        },
        {
            title: "Identifying Tablet Purpose",
            category: "Computer Vision",
            description: "Using spatial information and OCR to identify drug names and their purposes from images.",
            url: "blog/drug-identification.html",
            date: "Nov 23 2022"
        },
        {
            title: "Food Recipe Retrieval",
            category: "NLP",
            description: "Building a search engine to find recipes based on ingredients using embedding-based and graph-based techniques.",
            url: "blog/food-recipe.html",
            date: "Oct 30 2022"
        }
    ];

    // Group blogs by category
    const clusters = blogData.reduce((acc, blog) => {
        if (!acc[blog.category]) {
            acc[blog.category] = [];
        }
        acc[blog.category].push(blog);
        return acc;
    }, {});

    const clusterContainer = document.getElementById('cluster-container');
    const modal = document.getElementById('blog-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBlogList = document.getElementById('modal-blog-list');
    const closeModal = document.querySelector('.close-modal');

    // Render Clusters
    if (clusterContainer) {
        for (const [category, blogs] of Object.entries(clusters)) {
            const clusterCard = document.createElement('div');
            clusterCard.className = 'blog-card cluster-card reveal'; // Add reveal class
            clusterCard.innerHTML = `
                <span class="blog-meta">Cluster</span>
                <h3>${category}</h3>
                <p>${blogs.length} Post${blogs.length > 1 ? 's' : ''}</p>
            `;

            clusterCard.addEventListener('click', () => {
                openModal(category, blogs);
            });

            clusterContainer.appendChild(clusterCard);
        }
    }

    // Scroll Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Open Cluster Modal
    function openModal(category, blogs) {
        modalTitle.textContent = category;
        modalBlogList.innerHTML = '';

        // Sort blogs by date (newest first)
        const sortedBlogs = [...blogs].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // Descending order (newest first)
        });

        sortedBlogs.forEach((blog, index) => {
            const blogItem = document.createElement('a'); // Changed to <a>
            blogItem.href = blog.url; // Set href
            blogItem.target = "_blank"; // Open in new tab
            blogItem.className = 'blog-card modal-blog-card stagger-item';
            blogItem.style.textDecoration = 'none'; // Ensure no underline
            blogItem.style.animationDelay = `${index * 100}ms`;

            blogItem.innerHTML = `
                <span class="blog-meta">${blog.date || ''}</span>
                <h3>${blog.title}</h3>
                <p>${blog.description}</p>
            `;

            modalBlogList.appendChild(blogItem);
        });

        modal.style.display = 'flex';
        void modal.offsetWidth;
        modal.classList.add('show');
    }

    // Close Cluster Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeModalFunc(modal);
        });
    }

    // Generic Close Modal
    function closeModalFunc(modalElement) {
        modalElement.classList.remove('show');
        setTimeout(() => {
            modalElement.style.display = 'none';
        }, 300);
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc(modal);
        }
    });
    // --- Background Animation (Codex ASCII Wave Pattern) ---
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        let width, height;
        let time = 0;

        // ASCII characters sorted by visual density (light to heavy)
        const chars = [' ', '.', ':', '-', '=', '+', '*', '#', '@'];

        // Grid configuration
        const fontSize = 12;
        const charWidth = 8;
        const lineHeight = 14;
        const waveSpeed = 0.015;

        // Ripple storage
        const ripples = [];
        const maxRipples = 10;
        const rippleSpeed = 4;
        const rippleMaxRadius = 500;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        resize();
        window.addEventListener('resize', resize);

        // Add ripple on click
        document.addEventListener('click', (e) => {
            // Don't create ripple if clicking on interactive elements
            if (e.target.closest('a, button, .blog-card, .modal, nav, .nav-links')) {
                return;
            }

            ripples.push({
                x: e.clientX,
                y: e.clientY,
                radius: 0,
                strength: 1
            });

            // Limit number of ripples
            if (ripples.length > maxRipples) {
                ripples.shift();
            }
        });

        function draw() {
            time += 1;

            // Update ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                ripples[i].radius += rippleSpeed;
                ripples[i].strength = 1 - (ripples[i].radius / rippleMaxRadius);

                // Remove faded ripples
                if (ripples[i].radius > rippleMaxRadius) {
                    ripples.splice(i, 1);
                }
            }

            // Clear canvas with deep dark background
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px monospace`;
            ctx.textBaseline = 'top';

            // Calculate grid dimensions
            const cols = Math.ceil(width / charWidth) + 1;
            const rows = Math.ceil(height / lineHeight) + 1;

            // Draw ASCII wave pattern
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * charWidth;
                    const y = row * lineHeight;

                    // Multiple overlapping sine waves for complex pattern
                    const wave1 = Math.sin((col * 0.05) + (row * 0.1) + (time * waveSpeed));
                    const wave2 = Math.sin((col * 0.08) - (row * 0.05) + (time * waveSpeed * 0.7));
                    const wave3 = Math.sin((col * 0.03) + (row * 0.15) - (time * waveSpeed * 1.2));

                    // Calculate ripple effect
                    let rippleEffect = 0;
                    for (const ripple of ripples) {
                        const dx = x - ripple.x;
                        const dy = y - ripple.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // Create concentric wave rings
                        const rippleWave = Math.sin((distance - ripple.radius) * 0.1);
                        const falloff = Math.max(0, 1 - Math.abs(distance - ripple.radius) / 80);
                        rippleEffect += rippleWave * falloff * ripple.strength;
                    }

                    // Combine waves with ripple
                    const combinedWave = (wave1 + wave2 + wave3) / 3 + rippleEffect * 0.5;
                    const normalizedValue = Math.max(0, Math.min(1, (combinedWave + 1) / 2));

                    // Select character based on wave value
                    const charIndex = Math.floor(normalizedValue * (chars.length - 1));
                    const char = chars[charIndex];

                    // Opacity based on wave intensity
                    const opacity = 0.15 + normalizedValue * 0.35;

                    ctx.fillStyle = `rgba(160, 160, 170, ${opacity})`;
                    ctx.fillText(char, x, y);
                }
            }

            requestAnimationFrame(draw);
        }

        draw();
    }
});
