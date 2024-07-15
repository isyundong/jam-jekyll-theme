let appSideNavigationElement = document.getElementById('app-side-navigation');
appSideNavigationElement.addEventListener('click', event => {
    let clickEventId = event.target['id'];
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
})


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

}


function app_header_icon_click() {
    document.getElementById('app-side').classList.add('display_unset')
    document.getElementById('app-side').classList.add('scale_1d07142857142')

    document.getElementById('app-main').classList.add('scale_0d9333333333333333')
    document.getElementById('app-main').classList.add('bg_fff')
    document.getElementById('app-main').classList.add('height_inherit')


    document.getElementsByTagName('body')[0].classList.add('bg_000')
}

function app_content_click() {
    document.getElementById('app-side').classList.remove('display_unset')
    document.getElementById('app-side').classList.remove('scale_1d07142857142')

    document.getElementById('app-main').classList.remove('scale_0d9333333333333333')
    document.getElementById('app-main').classList.remove('bg_fff')
    document.getElementById('app-main').classList.remove('height_inherit')

    document.getElementsByTagName('body')[0].classList.remove('bg_000')

}

