class WindowDimensions {
    static width = 0;
    static height = 0;
}

function SetWindowDimensions() {
    height = $(window).height();
    width = $(window).width();
    WindowDimensions.width = width;
    WindowDimensions.height = height;
}

$(document).ready(function() {
    SetWindowDimensions();
    if (WindowDimensions.width < 600) {
        $("#chat").hide();
        $("#userList").show();
        $("#back").show();
    }
    else {
        $("#chat").show();
        $("#userList").show();
        $("#back").hide();
    }
});

$(window).resize(function() {
    SetWindowDimensions();
    if (WindowDimensions.width < 600) {
        $("#chat").hide();
        $("#userList").show();
        $("#back").show();
    }
    else {
        $("#chat").show();
        $("#userList").show();
        $("#back").hide();
    }
});

function OpenChat() {
    if (WindowDimensions.width < 600) {
        $("#chat").show();
        $("#userList").hide();
    }
}

function Back() {
    if (WindowDimensions.width < 600) {
        $("#chat").hide();
        $("#userList").show();
    }
}