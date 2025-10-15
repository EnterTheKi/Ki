// Kiazaki Script - Interactive Functionality

// Smooth scrolling functionality
function scrollToSection(target) {
    // Remove the hash symbol if present
    target = target.replace('#', '');

    // Find the target element
    const element = document.getElementById(target) || document.querySelector('[data-section="' + target + '"]');

    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Update URL without triggering page reload
        history.replaceState(null, null, '#' + target);
    } else {
        console.warn(`Section "${target}" not found`);
    }
}

// Section Toggle Functionality (Daliwali-style expandable sections)
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const content = document.getElementById(`${sectionId}-content`);

    if (!section || !content) {
        console.warn(`Section or content not found for ID: ${sectionId}`);
        return;
    }

    const button = section.querySelector('.section-toggle');

    // Use dataset to track state instead of checking innerHTML
    const isExpanded = content.classList.contains('show');

    if (isExpanded) {
        // Close section
        content.classList.remove('show');
        section.classList.remove('show');
        if (button) {
            button.innerHTML = '<i class="fa-solid fa-plus"></i> Explore';
            button.dataset.expanded = 'false';
        }
    } else {
        // Open section
        content.classList.add('show');
        section.classList.add('show');
        if (button) {
            button.innerHTML = '<i class="fa-solid fa-minus"></i> Close';
            button.dataset.expanded = 'true';
        }
    }
}

// Widget Control Functionality
class WidgetController {
    constructor() {
        this.searchModal = document.getElementById('search-modal');
        this.radioPlayer = document.getElementById('radio-player');
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');

        this.init();
    }

    ensureButtonElements() {
        // Add missing IDs to buttons if they don't exist
        const searchBtn = document.querySelector('header .control-btn[title="Search"]');
        const radioBtn = document.querySelector('header .control-btn[title="Radio"]');
        const menuBtn = document.querySelector('header .control-btn[title="Menu"]');

        if (searchBtn && !searchBtn.id) {
            searchBtn.id = 'search-btn';
        }
        if (radioBtn && !radioBtn.id) {
            radioBtn.id = 'radio-btn';
        }
        if (menuBtn && !menuBtn.id) {
            menuBtn.id = 'menu-btn';
        }
    }

    initializeSearchModal() {
        // Create search modal if it doesn't exist
        if (!this.searchModal) {
            const modal = document.createElement('div');
            modal.id = 'search-modal';
            modal.className = 'modal-overlay hidden';
            modal.innerHTML = `
                <div class="modal-content">
                    <input type="search" id="search-input" placeholder="Search..." />
                    <div id="search-results"></div>
                </div>
            `;
            document.body.appendChild(modal);
            this.searchModal = modal;
            this.searchInput = modal.querySelector('#search-input');
            this.searchResults = modal.querySelector('#search-results');
        }
    }

    ensureRadioPlayer() {
        // Create radio player if it doesn't exist
        if (!this.radioPlayer) {
            const audio = document.createElement('audio');
            audio.id = 'radio-player';
            audio.preload = 'none';
            const source = document.createElement('source');
            source.src = 'https://ice.somafm.com/dronezone-128-mp3';
            source.type = 'audio/mpeg';
            audio.appendChild(source);
            document.body.appendChild(audio);
            this.radioPlayer = audio;
        }
    }

    init() {
        // Ensure buttons, modal and radio player exist
        this.ensureButtonElements();
        this.initializeSearchModal();
        this.ensureRadioPlayer();

        // Initialize 1930s vibe animations after a delay
        setTimeout(() => {
            this.initialize1930sAnimations();
        }, 100);

        // Header search button
        const headerSearchBtn = document.querySelector('header .control-btn[title="Search"]');
        if (headerSearchBtn) {
            headerSearchBtn.removeEventListener('click', headerSearchBtn._searchHandler);
            headerSearchBtn._searchHandler = () => this.toggleSearch();
            headerSearchBtn.addEventListener('click', headerSearchBtn._searchHandler);
        }

        // Header radio button
        const headerRadioBtn = document.querySelector('header .control-btn[title="Radio"]');
        if (headerRadioBtn) {
            headerRadioBtn.removeEventListener('click', headerRadioBtn._radioHandler);
            headerRadioBtn._radioHandler = () => this.toggleRadio();
            headerRadioBtn.addEventListener('click', headerRadioBtn._radioHandler);
        }

        // Header menu button
        const headerMenuBtn = document.querySelector('header .control-btn[title="Menu"]');
        if (headerMenuBtn) {
            headerMenuBtn.removeEventListener('click', headerMenuBtn._menuHandler);
            headerMenuBtn._menuHandler = () => this.toggleMenu();
            headerMenuBtn.addEventListener('click', headerMenuBtn._menuHandler);
        }

        // Search input functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }

        // Close modal on outside click
        if (this.searchModal) {
            this.searchModal.addEventListener('click', (e) => {
                if (e.target === this.searchModal) {
                    this.closeSearch();
                }
            });
        }

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
            }
        });
    }

    toggleSearch() {
        if (this.searchModal.classList.contains('hidden')) {
            this.searchModal.classList.remove('hidden');
            if (this.searchInput) this.searchInput.focus();
        } else {
            this.closeSearch();
        }
    }

    closeSearch() {
        this.searchModal.classList.add('hidden');
        if (this.searchResults) this.searchResults.innerHTML = '';
    }

    toggleRadio() {
        if (this.radioPlayer.paused) {
            this.radioPlayer.play().catch(e => console.error('Radio play failed:', e));
            // Visual feedback for all radio buttons - add muted vintage teal color
            document.querySelectorAll('#radio-btn, [title="Radio"]').forEach(btn => {
                if (btn && btn.style) {
                    btn.style.background = 'linear-gradient(145deg, #3a5f7a, rgba(58,95,122,0.8))';
                    btn.style.border = '2px outset #3a5f7a';
                }
            });
        } else {
            this.radioPlayer.pause();
            // Reset visual feedback for all radio buttons
            document.querySelectorAll('#radio-btn, [title="Radio"]').forEach(btn => {
                if (btn && btn.style) {
                    btn.style.background = 'linear-gradient(145deg, var(--c-bg-dark), rgba(0,0,0,0.9))';
                    btn.style.border = '2px outset var(--c-dimmer)';
                }
            });
        }
    }

    toggleMenu() {
        // Hamburger menu - toggle navigation/sidebar visibility and expand all expandable sections on mobile
        const sidebar = document.querySelector('.sidebar-right');

        if (sidebar) {
            // Check if we're on mobile (sidebar is after content)
            const isMobile = window.getComputedStyle(sidebar).order !== '1';

            if (isMobile) {
                // On mobile, toggle sidebar visibility and expand sections
                const sectionHeaders = document.querySelectorAll('.section-header');

                if (!window.mobileMenuExpanded) {
                    // First show the sidebar
                    sidebar.style.display = 'block';

                    // Then expand all expandable sections (but don't change their individual button state)
                    sectionHeaders.forEach(header => {
                        const section = header.closest('.content-section');
                        const content = section.querySelector('.section-content');

                        if (content) {
                            content.classList.add('show');
                            section.classList.add('show');
                        }
                    });

                    window.mobileMenuExpanded = true;

                    // Visual feedback for menu button - muted vintage teal when expanded
                    const menuBtn = document.querySelector('#menu-btn, [title="Menu"]');
                    if (menuBtn && menuBtn.style) {
                        menuBtn.style.background = 'linear-gradient(145deg, #3a5f7a, rgba(58,95,122,0.8))';
                        menuBtn.style.border = '2px outset #3a5f7a';
                    }
                } else {
                    // Collapse only sections that were expanded by menu toggle
                    sectionHeaders.forEach(header => {
                        const section = header.closest('.content-section');
                        const content = section.querySelector('.section-content');
                        const toggle = header.querySelector('.section-toggle');

                        // Only collapse if section is expanded and button state is not individually set
                        if (content && content.classList.contains('show') && toggle.dataset.expanded !== 'true') {
                            content.classList.remove('show');
                            section.classList.remove('show');
                        }
                    });

                    // Then hide the sidebar
                    sidebar.style.display = 'none';

                    window.mobileMenuExpanded = false;

                    // Reset visual feedback for menu button
                    const menuBtn = document.querySelector('#menu-btn, [title="Menu"]');
                    if (menuBtn && menuBtn.style) {
                        menuBtn.style.background = 'linear-gradient(145deg, var(--c-bg-dark), rgba(0,0,0,0.9))';
                        menuBtn.style.border = '2px outset var(--c-dimmer)';
                    }
                }
            } else {
                // On desktop, use original hamburger behavior
                const sectionHeaders = document.querySelectorAll('.section-header');

                if (!window.mobileMenuExpanded) {
                    sectionHeaders.forEach(header => {
                        const section = header.closest('.content-section');
                        const content = section.querySelector('.section-content');

                        if (content) {
                            content.classList.add('show');
                            section.classList.add('show');
                        }
                    });
                    window.mobileMenuExpanded = true;
                } else {
                    sectionHeaders.forEach(header => {
                        const section = header.closest('.content-section');
                        const content = section.querySelector('.section-content');

                        // Only collapse sections that were expanded by menu toggle
                        if (content && content.classList.contains('show')) {
                            content.classList.remove('show');
                            section.classList.remove('show');
                        }
                    });
                    window.mobileMenuExpanded = false;
                }
            }
        }
    }

    performSearch(query) {
        if (!query.trim()) {
            this.searchResults.innerHTML = '';
            return;
        }

        const sections = [
            {
                title: 'Ki — Unknown',
                content: 'The past is dead. Your old self? Gone. This is where you shed what you held back—the doubts, the toxic ties, the version of you that settled for less.',
                id: 'blog-section'
            },
            {
                title: 'Lō-Ki',
                content: 'The noise? Mute it. The hype? An illusion. This is where you trade performance for power.',
                id: 'blog-section'
            },
            {
                title: 'The Guide',
                content: 'The path? Unwritten. The map? Within. This is where you silence the outside voices.',
                id: 'blog-section'
            },
            {
                title: 'Visual Work',
                content: 'A collection of visual narratives that capture the essence of the Ki realm.',
                id: 'visual-section'
            }
        ];

        const results = sections.filter(section =>
            section.title.toLowerCase().includes(query.toLowerCase()) ||
            section.content.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length > 0) {
            this.searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" onclick="toggleSection('${result.id}')">
                    <h4>${result.title}</h4>
                    <p>${result.content.substring(0, 100)}...</p>
                </div>
            `).join('');
        } else {
            this.searchResults.innerHTML = '<p>No results found</p>';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WidgetController();

    // Make toggleSection available globally
    window.toggleSection = toggleSection;

    // Animate sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    // Observe all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });
});
