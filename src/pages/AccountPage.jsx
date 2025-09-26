import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { getUserProfile, updateUserProfile } from "../services/user"; // ✅ make sure updateUserProfile exists
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContextProvider";

const AccountPage = () => {
    const { logout } = useAuth(); // ✅ grab logout from context

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getUserProfile();
                setUser(res.data.user);
                setFormData(res.data.user);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            const res = await updateUserProfile(formData);
            setUser(res.data.user);
            setEditMode(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    if (loading) {
        return <p className="text-center py-10">Loading profile...</p>;
    }

    if (!user) {
        return (
            <p className="text-center py-10 text-red-500">
                Unable to load profile. Please login again.
            </p>
        );
    }

    return (
        <main>
            <article className="flex w-full">
                {/* Sidebar */}
                <aside className="w-1/4 bg-white border-r border-gray-200 p-4">
                    <ul className="space-y-4 text-gray-700">
                        <li className="font-semibold text-teal-700">My Account</li>
                        <li>Orders History</li>
                        <li>My Cart</li>
                        <li>Wishlist</li>
                    </ul>
                </aside>

                {/* Content */}
                <section className="flex-1 p-8 bg-gray-50">
                    <div className="space-y-3 bg-white p-6 rounded-lg shadow-sm">
                        {!editMode ? (
                            <>
                                <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
                                <p><span className="font-medium">Email:</span> {user.email}</p>
                                <p><span className="font-medium">Phone:</span> {user.phone || "—"}</p>
                                <p><span className="font-medium">City:</span> {user.city || "—"}</p>
                                <p><span className="font-medium">Address:</span> {user.address || "—"}</p>
                                <p><span className="font-medium">Bio:</span> {user.bio || "—"}</p>
                                <p><span className="font-medium">Role:</span> {user.role}</p>
                                <p><span className="font-medium">Active:</span> {user.isActive ? "Yes" : "No"}</p>
                                <p><span className="font-medium">Email Verified:</span> {user.isEmailVerified ? "Yes" : "No"}</p>

                                <button
                                    onClick={() => setEditMode(true)}
                                    className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                                >
                                    Edit Profile
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName || ""}
                                        onChange={handleChange}
                                        className="border p-2 rounded"
                                        placeholder="First Name"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName || ""}
                                        onChange={handleChange}
                                        className="border p-2 rounded"
                                        placeholder="Last Name"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        disabled
                                        className="border p-2 rounded bg-gray-100"
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone || ""}
                                        onChange={handleChange}
                                        className="border p-2 rounded"
                                        placeholder="Phone"
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city || ""}
                                        onChange={handleChange}
                                        className="border p-2 rounded"
                                        placeholder="City"
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address || ""}
                                        onChange={handleChange}
                                        className="border p-2 rounded"
                                        placeholder="Address"
                                    />
                                    <textarea
                                        name="bio"
                                        value={formData.bio || ""}
                                        onChange={handleChange}
                                        className="border p-2 rounded col-span-2"
                                        placeholder="Bio"
                                    />
                                </div>

                                <div className="flex space-x-4 mt-4">
                                    <button
                                        onClick={handleSave}
                                        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData(user);
                                        }}
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
                        <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-gray-600 text-sm">Logout of all devices</p>
                            <button
                                onClick={logout} // ✅ logout functional
                                className="text-red-500 border px-3 py-1 rounded hover:bg-red-100"
                            >
                                Logout
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600 text-sm">Delete my account</p>
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </section>
            </article>

            <Footer />
        </main>
    );
};

export default AccountPage;
