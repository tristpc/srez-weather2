import React from "react"
import { StaticQuery, graphql } from "gatsby"

export default ({ children }) => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}

    render={data => (
      <div className="container">
        <h1>{data.site.siteMetadata.title}</h1>
        {children}
        <footer className="footer">Happily built using <a href="https://www.gatsbyjs.org/">Gatsby</a> :)</footer>
      </div>
    )}
/>
)
