import List from './lib/list';
import Lecture from './lib/lecture';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');
  
  localStorage.setItem('filters', '');

  if (isLecturePage) {
    console.log('lecture page');
    var slug = getSlug();
    
    const lecture = new Lecture();
    lecture.load(slug);

  } else {
    const list = new List();
    const filterButtons = document.getElementsByTagName('button');
    for (let i=0; i<filterButtons.length;i++){
      if (filterButtons[i].className.includes('filter__')){
        filterButtons[i].addEventListener('click',addFilter);
      }
    }
    list.load();
  }
});

function addFilter() {
  var curFilters = localStorage.getItem('filters');
  let sIdx = curFilters.indexOf(this.value);
  if (sIdx === -1) {
    localStorage.setItem('filters', curFilters + ' ' + this.value);
    this.classList = 'filter__active';
  } else {
    let tmpStr = curFilters.substr(0,sIdx);
    tmpStr += curFilters.substr(sIdx+this.value.length,curFilters.length);
    tmpStr = tmpStr.trim();
    localStorage.setItem('filters', tmpStr);
    this.classList = 'filter__inactive';
  }
  filterResults();
}

function filterResults() {
  const list = new List();
  list.load();
}

function getSlug(){
  var params = new URL(window.location.href);
  var slug = params.searchParams.get('slug');
  return slug;
}

