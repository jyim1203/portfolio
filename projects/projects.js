// import from global.js
import { fetchJSON, renderProjects } from '../global.js';

// fetch from lib/projects.json and render projects
const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const h1 = document.querySelector('h1');
h1.textContent = `${projects.length} Projects`;