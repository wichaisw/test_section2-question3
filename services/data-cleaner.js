function extractNavFromSymbol(arr, symbol) {
  for(let row = 1; row < arr.length; row++) {
    if(arr[row][0] === symbol) {
      return arr[row][1];
    };
  }

  return 'Invalid fund name';
}

export {
  extractNavFromSymbol
}