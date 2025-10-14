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

    if (content.classList.contains('show')) {
        content.classList.remove('show');
        section.classList.remove('show');

        // Change button icon back to plus - ensure it always resets to plus
        if (button) {
            button.innerHTML = '<i class="fa-solid fa-plus"></i> Explore';
        }
    } else {
        content.classList.add('show');
        section.classList.add('show');

        // Change button icon to minus
        if (button) {
            button.innerHTML = '<i class="fa-solid fa-minus"></i> Close';
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

    init() {
        // Ensure all buttons exist and are styled correctly
        this.ensureButtonElements();

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
            // Visual feedback for all radio buttons - add green color
            document.querySelectorAll('#radio-btn, [title="Radio"]').forEach(btn => {
                if (btn && btn.style) {
                    btn.style.background = 'linear-gradient(145deg, #4CAF50, rgba(76,175,80,0.8))';
                    btn.style.border = '2px outset #4CAF50';
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
        // Hamburger menu - toggle section visibility on mobile
        const sectionHeaders = document.querySelectorAll('.section-header');

        // Hide all sections initially, then toggle them
        if (!window.mobileMenuExpanded) {
            sectionHeaders.forEach(header => {
                const section = header.closest('.content-section');
                const content = section.querySelector('.section-content');
                const toggle = header.querySelector('.section-toggle');

                if (content) {
                    content.classList.add('show');
                    section.classList.add('show');
                    if (toggle) {
                        toggle.innerHTML = '<i class="fa-solid fa-minus"></i> Close';
                    }
                }
            });
            window.mobileMenuExpanded = true;
        } else {
            sectionHeaders.forEach(header => {
                const section = header.closest('.content-section');
                const content = section.querySelector('.section-content');
                const toggle = header.querySelector('.section-toggle');

                if (content && toggle.innerHTML.includes('Close')) {
                    content.classList.remove('show');
                    section.classList.remove('show');
                    toggle.innerHTML = '<i class="fa-solid fa-plus"></i> Explore';
                }
            });
            window.mobileMenuExpanded = false;
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
                id: 'ki-section'
            },
            {
                title: 'Lō-Ki',
                content: 'The noise? Mute it. The hype? An illusion. This is where you trade performance for power.',
                id: 'loki-section'
            },
            {
                title: 'The Guide',
                content: 'The path? Unwritten. The map? Within. This is where you silence the outside voices.',
                id: 'guide-section'
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
