export const user = [
  {
    _id: 'u1',
    username: 'hadar_harush1',
    password: 'hadar_harush1',
    fullname: 'Hadar harush',
    profileImgUrl:
      'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?cs=srgb&dl=pexels-andrew-dick-697509.jpg&fm=jpg',
    createdAt: 123543452,
    following: ['u2', 'u3', 'u4'],
    followers: ['u2', 'u3', 'u4'],
    savedPostsIds: [],
    activities: [{ id: 'ghgr', txt: 'ghdfg', type: 'likes' }],
    postsIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'],
  },
  {
    _id: 'u2',
    username: 'avraham_harush1',
    password: 'avraham_harush1',
    fullname: 'Avraham harush',
    profileImgUrl:
      'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?cs=srgb&dl=pexels-mohamed-abdelghaffar-771742.jpg&fm=jpg',
    createdAt: 123543452,
    following: ['u1', 'u3', 'u4'],
    followers: ['u1', 'u3', 'u4'],
    savedPostsIds: [],
    activities: [{ id: 'ghgr', txt: 'ghdfg', type: 'likes' }],
    postsIds: ['p11', 'p12'],
  },
  {
    _id: 'u3',
    username: 'dekel_harush1',
    password: 'dekel_harush1',
    fullname: 'Dekel harush',
    profileImgUrl:
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?cs=srgb&dl=pexels-chloe-kala-1043471.jpg&fm=jpg',
    createdAt: 123543452,
    following: ['u1', 'u2', 'u4'],
    followers: ['u1', 'u2', 'u4'],
    savedPostsIds: [],
    activities: [{ id: 'ghgr', txt: 'ghdfg', type: 'likes' }],
    postsIds: ['p13', 'p14'],
  },
  {
    _id: 'u4',
    username: 'frida_harush1',
    password: 'frida_harush1',
    fullname: 'Frida harush',
    profileImgUrl:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?cs=srgb&dl=pexels-pixabay-415829.jpg&fm=jpg',
    createdAt: 123543452,
    following: ['u1', 'u2', 'u3'],
    followers: ['u1', 'u2', 'u3'],
    savedPostsIds: [],
    activities: [{ id: 'ghgr', txt: 'ghdfg', type: 'likes' }],
    postsIds: ['p15', 'p16'],
  },
]