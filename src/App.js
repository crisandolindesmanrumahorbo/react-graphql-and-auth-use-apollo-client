import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { gql } from '@apollo/client';
import {setContext} from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: 'http://localhost:8081/graphql',
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhcmllZkBkb3dpdGguY29tIiwidXNlcklkIjoxLCJpYXQiOjE1OTczOTY4MTB9.RlhOP7M6PECtqLm683QPIoinv-zMV4GPO8p54D0SPrp6AVSngWHc6QmTu5pHASSoQm_zfD2WfUFZo95jFo6p8A"
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const testQuery = gql`
  query getSpesificVehicle($id: Int!){
    vehicle(id: $id){
      type
      modelCode
    }
  }
`;

client
    .query({
      query: testQuery,
      variables: {
          id: 4
      }
    })
    .then(result => console.log(result));

const testMutation = gql`
  mutation createVehicle($vehicle: VehicleWrapper){
    createVehicle(vehicle: $vehicle){
      id
      type
      modelCode
      brandName
    }
  }
    `;

client.mutate({
  mutation: testMutation,
  variables: {
    vehicle:{
      type: "car",
      modelCode: "carr",
      brandName: "String"
    }
  }
}).then(result => console.log(result));


function App() {
  return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </ApolloProvider>
  );
}

export default App;
