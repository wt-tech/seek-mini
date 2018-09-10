
// 随机生成字符串
function getRandomString(length=5,isSeekPerson) {
  let stamp = new Date().getTime();
  let chars = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'];

  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString = randomString + chars[Math.ceil(Math.random() * 25)];
  }
  let prefix = isSeekPerson ? 'xr' : 'xJ';
  randomString = prefix + stamp ;
  return randomString.toUpperCase();
}

function getRandomString2(length = 5, isVolunteer) {
  let stamp = new Date().getTime();
  let chars = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'];

  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString = randomString + chars[Math.ceil(Math.random() * 25)];
  }
  let prefix = isVolunteer ? 'ZYZ' : '';
  randomString = prefix + stamp;
  return randomString.toUpperCase();
}



module.exports = {
  getRandomString: getRandomString,
  getRandomString2: getRandomString2
}