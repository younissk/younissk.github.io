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
    this.innerHTML = `
      <a href="${this.href}"
        class="grid grid-cols-[60px_1fr] items-center p-5 border-2 border-${this.color} gap-5 max-w-md mx-auto"
      >
        <img src="${this.icon}" alt="${this.title}" class="w-10 h-10 justify-self-center" />
        <h2 class="text-3xl text-left truncate text-${this.color} tracking-wider">${this.title}</h2>
      </a>
      `;
  }
}

// Register the component
customElements.define("mode-card", ModeCard);
