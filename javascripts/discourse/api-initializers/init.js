import { apiInitializer } from "discourse/ib/api";

export default apiInitializer((api) => {
  api.onPageChange((url, title) => {
    console.log(url, title);
  })
});
