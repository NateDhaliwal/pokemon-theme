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
  const appEvents = api.container.lookup('service:appEvents');
  
  api.onPageChange(async (url, title) => {
    const currentRoute = router.currentRoute;
    const currentUser = api.container.lookup('service:currentUser');

    let userProfileUsername;
    try {
      userProfileUsername = getParamUsername(currentRoute);
    } catch (TypeError) {
      userProfileUsername = null;
    }

    // User routes
    if (userProfileUsername !== null) {
      const userModel = await User.findByUsername(userProfileUsername);
      const groupData = getGroupSettingData(userModel);

      if (groupData !== null) {
        const svgParent = document.getElementsByClassName("user-profile-names__primary")[0];
        if (svgParent.children.length > 0) svgParent.removeChild(svgParent.children[0]);
        svgParent.innerHTML += htmlSafe(
          iconHTML(groupData.icon, {
            label: groupData.icon_label
          })
        );
      }
    }

    // Topics and posts
    const postAuthors = document.getElementsByClassName("topic-meta-data");

    if (postAuthors.length !== 0 && currentRoute.parent.name === "topic") {
      for (const user of postAuthors) {
        const userInfo = user.children[0].children[0].children[0];
        const posterUsername = userInfo.innerText;
        const userModel = await User.findByUsername(posterUsername);
        const groupData = getGroupSettingData(userModel);

        if (groupData !== null) {
          if (userInfo.children.length > 0) userInfo.removeChild(userInfo.children[0]);
          userInfo.innerHTML += htmlSafe(
            iconHTML(groupData.icon, {
              label: groupData.icon_label
            })
          );
        }
      }
    }

    // User cards
    appEvents.on("card:show", async (username, target, event) => {
      // It's quite hacky, but we wait 1 second before trying to get the element via DOM.
      
      // Source - https://stackoverflow.com/a/47480429
      // Posted by Etienne Martin, modified by community. See post 'Timeline' for change history
      // Retrieved 2026-02-21, License - CC BY-SA 4.0

      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(1000);
      const userCardUserLink = document.getElementsByClassName("user-profile-link")[0]; // Only 1 user card open at a time
      const userModel = await User.findByUsername(username);
      const groupData = getGroupSettingData(userModel);

      if (groupData !== null) {
        if (userCardUserLink.children.length > 1) userCardUserLink.removeChild(userCardUserLink.children[1]);
        userCardUserLink.innerHTML += htmlSafe(
          iconHTML(groupData.icon, {
            label: groupData.icon_label
          })
        );
      }
    });
  });
});
