/* Event string shortcuts */
export const TRANSITION_END = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'
export const ANIMATION_END = 'webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend'

/* Use with caution */
export const IS_IOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
export const IS_ANDROID = /(android)/i.test(navigator.userAgent)
