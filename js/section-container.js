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
            ${content}
          </div>
        </div>
      </section>
     `;
  }
}

// Register the component
customElements.define("section-container", SectionContainer);
