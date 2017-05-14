/* eslint-disable */
function setCookie(params) {
  var name            = params.name,
      value           = params.value,
      expireDays      = params.days,
      expireHours     = params.hours,
      expireMinutes   = params.minutes,
      expireSeconds   = params.seconds;

  var expireDate = new Date();
  if (expireDays) {
      expireDate.setDate(expireDate.getDate() + expireDays);
  }
  if (expireHours) {
      expireDate.setHours(expireDate.getHours() + expireHours);
  }
  if (expireMinutes) {
      expireDate.setMinutes(expireDate.getMinutes() + expireMinutes);
  }
  if (expireSeconds) {
      expireDate.setSeconds(expireDate.getSeconds() + expireSeconds);
  }

  document.cookie = name +"="+ escape(value);
  document.cookie = "domain="+ window.location.hostname;
  document.cookie = "expires="+expireDate.toUTCString();
}

function deleteCookie(name) {
  setCookie({name: name, value: "", seconds: 1});
}

function getCookie(name) {

  var start = document.cookie.indexOf(name + "=");

  var len = start + name.length + 1;

  if ((!start) && (name != document.cookie.substring(0, name.length))) {

    return null;

  }

  if (start == -1) return null;

  var end = document.cookie.indexOf(';', len);

  if (end == -1) end = document.cookie.length;

  return unescape(document.cookie.substring(len, end));

}

export { getCookie, setCookie, deleteCookie }
