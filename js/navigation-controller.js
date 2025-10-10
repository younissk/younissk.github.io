class NavigationController {
  constructor() {
    this.currentSection = 'home';
    this.currentIndex = 0;
    this.sections = {};
    this.isInitialized = false;
    
    this.setupEventListeners();
    this.waitForComponents();
  }

  async waitForComponents() {
    // Wait for all custom elements to be defined and rendered
    await this.waitForCustomElements();
    this.initializeSections();
    this.isInitialized = true;
    this.updateCurrentSection();
  }

  async waitForCustomElements() {
    const customElements = ['mode-card', 'section-container', 'jupyter-project', 'jupyter-skill', 'jupyter-code-cell'];
    
    for (const elementName of customElements) {
      if (!customElements.get(elementName)) {
        await new Promise(resolve => {
          customElements.whenDefined(elementName).then(resolve);
        });
      }
    }
    
    // Wait a bit more for content to render
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  initializeSections() {
    // Initialize home section with mode cards
    const modeCards = Array.from(document.querySelectorAll('mode-card'));
    this.sections.home = {
      elements: modeCards,
      type: 'vertical',
      container: document.getElementById('home')
    };

    // Initialize section containers
    document.querySelectorAll('section-container').forEach(container => {
      const sectionId = container.getAttribute('section');
      if (sectionId) {
        // Wait for content to be rendered
        setTimeout(() => {
          const contentElements = Array.from(container.querySelectorAll('jupyter-project, jupyter-skill, jupyter-code-cell'));
          this.sections[sectionId] = {
            elements: contentElements,
            type: 'vertical',
            container: container
          };
        }, 200);
      }
    });
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    
    // Update current section on scroll with throttling
    let scrollTimeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (this.isInitialized) {
          this.updateCurrentSection();
        }
      }, 50);
    });

    // Re-initialize sections when content changes
    const observer = new MutationObserver(() => {
      if (this.isInitialized) {
        this.initializeSections();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  handleKeyPress(e) {
    if (!this.isInitialized) return;

    const currentContext = this.sections[this.currentSection];
    if (!currentContext || !currentContext.elements.length) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        this.navigate(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.navigate(1);
        break;
      case 'Enter':
        e.preventDefault();
        this.activateCurrentElement();
        break;
      case 'Escape':
        e.preventDefault();
        this.goToHome();
        break;
    }
  }

  navigate(direction) {
    const currentContext = this.sections[this.currentSection];
    if (!currentContext || !currentContext.elements.length) return;

    // Remove selection from current element
    this.updateElementSelection(currentContext.elements[this.currentIndex], false);

    // Calculate new index
    this.currentIndex = (this.currentIndex + direction + currentContext.elements.length) % currentContext.elements.length;

    // Add selection to new element
    this.updateElementSelection(currentContext.elements[this.currentIndex], true);
    this.scrollElementIntoView();
  }

  updateElementSelection(element, isSelected) {
    if (!element) return;
    
    if (element.tagName.toLowerCase() === 'mode-card') {
      element.setAttribute('selected', isSelected);
    } else {
      // Add visual selection to content elements
      element.classList.toggle('nav-selected', isSelected);
      
      // Add a subtle glow effect
      if (isSelected) {
        element.style.boxShadow = '0 0 20px rgba(76, 201, 240, 0.5)';
        element.style.transform = 'scale(1.02)';
      } else {
        element.style.boxShadow = '';
        element.style.transform = '';
      }
    }
  }

  scrollElementIntoView() {
    const element = this.sections[this.currentSection].elements[this.currentIndex];
    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }

  activateCurrentElement() {
    const currentContext = this.sections[this.currentSection];
    if (!currentContext) return;

    const element = currentContext.elements[this.currentIndex];
    if (!element) return;

    if (element.tagName.toLowerCase() === 'mode-card') {
      const href = element.getAttribute('href');
      if (href) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          // Update current section after scroll
          setTimeout(() => this.updateCurrentSection(), 500);
        }
      }
    } else {
      // For content elements, we could add click simulation or other interactions
      element.click();
    }
  }

  goToHome() {
    this.currentSection = 'home';
    this.currentIndex = 0;
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    
    // Update selection
    setTimeout(() => {
      const homeContext = this.sections.home;
      if (homeContext && homeContext.elements[0]) {
        this.updateElementSelection(homeContext.elements[0], true);
      }
    }, 500);
  }

  updateCurrentSection() {
    const sections = ['home', 'ml-ai', 'web-dev', 'education'];
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    for (const sectionId of sections) {
      const element = sectionId === 'home' 
        ? document.getElementById('home')
        : document.querySelector(`section-container[section="${sectionId}"]`);
      
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      
      if (scrollPosition >= absoluteTop && scrollPosition < absoluteTop + rect.height) {
        if (this.currentSection !== sectionId) {
          this.currentSection = sectionId;
          this.currentIndex = 0;
          
          // Update selection for new section
          const currentContext = this.sections[this.currentSection];
          if (currentContext && currentContext.elements.length > 0) {
            this.updateElementSelection(currentContext.elements[0], true);
          }
        }
        break;
      }
    }
  }
}

// Initialize the navigation controller
window.addEventListener('DOMContentLoaded', () => {
  window.navigationController = new NavigationController();
});