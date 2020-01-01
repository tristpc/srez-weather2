module.exports = {
  pathPrefix: '/weatherapp',
  siteMetadata: {
    title: 'City Weather v1.0',
  },
  plugins: [
    // {
    //   resolve: 'gatsby-plugin-typography',
    //   options: {
    //     pathToConfigModule: 'src/utils/typography',
    //   },
    // },
    {
      resolve: 'gatsby-openweathermap',
      options: {
        appid: 'bd586fd23c1ee5b08ef59926e847b6e0',
        q: 'Vancouver,ca',
        units: 'metric'
      },
    },
  ],
};
