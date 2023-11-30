const Matrix = (list, num) => {
  var matrix = [],
    i,
    k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % num === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
  }

  return matrix;
};

export default Matrix;
