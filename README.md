[![New Relic Experimental header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#new-relic-experimental)

# New Relic Anvato Tracker

New Relic video tracking for Anvato.

## Requirements

This video monitor solutions works on top of New Relic's **Browser Agent**.

## Build

Install dependencies:

```
$ npm install
```

And build:

```
$ npm run build:dev
```

Or if you need a production build:

```
$ npm run build
```

## Notice

This tracker is designed to follow the specifications of [Anvato version 3 SDK](https://dev.anvato.net/api/playerv3).

### Getting Playhead

In order to retrieve the playhead, you will need to enable `trackTimePeriod` on the player.

## Usage

Load **scripts** inside `dist` folder into your page.

```html
<script src="../dist/newrelic-video-anvato.min.js"></script>
```

### Using AnvatoPlayer Class (Recomended)

If you use `AnvatoPlayer` class to init the player, use this integration method. We recommend using this system.

```html
  <div id="myVideo"></div>

  <script>
    AnvatoPlayer('myVideo').init({ trackTimePeriod: true, /*...*/ })
    nrvideo.Core.addTracker(new nrvideo.AnvatoTracker('myVideo'))
  </script>
```

### Using anvp namespace

Add this line to the onReady parameter of the player you want to instrument:

```html
  <div id="myVideo"></div>

  <script>
    var anvp = {}
    anvp.myVideo = {}
    anvp.myVideo.config = { 
      trackTimePeriod: true, 
      /*...*/ 
    }
    anvp.myVideo.onReady = function() {
      var tracker = new nrvideo.AnvatoTracker('myVideo')
      nrvideo.Core.addTracker(tracker)
      
      // Since this init method can't register listeners before the player is ready,
      // we need to trigger this event manually
      tracker.onReady()

      // Since this method only exposes one listener, you will need to call processEvent() 
      // manually.
      anvp.myVideo.setListener(function(event) {
        tracker.processEvent(event)
      })
    }
  </script>
```

## Known Limitations

Due to the information exposed by player provider, this tracker may not be able to report:

- `playhead`: see above.
- `src`.

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT. Issues and contributions should be reported to the project here on GitHub.

We encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.

## Contributing

We encourage your contributions to improve New Relic Anvato Tracker! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project. If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company, please drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License

New Relic Anvato Tracker is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
