  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-nocheck
  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
  import axios from "axios";

  // Use import.meta.env for Vite
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    userData: null,
    posts: [],
    users: [],
    specificUserData: null,
    comments: [], // Added comments array to store post comments
  };

  export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ username, password }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          username,
          password,
        });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Login failed");
      }
    }
  );

  export const signupUser = createAsyncThunk(
    "auth/signup",
    async ({ email, password, name, username }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/sign-up`, {
          email,
          password,
          name,
          username,
        });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Signup failed");
      }
    }
  );

  export const verifyRegistrationOTP = createAsyncThunk(
    "auth/verify-otp",
    async ({ email, otp }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
          email,
          otp
        });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "OTP verification failed");
      }
    }
  );

  export const fetchUserData = createAsyncThunk(
    "auth/fetchUserData",
    async (token, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/fetchLoggedInUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to fetch user data");
      }
    }
  );

  export const fetchSpecificUser = createAsyncThunk(
    'auth/fetchSpecificUser',
    async ({ token, userId }, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to fetch user");
      }
    }
  );

  export const fetchAllPost = createAsyncThunk(
    "auth/fetchAllPost",
    async (token, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/allposts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to fetch posts");
      }
    }
  );

  export const likePost = createAsyncThunk(
    "auth/likePost",
    async ({ postId, token }, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/user/post/like/${postId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to like post");
      }
    }
  );

  export const createPost = createAsyncThunk(
    "auth/createPost",
    async ({ title, media, token }, { rejectWithValue }) => {
      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("media", media);

        const response = await axios.post(
          `${API_BASE_URL}/createPost`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to create post");
      }
    }
  );

  export const deletePost = createAsyncThunk(
    "auth/deletePost",
    async ({ postId, token }, { rejectWithValue }) => {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/user/post/delete/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to delete post");
      }
    }
  );

  export const createComment = createAsyncThunk(
    "auth/createComment",
    async ({ postId, comment, token }, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/user/post/comment/${postId}`,
          { text: comment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to create comment");
      }
    }
  );

  export const fetchOnePostComments = createAsyncThunk(
    "posts/fetchOnePostComments",
    async (postId, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/posts/${postId}/comments`
        );
        return response.data.comments;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to fetch comments");
      }
    }
  );

  export const fetchSearchUser = createAsyncThunk(
    "user/fetchSearchUser",
    async ({ searchTerm, token }, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/search-users?query=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.users;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to search users");
      }
    }
  );

  export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.userData = null;
        state.posts = [];
        state.users = [];
        state.specificUserData = null;
        state.comments = [];
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      },
    },
    extraReducers: (builder) => {
      builder
        // Login
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.token);
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Signup
        .addCase(signupUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(signupUser.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.token);
        })
        .addCase(signupUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Fetch user data
        .addCase(fetchUserData.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
          state.loading = false;
          state.userData = action.payload;
        })
        .addCase(fetchUserData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Fetch specific user
        .addCase(fetchSpecificUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSpecificUser.fulfilled, (state, action) => {
          state.loading = false;
          state.specificUserData = action.payload;
        })
        .addCase(fetchSpecificUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Fetch all posts
        .addCase(fetchAllPost.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllPost.fulfilled, (state, action) => {
          state.loading = false;
          state.posts = action.payload;
        })
        .addCase(fetchAllPost.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Like post
        .addCase(likePost.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(likePost.fulfilled, (state, action) => {
          state.loading = false;
          state.posts = action.payload;
        })
        .addCase(likePost.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Create post
        .addCase(createPost.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createPost.fulfilled, (state, action) => {
          state.loading = false;
          state.posts = action.payload;
        })
        .addCase(createPost.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Delete post
        .addCase(deletePost.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deletePost.fulfilled, (state, action) => {
          state.loading = false;
          state.posts = action.payload;
        })
        .addCase(deletePost.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Create comment
        .addCase(createComment.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createComment.fulfilled, (state, action) => {
          state.loading = false;
          state.posts = action.payload;
        })
        .addCase(createComment.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Fetch post comments
        .addCase(fetchOnePostComments.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOnePostComments.fulfilled, (state, action) => {
          state.loading = false;
          state.comments = action.payload;
        })
        .addCase(fetchOnePostComments.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Search users
        .addCase(fetchSearchUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSearchUser.fulfilled, (state, action) => {
          state.loading = false;
          state.users = action.payload;
        })
        .addCase(fetchSearchUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });

  export const { logout } = authSlice.actions;

  export default authSlice.reducer;