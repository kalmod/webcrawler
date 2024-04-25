const { url } = require('node:url');
const { JSDOM } = require('jsdom');
const { link } = require('node:fs');


function normalizeURL(inputURL) {
  const urlObj = new URL(inputURL)
  const normalizedURL = (urlObj.hostname).toLowerCase() + (urlObj.pathname.replace(/\/$/, "")).toLowerCase()
  return normalizedURL
}

function getURLsFromHTML(HTMLtext, baseURL) {
  const dom = new JSDOM(HTMLtext);
  const aElements = dom.window.document.querySelectorAll("a");
  const links = []
  for (const aElement of aElements) {
    if (aElement.href.slice(0, 1) === '/') {
      try {
        links.push(new URL(aElement.href, baseURL).href)
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`)
      }
    } else {
      try {
        links.push(new URL(aElement.href).href)
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`)
      }
    }
  }
  return links
}

// async function crawlPage(baseURL) {
//   try {
//     const response = await fetch(baseURL);

//     if (response.status >= 400) {
//       console.log(`Error Code: ${response.status}`);
//       return;
//     }
//     console.log(`Success Code: ${response.status}`);
//     const contentType = response.headers.get('content-type');
//     if (!contentType.includes('text/html')) {
//       console.log(`URL is a content-type of ${contentType}`);
//       return;
//     }
//     const txt = await response.text()
//     console.log('Success - Getting HTML text')
//     return txt
//   } catch (err) {
//     console.log(`An error was thrown: ${err}`)
//   }

//   return;
// }


async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL)
  const currentURLObj = new URL(currentURL)
  // Same domain check
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages
  }
  const currentNormURL = normalizeURL(currentURL)
  if (currentNormURL in pages) {
    pages[currentNormURL]++
    return pages
  }
  pages[currentNormURL] = 1
  // console.log(`Making request to ${currentURL}`)
  let htmlbody = ''
  try {
    const response = await fetch(currentURL);

    if (response.status >= 400) {
      console.log(`Error Code: ${response.status}`);
      return pages;
    }

    // console.log(`Success Code: ${response.status}`);

    const contentType = response.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(`URL is a content-type of ${contentType}`);
      return pages;
    }

    htmlbody = await response.text()
    // console.log('Success - Getting HTML text')
  } catch (err) {
    console.log(`An error was thrown: ${err}`)
  }
  const nextURLs = getURLsFromHTML(htmlbody,baseURL)
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages)
  }

  return pages;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
}
