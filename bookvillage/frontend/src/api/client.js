const API_BASE = "/api";
const notifyAuthChanged = () => window.dispatchEvent(new Event("ohyes24-auth-changed"));

const getAuthHeader = () => {
  const creds = sessionStorage.getItem("ohyes24_creds");
  return creds ? { Authorization: `Basic ${creds}` } : {};
};

const TRANSIENT_STATUS = new Set([502, 503, 504]);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(url, options = {}) {
  const headers = {
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const hasBody = options.body !== undefined && options.body !== null;
  if (hasBody && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const method = (options.method || "GET").toUpperCase();
  let res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (method === "GET" && TRANSIENT_STATUS.has(res.status)) {
    await sleep(700);
    res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  }

  if (res.status === 401) {
    sessionStorage.removeItem("ohyes24_creds");
    sessionStorage.removeItem("ohyes24_user");
    notifyAuthChanged();
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    if (TRANSIENT_STATUS.has(res.status)) {
      throw new Error("\uC11C\uBC84 \uC5F0\uACB0\uC774 \uC77C\uC2DC\uC801\uC73C\uB85C \uBD88\uC548\uC815\uD569\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
    }
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || err.error || "Request failed");
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  auth: {
    register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    logout: () => request("/auth/logout", { method: "POST" }),
    findId: (name, email) => request("/auth/find-id", { method: "POST", body: JSON.stringify({ name, email }) }),
    requestPasswordReset: (email) => request("/auth/password-reset/request", { method: "POST", body: JSON.stringify({ email }) }),
    confirmPasswordReset: (email, token, newPassword, userId) =>
      request("/auth/password-reset/confirm", {
        method: "POST",
        body: JSON.stringify({ email, token, newPassword, ...(userId ? { userId } : {}) }),
      }),
  },
  users: {
    get: (userId) => request(`/users/${userId}`),
    getProfileByUserId: (userId) => request(`/profile?user_id=${encodeURIComponent(userId)}`),
    update: (userId, data) => request(`/users/${userId}`, { method: "PUT", body: JSON.stringify(data) }),
    getOrders: (userId) => request(`/users/${userId}/orders`),
    searchAddress: (q) => request(`/users/me/address-search?q=${encodeURIComponent(q)}`),
    changePassword: (currentPassword, newPassword) =>
      request("/users/me/password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) }),
    deleteMe: (userId, password) =>
      request(`/users/delete?user_id=${encodeURIComponent(userId)}`, { method: "DELETE", body: JSON.stringify({ password }) }),
  },
  books: {
    search: (q, category) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      return request(`/books/search?${params.toString()}`);
    },
    getCategories: () => request("/books/categories"),
    get: (bookId) => request(`/books/${bookId}`),
    shippingInfo: (bookId, zipcode) => request(`/books/${bookId}/shipping-info${zipcode ? `?zipcode=${encodeURIComponent(zipcode)}` : ""}`),
    preview: (bookId, filePath) => request(`/books/${bookId}/preview${filePath ? `?filePath=${encodeURIComponent(filePath)}` : ""}`),
  },
  cart: {
    list: () => request("/cart"),
    add: (bookId, quantity, price) =>
      request("/cart", { method: "POST", body: JSON.stringify({ bookId, quantity, ...(price !== undefined ? { price } : {}) }) }),
    update: (cartItemId, quantity) => request(`/cart/${cartItemId}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
    remove: (cartItemId) => request(`/cart/${cartItemId}`, { method: "DELETE" }),
    clear: () => request("/cart", { method: "DELETE" }),
  },
  orders: {
    list: () => request("/orders"),
    checkout: (payload) => request("/orders/checkout", { method: "POST", body: JSON.stringify(payload) }),
    lookup: (orderNumber) => request(`/orders/lookup?orderNumber=${encodeURIComponent(orderNumber)}`),
    track: (orderId, trackingUrl) => request(`/orders/${orderId}/tracking?trackingUrl=${encodeURIComponent(trackingUrl)}`),
    downloadUrl: (file) => `${API_BASE}/download?file=${encodeURIComponent(file)}`,
  },
  reviews: {
    listByBook: (bookId) => request(`/books/${bookId}/reviews`),
    create: (bookId, data) => request(`/books/${bookId}/reviews`, { method: "POST", body: JSON.stringify(data) }),
    uploadImage: (reviewId, file) => {
      const fd = new FormData();
      fd.append("file", file);
      return request(`/reviews/${reviewId}/upload`, { method: "POST", body: fd });
    },
    like: (reviewId) => request(`/reviews/${reviewId}/like`, { method: "POST" }),
    report: (reviewId, reason) => request(`/reviews/${reviewId}/report`, { method: "POST", body: JSON.stringify({ reason }) }),
    delete: (reviewId, csrfToken) => request(`/reviews/${reviewId}`, { method: "DELETE", headers: { "X-LAB-CSRF-TOKEN": csrfToken } }),
  },
  board: {
    list: (q, myOnly = false, sort = "latest", page = 0, size = 10) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (myOnly) params.set("myOnly", "true");
      params.set("sort", sort === "popular" ? "popular" : "latest");
      params.set("page", String(page));
      params.set("size", String(size));
      const query = params.toString();
      return request(`/board/posts${query ? `?${query}` : ""}`);
    },
    get: (postId) => request(`/board/posts/${postId}`),
    create: (data) => request("/board/posts", { method: "POST", body: JSON.stringify(data) }),
    update: (postId, data) => request(`/board/posts/${postId}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (postId) => request(`/board/posts/${postId}`, { method: "DELETE" }),
    listComments: (postId, sort = "latest", page = 0, size = 10) =>
      request(
        `/board/posts/${postId}/comments?sort=${encodeURIComponent(sort === "oldest" ? "oldest" : "latest")}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`,
      ),
    createComment: (postId, content) => request(`/board/posts/${postId}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
    updateComment: (commentId, content) => request(`/board/comments/${commentId}`, { method: "PUT", body: JSON.stringify({ content }) }),
    deleteComment: (commentId) => request(`/board/comments/${commentId}`, { method: "DELETE" }),
    listAttachments: (postId) => request(`/board/posts/${postId}/attachments`),
    uploadAttachment: (postId, file) => {
      const fd = new FormData();
      fd.append("file", file);
      return request(`/board/posts/${postId}/attachments`, { method: "POST", body: fd });
    },
    deleteAttachment: (postId, attachmentId) => request(`/board/posts/${postId}/attachments/${attachmentId}`, { method: "DELETE" }),
    fetchAttachmentBlob: async (attachmentId, fallbackName = "attachment") => {
      const res = await fetch(`${API_BASE}/board/attachments/${encodeURIComponent(attachmentId)}/download`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      if (res.status === 401) {
        sessionStorage.removeItem("ohyes24_creds");
        sessionStorage.removeItem("ohyes24_user");
        notifyAuthChanged();
        throw new Error("Unauthorized");
      }
      if (!res.ok) {
        throw new Error("Attachment download failed");
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("content-disposition") || "";
      const match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
      const filename = match?.[1] ? decodeURIComponent(match[1]) : fallbackName;
      const contentType = res.headers.get("content-type") || blob.type || "application/octet-stream";

      return { blob, filename, contentType };
    },

    downloadAttachment: async (attachmentId, fallbackName = "attachment") => {
      const { blob, filename } = await api.board.fetchAttachmentBlob(attachmentId, fallbackName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },

    previewAttachment: (attachmentId, fallbackName = "attachment") =>
      api.board.fetchAttachmentBlob(attachmentId, fallbackName),
  },
  support: {
    notices: (q) => request(`/notices${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    notice: (noticeId) => request(`/notices/${noticeId}`),
    faqs: (category) => request(`/faqs${category ? `?category=${encodeURIComponent(category)}` : ""}`),
    uploadInquiryAttachment: (inquiryId, file) => {
      const fd = new FormData();
      fd.append("file", file);
      return request(`/customer-service/${inquiryId}/attachments`, { method: "POST", body: fd });
    },
  },
  mypage: {
    summary: () => request("/mypage/summary"),
    recentViews: () => request("/mypage/recent-views"),
    wishlist: () => request("/mypage/wishlist"),
    addWishlist: (bookId) => request("/mypage/wishlist", { method: "POST", body: JSON.stringify({ bookId }) }),
    removeWishlist: (wishlistId) => request(`/mypage/wishlist/${wishlistId}`, { method: "DELETE" }),
    wallet: () => request("/mypage/wallet"),
    cancelOrder: (orderId, reason) => request(`/mypage/orders/${orderId}/cancel`, { method: "POST", body: JSON.stringify({ reason }) }),
    returnOrder: (orderId, reason, proofFileName) =>
      request(`/mypage/orders/${orderId}/return`, { method: "POST", body: JSON.stringify({ reason, proofFileName }) }),
    favoritePosts: (includePrivate = false) => request(`/mypage/favorite-posts?includePrivate=${includePrivate}`),
    deleteFavoritePost: (postId) => request(`/mypage/favorite-posts/${postId}`, { method: "DELETE" }),
    deleteReview: (reviewId, csrfToken) => request(`/mypage/reviews/${reviewId}`, { method: "DELETE", headers: { "X-LAB-CSRF-TOKEN": csrfToken } }),
  },
  admin: {
    dashboard: () => request("/admin/dashboard"),
    getBooks: () => request("/admin/books"),
    createBook: (data) => request("/admin/books", { method: "POST", body: JSON.stringify(data) }),
    updateBook: (id, data) => request(`/admin/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteBook: (id) => request(`/admin/books/${id}`, { method: "DELETE" }),
    getOrders: () => request("/admin/orders"),
    updateOrderStatus: (orderId, status) => request(`/admin/orders/${orderId}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
    getUsers: () => request("/admin/users"),
    updateUserStatus: (userId, status, role) => request(`/admin/users/${userId}/status`, { method: "PUT", body: JSON.stringify({ status, role }) }),
    getCoupons: () => request("/admin/coupons"),
    createCoupon: (data) => request("/admin/coupons", { method: "POST", body: JSON.stringify(data) }),
    getCustomerService: () => request("/admin/customer-service"),
    replyCustomerService: (inquiryId, answer) => request(`/admin/customer-service/${inquiryId}/reply`, { method: "POST", body: JSON.stringify({ answer }) }),
    getLogs: () => request("/admin/logs"),
    stock: (author, isbn) => {
      const params = new URLSearchParams();
      if (author) params.set("author", author);
      if (isbn) params.set("isbn", isbn);
      return request(`/admin/books/stock${params.toString() ? `?${params.toString()}` : ""}`);
    },
    inbound: (isbn, quantity) => request("/admin/books/inbound", { method: "POST", body: JSON.stringify({ isbn, quantity }) }),
    updateStock: (id, stock) => request(`/admin/books/${id}/stock`, { method: "PUT", body: JSON.stringify({ stock }) }),
    createNotice: (title, content) => request("/admin/notices", { method: "POST", body: JSON.stringify({ title, content }) }),
  },
  labs: {
    requirements: () => request("/labs/requirements"),
    simulate: (reqId, input, metadata) => request(`/labs/${reqId}/simulate`, { method: "POST", body: JSON.stringify({ input, metadata }) }),
  },
  integration: {
    linkPreview: (url) => request("/integration/link-preview", { method: "POST", body: JSON.stringify({ url }) }),
  },
  customerService: {
    list: () => request("/customer-service"),
    create: (data) => request("/customer-service", { method: "POST", body: JSON.stringify(data) }),
  },
};



