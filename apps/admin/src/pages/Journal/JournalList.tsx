import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/Input';
import { DropdownMenu, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { MoreHorizontal, Plus } from 'lucide-react';

export function JournalList({ navigate }: { navigate: (view: string) => void }) {
  const articles = [
    { id: 1, title: "Architecting the New CSEA Platform", author: "Tech Team", status: "Published", date: "Aug 12, 2026" },
    { id: 2, title: "Registration Open for Orientation '26", author: "Leadership", status: "Published", date: "Aug 05, 2026" },
    { id: 3, title: "Lessons from the Summer Hackathon", author: "Events", status: "Draft", date: "Jul 28, 2026" },
    { id: 4, title: "Deep Dive into Node.js Worker Threads", author: "Tech Team", status: "In Review", date: "Jul 22, 2026" },
  ];

  return (
    <div className="mx-auto max-w-content">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-[20px] font-semibold tracking-tight text-foreground">Journal</h1>
          <p className="text-[14px] text-foreground-secondary">Manage technical reports and dispatches.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[240px]">
            <SearchInput placeholder="Search articles..." />
          </div>
          <Button onClick={() => navigate('journal/create')}>
            <Plus size={16} className="mr-2" />
            New Article
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
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
                <TableCell className="text-foreground-secondary">{article.author}</TableCell>
                <TableCell><StatusBadge status={article.status} /></TableCell>
                <TableCell className="text-foreground-secondary">{article.date}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu 
                    trigger={<Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>}
                    align="right"
                  >
                    <DropdownMenuItem onClick={() => navigate(`journal/edit/${article.id}`)}>Edit Article</DropdownMenuItem>
                    <DropdownMenuItem>View Analytics</DropdownMenuItem>
                    {article.status === 'Draft' ? (
                      <DropdownMenuItem>Publish</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>Unpublish</DropdownMenuItem>
                    )}
                    <DropdownMenuItem destructive>Delete</DropdownMenuItem>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
