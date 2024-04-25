const { getURLsFromHTML, crawlPage } = require("./crawl.js")
const { printReport } = require("./report.js")

async function main() {
  if (process.argv.length < 3 || process.argv.length > 3) {
    console.log(`Incorrect num of Args: ${process.argv.length}`);
    return;
  }
  console.log(`Crawler starting at baseUrl of ${process.argv[2]}`);
  const pages = await crawlPage(process.argv[2], process.argv[2], {})
  printReport(pages)
}

main()
