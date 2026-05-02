import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const h1 = document.querySelector('h1');
h1.textContent = `${projects.length} Projects`;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

let query = '';
let selectedYear = null;

function getSearchFiltered() {
  return projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
}

function applyFilters() {
  let filtered = getSearchFiltered();
  if (selectedYear !== null) {
    filtered = filtered.filter((p) => p.year === selectedYear);
  }
  renderProjects(filtered, projectsContainer, 'h2');
}

function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let svg = d3.select('#projects-plot');
  svg.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  arcs.forEach((arc, i) => {
    const year = data[i].label;
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(year))
      .attr('class', selectedYear === year ? 'selected' : '')
      .on('click', () => {
        selectedYear = selectedYear === year ? null : year;
        renderPieChart(getSearchFiltered());
        applyFilters();
      });
  });

  data.forEach((d) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(d.label)}`)
      .attr('class', selectedYear === d.label ? 'selected' : '')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  const searchFiltered = getSearchFiltered();
  renderPieChart(searchFiltered);
  applyFilters();
});
