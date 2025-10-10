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
      <div class="text-sm relative group my-6">
        <!-- Input Cell -->
        <div class="border-l-4 pl-2" style="border-color: var(--neon-blue)">
          <div class="flex items-start gap-4 bg-[var(--terminal-bg)] rounded-r-lg p-4">
            <!-- Prompt -->
            <div class="flex-shrink-0 text-[var(--neon-blue)]" style="min-width: 50px">
              In [${this.number}]:
            </div>
            <!-- Code -->
            <div class="">
              <div class="text-[var(--terminal-text)]">${this.code}</div>
            </div>
          </div>
        </div>
        
        <!-- Output Cell -->
        <div class="mt-1">
          <div class="flex items-start gap-4 pl-6">
            <!-- Output content -->
            <div class="flex-1 text-[var(--terminal-text)]">
              <slot></slot>
            </div>
          </div>
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
      ? JSON.parse(this.links)
      : [];
    const linksHtml =
      linksArray.length > 0
        ? `<div class="mt-4 text-center">
        <div class="text-white">
          ${linksArray
            .map(
              (link) =>
                `<a href="${link.url}" class="underline hover:text-blue-300" target="_blank" rel="noopener noreferrer">${link.text}</a>`
            )
            .join(" - ")}
        </div>
      </div>`
        : "";

    this.innerHTML = `
      <div class="my-6 group">
        <div>
          <div class="rounded-r-lg p-4">
            <div class="gap-4 mb-4">
              <h3 class="text-2xl" style="color: var(--neon-blue)">${this.title}</h3>
            </div>
            <div class="text-[var(--terminal-text)] mb-4">${this.description}</div>
            <div class="text-center">
              ${linksHtml}
            </div>
          </div>
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
      <div class="my-2 group">
        <div class="border-l-4 pl-2" style="border-color: var(--neon-green)">
          <div class="bg-[var(--terminal-bg)] rounded-r-lg p-4">
            <div class="flex items-start gap-4">
              <div class="relative">
                <div class="absolute inset-0 bg-[var(--neon-green)] opacity-5 blur-lg rounded-full"></div>
                <img src="${this.icon}" alt="${this.skillGroup}" class=" group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div class="text-xl mb-2 text-left" style="color: var(--neon-green)">
                  ${this.skillGroup}
                </div>
                <div class="text-[var(--terminal-text)] text-sm">
                  ${this.skills}
                </div>
              </div>
            </div>
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
