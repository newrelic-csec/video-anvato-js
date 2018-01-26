import * as nrvideo from 'newrelic-video-core'
import { version } from '../package.json'

export default class JwplayerAdsTracker extends nrvideo.VideoTracker {
  resetValues () {
    this.playhead = null
    this.id = null
    this.provider = null
    this.title = null
    this.duration = null
  }

  getTrackerName () {
    return 'anvato-ads'
  }

  getTrackerVersion () {
    return version
  }

  getDuration () {
    return this.duration
  }

  getVideoId () {
    return this.id
  }

  getAdPartner () {
    return this.provider
  }

  getPlayhead () {
    return this.playhead
  }

  getTitle () {
    return this.title
  }

  registerListeners () {
    if (this.player.on) { // Anvato v3 system
      if (nrvideo.Log.level <= nrvideo.Log.Levels.DEBUG) {
        let ev = [
          'AD_BREAKS',
          'AD_BREAK_STARTED',
          'AD_STARTED',
          'AD_FIRST_QUARTILE',
          'AD_MID_POINT',
          'AD_THIRD_QUARTILE',
          'AD_COMPLETED',
          'AD_BREAK_COMPLETED',
          'AD_SKIPPED',
          'ALL_ADS_COMPLETED',
          'AD_CLICKED',
          'COMPANION_AVAILABLE',
          'NON_LINEAR_AD_DISPLAYED',
          'AD_IMMINENT',
          'POPUP_DISPLAYED',
          'POPUP_BLOCKED'
        ]

        for (let i = 0; i < ev.length; i++) {
          let e = ev[i]
          this.player.on(e, function (arg) {
            nrvideo.Log.debug('Event: ' + e, arg)
          })
        }
      }

      this.player.on('AD_BREAK_STARTED', this.onAdBreakStart.bind(this))
      this.player.on('AD_BREAK_COMPLETED', this.onAdBreakCompleted.bind(this))
      this.player.on('AD_FIRST_QUARTILE', this.onFirstQuartile.bind(this))
      this.player.on('AD_MID_POINT', this.onMidPoint.bind(this))
      this.player.on('AD_THIRD_QUARTILE', this.onThirdQuartile.bind(this))
      this.player.on('AD_CLICKED', this.onClick.bind(this))
      this.player.on('AD_STARTED', this.onAdStarted.bind(this))
      this.player.on('AD_COMPLETED', this.onCompleted.bind(this))
      this.player.on('AD_SKIPPED', this.onSkipped.bind(this))
      this.player.on('TIME_UPDATED', this.onTimeUpdated.bind(this))
    }
  }

  unregisterListeners () {
    if (this.player.off) {
      this.player.off('AD_BREAK_STARTED', this.onAdBreakStart)
      this.player.off('AD_BREAK_COMPLETED', this.onAdBreakCompleted)
      this.player.off('AD_FIRST_QUARTILE', this.onFirstQuartile)
      this.player.off('AD_MID_POINT', this.onMidPoint)
      this.player.off('AD_THIRD_QUARTILE', this.onThirdQuartile)
      this.player.off('AD_CLICKED', this.onClick)
      this.player.off('AD_STARTED', this.onAdStarted)
      this.player.off('AD_COMPLETED', this.onCompleted)
      this.player.off('AD_SKIPPED', this.onSkipped)
      this.player.off('TIME_UPDATED', this.onTimeUpdated)
    }
  }

  processEvent (e) {
    switch (e.name) {
      case 'AD_BREAK_STARTED':
        this.onAdBreakStart.apply(this, e.args)
        break
      case 'AD_BREAK_COMPLETED':
        this.onAdBreakCompleted.apply(this, e.args)
        break
      case 'AD_FIRST_QUARTILE':
        this.onFirstQuartile.apply(this, e.args)
        break
      case 'AD_MID_POINT':
        this.onMidPoint.apply(this, e.args)
        break
      case 'AD_THIRD_QUARTILE':
        this.onThirdQuartile.apply(this, e.args)
        break
      case 'AD_CLICKED':
        this.onClick.apply(this, e.args)
        break
      case 'AD_STARTED':
        this.onAdStarted.apply(this, e.args)
        break
      case 'AD_COMPLETED':
        this.onCompleted.apply(this, e.args)
        break
      case 'AD_SKIPPED':
        this.onSkipped.apply(this, e.args)
        break
      case 'TIME_UPDATED':
        this.onTimeUpdated.apply(this, e.args)
        break
    }
  }

  onAdBreakStart () {
    this.sendAdBreakStart()
  }

  onAdBreakCompleted () {
    this.sendAdBreakEnd()
  }

  onFirstQuartile () {
    this.sendAdQuartile({ quartile: 1 })
  }

  onMidPoint () {
    this.sendAdQuartile({ quartile: 2 })
  }

  onThirdQuartile () {
    this.sendAdQuartile({ quartile: 3 })
  }

  onAdStarted (id, title, provider) {
    this.id = id
    this.title = title
    this.provider = provider
    this.player.getAdDuration((duration) => { this.duration = duration })
    this.sendRequest()
    this.sendStart()
  }

  onTimeUpdated (playhead) {
    if (this.state.isRequested) this.playhead = playhead * 1000
  }

  onSkipped (e) {
    this.sendEnd({ skipped: true })
    this.resetValues()
  }

  onCompleted (e) {
    this.sendEnd()
    this.resetValues()
  }

  onClick (e) {
    this.sendAdClick()
  }
}
