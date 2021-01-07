/*
* Toggling Mobile and Desktop
*/
export default function (mobileSize) {
  let obj = this;
  this.isMobile = -1;
  this.mobileCallbacks = [];
  this.desktopCallbacks = [];
  this.mobileSize = mobileSize ? mobileSize : 767;

  /* Check mobile on resize */
  this.resized = function()	{
		if ((obj.isMobile === -1 || !obj.isMobile) && 'matchMedia' in window && window.matchMedia('(max-width: ' + obj.mobileSize + 'px)').matches) {
			obj.isMobile = true;
      obj.callMobile();
      $(window).trigger('toggle');
		} else if ((obj.isMobile === -1 || obj.isMobile) && 'matchMedia' in window && window.matchMedia('(min-width: ' + (obj.mobileSize + 1) + 'px)').matches) {
			obj.isMobile = false;
      obj.callDesktop();
      $(window).trigger('toggle');
		}
	};

  /* Call callbacks */
  obj.callMobile = function() {
    obj.mobileCallbacks.forEach(function(callback) {
      callback();
    });
  };

  obj.callDesktop = function() {
    obj.desktopCallbacks.forEach(function(callback) {
      callback();
    });
  };

  /* Add callbacks */
  this.addCallbacks = function(_mobileCallback, _desktopCallback, _autoRun) {
    obj.mobileCallbacks.push(_mobileCallback);
    obj.desktopCallbacks.push(_desktopCallback);
    if (_autoRun === undefined || _autoRun == true) {
      if (obj.isMobile === true) {
        _mobileCallback()
      } else if (obj.isMobile === false) {
        _desktopCallback()
      }
    }
    return obj;
  };

  this.kill = function() {
    this.mobileCallbacks = [];
    this.desktopCallbacks = [];
    $(window).off('resize orientationchange load', obj.resized);
  };

  /* Initializer */
  $(window).on('resize orientationchange load', obj.resized);
  obj.resized();
  return this;
}
