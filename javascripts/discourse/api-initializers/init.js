import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  const router = api.container.lookup('service:router');
  
  api.onPageChange((url, title) => {
    const currentRoute = router.currentRoute.name);
    const currentUser = api.container.lookup('service:currentUser');
    console.log(currentUser);
  })
});
