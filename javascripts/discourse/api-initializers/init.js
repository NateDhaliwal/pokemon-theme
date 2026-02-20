import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  const router = api.container.lookup('service:router');
  
  api.onPageChange((url, title) => {
    console.log(router.currentRoute.name);
  })
});
