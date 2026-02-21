import { htmlSafe } from "@ember/template";
import { apiInitializer } from "discourse/lib/api";
import { iconHTML } from "discourse/lib/icon-library";
import User from "discourse/models/user";

function getParamUsername(currentRoute) {
  if (currentRoute.params.username) return currentRoute.params.username;

  return getParamUsername(currentRoute.parent);
}

function getGroupSettingData(currentUser) {
  console.log(currentUser);
  
  for (const groupSetting of settings.group_icon_data) {
    for (const group of currentUser.groups) {
      if (groupSetting.group.includes(group.id)) {
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
      const user = await User.findByUsername(userProfileUsername);
      const groupData = getGroupSettingData(user);

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
        console.log(user);
        const posterUsername = user.children[0].children[0].children[0].innerText;
        console.log(posterUsername);
        const user = User.findByUsername(posterUsername).then((res) => console.log(res));
        const groupData = getGroupSettingData(user);
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
