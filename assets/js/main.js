
function appSideNavigation(clickEventId){
    let appSideNavigationElement = document.getElementById('app-side-navigation');
    if (clickEventId !== 'app-side-navigation') {
        for (let i = 0; i < appSideNavigationElement.children.length; i++) {
            if (clickEventId === appSideNavigationElement.children[i]['id']) {
                appSideNavigationElement.children[i].classList.add('navigation_bar_click');
                appSideNavigationElement.children[i].classList.add('navigation_bar_click_no_hover');
            } else {
                appSideNavigationElement.children[i].classList.remove('navigation_bar_click');
                appSideNavigationElement.children[i].classList.remove('navigation_bar_click_no_hover');
            }
        }
        let appContentElement = document.getElementById('app-content')
        for (let i = 0; i < appContentElement.children.length; i++) {
            if(appContentElement.children[i]['id'].replace('app-content', '') === clickEventId.replace('app-side', '')) {
                appContentElement.children[i].classList.remove('block_none')
            }else {
                appContentElement.children[i].classList.add('block_none')
            }
        }

    }

    let windowsWidth = window.innerWidth;
    if (windowsWidth < 1100) {
        close_header()
    }
}

function app_content_writing_click(post_element_id) {
    var element =  document.getElementById(post_element_id);
    var siblings = Array.prototype.filter.call(element.parentNode.children, function(child) {
        return child !== element;
    });
    for (let i = 0; i < siblings.length; i++) {
        siblings[i].classList.remove('include-writing-post-title_click');
        siblings[i].classList.remove('include_writing_body_post_click');
    }

    element.classList.add('include-writing-post-title_click');
    element.classList.add('include_writing_body_post_click');

    document.getElementById('include-writing-post-content-block').innerHTML = document.getElementById(post_element_id + "-post").outerHTML


    let windowsWidth = window.innerWidth;
    if (windowsWidth < 1100) {
        document.getElementById('include-writing-post-content-block').classList.add('translateX0d')


        document.getElementById('post_icon_return___').style.opacity='1'
        document.getElementById('post_icon_return___').style.display='unset'

        document.getElementById('side_icon_____').style.display='none'
        document.getElementById('side_icon_____').style.opacity='0'
    }
}



function app_content_bookmark_click(post_element_id) {
    var element =  document.getElementById(post_element_id);
    var siblings = Array.prototype.filter.call(element.parentNode.children, function(child) {
        return child !== element;
    });
    for (let i = 0; i < siblings.length; i++) {
        siblings[i].classList.remove('include-writing-post-title_click');
        siblings[i].classList.remove('include_writing_body_post_click');
    }

    element.classList.add('include-writing-post-title_click');
    element.classList.add('include_writing_body_post_click');

    document.getElementById('include-bookmark-post-content-block').innerHTML = document.getElementById(post_element_id + "-post").outerHTML

   let windowsWidth = window.innerWidth;
    if (windowsWidth < 1100) {
        document.getElementById('include-bookmark-post-content-block').classList.add('translateX0d')

        document.getElementById('post_icon_return___').style.opacity='1'
        document.getElementById('post_icon_return___').style.display='unset'

        document.getElementById('side_icon_____').style.display='none'
        document.getElementById('side_icon_____').style.opacity='0'
    }
}


function open_header() {
    const side_icon_____display = document.getElementById('side_icon_____').style.display
    if (side_icon_____display === 'none') {
        document.getElementById('post_icon_return___').style.opacity='0'
        document.getElementById('post_icon_return___').style.display='none'

        document.getElementById('side_icon_____').style.display='unset'
        document.getElementById('side_icon_____').style.opacity='1'


        document.getElementById('include-writing-post-content-block').classList.remove('translateX0d')
        document.getElementById('include-bookmark-post-content-block').classList.remove('translateX0d')
        return
    }


    const appContentElement = document.getElementById('app-content');
    appContentElement.classList.add('scale_0d9333333333333333')
    appContentElement.classList.add('overflow-y_hidden')

    const mobileHeaderElement = document.getElementById('mobile_header');
    mobileHeaderElement.classList.add('scale_0d9333333333333333')
    mobileHeaderElement.classList.add('border-radius12px_top')


    document.getElementById('app-side').classList.add('show_translateYd0')


    document.getElementsByTagName('body')[0].classList.add('bg_000')
    document.getElementsByTagName('body')[0].classList.add('overflow-y_hidden')


    document.getElementById('app-shade').style.display = 'unset'
    document.getElementById('app-shade').classList.add('opacity0d8')



}

function close_header() {
    const appContentElement = document.getElementById('app-content');
    appContentElement.classList.remove('scale_0d9333333333333333')
    appContentElement.classList.remove('height_inherit')
    appContentElement.classList.remove('overflow-y_hidden')

    const mobileHeaderElement = document.getElementById('mobile_header');
    mobileHeaderElement.classList.remove('scale_0d9333333333333333')
    mobileHeaderElement.classList.remove('border-radius12px_top')


    document.getElementById('app-side').classList.remove('show_translateYd0')


    document.getElementsByTagName('body')[0].classList.remove('bg_000')
    document.getElementsByTagName('body')[0].classList.remove('overflow-y_hidden')

    document.getElementById('app-shade').classList.remove('opacity0d8')
    document.getElementById('app-shade').style.display = 'none'
}

