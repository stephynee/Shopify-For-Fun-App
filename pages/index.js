import { useState } from 'react';
import { Page, Card, EmptyState } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import store from 'store-js';
import ProductList from './Components/ProductList';

// Stephanie's learning comments:
  // App Bridge and Polaris are combined to display a product select on empty state. The resource picker is used to show a list of products that the user can select. The ProductList component is then rendered with a list of the selected products
  // Local storage used to persist data (Since I'm not using a data base here)

// TODO:
  // Fix the error where text content does not match between server and client

const Index = () => {
  const [isResourcePickerOpen, setResourcePickerOpen] = useState(false);
  const hasProducts = store.get('ids');

  const emptyState = <>
    <EmptyState
      heading="Select some products. I don't know what I'm going to do with this yet."
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      action={{
        content: "Select products",
        onAction: () => {
          setResourcePickerOpen(true);
        }
      }}
    />
    <ResourcePicker
      resourceType="Product"
      open={isResourcePickerOpen}
      onSelection={(selectPayload) => {
        const selected = selectPayload.selection.map(product => product.id);
        setResourcePickerOpen(false);
        store.set('ids', selected);
      }}
      onCancel={() => {
        setResourcePickerOpen(false);
      }}
    />
  </>;

  return (
    <Page>
      <Card>{hasProducts ? (<ProductList />) : emptyState}</Card>
    </Page>
  );
};

export default Index;
