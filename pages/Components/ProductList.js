import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Card, ResourceList, Stack, TextStyle, Thumbnail } from '@shopify/polaris';
import store from 'store-js';

// Stephanie's learning comments:
  // Component that will list out the products that are selected from the resource picker
  // GraphQL is used to query shopify for product data based on the IDs collected from the resource picker (The only thing that the picker returns is product IDs. No additional product details are provided.)
    // The Query component from apollo returns some useful information: Data, loading state, and error messages

const renderItem = (item) => {
  const price = item.variants.edges[0].node.price;
  const media = (
    <Thumbnail
      source={item.images.edges[0] ? item.images.edges[0].node.originalSrc : ''}
      alt={item.images.edges[0] ? item.images.edges[0].altText : ''}
    />
  );

  return (
    <ResourceList.Item
      id={item.id}
      media={media}
      accessibilityLabel={`View details for ${item.title}`}
      onClick={() => store.set('item', item)}
    >
      <Stack>
        <Stack.Item fill>
          <h3>
            <TextStyle variation="strong">{item.title}</TextStyle>
          </h3>
        </Stack.Item>
        <Stack.Item>
          <p>${price}</p>
        </Stack.Item>
      </Stack>
    </ResourceList.Item>
  );
};

const ProductList = () => {
  return (
    <Query query={GET_PRODUCTS_BY_ID} variables={{ids: store.get('ids')}}>
      {({data, loading, error}) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>{error.message}</div>;

        return (
          <Card>
            <ResourceList
              showHeader
              resourceName={{ singular: 'Product', plural: 'Products' }}
              items={data.nodes}
              renderItem={renderItem}
            />
          </Card>
        )
      }}
    </Query>
  );
};

const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

export default ProductList;