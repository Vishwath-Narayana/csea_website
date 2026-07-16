import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DropdownMenu, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { FilterBar } from '../../components/ui/FilterBar';
import { Pagination } from '../../components/ui/Pagination';
import { PageHeader } from '../../components/ui/PageHeader';
import { MoreHorizontal, Plus } from 'lucide-react';

export function JournalList({ navigate }: { navigate: (view: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const allArticles = [
    { id: 1, title: 'The Future of AI in Engineering', author: 'Vishwath', status: 'Published', date: 'Aug 14, 2026', category: 'Technology' },
    { id: 2, title: 'Understanding Distributed Systems', author: 'Dr. Rao', status: 'In Review', date: 'Aug 12, 2026', category: 'Academics' },
    { id: 3, title: 'Getting Started with React', author: 'Jane Smith', status: 'Draft', date: 'Aug 10, 2026', category: 'Tutorials' },
  ];

  const articles = allArticles.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status.toLowerCase().replace(' ', '_') !== statusFilter) return false;
    if (categoryFilter && a.category.toLowerCase() !== categoryFilter) return false;
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
              { label: 'Draft', value: 'draft' },
              { label: 'In Review', value: 'in_review' },
              { label: 'Published', value: 'published' }
            ]
          },
          {
            id: 'category',
            placeholder: 'All Categories',
            options: [
              { label: 'Technology', value: 'tech' },
              { label: 'Academics', value: 'academics' },
              { label: 'Tutorials', value: 'tutorials' }
            ]
          }
        ]}
        onSearchChange={setSearch}
        onFilterChange={(id, val) => {
          if (id === 'status') setStatusFilter(val);
          if (id === 'category') setCategoryFilter(val);
        }}
      />
      
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Article Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium text-foreground">{article.title}</TableCell>
                <TableCell className="text-foreground-secondary">{article.category}</TableCell>
                <TableCell className="text-foreground-secondary">{article.author}</TableCell>
                <TableCell><StatusBadge status={article.status} /></TableCell>
                <TableCell className="text-foreground-secondary">{article.date}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu 
                    trigger={<Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>}
                    align="right"
                  >
                    <DropdownMenuItem onClick={() => navigate(`journal/${article.id}`)}>Preview Article</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`journal/${article.id}/edit`)}>Edit Content</DropdownMenuItem>
                    <DropdownMenuItem>Publish</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem destructive>Delete</DropdownMenuItem>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-foreground-muted">
                  No articles found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={12}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
