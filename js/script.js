{
    const templates = {
        articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
        tagLinks: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
        authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
        tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
        authorsListLink: Handlebars.compile(document.querySelector('#template-authorsList-link').innerHTML)
    }



    const titleClickHandler = function(event) {
        event.preventDefault();
        const clickedElement = this;

        /* remove class 'active' from all article links  */
        const activeLinks = document.querySelectorAll('.titles a.active');
        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');
        }

        /* add class 'active' to the clicked link */
        clickedElement.classList.add('active');

        /* remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll('.posts article.active');

        for (let activeArticle of activeArticles) {
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
          optCloudClassCount = 5;
          optCloudClassPrefix = 'tag-size-';
          optAuthorsListSelector = 'authors.list';

    const generateTitleLinks = function(customSelector = '') {

        /* remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';


        let html = '';

        /* for each article */
        const articles = document.querySelectorAll(optArticleSelector + customSelector);
        for (let article of articles) {

            /* get the article id */
            const articleId = article.getAttribute('id');

            /* find the title element */
            /* get the title from the title element */
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;

            /* create HTML of the link */

            const linkHTMLData = {
                id: articleId,
                title: articleTitle
            };
            const linkHTML = templates.articleLink(linkHTMLData);
            //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

            /* insert link into titleList */
            //titleList.innerHTML = titleList.innerHTML + linkHTML;
            //titleList.insertAdjacentHTML('beforeend', linkHTML);

            /* insert link into html variable */
            html = html + linkHTML;
        }

        titleList.innerHTML = html;

        //bug fix according to exercise description
        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }
    }

    generateTitleLinks();

    // Part 7.2 Dynamic Tags

    const setDefaultArticle = function(targetArticle) {
        const activeArticles = document.querySelectorAll('.post.active');
        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');
        }
        targetArticle.classList.add('active');
    }

    const calculateTagsParams = function(tags) {

        const params = {
            max: 0,
            min: 999999
        };

        for (let tag in tags) {
            console.log(tag + ' is used ' + tags[tag] + ' times');
            params.max = Math.max(tags[tag], params.max);
            params.min = Math.min(tags[tag], params.min);
        }

        return params;
    }

    const calculateTagClass = function(count, params) {

        const normalizedCount = count - params.min;
        const normalizedMax = params.max - params.min;
        const percentage = normalizedCount / normalizedMax;
        const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);


        return optCloudClassPrefix + classNumber;
    }

    const generateTags =  function() {
        /* [NEW] create a new variable allTags with an empty object */
        let allTags = {};

        /* find all articles */
        const articles = document.querySelectorAll(optArticleSelector);

        for (let article of articles) {
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
            for (let tag of articleTagsArray) {

                /* generate HTML of the link */
                const tagHTMLData = {
                    id: tag
                };
                const linkTagHTML = templates.tagLinks(tagHTMLData);
                //const linkTagHTML = '<li><a href="#tag-'+ tag +'">'+ tag +'</a></li>';

                /* add generated code to html variable */
                html = html + linkTagHTML;

                /* [NEW] check if this link is NOT already in allTags */
                if (!allTags[tag]) {
                    /* [NEW] add tag to allTags object */
                    allTags[tag] = 1;
                } else {
                    allTags[tag]++;
                }

                /* END LOOP: for each tag */
            }
            /* insert HTML of all the links into the tags wrapper */
            tagsWrapper.innerHTML = html;
            /* END LOOP: for every article: */
        }

        /* [NEW] find list of tags in right column */
        const tagList = document.querySelector('.tags');

        const tagsParams = calculateTagsParams(allTags);
        console.log('tagsParams:', tagsParams)

        /* [NEW] create variable for all links HTML code */
        const allTagsData = {
            tags: []
        };
        //let allTagsHTML = '';

        /* [NEW] START LOOP: for each tag in allTags: */
        for (let tag in allTags) {
            /* [NEW] generate code of a link and add it to allTagsHTML */
            //allTagsHTML += tag + ' (' + allTags[tag] + ') ';


            allTagsData.tags.push({
                tag: tag,
                count: allTags[tag],
                className: calculateTagClass(allTags[tag], tagsParams)
            });
            //const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams) ;
            //allTagsHTML += '<li><a href="#tag-' + tag + '"><span>' + allTags[tag] + '</span></a></li>';
            //allTagsHTML +=  '<li><a class="' + tagLinkHTML + '" href="#tag-' + tag + '"> + tag + '</a>'</li>';

        }
        /* [NEW] END LOOP: for each tag in allTags: */

        /*[NEW] add HTML from allTagsHTML to tagList */
        tagList.innerHTML = templates.tagCloudLink(allTagsData);
        //tagList.innerHTML = allTagsHTML;

    }

    generateTags();

    const tagClickHandler = function(event) {
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
        for (let link of activeTagLinks) {
            /* remove class active */
            link.classList.remove('active');
            /* END LOOP: for each active tag link */
        }

        /* find all tag links with "href" attribute equal to the "href" constant */
        const hrefEqualLinks = document.querySelectorAll('a[href="' + href + '"]');
        /* START LOOP: for each found tag link */
        for (let linkHref of hrefEqualLinks) {
            /* add class active */
            linkHref.classList.add('active');
            /* END LOOP: for each found tag link */
        }
        /* execute function "generateTitleLinks" with article selector as argument */
        generateTitleLinks('[data-tags~="' + tag + '"]');

        /*Show first available article of selected tag after click.*/
        const targetArticle = document.querySelector('[data-tags~="' + tag + '"]');
        setDefaultArticle(targetArticle);
    }

    const addClickListenersToTags = function() {

        /* find all links to tags */
        const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

        /* START LOOP: for each link */
        for (let linkTag of tagLinks) {
            /* add tagClickHandler as event listener for that link */
            linkTag.addEventListener('click', tagClickHandler);
            /* END LOOP: for each link */
        }
    }

    addClickListenersToTags();


    // Add Author

    const generateAuthors = function() {

        let allAuthors = {};

        const articles = document.querySelectorAll(optArticleSelector);

        for (let article of articles) {

            const authorWrapper = article.querySelector(optArticleAuthorSelector);

            const articleAuthor = article.getAttribute('data-author');

            const authorHTMLData = {
                author: articleAuthor
            };
            const authorLinkHTML = templates.authorLink(authorHTMLData);
            //const authorLinkHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';


            if (!allAuthors[articleAuthor]) {
                allAuthors[articleAuthor] = 1
            } else {
                allAuthors[articleAuthor]++
            }
            authorWrapper.innerHTML = authorLinkHTML;
        }

        const authorList = document.querySelector('.authors');

        const allAuthorsLinks = {
            authors: []
        };
        //let allAuthorsHTML = '';

        for (let author in allAuthors) {
            allAuthorsLinks.authors.push({
                author: author,
                //countArticles:  document.querySelectorAll('[data-author="' + author + '"]').length
                countArticles: allAuthors[author]

            });

            //allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + '</a><span> | articles(<span>' + (countArticles) + '</span>)</span></li>';
        }
        //authorList.innerHTML = allAuthorsHTML;
        authorList.innerHTML = templates.authorsListLink(allAuthorsLinks);
    }

    generateAuthors();


    const authorClickHandler = function(event) {

        event.preventDefault();
        const clickedElement = this;

        const href = clickedElement.getAttribute('href');

        const author = href.replace('#author-', '');

        const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

        if (activeAuthorLinks) {
            for (let activeAuthor of activeAuthorLinks) {
                activeAuthor.classList.remove('active');
            }
        }

        const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

        for (let author of authorLinks) {
            author.classList.add('active');
        }

        generateTitleLinks('[data-author="' + author + '"]');

        /* Show first available article of selected author after click.*/
        const targetArticle = document.querySelector('[data-author="' + author + '"]');
        setDefaultArticle(targetArticle);
    };


    const addClickListenersToAuthors = function() {
        let authorLinks = document.querySelectorAll('a[href^="#author-"]');

        for (let author of authorLinks) {
            author.addEventListener('click', authorClickHandler);
        }

    };

    addClickListenersToAuthors();
}
