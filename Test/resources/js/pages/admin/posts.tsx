import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";

// Types for props
interface User {
    id: number;
    name: string;
}

interface Comment {
    id: number;
    content: string;
    user: User;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    category_id: number;
    category: Category;
    published_at: string | null;
    comments: Comment[];
    comments_count: number;
}

interface PaginatedData {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface PostsPageProps {
    posts: PaginatedData;
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Posts',
        href: '/admin/posts',
    },
];

export default function PostsPage({ posts, categories }: PostsPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [editPost, setEditPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category_id: '',
        published_at: '',
    });

    const handleAdd = () => {
        setEditPost(null);
        setFormData({
            title: '',
            content: '',
            category_id: '',
            published_at: '',
        });
        setShowModal(true);
    };

    const handleEdit = (post: Post) => {
        setEditPost(post);
        setFormData({
            title: post.title,
            content: post.content,
            category_id: post.category_id.toString(),
            published_at: post.published_at || '',
        });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(`/admin/posts/${id}`, {
                onSuccess: () => {
                    toast.success('Post deleted successfully', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
                onError: () => {
                    toast.error('Failed to delete post', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editPost) {
            router.put(`/admin/posts/${editPost.id}`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Post updated successfully', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
                onError: () => {
                    toast.error('Failed to update post', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
            });
        } else {
            router.post('/admin/posts', formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Post created successfully', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
                onError: () => {
                    toast.error('Failed to create post', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.posts.index'), { page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleShowComments = (post: Post) => {
        setSelectedPost(post);
        setShowCommentsModal(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <Toaster richColors closeButton />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Posts</h1>                    <Button onClick={handleAdd}>
                        Add  Blog                     </Button>                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>                                <TableHead>Category</TableHead>                                <TableHead>Published At</TableHead>                                <TableHead>Comments</TableHead>                                <TableHead>Actions</TableHead>                            </TableRow>                        </TableHeader>                        <TableBody>
                            {posts.data.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell>{post.title}</TableCell>                                    <TableCell>{post.category?.name}</TableCell>                                    <TableCell>
                                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                                    </TableCell>                                    <TableCell>
                                        <Button variant="ghost"
                                            size="sm"
                                            onClick={() => handleShowComments(post)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {post.comments_count}  Comments                                         </Button>                                    </TableCell>                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(post)}
                                            >
                                                 Edit                                             </Button>                                            <Button variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(post.id)}
                                                >
 Delete                                            </Button>                                        </div>                                    </TableCell>                                </TableRow>))}
                        </TableBody>                    </Table>                </div>
                {/* Pagination */}
                <div className="flex justify-start mt-4">
                    <nav className="flex items-center space-x-2">
                        <Button variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(posts.current_page - 1)}
                            disabled={posts.current_page === 1}
                            className="h-8 px-2"
                        >
                             Previous                        </Button>
                        <div className="flex items-center space-x-1">
                            {posts.links.map((link, i) => {
                                if (link.label === '...') {
                                    return (
                                        <span key={i} className="px-2">...</span>);
                                }

                                if (link.url === null) {
                                    return null;
                                }

                                const page = parseInt(link.label);
                                return (
                                    <Button key={i}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className="h-8 w-8 p-0"
                                    >
                                        {link.label}
                                    </Button>);
                            })}
                        </div>

                        <Button variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(posts.current_page + 1)}
                            disabled={posts.current_page === posts.last_page}
                            className="h-8 px-2"
                        >
                             Next                         </Button>                    </nav>                </div>
                {/* Comments Modal */}
                <Dialog open={showCommentsModal} onOpenChange={setShowCommentsModal}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Comments for {selectedPost?.title}</DialogTitle>                            <DialogDescription>
                                View all comments on this Post                            </DialogDescription>                        </DialogHeader>                        <div className="max-h-[400px] overflow-y-auto">
                            {selectedPost?.comments.map((comment) => (
                                <div key={comment.id} className="border-b py-3 last:border-b-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium">{comment.user.name}</div>                                        <div className="text-sm text-gray-500">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </div>
                                    </div>                                    <p className="text-gray-700">{comment.content}</p>                                </div>))}
                            {selectedPost?.comments.length === 0 && (
                                <div className="text-center py-4 text-gray-500">
                                    No comments yet                                </div>)}
                        </div>
                    </DialogContent>                </Dialog>
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editPost ? 'Edit Blog' : 'Add Blog'}</DialogTitle>                            <DialogDescription>
                                {editPost ? 'Make changes to your blog post here.' : 'Create a new blog post here.'}
                            </DialogDescription>                        </DialogHeader>                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>                                <Input id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>                                <Textarea id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    required className="min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>                                <Select
                                    value={formData.category_id}
                                    onValueChange={(value) => handleSelectChange('category_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>))}
                                    </SelectContent>                                </Select>                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="published_at">Published At</Label>                                <Input id="published_at"
                                    name="published_at"
                                    type="datetime-local"
                                    value={formData.published_at}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                     Cancel                                 </Button>                                <Button type="submit">
                                    {editPost ? 'Update' : 'Create'}
                                </Button>                            </DialogFooter>                        </form>                    </DialogContent>                </Dialog>            </div>        </AppLayout>);
}
                                

        