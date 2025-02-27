export interface Post {
  filter(arg0: (person: any) => any);
  _id: string;
  _createdAt: string;
  title: string;

  author: {
    name: string;
    image: string;
    bio: string;
  };
  comments: Comment[];
  departures: City[];
  pointsForts: string[];
  href: string,
  destination: City[];
  priceRange: {low: number, high: number}
  link: string,
  description: string;

  mainImage: {
    assest: {
      url: string;
    };
  };
  userImage: {
    assest: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: [object];
  price: string;
  smallDescription: string;
}

interface City {
  title: string;
  description: string;
}

export interface Comment {
  userImage: {
    assest: {
      url: string;
    };
  };
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  likes: number;
  last: string;
  post: {
    _ref: string;
    _type: string;
  };
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updateAt: string;
}
