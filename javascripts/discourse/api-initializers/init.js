import { apiInitializer } from "discourse/lib/api";

function getParamUsername(currentRoute) {
  if (currentRoute.params.username) return currentRoute.params.username;

  return getParamUsername(currentRoute.parent);
}

export default apiInitializer((api) => {
  const router = api.container.lookup('service:router');
  
  api.onPageChange((url, title) => {
    const currentRoute = router.currentRoute;
    const currentUser = api.container.lookup('service:currentUser');
    console.log(currentUser);
    console.log(currentRoute);
    console.log(getParamUsername(currentRoute));
  });
});
