This module has two parts.

First, there are scripts to **fetch** data from althingi.is. These scrape their website for relevant data and saves
them into minimally processed json files.

Then there are **processor** scripts to process the previously fetched data to create new json files that are ready
for use by the api and frontend.

Both of these have subtasks which can be run individually.

## How to use

After installing dependencies with `npm install`, you can run the following commands:

```
# Run all fetch tasks
npm run fetch

# Run all process tasks
npm run process

# Run only mps tasks
npm run fetch mps
npm run process mps
```

After processing the data, you can copy the output files from [data/export](data/export) to the thingmenn api
[data folder](../thingmenn-api/data).

## Fetch tasks

- mps
- votes
- subjects
- speechStatistics
- speeches

## Process tasks

- mps
- speeches
- speechStatistics
- parties
- position
- top
