import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Post from '../components/Post';

const SUBSCRIPTION_ALL_POST = gql`
  subscription {
    Post(filter: { mutation_in: [CREATED] }) {
      mutation
      node {
        id
        description
        imageUrl
        author {
          id
        }
      }
    }
  }
`;

class ListPage extends React.Component {
  componentWillReceiveProps(nextProps) {
    console.log('nextProps.allPostsQuery.loading', nextProps.allPostsQuery.loading);
    if (!nextProps.allPostsQuery.loading) {
      if (nextProps.allPostsQuery.allPosts !== this.props.allPostsQuery.allPosts) {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
        this.unsubscribe = this.subscription();
      }
    }
  }

  subscription = () => {
    console.log('called subscribeToMore');

    return this.props.allPostsQuery.subscribeToMore({
      document: SUBSCRIPTION_ALL_POST,
      variables: null,
      updateQuery: (previousState, { subscriptionData }) => {
        console.log('previousState', previousState);
        console.log('subscriptionData.Post.node', subscriptionData.Post.node);

        const newPost = subscriptionData.Post.node;
        const afterState = {
          ...previousState,
          allPosts: [
            {
              ...newPost,
            },
            ...previousState.allPosts,
          ],
        };
        console.log('afterState', afterState);

        return afterState;
      },
      onError: err => console.error(err),
    });
  };

  render() {
    if (this.props.allPostsQuery.loading) {
      return <div>Loading</div>;
    }

    return (
      <div className="w-100 flex justify-center">
        <div className="w-100" style={{ maxWidth: 400 }}>
          {console.log(this.props.allPostsQuery) ||
            this.props.allPostsQuery.allPosts.map(post => <Post key={post.id} post={post} />)}
        </div>
      </div>
    );
  }
}

const ALL_POSTS_QUERY = gql`
  query AllPostsQuery {
    allPosts(orderBy: createdAt_DESC) {
      id
      imageUrl
      description
    }
  }
`;

export default graphql(ALL_POSTS_QUERY, {
  name: 'allPostsQuery',
  options: {
    fetchPolicy: 'network-only',
  },
})(ListPage);
