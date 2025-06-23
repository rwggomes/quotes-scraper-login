# Quotes Scraper ##

A modular and extensible web scraper built with Puppeteer for [quotes.toscrape.com](https://quotes.toscrape.com/). Supports scraping quotes or author names, with pagination, optional login, logging, retries, and optional asset downloading.

---

## Features ##

- Paginated scraping
- Uses loginIfNeeded() function
- Save results as JSON or CSV
- Optional download of linked image/PDF assets
- Modular architecture
- Retry logic for flaky pages
- Log file output with timestamps and events

---

## Dependencies ## 

- `puppeteer-extra` + `stealth-plugin`
- `yargs` for CLI
- `fs-extra` for file ops
- `csv-writer` for CSV export
- `date-fns` for timestamps

---

## Project Structure ## 

```bash
quotes-scraper/
├── mainScraper.js                # Entry point
├── scraper.log                   # Log output
├── output/                       # JSON/CSV results
├── assets/                    # Downloaded assets (if any)
├── modules/
│   ├── login.js
│   ├── logger.js
│   ├── pagination.js
│   ├── retry.js
│   ├── save.js
│   ├── scrapePage.js
│   └── extractors/
│       ├── authors.js
│       └── quotes.js
