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
      <div class="text-sm">
        <!-- Input Section -->
        <div class="flex items-start gap-1 my-4">
          <span class="text-sm">In [${this.number}]:</span>
          <div class="flex-1 border border-gray-600 p-2">
            <div class="text-white text-left">
              ${this.code}
            </div>
          </div>
        </div>
        
        <!-- Output Section - Accepts arbitrary HTML -->
        <div class="text-left mt-2">
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
        ? `<div class="mt-4 text-center">
        <div class="text-white">
          ${linksArray
            .map(
              (link) =>
                `<a href="#" class="underline hover:text-blue-300">${link}</a>`
            )
            .join(" - ")}
        </div>
      </div>`
        : "";

    this.innerHTML = `
      <div class="text-left">
      <div class="flex items-center align-middle justify-center mb-2 gap-2 border-b border-gray-600">
          <img src="${this.icon}" alt="${this.title}" class="w-10 h-10 justify-self-center" />
          <span class="text-gray-300 text-center p-3">${this.title}</span>
        </div>
        <div class="text-gray-300 mb-4 text-center">${this.description}</div>
        ${linksHtml}
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
      <div class="flex items-center text-left my-4">
        <img src="${this.icon}" alt="${this.skillGroup}" class="w-10 h-10 mr-4" />
        <div class="flex flex-col border-b border-gray-600 pb-4">
          <div class="text-gray-300 mb-1 text-left">
            ${this.skillGroup}
          </div>
          <div class="text-gray-300 text-left">
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
