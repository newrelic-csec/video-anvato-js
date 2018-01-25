import * as nrvideo from 'newrelic-video-core'
import { version } from '../package.json'

export default class AnvatoTracker extends nrvideo.VideoTracker {
  setPlayer (player, tag) {
    if (typeof player === 'string') {
      player = AnvatoPlayer(player)
    }

    nrvideo.VideoTracker.prototype.setPlayer.call(this, player)
  }

  resetValues () {

  }

  getTrackerName () {
    return 'anvato'
  }

  getTrackerVersion () {
    return version
  }

  getPlayhead () {
  }

  getDuration () {
  }

  getRenditionBitrate () {
  }

  getRenditionName () {
  }

  getRenditionWidth () {
  }

  getRenditionHeight () {
  }

  getTitle () {
  }

  getSrc () {
  }

  getPlayerVersion () {
  }

  isMuted () {
  }

  getPlayrate () {
  }

  isAutoplayed () {
  }

  getPreload () {
  }

  getLanguage () {
  }

  registerListeners () {
    if (nrvideo.Log.level <= nrvideo.Log.Levels.DEBUG) {
      let ev = [
        'ready',
        'STATE_CHANGE',
        'CLIENT_BANDWIDTH',
        'FIRST_FRAME_READY',
        'PLAYING_START',
        // 'TIME_UPDATED',
        'VIDEO_STARTED',
        'VIDEO_FIRST_QUARTILE',
        'VIDEO_MID_POINT',
        'VIDEO_THIRD_QUARTILE',
        'VIDEO_COMPLETED',
        'PLAYLIST_COMPLETED',
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
        'NEXT_PROGRAM',
        'METADATA_LOADED',
        'HOMEZIP_DETECTED',
        'POPUP_BLOCKED',
        'POPUP_DISPLAYED',
        'AD_IMMINENT',
        'PLAYER_ERROR',
        'USER_PLAY',
        'USER_RESUME',
        'USER_GOLIVE',
        'USER_PAUSE',
        'USER_FORWARD_SEEK',
        'USER_BACKWARD_SEEK',
        'BUFFER_START',
        'BUFFER_END',
        'BITRATE_CHANGED',
        'BITRATE_CHANGE_IN_PROGRESS',
        'MEDIA_URLS_SET',
        'BEFORE_VIDEO_LOAD',
        'PLAYLIST_ITEM_CHANGED'
      ]

      for (let i = 0; i < ev.length; i++) {
        let e = ev[i]
        this.player.on(e, function (arg) {
          nrvideo.Log.debug('Event: ' + e, arg)
        })
      }
    }

    this.player.on('METADATA_LOADED', this.onMetadataLoaded.bind(this))
    this.player.on('ready', this.onReady.bind(this))
    this.player.on('STATE_CHANGE', this.onStateChange.bind(this))
    this.player.on('USER_PLAY', this.onUserPlay.bind(this))
    this.player.on('PLAYING_START', this.onPlayingStart.bind(this))
    this.player.on('USER_PAUSE', this.onUserPause.bind(this))
    this.player.on('USER_RESUME', this.onUserResume.bind(this))
    this.player.on('USER_FORWARD_SEEK', this.onUserForwardSeek.bind(this))
    this.player.on('USER_BACKWARD_SEEK', this.onUserBackwardSeek.bind(this))
    this.player.on('BUFFER_END', this.onBufferEnd.bind(this))
    this.player.on('BUFFER_START', this.onBufferStart.bind(this))
    this.player.on('VIDEO_COMPLETED', this.onVideoCompleted.bind(this))
    this.player.on('PLAYER_ERROR', this.onError.bind(this))
  }

  unregisterListeners () {

  }

  onMetadataLoaded (id, id2, data) {
    this.title = data.title
    this.live = data.live
  }

  onReady () {
    this.sendPlayerReady()
  }

  onStateChange (state) {
    switch (state) {

    }
  }

  onUserPlay () {
    this.sendRequest()
  }

  onPlayingStart () {
    this.sendStart()
  }

  onUserPause () {
    this.sendPause()
  }

  onUserResume () {
    this.sendResume()
  }

  onUserForwardSeek () {
    this.sendSeekStart()
  }

  onUserBackwardSeek () {
    this.sendSeekStart()
  }

  onBufferStart () {
    if (!this.state.isSeeking) this.sendBufferStart()
  }

  onBufferEnd () {
    if (this.state.isSeeking) this.sendSeekEnd()
    if (this.state.isBuffering) this.sendBufferEnd()
  }

  onVideoCompleted () {
    this.sendEnd()
  }

  onError (code, msg, isCritical) {
    this.sendError({ errorCode: code, errorMsg: msg, errorIsFatal: isCritical })
    if (isCritical) this.sendEnd()
  }
}

// Static members
export {

}
