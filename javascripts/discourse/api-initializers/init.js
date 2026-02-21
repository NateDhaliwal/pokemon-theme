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
    console.log(settings.group_icon_data);
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

      if (groupData !== null) {
        document.getElementsByClassName(
          "user-profile-names__primary"
        )[0]
          .children[0]
          .replaceWith(
            htmlSafe(
              iconHTML(groupData.icon, {
                label: groupData.icon_label
              }),
            )
          );
      }
    }

    const postAuthors = document.getElementsByClassName("topic-meta-data");

    if (postAuthors.length !== 0 && currentRoute.parent.name === "topic") {
      for (const user of postAuthors) {
        const posterUsername = user.children[0].children[0].children[0].innerText;
        const groupData = getGroupSettingData(User.findByUsername(posterUsername));
        console.log(htmlSafe(
                  iconHTML(groupData.icon, {
                    label: groupData.icon_label
                  }),
                ));

        if (groupData !== null) {
          if (user.children[0].children[0].children[0].children.length !== 0)  {
            user
              .children[0]
              .children[0]
              .children[0]
              .children[0]
              .replaceWith(
                htmlSafe(
                  iconHTML(groupData.icon, {
                    label: groupData.icon_label
                  }),
                )
              );
          } else {
            user
              .children[0]
              .children[0]
              .children[0]
              .appendChild(
                htmlSafe(
                  iconHTML(groupData.icon, {
                    label: groupData.icon_label
                  }),
                )
              );
          }
        }
      }
    }
  });
});
