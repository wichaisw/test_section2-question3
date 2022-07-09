const { extractNavFromSymbol } = require('../../services/data-cleaner');

describe('element-scrapper.test.js', () => {
  const mockNav = [
    [],
    [ 'B-INCOMESSF', '10.0548', '10.0549', '10.0548', '0.0107' ],
    [ 'BM70SSF', '9.9774', '9.9775', '9.9774', '0.0927' ],
    [ 'BEQSSF', '11.247', '11.2471', '11.247', '0.1319' ],
    [ 'B-FUTURESSF', '11.443', '11.4431', '11.443', '0.1488' ]
  ]

  it('should return error message if no nav found', () => {
    expect(extractNavFromSymbol(mockNav, '123')).toEqual('Invalid fund name');
  });
  
  it('should return NAV value if symbol is valid', () => {
    expect(extractNavFromSymbol(mockNav, 'B-FUTURESSF')).toEqual('11.443');
    expect(extractNavFromSymbol(mockNav, 'BM70SSF')).toEqual('9.9774');
  });
});