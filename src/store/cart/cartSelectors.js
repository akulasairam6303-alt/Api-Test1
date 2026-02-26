import { createSelector } from "@reduxjs/toolkit";

const selectCartItemsObject = (state) => state.cart.items || {};

export const selectCartArray = createSelector(
  [selectCartItemsObject],
  (itemsObj) => Object.values(itemsObj)
);


export const selectCartTotalQuantity = createSelector(
  [selectCartArray],
  (items) =>
    items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotalPrice = createSelector(
  [selectCartArray],
  (items) =>
    items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
);