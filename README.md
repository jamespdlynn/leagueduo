# Duo Queue Stats

>I got the idea for this app from a friend who mentioned a lack of being able to find your duo queue stats with a partner within the current online community.
Please note due to time constraints this is only an early build of the app. I plan on adding more useful data points and giving it a major visual overhaul in the future before
putting it out for mass consumption. The overall structure of the code base, however, is in place.

#### Start App
  * npm start

#### Run Mocha Unit Tests
  * npm test

#### Run Grunt Build
  * npm run build

## How it works in a nutshell

* Although the client is built specifically for finding statistics between a single summoner and their duo partner; the server is actually more adaptable, and capable of grouping match
statistics for clusters of anywhere between one and five summoners.

* The node server utilizes the 'summoner', 'match' and 'matchhistory' endpoints to aggregate the necessary match data given only a region and an array of summoner names.
API calls of duplicate endpoints are made in parallel to reduce overall load time. The Match Controller is responsible for selecting only the data for matches participated in by all given summoners.

* The app uses a Mongo database to cache pertinent summoner and match data during throughout the above process. This way all subsequent data requests for the the same group of summoners will
need to only use a fraction of the remote API calls, which results in a significant decrease in overall load time. The mongo database currently points to a free instance I'm running on MongoLabs.
You can point it to a local instance using the config files if you wanted to.

