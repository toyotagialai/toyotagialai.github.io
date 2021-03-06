function getdevice() {
  var md = new MobileDetect(window.navigator.userAgent);
  var myhtml = document.getElementsByTagName("html");
  //Desktop
  if (md.phone() === null && md.tablet() === null) {
    myhtml[0].classList.add("isDesktop");
    myhtml[0].classList.remove("isMobile");
    myhtml[0].classList.remove("isTablet");
    myhtml[0].classList.remove("isPhone");
  }
  //Mobile
  else {
    myhtml[0].classList.add("isMobile");
    myhtml[0].classList.remove("isDesktop");
    if (md.phone()){
      myhtml[0].classList.add("isPhone");
      myhtml[0].classList.remove("isTablet");
    }
    else{
      myhtml[0].classList.remove("isPhone");
      myhtml[0].classList.add("isTablet");
    }

  }

  //browser
  var ua = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  var browser = '';
  if (navigator.userAgent.match(/Edge/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) {
    browser = "msie";
  }
  else {
    browser = ua[1].toLowerCase();
    if (browser === 'safari')
    {
      myhtml[0].classList.add("safari");
    }

    else{
      myhtml[0].classList.remove("safari");
    }
  }
}

document.addEventListener("DOMContentLoaded", getdevice);
window.addEventListener("resize", getdevice);
