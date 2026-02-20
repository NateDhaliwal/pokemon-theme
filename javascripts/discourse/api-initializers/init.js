import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  api.onPageChange((url, title) => {
    console.log(url, title);
  })
});
