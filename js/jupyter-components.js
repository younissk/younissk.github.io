// js/jupyter-components.js
class JupyterCodeCell extends HTMLElement {
  constructor() {
    super();
    this.code = this.getAttribute("code") || "print('Hello, World!')";
    this.number = this.getAttribute("number") || "8";
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="text-sm font-mono">
        <!-- Input Section -->
        <div class="flex items-start gap-2 my-6 bg-black/50 border border-cyan-500/30 p-4 rounded-lg backdrop-blur-sm">
          <span class="text-cyan-300 font-bold text-sm">In [${this.number}]:</span>
          <div class="flex-1 bg-gray-900/80 border border-gray-600 p-3 rounded">
            <div class="text-green-400 text-left font-mono text-sm leading-relaxed">
              ${this.code}
            </div>
          </div>
        </div>

        <!-- Output Section - Accepts arbitrary HTML -->
        <div class="text-left mt-4 p-2">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

class JupyterProject extends HTMLElement {
  constructor() {
    super();
    this.title = this.getAttribute("title") || "";
    this.description = this.getAttribute("description") || "";
    this.links = this.getAttribute("links") || "";
    this.icon = this.getAttribute("icon") || "/icons/Fire.png";
    this.render();
  }

  render() {
    const linksArray = this.links
      ? this.links.split(",").map((link) => link.trim())
      : [];
    const linksHtml =
      linksArray.length > 0
        ? `<div class="mt-6 text-center">
        <div class="text-cyan-300 font-mono text-sm">
          ${linksArray
            .map(
              (link) =>
                `<a href="#" class="border border-cyan-500/50 px-3 py-1 rounded hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 text-shadow-neon">${link}</a>`
            )
            .join('<span class="mx-2 text-cyan-500">|</span>')}
        </div>
      </div>`
        : "";

    this.innerHTML = `
      <div class="text-left my-6">
        <div class="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-cyan-500/30 p-6 rounded-lg backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
          <div class="flex items-center align-middle justify-center mb-4 gap-3">
            <div class="relative">
              <img src="${this.icon}" alt="${this.title}" class="w-12 h-12 justify-self-center transition-transform duration-300 hover:scale-110" />
              <div class="absolute inset-0 bg-cyan-500/20 blur-sm rounded-full animate-pulse"></div>
            </div>
            <span class="text-cyan-300 text-xl font-bold text-center p-2 drop-shadow-lg">${this.title}</span>
          </div>
          <div class="text-gray-300 mb-4 text-center leading-relaxed font-mono">${this.description}</div>
          ${linksHtml}
        </div>
      </div>
    `;
  }
}

class JupyterSkill extends HTMLElement {
  constructor() {
    super();
    this.skillGroup = this.getAttribute("skillGroup") || "";
    this.skills = this.getAttribute("skills") || "";
    this.icon = this.getAttribute("icon") || "";
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="flex items-center text-left my-6">
        <div class="relative mr-6">
          <img src="${this.icon}" alt="${this.skillGroup}" class="w-12 h-12 transition-transform duration-300 hover:scale-110" />
          <div class="absolute inset-0 bg-cyan-500/20 blur-sm rounded-full animate-pulse"></div>
        </div>
        <div class="flex flex-col flex-1 bg-gray-900/60 border border-cyan-500/20 p-4 rounded-lg backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300">
          <div class="text-cyan-300 mb-2 text-left font-bold text-lg">
            ${this.skillGroup}
          </div>
          <div class="text-gray-300 text-left font-mono text-sm leading-relaxed">
            ${this.skills}
          </div>
        </div>
      </div>
    `;
  }
}

// Register the components
customElements.define("jupyter-code-cell", JupyterCodeCell);
customElements.define("jupyter-project", JupyterProject);
customElements.define("jupyter-skill", JupyterSkill);
