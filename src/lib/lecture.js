import { empty } from './helpers';

/*
  header with 
      -background image
      -centered category name
      -centered lecture title

*/

export default class Lecture {
  constructor() {
    this.container = document.querySelector('.lecture__content');
  }
  load(slug) {
    empty(this.container);
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", "lectures.json",true);
    httpRequest.responseType = 'json';
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200){
        loadLecture(httpRequest.response, slug);
      }
    } 
  }
}

function loadLecture(data, slug) {
  let lectureIdx = -1;
  for (let i=0;i<data.lectures.length;i++){
    if (data.lectures[i]['slug'] === slug) {
      lectureIdx = i;
      console.log(lectureIdx);
      break;
    }
  }
  if (lectureIdx > -1) {
    let lectureContent = document.querySelector('.lecture__content');
    createHeader(data.lectures[lectureIdx]['category'], data.lectures[lectureIdx]['title']);
    for (let i=0;i<data.lectures[lectureIdx].content.length;i++){
      switch(data.lectures[lectureIdx].content[i].type){
        case 'youtube':
          lectureContent.appendChild(createYT(data.lectures[lectureIdx].content[i]['data']));
          break;
        
        case 'quote':
          lectureContent.appendChild(createQuote(data.lectures[lectureIdx].content[i]['data'], data.lectures[lectureIdx].content[i]['attribute']));
          break;

        case 'image':
          lectureContent.appendChild(createImage(data.lectures[lectureIdx].content[i]['data'], data.lectures[lectureIdx].content[i]['caption']));
          break;

        case 'heading':
          lectureContent.appendChild(createHeading(data.lectures[lectureIdx].content[i]['data']));
          break;
        
        case 'code':
          lectureContent.appendChild(createCodeBlock(data.lectures[lectureIdx].content[i]['data']));
          break;
        
        case 'list':
          lectureContent.appendChild(createList(data.lectures[lectureIdx].content[i]['data']));
          break;
        
        case 'text':
          lectureContent.appendChild(createPText(data.lectures[lectureIdx].content[i]['data']));
          break;
      }
    }
    lectureContent.appendChild(createFooter(slug));
  }
}

function createYT(href){

  let x = document.createElement('iframe');
  let w = document.createElement('div');
  w.classList = 'yt__wrapper';
  w.appendChild(x);
  x.src = href;
  x.frameBorder = 0;
  x.allowFullscreen = 0;
  x.classList = 'yt__video';
  return w;
}

function createHeading(txt){

  let x = document.createElement('h1');
  x.innerText = txt;
  x.classList = 'lecture__heading';
  return x;
}

function createQuote(txt, author){

  let x = document.createElement('blockquote');
  let y = document.createElement('p');
  let z = document.createElement('span');
  y.innerText = txt;
  z.innerText = author;
  x.classList = 'lecture__blockquote';
  x.appendChild(y);
  x.appendChild(z);
  return x;
}

function createList(list){
  console.log('list');
  let x = document.createElement('ul');
  x.classList = 'lecture__li';
  for (let i=0;i<list.length;i++){
    let y = document.createElement('li');
    y.appendChild(document.createTextNode(list[i]));
    x.appendChild(y);
  }
  return x;
}

function createCodeBlock(txt){

  let x = document.createElement('code');
  x.innerText = txt;
  return x;
}

function createImage(href, caption){

  let fig = document.createElement('figure');
  let c = document.createElement('figcaption');
  let im = document.createElement('img');
  im.src = href;
  c.innerText = caption;
  fig.classList = 'lecture__figure';
  c.classList = 'figure__caption';
  fig.appendChild(im);
  fig.appendChild(c);
  return fig;
}

function createPText(txt){

  let x = document.createElement('p');
  x.innerText = txt;
  x.classList = 'lecture__p';
  return x;
}

function createHeader(cat, title){
  console.log('header|'+cat+'|'+title);
  let x = document.getElementsByClassName('lecture__header-category');
  let y = document.getElementsByClassName('lecture__header-title');
  
  x[0].innerText = cat;
  y[0].innerText = title;

}
function createFooter(slug){
  let completedSlugs = JSON.parse(localStorage.getItem('completedSlugs'));
  let isComplete = completedSlugs[slug];

  let x = document.createElement('p');
  let y = document.createElement('a');
  let z = document.createElement('div');

  
  x.addEventListener('click', completeLecture);
  if (!isComplete) {
    x.classList = 'complete__lecture';
    x.innerText = 'Klára fyrirlestur';
  } else {
    x.classList = 'complete__lecture-true';
    x.innerText = 'Merkja sem óklárað';
  }
  x.id = slug;
  y.href = 'index.html';
  y.innerText = 'Til baka';
  y.classList = 'complete__lecture';
  z.classList = 'lecture__footer';
  z.appendChild(x);
  z.appendChild(y);
  
  return z;


  //two clickable links
  //one that marks lecture as complete
  //one that returns to main page

}

function completeLecture() {
  let completedSlugs = JSON.parse(localStorage.getItem('completedSlugs'));
  completedSlugs[this.id] = !completedSlugs[this.id];
  localStorage.setItem('completedSlugs', JSON.stringify(completedSlugs));

  let x = document.getElementById(this.id);
  if (x.className === 'complete__lecture') {
    x.classList = 'complete__lecture-true';
    x.innerText = 'Merkja sem óklárað';
  } else {
    x.classList = 'complete__lecture';
    x.innerText = 'Klára fyrirlestur';
  }

}
