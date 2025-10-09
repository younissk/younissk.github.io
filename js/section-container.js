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

    let content = "";
    if (data) {
      switch (this.section) {
        case "ml-ai":
          content = renderMLAI(data);
          break;
        case "web-dev":
          content = renderWebDev(data);
          break;
        case "education":
          content = renderEducation(data);
          break;
      }
    }

    this.innerHTML = `
      <section id="${sectionId}" class="block">
        <div class="min-h-screen mt-4 flex flex-col items-center">
          <div class="sticky top-0 w-full max-w-4xl z-50">
            <div class="relative mb-4 ">
              <div class="absolute inset-0 opacity-70"></div>
              <mode-card
                title="${this.title}"
                icon="${this.icon}"
                href="#${sectionId}"
                color="${this.color}"
              ></mode-card>
            </div>
          </div>
          <div class="w-full max-w-4xl p-8 relative">
            <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
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
