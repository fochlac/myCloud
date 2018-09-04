const today = Date.now()
const day = 3600 * 24 * 1000

export default {
  users: {
    u_1: {
      name: 'Florian',
      id: 'u_1',
    },
    u_2: {
      name: 'Mela',
      id: 'u_2',
    },
  },
  app: {
    currentUser: 1,
    isAdmin: true,
    busy: [],
    calendar: {}
  },
  posts: ['e_1', 'n_1', 'e_2'],
  events: {
    e_1: {
      id: 'e_1',
      type: 'birthday',
      date: today + day * 3,
      name: `Niko`,
      author: 'u_1',
      recurring: { interval: 'yearly', times: 0 },
      public: true,
      comments: [
        {
          author: 'u_2',
          created: today - day,
          content: 'nur persönlich gratulieren',
        },
      ],
    },
    e_2: {
      public: true,
      id: 'e_2',
      type: 'event',
      date: today + day * 5,
      created: today - day * 2,
      name: `Niko's Geburtstagsfeier`,
      description: 'Übernachtung geht klar, Schlafsack mitbringen',
      author: 'u_1',
      recurring: false,
      comments: [
        {
          author: 'u_2',
          created: today - day,
          content: 'Geschenk mitbringen',
        },
      ],
    },
  },
  notes: {
    n_1: {
      id: 'n_1',
      updated: today - 10000,
      author: 'u_1',
      type: 'note',
      created: today - day,
      name: 'Einkaufsliste',
      content: 'blah blubb',
      public: true,
      list: [
        {
          checked: false,
          content: 'milch',
          id: 'le_1',
        },
        {
          checked: false,
          content: 'butter',
          id: 'le_2',
        },
      ],
    },
  },
}

//'e1', 'n1', 'e2'
