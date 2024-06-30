// 获取侧边栏袁术
const appSideNavigation = document.getElementById('app-side-navigation');
appSideNavigation.addEventListener('click', event => {
    // 检查点击的目标元素
    const clickEventId = event.target['id'];
    console.log(clickEventId)
    if (clickEventId !== 'app-side-navigation') {
        for (let i = 0; i < appSideNavigation.children.length; i++) {
            if (clickEventId === appSideNavigation.children[i]['id']) {
                appSideNavigation.children[i].classList.add('navigation_bar_click');
                appSideNavigation.children[i].classList.add('navigation_bar_click_no_hover');
            } else {
                appSideNavigation.children[i].classList.remove('navigation_bar_click');
                appSideNavigation.children[i].classList.remove('navigation_bar_click_no_hover');
            }
        }
    }

})