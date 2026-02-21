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
    const settingGroups = groupSetting.groups;
    for (const group of currentUser.groups) {
      if (settingGroups.includes(group.id)) {
        return groupSetting;
      }
    }
  }

  return null;
}

export default apiInitializer((api) => {
  const router = api.container.lookup('service:router');
  
  api.onPageChange(async (url, title) => {
    const currentRoute = router.currentRoute;
    const currentUser = api.container.lookup('service:currentUser');
    console.log(currentUser.groups);

    let userProfileUsername;
    try {
      userProfileUsername = getParamsUsername(currentRoute);
    } catch (TypeError) {
      userProfileUsername = null;
    }

    if (userProfileUsername !== null) {
      const userModel = User.findByUsername(userProfileUsername);
      const groupData = getGroupSettingData(userModel);

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
      console.log(postAuthors);
      for (const user of postAuthors) {
        const posterUsername = user.children[0].children[0].children[0].innerText;
        let groupData;
        const userModel = await User.findByUsername(posterUsername);
        // const groupData = getGroupSettingData(userModel);
        let groupData = getGroupSettingData(res);
        console.log(groupData);

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
              .innerHTML += (
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
