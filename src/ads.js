import * as nrvideo from 'newrelic-video-core'
import { version } from '../package.json'

export default class JwplayerAdsTracker extends nrvideo.VideoTracker {
  getTrackerName () {
    return 'jwplayer-ads'
  }

  getTrackerVersion () {
    return version
  }

  getDuration () {
    return this.duration
  }

  getSrc () {
    return this.resource
  }

  getPlayhead () {
    return this.playhead
  }

  getTitle () {
    return this.title
  }

  registerListeners () {
    nrvideo.Log.debugCommonVideoEvents(this.player, [
      null, 'adBlock', 'adStarted', 'adImpression', 'adPause', 'adPlay', 'adSkipped', 'adComplete',
      'adClick', 'adError', 'adRequest'
    ])

    this.player.on('adBlock', this.onBlock.bind(this))
    this.player.on('adRequest', this.onRequest.bind(this))
    this.player.on('adTime', this.onTime.bind(this))
    this.player.on('adStarted', this.onStarted.bind(this))
    this.player.on('adImpression', this.onImpression.bind(this))
    this.player.on('adPause', this.onPause.bind(this))
    this.player.on('adPlay', this.onPlay.bind(this))
    this.player.on('adSkipped', this.onSkipped.bind(this))
    this.player.on('adComplete', this.onComplete.bind(this))
    this.player.on('adClick', this.onClick.bind(this))
    this.player.on('adError', this.onError.bind(this))
  }

  unregisterListeners () {
    this.player.off('adBlock', this.onBlock)
    this.player.off('adRequest', this.onRequest)
    this.player.off('adTime', this.onTime)
    this.player.off('adStarted', this.onStarted)
    this.player.off('adImpression', this.onImpression)
    this.player.off('adPause', this.onPause)
    this.player.off('adPlay', this.onPlay)
    this.player.off('adSkipped', this.onSkipped)
    this.player.off('adComplete', this.onComplete)
    this.player.off('adClick', this.onClick)
    this.player.off('adError', this.onError)
  }

  onBlock () {
    // Special event only for jwp
    this.emit('AD_BLOCKED', this.getAttributes())
  }

  onRequest (e) {
    this.sendRequest()
  }

  onTime (e) {
    this.playhead = e.position
    this.duration = e.duration
    this.sendRequest()
    this.sendStart()
  }

  onStarted (e) {
    this.resource = e.tag
    this.title = e.adtitle
  }

  onImpression (e) {
    this.resource = e.tag
    this.title = e.adtitle
  }

  onPause (e) {
    this.sendPause()
  }

  onPlay (e) {
    this.sendResume()
  }

  onSkipped (e) {
    this.sendEnd({ skipped: true })
    this.resetValues()
  }

  onComplete (e) {
    this.sendEnd()
    this.resetValues()
  }

  onClick (e) {
    this.sendAdClick({ url: e.tag })
  }

  onError (e) {
    this.sendError({ errorMessage: e.message })
    this.sendEnd()
  }

  resetValues () {
    this.playhead = undefined
    this.duration = undefined
    this.resource = undefined
    this.title = undefined
  }
}
