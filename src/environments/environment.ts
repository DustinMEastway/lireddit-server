export const environment = {
  cookieName: 'qid',
  database: {
    name: 'lireddit',
    type: 'postgresql'
  },
  port: 4000,
  prod: false,
  urls: {
    app: 'http://localhost:3000'
  }
} as const;
