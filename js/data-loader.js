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
  if (!data) return '';
  
  let html = `
    <jupyter-code-cell number="1" code="intro.show()"></jupyter-code-cell>
    <p class="mb-2">${data.intro.text}</p>
    <jupyter-code-cell number="2" code="for project in projects:&#10;    print(project)"></jupyter-code-cell>
  `;
  
  data.projects.forEach(project => {
    html += `
      <jupyter-project
        title="${project.title}"
        description="${project.description}"
        links="${project.links.join(', ')}"
      ></jupyter-project>
    `;
  });
  
  html += `<jupyter-code-cell number="3" code="pprint.pprint(skills)"></jupyter-code-cell>`;
  
  data.skills.forEach(skill => {
    html += `
      <jupyter-skill
        skillGroup="${skill.group}"
        skills="${skill.items}"
        icon="${skill.icon}"
      ></jupyter-skill>
    `;
  });
  
  return html;
}

function renderWebDev(data) {
  if (!data) return '';
  
  let html = `<p>${data.intro.text}</p>`;
  
  data.projects.forEach(project => {
    html += `
      <jupyter-project
        title="${project.title}"
        description="${project.description}"
        links="${project.links.join(', ')}"
      ></jupyter-project>
    `;
  });
  
  data.skills.forEach(skill => {
    html += `
      <jupyter-skill
        skillGroup="${skill.group}"
        skills="${skill.items}"
        icon="${skill.icon}"
      ></jupyter-skill>
    `;
  });
  
  return html;
}

function renderEducation(data) {
  if (!data) return '';

  let html = `
    <div class="mb-8 p-6 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
      <p class="text-cyan-200 font-mono text-lg leading-relaxed">${data.intro.text}</p>
    </div>
  `;

  html += `
    <div class="text-center mb-8 mt-8">
      <div class="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 rounded-lg">
        <span class="text-cyan-300 font-mono text-xl font-bold tracking-wider">COURSES</span>
      </div>
    </div>
  `;

  data.courses.forEach(course => {
    html += `
      <jupyter-project
        title="${course.title}"
        description="${course.description}"
        links="${course.links.join(', ')}"
      ></jupyter-project>
    `;
  });

  html += `
    <div class="text-center mb-8 mt-12">
      <div class="inline-block px-6 py-3 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/50 rounded-lg">
        <span class="text-green-300 font-mono text-xl font-bold tracking-wider">SCHOOLS</span>
      </div>
    </div>
  `;

  data.schools.forEach(school => {
    html += `
      <div class="text-left mb-6">
        <div class="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-green-500/30 p-6 rounded-lg backdrop-blur-sm hover:border-green-400/50 transition-all duration-300">
          <h3 class="text-xl text-green-300 mb-3 font-bold">${school.name}</h3>
          <p class="text-gray-300 mb-3 leading-relaxed">${school.description}</p>
          <p class="text-sm text-cyan-400 font-mono">${school.period}</p>
        </div>
      </div>
    `;
  });

  return html;
}
