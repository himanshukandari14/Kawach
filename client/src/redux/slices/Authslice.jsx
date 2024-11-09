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
    documents: [], // Add this to store documents
  };

  export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email,
          password,
        });
        
        // Store token and user in localStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Login failed");
      }
    }
  );

  export const signupUser = createAsyncThunk(
    "auth/signup",
    async ({ email, password }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
          email,
          password,
        });
        
        // Store token in localStorage immediately
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Signup failed");
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
        const response = await axios.get(`${API_BASE_URL}/getuser`, {
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

 



  export const getUserFromToken = createAsyncThunk(
    "auth/getUserFromToken",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return rejectWithValue("No token found");
        }

        const response = await axios.get(`${API_BASE_URL}/getuser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch user data");
      }
    }
  );

  export const uploadDocument = createAsyncThunk(
    "/upload",
    async ({ file, token }, { rejectWithValue }) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          `${API_BASE_URL}/upload`,
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
        return rejectWithValue(err.response?.data || "Failed to upload document");
      }
    }
  );

  export const fetchUserDocuments = createAsyncThunk(
    "auth/fetchUserDocuments",
    async (token, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/documents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.documents;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to fetch documents");
      }
    }
  );

  export const getDocumentById = createAsyncThunk(
    "auth/getDocumentById",
    async ({ id, token }, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.document;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to fetch document");
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

       

        .addCase(getUserFromToken.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getUserFromToken.fulfilled, (state, action) => {
          state.loading = false;
          state.userData = action.payload;
        })
        .addCase(getUserFromToken.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          // Clear user data if token is invalid
          state.userData = null;
          localStorage.removeItem('token');
        })

        // Upload document
        .addCase(uploadDocument.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(uploadDocument.fulfilled, (state, action) => {
          state.loading = false;
          state.documents = [...state.documents, action.payload];
        })
        .addCase(uploadDocument.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Fetch documents
        .addCase(fetchUserDocuments.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUserDocuments.fulfilled, (state, action) => {
          state.loading = false;
          state.documents = action.payload;
        })
        .addCase(fetchUserDocuments.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(getDocumentById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getDocumentById.fulfilled, (state, action) => {
          state.loading = false;
          state.currentDocument = action.payload;
        })
        .addCase(getDocumentById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });

  export const { logout } = authSlice.actions;

  export default authSlice.reducer;