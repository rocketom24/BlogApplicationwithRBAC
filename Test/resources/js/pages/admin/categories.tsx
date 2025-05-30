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
import { toast, Toaster } from "sonner";

interface Category {
    id: number;
    name: string;
    posts_count: number;
}

interface PaginatedData {
    data: Category[];
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

interface CategoriesPageProps {
    categories: PaginatedData;
}

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Categories',
        href: '/admin/categories',
    },
];

export default function CategoriesPage({ categories }: CategoriesPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
    });

    const handleAdd = () => {
        setEditCategory(null);
        setFormData({ name: '' });
        setShowModal(true);
    };

    const handleEdit = (category: Category) => {
        setEditCategory(category);
        setFormData({ name: category.name });
        setShowModal(true);
    };



    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${id}`, {
                onSuccess: () => {
                    toast.success('Category deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.error || 'Failed to delete category');
                },
            });
        }
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editCategory) {
            router.put(`/admin/categories/${editCategory.id}`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Category updated successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to update category');
                },
            });
        } else {
            router.post('/admin/categories', formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Category created successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to create category');
                },
            });
        }
    };




    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.categories.index'), { page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <Toaster richColors closeButton position="top-right" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Categories</h1>                <Button onClick={handleAdd}>
                        Add Category
                    </Button>            </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>                            <TableHead>Posts Count</TableHead>                            <TableHead>Actions</TableHead>                        </TableRow>                    </TableHeader>                    <TableBody>
                            {categories.data.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>                                <TableCell>{category.posts_count}</TableCell>                                <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(category)}
                                            >
                                              Edit                                       </Button>
                                            <Button variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                Delete                                        </Button>                                    </div>                                </TableCell>                            </TableRow>))}
                        </TableBody>                </Table>            </div>
                {/* Pagination */}
                <div className="flex justify-start mt-4">
                    <nav className="flex items-center space-x-2">
                        <Button variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(categories.current_page - 1)}
                            disabled={categories.current_page === 1}
                            className="h-8 px-2"
                        >
                             Previous                     </Button>
                        <div className="flex items-center space-x-1">
                            {categories.links.map((link, i) => {
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(categories.current_page + 1)}
                            disabled={categories.current_page === categories.last_page}
                            className="h-8 px-2"
                        >
                            Next                     </Button>                </nav>            </div>
                {/* Add/Edit Category Modal */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>                        <DialogDescription>
                                {editCategory ? 'Make changes to your category here.' : 'Create a new category here.'}
                            </DialogDescription>                    </DialogHeader>                    <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>                            <Input id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                    Cancel                             </Button>                            <Button type="submit">
                                    {editCategory ? 'Update' : 'Create'}
                                </Button>                        </DialogFooter>                    </form>                </DialogContent>            </Dialog>        </div>    </AppLayout>);
}
 