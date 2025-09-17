import { SourceGroup } from '../interfaces/Destination';

export const MARKET_DATA_GROUPS: SourceGroup = {
  dolar: [
    {
      url: 'https://open.er-api.com/v6/latest/USD',
      headers: { Accept: 'application/json' },
    },
    // {
    //   url: 'https://api.fixer.io/latest?base=USD',
    //   token: 'Bearer YOUR_API_KEY'
    // }
  ],
  // euro: [
  //   {
  //     url: 'https://api.exchangerate-api.com/v4/latest/EUR',
  //     headers: { 'Accept': 'application/json' }
  //   },
  //   {
  //     url: 'https://api.fixer.io/latest?base=EUR',
  //     token: 'Bearer YOUR_API_KEY'
  //   }
  // ],
  // bitcoin: [
  //   {
  //     url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
  //     headers: { 'Accept': 'application/json' }
  //   },
  //   {
  //     url: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
  //     headers: { 'Accept': 'application/json' }
  //   }
  // ]
};
