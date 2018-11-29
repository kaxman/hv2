import { empty } from './helpers';

export default class List {
  constructor() {
    this.container = document.querySelector('.lecture__list');
  }
  load() {
    empty(this.container); 
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", "lectures.json",true);
    httpRequest.responseType = 'json';
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200){
        console.log('another httprequest');
        parseResults(httpRequest.response);
      }
    } 
  }
}

function parseResults(data) {
  let myLectures = data['lectures'];
  let myFilters = localStorage.getItem('filters');
  //console.log(localStorage);
  let completedLectures = JSON.parse(localStorage.getItem('completedSlugs') || null);

  console.log(completedLectures);
  if (completedLectures === null) {
    completedLectures = {};
    for (var i=0;i<myLectures.length;i++){

      completedLectures[myLectures[i].slug] = false;
    }
    localStorage.setItem('completedSlugs', JSON.stringify(completedLectures));
  }



  let output = document.querySelector('.lecture__list');

  for (var i=0;i<myLectures.length;i++){
    if (myFilters.indexOf(myLectures[i].category) > -1 || myFilters.trim().length === 0){
      let lectureLink = document.createElement('a');
      let lectureCard = document.createElement('div');
      let lectureCardText = document.createElement('div');
      let cardTitle = document.createElement('h1');
      let cardCategory = document.createElement('h4');
      let lectureFinished = document.createElement('span');
      
      lectureFinished.classList = 'lecture__finished';
      if (completedLectures[myLectures[i].slug] === true){
        lectureFinished.textContent = '\u2714';
      }

      lectureLink.href = 'fyrirlestur.html?slug=' + myLectures[i]['slug'];
      lectureLink.classList.add('lecture__card');
      output.appendChild(lectureLink);

      lectureCard.classList.add('lecture__card-content');
      lectureCardText.classList.add('lecture__card-text');
      lectureLink.appendChild(lectureCard);
      cardTitle.textContent = myLectures[i]['title'];
      cardCategory.textContent = myLectures[i]['category'];

      //console.log(myLectures[i]['thumbnail']);
      if (myLectures[i]['thumbnail'] !== undefined){
        let cardThumbnail = document.createElement('img');
        cardThumbnail.src = myLectures[i]['thumbnail'];
        cardThumbnail.classList.add('lecture__card-image');
        lectureCard.appendChild(cardThumbnail);
      } else {
        let cardThumbnail = document.createElement('div');
        cardThumbnail.classList.add('no__thumbnail');
        lectureCard.appendChild(cardThumbnail);
      }
      lectureCard.appendChild(lectureCardText);
      lectureCardText.appendChild(cardCategory);
      lectureCardText.appendChild(cardTitle);
      lectureCardText.appendChild(lectureFinished);
    }
  }
}