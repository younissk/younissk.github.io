// js/mode-card.js
class ModeCard extends HTMLElement {
  constructor() {
    super();
    this.title = this.getAttribute("title") || "Default";
    this.icon = this.getAttribute("icon") || "https://via.placeholder.com/150";
    this.href = this.getAttribute("href") || "/";
    this.color = this.getAttribute("color") || "white";
    this.render();
  }

  render() {
    const neonColor = this.color.includes('red') ? 'var(--neon-red)' : 
                      this.color.includes('blue') ? 'var(--neon-blue)' : 
                      'var(--neon-green)';
    
    // Detect external links (starting with http:// or https://)
    const isExternal = this.href.startsWith('http://') || this.href.startsWith('https://');
    const linkAttributes = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
    
    this.innerHTML = `
      <a href="${this.href}" ${linkAttributes}
        class="group grid grid-cols-[60px_1fr] bg-[var(--crt-background)] items-center p-5 gap-5 mx-auto arcade-border relative overflow-hidden transition-all duration-300 hover:scale-105"
        style="border-color: ${neonColor}; box-shadow: 0 0 5px ${neonColor}, inset 0 0 5px ${neonColor}"
        onmouseover="this.style.boxShadow = '0 0 15px ${neonColor}, inset 0 0 10px ${neonColor}'"
        onmouseout="this.style.boxShadow = '0 0 5px ${neonColor}, inset 0 0 5px ${neonColor}'"
      >
        <div class="absolute inset-0 bg-black opacity-50 group-hover:opacity-30 transition-opacity"></div>
        <img src="${this.icon}" alt="${this.title}" class="w-10 h-10 justify-self-center relative z-10 group-hover:scale-110 transition-transform" />
        <h2 class="text-3xl text-left truncate tracking-wider arcade-text relative z-10" style="color: ${neonColor}">${this.title}</h2>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 blur transition-opacity" style="color: ${neonColor}"></div>
      </a>
      `;
  }
}

// Register the component
customElements.define("mode-card", ModeCard);
