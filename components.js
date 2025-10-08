// components.js
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
      <a href="/${this.href}"
        class="grid grid-cols-[60px_1fr] items-center p-5 border-2 border-${this.color} gap-5 max-w-md mx-auto"
      >
        <img src="${this.icon}" alt="${this.title}" class="w-10 h-10 justify-self-center" />
        <h2 class="text-3xl text-left truncate text-${this.color} tracking-wider">${this.title}</h2>
      </a>
      `;
  }
}

class SectionContainer extends HTMLElement {
  constructor() {
    super();
    this.title = this.getAttribute("title") || "Section";
    this.color = this.getAttribute("color") || "white";
    this.icon = this.getAttribute("icon") || "/icons/Brain.png";
    this.render();
  }

  render() {
    const sectionId = this.title.toLowerCase().replace(/ /g, "-");
    this.innerHTML = `
      <section id="${sectionId}" class="block">
        <div class="min-h-screen flex flex-col items-center">
          <div class="sticky top-0 w-full bg-[#222222] py-4">
            <mode-card
              title="${this.title}"
              icon="${this.icon}"
              href="#${sectionId}"
              color="${this.color}"
            ></mode-card>
          </div>
          <div class="w-full max-w-4xl p-8">
            ${this.innerHTML}
          </div>
        </div>
      </section>
     `;
  }
}

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
        <div class="flex items-center mb-2">
          <div class="flex-1 border-t border-gray-600"></div>
          <span class="px-3 text-gray-300">${this.title}</span>
          <div class="flex-1 border-t border-gray-600"></div>
        </div>
        <div class="text-gray-300 mb-4 text-center">
          ${this.description}
        </div>
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
customElements.define("mode-card", ModeCard);
customElements.define("section-container", SectionContainer);
customElements.define("jupyter-code-cell", JupyterCodeCell);
customElements.define("jupyter-project", JupyterProject);
customElements.define("jupyter-skill", JupyterSkill);
