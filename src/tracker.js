import * as nrvideo from 'newrelic-video-core'
import { version } from '../package.json'
import AnvatoAdsTracker from './ads'

export default class AnvatoTracker extends nrvideo.VideoTracker {
  setPlayer (player, tag) {
    if (typeof player === 'string') {
      if (typeof AnvatoPlayer !== 'undefined') {
        player = AnvatoPlayer(player)
      } else {
        player = anvp[player]
      }
    }

    nrvideo.VideoTracker.prototype.setPlayer.call(this, player)
  }

  resetValues () {
    this.title = null
    this.live = null
    this.bitrate = null
    this.playhead = null
    this.duration = null
    this.muted = null
  }

  getTrackerName () {
    return 'anvato'
  }

  getTrackerVersion () {
    return version
  }

  getPlayhead () {
    return this.playhead
  }

  getDuration () {
    return this.duration
  }

  getRenditionBitrate () {
    return this.bitrate
  }

  getTitle () {
    return this.title
  }

  isMuted () {
    return this.muted
  }

  getPlayerVersion () {
    try {
      return anvp.version
    } catch (err) {
      return null
    }
  }

  isAutoplayed () {
    return this.player.config.autoplay
  }

  loadAdTracker () {
    this.setAdsTracker(new AnvatoAdsTracker(this.player))
  }

  registerListeners () {
    if (this.player.on) { // Anvato v3 system
      if (nrvideo.Log.level <= nrvideo.Log.Levels.DEBUG) {
        let ev = [
          'ready',
          'PRESENTATION_UPDATED',
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
          'NEXT_PROGRAM',
          'METADATA_LOADED',
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

      this.player.on('ready', this.onReady.bind(this))
      this.player.on('METADATA_LOADED', this.onMetadataLoaded.bind(this))
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
      this.player.on('BITRATE_CHANGED', this.onBitrateChanged.bind(this))
      this.player.on('TIME_UPDATED', this.onTimeUpdated.bind(this))
      this.player.on('MUTED', this.onMuted.bind(this))
      this.player.on('UNMUTED', this.onUnmuted.bind(this))
    }
  }

  unregisterListeners () {
    if (this.player.off) {
      this.player.off('ready', this.onReady)
      this.player.off('METADATA_LOADED', this.onMetadataLoaded)
      this.player.off('USER_PLAY', this.onUserPlay)
      this.player.off('PLAYING_START', this.onPlayingStart)
      this.player.off('USER_PAUSE', this.onUserPause)
      this.player.off('USER_RESUME', this.onUserResume)
      this.player.off('USER_FORWARD_SEEK', this.onUserForwardSeek)
      this.player.off('USER_BACKWARD_SEEK', this.onUserBackwardSeek)
      this.player.off('BUFFER_END', this.onBufferEnd)
      this.player.off('BUFFER_START', this.onBufferStart)
      this.player.off('VIDEO_COMPLETED', this.onVideoCompleted)
      this.player.off('PLAYER_ERROR', this.onError)
      this.player.off('BITRATE_CHANGED', this.onBitrateChanged)
      this.player.off('TIME_UPDATED', this.onTimeUpdated)
      this.player.off('MUTED', this.onMuted)
      this.player.off('UNMUTED', this.onUnmuted)
    }
  }

  processEvent (e) {
    if (nrvideo.Log.level <= nrvideo.Log.Levels.DEBUG) {
      nrvideo.Log.debug('Event:', e)
    }

    if (this.adsTracker) this.adsTracker.processEvent(e)
    switch (e.name) {
      case 'METADATA_LOADED':
        this.onMetadataLoaded.apply(this, e.args)
        break
      case 'USER_PLAY':
        this.onUserPlay.apply(this, e.args)
        break
      case 'PLAYING_START':
        this.onPlayingStart.apply(this, e.args)
        break
      case 'USER_PAUSE':
        this.onUserPause.apply(this, e.args)
        break
      case 'USER_RESUME':
        this.onUserResume.apply(this, e.args)
        break
      case 'USER_FORWARD_SEEK':
        this.onUserForwardSeek.apply(this, e.args)
        break
      case 'USER_BACKWARD_SEEK':
        this.onUserBackwardSeek.apply(this, e.args)
        break
      case 'BUFFER_END':
        this.onBufferEnd.apply(this, e.args)
        break
      case 'BUFFER_START':
        this.onBufferStart.apply(this, e.args)
        break
      case 'VIDEO_COMPLETED':
        this.onVideoCompleted.apply(this, e.args)
        break
      case 'PLAYER_ERROR':
        this.onError.apply(this, e.args)
        break
      case 'BITRATE_CHANGED':
        this.onBitrateChanged.apply(this, e.args)
        break
      case 'TIME_UPDATED':
        this.onTimeUpdated.apply(this, e.args)
        break
      case 'MUTED':
        this.onMuted.apply(this, e.args)
        break
      case 'UNMUTED':
        this.onUnmuted.apply(this, e.args)
        break
    }
  }

  onMetadataLoaded (id, id2, data) {
    this.title = data.title
    this.live = data.live
  }

  onReady () {
    this.loadAdTracker()
    this.sendPlayerReady()
  }

  onUserPlay () {
    this.player.getDuration((duration) => { this.duration = duration * 1000 })
    this.sendRequest()
  }

  onPlayingStart () {
    this.player.getDuration((duration) => { this.duration = duration * 1000 })
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
    this.resetValues()
  }

  onError (code, msg, isCritical) {
    this.sendError({ errorCode: code, errorMsg: msg, errorIsFatal: isCritical })
    if (isCritical) this.sendEnd()
  }

  onBitrateChanged (bitrate) {
    this.bitrate = bitrate * 1000
    this.sendRenditionChanged()
  }

  onTimeUpdated (playhead) {
    if (!this.adsTracker || !this.adsTracker.state.isRequested) this.playhead = playhead * 1000
  }

  onMuted () {
    this.muted = true
  }

  onUnmuted () {
    this.muted = false
  }
}

// Static members
export {
  AnvatoAdsTracker
}
