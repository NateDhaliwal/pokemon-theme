import { htmlSafe } from "@ember/template";
import { apiInitializer } from "discourse/lib/api";
import { iconHTML } from "discourse/lib/icon-library";
import User from "discourse/models/user";

function getParamUsername(currentRoute) {
  if (currentRoute.params.username) return currentRoute.params.username;

  return getParamUsername(currentRoute.parent);
}

function getGroupSettingData(currentUser) {
  for (const groupSetting of settings.group_icon_data) {
    for (const group of currentUser.groups) {
      if (group.id === groupSetting.group) {
        return groupSetting;
      }
    }
  }

  return null;
}

export default apiInitializer((api) => {
  const router = api.container.lookup('service:router');
  
  api.onPageChange((url, title) => {
    const currentRoute = router.currentRoute;
    const currentUser = api.container.lookup('service:currentUser');

    let userProfileUsername;
    try {
      userProfileUsername = getParamsUsername(currentRoute);
    } catch (TypeError) {
      userProfileUsername = null;
    }

    if (userProfileUsername !== null) {
      const groupData = getGroupSettingData(User.findByUsername(userProfileUsername));
      document.getElementsByClassName(
        "user-profile-names__primary"
      )[0]
        .children[0]
        .replaceWith(
          htmlSafe(
            iconHTML(groupData.icon, {
              // eslint-disable-next-line no-undef
              label: groupData.iconLabel
            }),
          )
        );
    }

    const postAuthors = document.getElementsByClassName("topic-meta-data");

    if (postAuthors.length === 0 && currentRoute.parent.name === "topic") {
      for (const username of postAuthors) {
        const posterUsername = postAuthors.children[0].children[0].children[0].innerText;
        const groupData = getGroupSettingData(User.findByUsername(userProfileUsername));
      }
    }
  });
});
