import { gql } from '@apollo/client';

export const SEARCH_COUNTRIES = gql`
query {
    countries {
      code
      name
      capital
      currency
      continent {
        name
      }
      languages{
        name
      }
      states{
        name
      }
      
    }
  }
`;
export const GET_COUNTRIES_BY_CONTINENTS = gql`
query GetCountriesByContinents($continentCodes: [String!]!) {
  countries(filter: { continent: { in: $continentCodes } }) {
    code
      name
      capital
      currency
      continent {
        name
      }
      languages{
        name
      }
      states{
        name
      }
  }
}
`;

export const GET_CONTINENTS = gql`
  query {
    continents {
      code
      name
    }
  }
`;