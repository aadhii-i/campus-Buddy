import { apiService } from './api';

export const communityService = {
	getPosts: (params = {}) => apiService.community.getPosts(params),
	getPostById: (id) => apiService.community.getPostById(id),
	createPost: (data) => apiService.community.createPost(data),
	updatePost: (id, data) => apiService.community.updatePost(id, data),
	deletePost: (id) => apiService.community.deletePost(id),
	likePost: (id) => apiService.community.likePost(id),
	unlikePost: (id) => apiService.community.unlikePost(id),
	addComment: (id, comment) => apiService.community.addComment(id, comment),
	deleteComment: (postId, commentId) => apiService.community.deleteComment(postId, commentId)
};
