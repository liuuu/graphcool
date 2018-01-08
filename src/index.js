import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink, split } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import 'tachyons';

import App from './components/App';
import CreatePost from './components/CreatePost';
import CreateUser from './components/CreateUser';
import LoginUser from './components/LoginUser';
// __SIMPLE_API_ENDPOINT__ looks like: 'https://api.graph.cool/simple/v1/__SERVICE_ID__'
const __SIMPLE_API_ENDPOINT__ = 'https://api.graph.cool/simple/v1/cjc34mv2b161101303w7v5n9x';

const httpLink = createHttpLink({ uri: __SIMPLE_API_ENDPOINT__ });

const __SUBSCRIPTIONS_API_ENDPOINT__ =
  'wss://subscriptions.us-west-2.graph.cool/v1/cjc34mv2b161101303w7v5n9x';
  
const wsLink = new WebSocketLink({
  uri: __SUBSCRIPTIONS_API_ENDPOINT__,
  options: {
    timeout: 30000,
    reconnect: true,
  },
});

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('graphcoolToken');
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader,
    },
  });
  return forward(operation);
});

const httpLinkWithAuthToken = middlewareLink.concat(httpLink);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLinkWithAuthToken,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/create" component={CreatePost} />
        <Route path="/login" component={LoginUser} />
        <Route path="/signup" component={CreateUser} />
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
);
