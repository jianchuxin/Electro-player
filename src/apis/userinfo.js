import request from "@/utils/axios";

// 获取用户的歌单信息（包括用户的头像）
export const getUserPlayList = (uid) => {
    return request("/user/playlist", {
        params: {
            uid,
        },
    });
};

export const getUserDetails = (uid) => {
    return request("/user/detail", {
        params: {
            uid,
        },
    });
};
