Þingmenn
========

This project scrapes, processes and presents information about Members of Parliament in Iceland.

It has three modules:

* [thingmenn-api](thingmenn-api) is an api module built in Python and Flask. It mostly serves static json from pre-generated data files.
* [thingmenn-data](thingmenn-data) contains NodeJS scripts that fetch data from [althingi.is](http://www.althingi.is/). The data is processed and saved into json files which the api serves.
* [thingmenn-frontend](thingmenn-frontend) is a website built with React. It fetches data from the api and presents it visually to the user.
