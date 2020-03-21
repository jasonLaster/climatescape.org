import React from "react"
import { graphql } from "gatsby"

import { transformOrganizations } from "../utils/airtable"
import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import OrganizationFilter, {
  useOrganizationFilterState,
} from "../components/OrganizationFilter"
import AddOrganizationCTA from "../components/AddOrganizationCTA"
import SEO from "../components/seo"

const OrganizationsTemplate = ({ data, pageContext }) => {
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()

  let organizations = transformOrganizations(data)
  organizations = applyFilter(organizations)

  const organizationsTitle =
    filter.bySector || pageContext.sectorName
      ? filter.bySector?.name || pageContext.sectorName
      : "All"

  return (
    <Layout contentClassName="bg-gray-200">
      <SEO title={`${organizationsTitle} organizations on Climatescape`} />

      <div className="max-w-4xl mx-auto pb-4">
        <h2 className="text-3xl tracking-wide font-light p-3 md:mt-4">
          {organizationsTitle} organizations{" "}
          <AddOrganizationCTA variant="simple" />
        </h2>

        <OrganizationFilter
          currentFilter={filter}
          onClearFilter={() => setFilter.none()}
        />

        <div className="bg-white">
          {organizations.map(org => (
            <OrganizationCard
              title={org.title}
              description={org.description}
              tags={org.tags}
              location={org.location}
              headcount={org.headcount}
              orgType={org.orgType}
              slug={org.slug}
              homepage={org.homepage}
              logo={org.logo}
              sector={org.sector}
              showSector={!pageContext.sectorName}
              key={org.title}
              currentFilter={filter}
              onApplyFilter={setFilter}
            />
          ))}
        </div>
        <div className="bg-white mt-8 p-3 text-center border-b border-gray-400">
          <AddOrganizationCTA />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query OrganizationsPageQuery($slugRegex: String) {
    organizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: {
          Sector: { elemMatch: { data: { Slug: { regex: $slugRegex } } } }
        }
      }
    ) {
      nodes {
        data {
          Name
          Homepage
          About
          Tags
          Tagline
          HQ_Location
          Organization_Type
          Headcount
          Logo {
            localFiles {
              childImageSharp {
                fixed(
                  width: 64
                  height: 64
                  fit: CONTAIN
                  background: "white"
                ) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
          LinkedIn_Profiles {
            data {
              Logo {
                localFiles {
                  childImageSharp {
                    fixed(
                      width: 64
                      height: 64
                      fit: CONTAIN
                      background: "white"
                    ) {
                      ...GatsbyImageSharpFixed
                    }
                  }
                }
              }
            }
          }
          Sector {
            data {
              Slug
            }
          }
        }
      }
    }
    sectors: allAirtable(filter: { table: { eq: "Sectors" } }) {
      nodes {
        data {
          name: Name
          slug: Slug
        }
      }
    }
  }
`

export default OrganizationsTemplate
