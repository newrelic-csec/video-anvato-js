# newrelic-video-anvato [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
#### [New Relic](http://newrelic.com) video tracking for Anvato

## Requirements
This video monitor solutions works on top of New Relic's **Browser Agent**.

## Notice
This tracker is designed to follow the specifications of [Anvato version 3 SDK](https://dev.anvato.net/api/playerv3).

### Getting Playhead
In order to retrieve the playhead, you will need to enable `trackTimePeriod` on the player.

## Usage
Load **scripts** inside `dist` folder into your page.
```html
<script src="../dist/newrelic-video-anvato.min.js"></script>
```
Add this line to the onReady parameter of the player you want to instrument:

```html
  <div id="myVideo"></div>

  <script>
    AnvatoPlayer('myVideo').init({ trackTimePeriod: true, /*...*/ })
    nrvideo.Core.addTracker(new nrvideo.AnvatoTracker('myVideo'))
  </script>
```

## Known Limitations
Due to the information exposed by player provider, this tracker may not be able to report:
- `playhead`: see above.
- `adPosition`.