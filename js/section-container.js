// js/section-container.js
class SectionContainer extends HTMLElement {
  constructor() {
    super();
    this.title = this.getAttribute("title") || "Section";
    this.color = this.getAttribute("color") || "white";
    this.icon = this.getAttribute("icon") || "/icons/Brain.png";
    this.section = this.getAttribute("section") || "ml-ai";
    this.render();
  }

  async render() {
    const sectionId = this.title.toLowerCase().replace(/ /g, "-");
    const data = await loadData(this.section);

    let content = '';
    if (data) {
      switch(this.section) {
        case 'ml-ai':
          content = renderMLAI(data);
          break;
        case 'web-dev':
          content = renderWebDev(data);
          break;
        case 'education':
          content = renderEducation(data);
          break;
      }
    }

    this.innerHTML = `
      <section id="${sectionId}" class="block relative">
        <div class="min-h-screen flex flex-col items-center bg-gradient-to-b from-[#0f1419] via-[#1a2332] to-[#2d3748]">
          <div class="sticky top-0 w-full py-6 bg-gradient-to-r from-transparent via-[#1a2332]/90 to-transparent backdrop-blur-sm border-b border-cyan-500/20">
            <mode-card
              title="${this.title}"
              icon="${this.icon}"
              href="#${sectionId}"
              color="${this.color}"
              class="animate-arcade-hover"
            ></mode-card>
          </div>
          <div class="w-full max-w-5xl p-8 relative">
            <!-- Section Background Glow -->
            <div class="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none"></div>
            <div class="relative z-10">
              ${content}
            </div>
          </div>
        </div>
      </section>
     `;
  }
}

// Register the component
customElements.define("section-container", SectionContainer);
