// js/data-loader.js
// Data loading utilities
async function loadData(section) {
  try {
    const response = await fetch(`/data/${section}.json`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${section} data:`, error);
    return null;
  }
}

// Render functions for different sections
function renderMLAI(data) {
  if (!data) return "";

  let html = `
    <jupyter-code-cell number="1" code="intro.show()"></jupyter-code-cell>
    <p class="mb-2">${data.intro.text}</p>
    <jupyter-code-cell number="2" code="for project in projects:\n print(project)"></jupyter-code-cell>
  `;

  data.projects.forEach((project) => {
    html += `
      <jupyter-project
        title="${project.title}"
        description="${project.description}"
        links='${JSON.stringify(project.links)}'
      ></jupyter-project>
    `;
  });

  html += `<jupyter-code-cell number="3" code="pprint.pprint(skills)"></jupyter-code-cell>`;
  html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">`;

  data.skills.forEach((skill) => {
    html += `
      <jupyter-skill
        skillGroup="${skill.group}"
        skills="${skill.items}"
        icon="${skill.icon}"
      ></jupyter-skill>
    `;
  });

  html += `</div>`;

  return html;
}

function renderWebDev(data) {
  if (!data) return "";

  let html = `<p>${data.intro.text}</p>`;

  data.projects.forEach((project) => {
    html += `
      <jupyter-project
        title="${project.title}"
        description="${project.description}"
        links='${JSON.stringify(project.links)}'
      ></jupyter-project>
    `;
  });

  html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">`;

  data.skills.forEach((skill) => {
    html += `
      <jupyter-skill
        skillGroup="${skill.group}"
        skills="${skill.items}"
        icon="${skill.icon}"
      ></jupyter-skill>
    `;
  });

  html += `</div>`;

  return html;
}

function renderEducation(data) {
  if (!data) return "";

  let html = `<p>${data.intro.text}</p>`;

  html += `<div class="text-center mb-4">---------- Courses ----------</div>`;

  data.courses.forEach((course) => {
    html += `
      <jupyter-project
        title="${course.title}"
        description="${course.description}"
        links='${JSON.stringify(course.links)}'
      ></jupyter-project>
    `;
  });

  html += `<div class="text-center mb-4">---------- Schools I worked with ----------</div>`;

  data.schools.forEach((school) => {
    html += `
      <div class="my-6 group">
        <div class="">
          <div class="bg-[var(--terminal-bg)] rounded-r-lg p-4 hover:shadow-lg hover:shadow-[var(--neon-green)]/20 transition-all duration-300">
            <div class="flex items-start gap-4">
              <div class="relative">
                <div class="absolute inset-0 bg-[var(--neon-green)] opacity-5 blur-lg rounded-full"></div>
              </div>
              <div class="flex-1">
                <h3 class="text-2xl mb-2" style="color: var(--neon-green)">${school.name}</h3>
                <p class="text-[var(--terminal-text)] mb-2">${school.description}</p>
                <p class="text-sm text-[var(--terminal-text)] opacity-70 mb-2">${school.period}</p>
                <a href="${school.link}" class="text-sm underline hover:text-[var(--neon-green)] transition-colors duration-200" target="_blank" rel="noopener noreferrer">Visit Website →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  return html;
}
