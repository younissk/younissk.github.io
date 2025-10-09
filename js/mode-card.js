// js/mode-card.js
class ModeCard extends HTMLElement {
  constructor() {
    super();
    this.title = this.getAttribute("title") || "Default";
    this.icon = this.getAttribute("icon") || "https://via.placeholder.com/150";
    this.href = this.getAttribute("href") || "/";
    this.color = this.getAttribute("color") || "white";
    this.className = this.getAttribute("class") || "";
    this.render();
  }

  render() {
    this.innerHTML = `
      <a href="${this.href}"
        class="grid grid-cols-[60px_1fr] items-center p-6 border-arcade gap-6 max-w-lg mx-auto cursor-pointer ${this.className}"
        style="border-color: ${this.getColorValue()};"
      >
        <div class="relative">
          <img src="${this.icon}" alt="${this.title}" class="w-12 h-12 justify-self-center transition-transform duration-300 hover:scale-110" />
          <div class="absolute inset-0 bg-current opacity-20 blur-sm animate-pulse"></div>
        </div>
        <h2 class="text-3xl text-left truncate font-bold drop-shadow-lg animate-pulse"
            style="color: ${this.getColorValue()}; text-shadow: 0 0 10px ${this.getColorValue()};">
          ${this.title}
        </h2>
      </a>
      `;
  }

  getColorValue() {
    const colorMap = {
      'red-400': '#f87171',
      'cyan-400': '#22d3ee',
      'green-400': '#4ade80',
      'red-300': '#fca5a5',
      'blue-300': '#93c5fd',
      'green-300': '#86efac',
      'white': '#ffffff'
    };
    return colorMap[this.color] || colorMap['white'];
  }
}

// Register the component
customElements.define("mode-card", ModeCard);
