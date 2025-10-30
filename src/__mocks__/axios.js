import mockAxios from 'jest-mock-axios';

// Extend mockAxios to include put method if it doesn't exist
if (!mockAxios.put) {
  mockAxios.put = mockAxios.post;
}

// Override create to return instances with all HTTP methods
mockAxios.create = function () {
  const instance = {
    get: mockAxios.get,
    post: mockAxios.post,
    put: mockAxios.put || mockAxios.post,
    delete: mockAxios.delete,
    patch: mockAxios.patch || mockAxios.post,
    request: mockAxios.request,
    head: mockAxios.head,
    options: mockAxios.options,
    interceptors: mockAxios.interceptors,
  };

  return instance;
};

export default mockAxios;
