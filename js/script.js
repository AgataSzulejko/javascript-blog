{
  const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
   activeArticle.classList.remove('active');
 }

  /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

// Part 6.4 - Dynamic Title links

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';
  optArticleTagsSelector = '.post-tags .list';
  optArticleAuthorSelector = '.post-author';

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';


let html = '';

  /* for each article */
const articles = document.querySelectorAll(optArticleSelector + customSelector);
for (let article of articles){

    /* get the article id */
  const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
  const articleTitle = article.querySelector(optTitleSelector).innerHTML;

  /* create HTML of the link */
  const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

  /* insert link into titleList */
  //titleList.innerHTML = titleList.innerHTML + linkHTML;
  //titleList.insertAdjacentHTML('beforeend', linkHTML);

  /* insert link into html variable */
      html = html + linkHTML;
  }

titleList.innerHTML = html;

//bug fix according to exercise description
const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

// Part 7.2 Dynamic Tags

function generateTags(){
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles){
      /* START LOOP: for every article: */
      /* find tags wrapper */
  const tagsWrapper = article.querySelector(optArticleTagsSelector);
      /* make html variable with empty string */
  let html = '';
    /* get tags from data-tags attribute */
  const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');


    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
    const linkTagHTML = '<li><a href="#tag-'+ tag +'">'+ tag +'</a></li>';
    /* add generated code to html variable */
    html = html + linkTagHTML;
   /* END LOOP: for each tag */
     }
   /* insert HTML of all the links into the tags wrapper */
     tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let link of activeTagLinks){
    /* remove class active */
    link.classList.remove('active');
  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const hrefEqualLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let linkHref of hrefEqualLinks){
    /* add class active */
    linkHref.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){

  /* find all links to tags */
  const tagLinks =  document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for(let linkTag of tagLinks){
    /* add tagClickHandler as event listener for that link */
    linkTag.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
}

addClickListenersToTags();


// Add Author

function generateAuthors() {

  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {

    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    const articleAuthor = article.getAttribute('data-author');

    const authorLinkHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';

    authorWrapper.innerHTML = authorLinkHTML;

  }
}

generateAuthors();


function authorClickHandler(event){

  event.preventDefault();
  const clickedElement = this;

  const href = clickedElement.getAttribute('href');
  console.log(href);

  const author = href.replace('#author-','');
  console.log(author);

  const activeAuthorLinks = document.querySelectorAll('a[href^="#author-"]');
  console.log(activeAuthorLinks);

  for (let activeAuthor of activeAuthorLinks) {

    activeAuthor.classList.remove('active');

  }

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let author of authorLinks) {
    author.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');

};


function addClickListenersToAuthors() {
  let authorLinks = document.querySelectorAll('a[href^="#author-"]');
  console.log(authorLinks);

  for (let author of authorLinks) {
    author.addEventListener('click', authorClickHandler);
  }

 };

   addClickListenersToAuthors();
}
