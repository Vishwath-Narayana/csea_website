import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DropdownMenu, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { FilterBar } from '../../components/ui/FilterBar';
import { Pagination } from '../../components/ui/Pagination';
import { PageHeader } from '../../components/ui/PageHeader';
import { MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export function JournalList({ navigate }: { navigate: (view: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      // In a real app, we'd pass search and filters to the API query params
      const response = await api.get<any>(`/control/journal?page=${currentPage}&limit=10`);
      setArticles(response.data);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/control/journal/${id}`);
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  // Client side filtering for demo purposes since we don't have search params on the backend yet
  const filteredArticles = articles.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-content">
      <PageHeader 
        title="Journal"
        description="Manage publications, technical articles, and editorial content."
        actions={
          <Button onClick={() => navigate('journal/create')}>
            <Plus size={16} className="mr-2" />
            New Article
          </Button>
        }
      />

      <FilterBar 
        searchPlaceholder="Search articles..."
        filters={[
          {
            id: 'status',
            placeholder: 'All Statuses',
            options: [
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Published', value: 'PUBLISHED' },
              { label: 'Archived', value: 'ARCHIVED' }
            ]
          }
        ]}
        onSearchChange={setSearch}
        onFilterChange={(id, val) => {
          if (id === 'status') setStatusFilter(val);
        }}
      />
      
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Article Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto text-foreground-muted" />
                </TableCell>
              </TableRow>
            ) : filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-foreground-muted">
                  No articles found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium text-foreground">{article.title}</TableCell>
                  <TableCell className="text-foreground-secondary">{article.category || 'N/A'}</TableCell>
                  <TableCell><StatusBadge status={article.status} /></TableCell>
                  <TableCell className="text-foreground-secondary">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unpublished'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu 
                      trigger={<Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>}
                      align="right"
                    >
                      <DropdownMenuItem onClick={() => navigate(`journal/${article.id}`)}>Preview Article</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`journal/${article.id}/edit`)}>Edit Content</DropdownMenuItem>
                      <div className="h-px bg-border my-1 mx-1"></div>
                      <DropdownMenuItem destructive onClick={() => handleDelete(article.id)}>Delete</DropdownMenuItem>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
