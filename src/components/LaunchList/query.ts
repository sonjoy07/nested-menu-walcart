import { gql } from '@apollo/client';

export const QUERY_LAUNCH_LIST = gql`
query CategoryList {
    getCategories(
      pagination:{
        limit: 100
        skip: 0
      }
    ) {
      
        message
        statusCode
        result {
          count
          categories {
            uid
            name
            parent {
              name
              uid
            }
            parents {
              name
              uid
            }
            isActive
            inActiveNote
            createdAt
            updatedAt
          }
        }
      
    }
  }
`;

