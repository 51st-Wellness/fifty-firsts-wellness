import http from "../helpers/http";

// fetch user profile
export const getUserProfile = async () => {
    const response = await http().get("/user/me");
    return response.data; // { message, status, data: { user: {...} } }
};

// ✅ Update user profile
export const updateUserProfile = async (data) => {
    const response = await http().put("/user/me", {
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        phone: data.phone,
        bio: data.bio,
    });
    return response.data;
};
