import { createSelector } from "@reduxjs/toolkit";

/* Raw object from slice */
const selectCartItemsObject = (state) => state.cart.items || {};

/* Convert object → array safely */
export const selectCartArray = createSelector(
  [selectCartItemsObject],
  (itemsObj) => Object.values(itemsObj)
);

/* Total Quantity */
export const selectCartTotalQuantity = createSelector(
  [selectCartArray],
  (items) =>
    items.reduce((total, item) => total + item.quantity, 0)
);

/* Total Price */
export const selectCartTotalPrice = createSelector(
  [selectCartArray],
  (items) =>
    items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
);