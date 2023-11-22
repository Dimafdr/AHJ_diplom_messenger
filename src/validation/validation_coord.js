export default function validationCoord(data) {
  const re = /\[?-?\d{1,2}\.\d{5},\s?-?\d{1,2}\.\d{5}\]?/ig;
  const corresponds = re.test(data);
  const coordArr = [];
  let result;
  const regexp = /-?\d{1,2}\.\d{5}/ig;
  if (corresponds) {
    // eslint-disable-next-line no-cond-assign
    while (result = regexp.exec(data)) {
      coordArr.push(result[0]);
    }
  } else return false;
  const objCoord = {
    latitude: coordArr[0],
    longitude: coordArr[1],
  };
  return objCoord;
}
