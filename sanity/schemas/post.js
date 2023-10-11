export const post = {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
    {
      name: 'smallDescription',
      title: 'Small Description',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
    },
    {
      name: 'departures',
      title: 'DeparturesCities',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'city' } }],
    },
    {
      name: 'destination',
      title: 'ArrivalCities',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'city' } }],
    },
    {
      title: 'PointsForts',
      name: 'pointsForts',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Idéal entre amis', value: 'amis' },
          { title: 'Idéal pour les familles', value: 'famille' },
          { title: 'Idéal pour les couples', value: 'couple' },
          { title: 'Vols directs', value: 'vol-direct' },
          { title: 'Voyage solo', value: 'privateHome' },
          { title: 'Randonnées', value: 'rando' }
        ]
      }
    },
    {
      title: 'Price Range',
      name: 'priceRange',
      type: 'object',
      fields: [
        {name: 'low', type: 'number', title: 'PriceRange Low'},
        {name: 'high', type: 'number', title: 'PriceRange High'},
      ]
    },
    {
      title: 'Link',
      name: 'href',
      type: 'url',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https', 'mailto', 'tel']
      })
    }
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
}
