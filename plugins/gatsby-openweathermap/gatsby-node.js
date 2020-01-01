const fetch = require('node-fetch');
const queryString = require('query-string');

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;
  
  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins;
  
  // Convert the options object into a query string
  const apiOptions = queryString.stringify(configOptions);
  
  // Join apiOptions with the opeanweathermap API URL
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?${apiOptions}`;//q=London,us&mode=json
  
  // Gatsby expects sourceNodes to return a promise
  return (
  // Fetch a response from the apiUrl
    fetch(apiUrl)
      // Parse the response as JSON
      .then(response => response.json())
      // Process the response data into a node
      .then(data => {
        //console.log('data is: ', data);


        const nodeId = createNodeId(`openweathermap-${data.city.id}`);
        const nodeContent = JSON.stringify(data);
        const nodeData = Object.assign({}, data, {
          id: nodeId,
          parent: null,
          children: [],
          internal: {
            type: `OpenWeather`,
            content: nodeContent,
            contentDigest: createContentDigest(data),
          },
        });

        createNode(nodeData);
        // // For each query result (or 'hit')
        // data.hits.forEach(photo => {
        //   // Process the photo data to match the structure of a Gatsby node
        //   const nodeData = processPhoto(photo);
        //   // Use Gatsby's createNode helper to create a node from the node data
        //   createNode(nodeData);
        // })
      })
  );
};
