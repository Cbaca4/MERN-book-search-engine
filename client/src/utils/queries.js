import { gql } from '@apollo/client';

export const QUERY_ME = gql`
query me {
    user {
        _id
        username
        email
        savedBooks {
            _id
            bookId
            authors
            description
            title
            image
            link
        }
    }   
    }
`;