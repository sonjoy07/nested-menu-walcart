import { gql } from '@apollo/client';

export const CREATE_CATEGORY = gql`
mutation CreateCategory($category: CategoryCreateInput!) {
    createCategory(category: $category) {
      message
      statusCode
      result {
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
`;
export const UPDATE_CATEGORY = gql`
mutation UpdateCategory($category: updateCategoryCreateInput!, $categoryUid: String!) {
    updateCategory(category: $category, categoryUid: $categoryUid) {
      message
      result {
        isActive
        inActiveNote
        name
        parent {
          name
          uid
        }
        parents {
          name
          uid
        }
        uid
        updatedAt
        createdAt
      }
    }
  }
`;

