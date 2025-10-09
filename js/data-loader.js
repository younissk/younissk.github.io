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
  
  let html = `<p>${data.intro.text}</p>`;
  
  html += `<div class="text-center mb-4">---------- Courses ----------</div>`;
  
  data.courses.forEach(course => {
    html += `
      <jupyter-project
        title="${course.title}"
        description="${course.description}"
        links="${course.links.join(', ')}"
      ></jupyter-project>
    `;
  });
  
  html += `<div class="text-center mb-4">---------- Schools I worked with ----------</div>`;
  
  data.schools.forEach(school => {
    html += `
      <div class="text-left mb-4">
        <div class="border border-gray-600 p-4">
          <h3 class="text-xl text-gray-300 mb-2">${school.name}</h3>
          <p class="text-gray-300 mb-2">${school.description}</p>
          <p class="text-sm text-gray-400">${school.period}</p>
        </div>
      </div>
    `;
  });
  
  return html;
}
