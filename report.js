
function printReport(pages){
  listOfPages = sortPages(pages)
  for (const page of listOfPages){
    console.log(`Found ${page[1]} internal links to ${page[0]}`)
  }
}

// One day look into using a heap here
function sortPages(pages){
// 
  allPages = Object.entries(pages)
  allPages.sort(function(a, b){
    return b[1]-a[1]}
  )
  return allPages
}

module.exports = {
  printReport
}
